const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const ort = require('onnxruntime-node');
const Jimp = require('jimp');

const router = express.Router();

// Reverse geocoding function using OpenStreetMap Nominatim API
async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MyApp/1.0 (myemail@example.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Nominatim API error: ${data.error}`);
    }

    // Return the human-readable address
    return data.display_name || 'Address not found';
    
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return a fallback address format
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
}

// Multer setup with diskStorage to preserve file extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'temp-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// ONNX model path & session cache
const MODEL_PATH = path.join('../FronEnd/public/mobilenetv2.onnx');
let session = null;

// Load ONNX model once
async function loadModel() {
  if (!session) {
    session = await ort.InferenceSession.create(MODEL_PATH);
    console.log('ONNX model loaded');
  }
  return session;
}

// Image preprocess to tensor
async function processImage(imagePath) {
  console.log("Image path:", imagePath);

  const image = await Jimp.read(imagePath);
  console.log("Image loaded:", image !== undefined);
  const width = image.bitmap?.width;
const height = image.bitmap?.height;
console.log("Image dimensions:", width, height);


  image.resize(224, 224);

  const floatData = new Float32Array(3 * 224 * 224);
  let ptr = 0;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    floatData[ptr++] = image.bitmap.data[idx] / 255;       // R
    floatData[ptr++] = image.bitmap.data[idx + 1] / 255;   // G
    floatData[ptr++] = image.bitmap.data[idx + 2] / 255;   // B
  });

  // HWC to CHW
  const chwFloatData = new Float32Array(3 * 224 * 224);
  for (let i = 0; i < 224 * 224; i++) {
    chwFloatData[i] = floatData[i * 3];
    chwFloatData[i + 224 * 224] = floatData[i * 3 + 1];
    chwFloatData[i + 2 * 224 * 224] = floatData[i * 3 + 2];
  }

  return new ort.Tensor('float32', chwFloatData, [1, 3, 224, 224]);
}

// Run model inference
async function runModel(inputTensor) {
  const session = await loadModel();
  const feeds = {};
  feeds[session.inputNames[0]] = inputTensor;

  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  return results[outputName];
}

// Estimate size from bounding box area in ONNX model output
function estimateSizeFromBoundingBox(output) {
  try {
    const data = output.data;
    console.log('ONNX output data:', data);
    console.log('ONNX output shape:', output.dims);
    
    // Convert to array for easier handling
    const outputArray = Array.from(data);
    console.log('Output array:', outputArray);
    
    // Extract bounding box coordinates [x1, y1, x2, y2]
    // Assuming the model outputs detection results with bounding boxes
    let x1, y1, x2, y2;
    
    if (outputArray.length >= 4) {
      // Try different output formats based on common detection models
      if (outputArray.length === 4) {
        // Direct bounding box format [x1, y1, x2, y2]
        [x1, y1, x2, y2] = outputArray;
      } else if (outputArray.length >= 7) {
        // YOLO-like format: [x_center, y_center, width, height, confidence, class_id, ...]
        const x_center = outputArray[0];
        const y_center = outputArray[1];
        const width = outputArray[2];
        const height = outputArray[3];
        
        x1 = x_center - width / 2;
        y1 = y_center - height / 2;
        x2 = x_center + width / 2;
        y2 = y_center + height / 2;
      } else {
        // Try to extract from larger output arrays
        // Look for the first detection's bounding box
        for (let i = 0; i < outputArray.length - 3; i += 4) {
          if (outputArray[i] >= 0 && outputArray[i + 1] >= 0 && 
              outputArray[i + 2] > outputArray[i] && outputArray[i + 3] > outputArray[i + 1]) {
            [x1, y1, x2, y2] = outputArray.slice(i, i + 4);
            break;
          }
        }
      }
    }
    
    console.log('Extracted bounding box:', { x1, y1, x2, y2 });
    
    if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
      // Calculate bounding box area
      const boxArea = (x2 - x1) * (y2 - y1);
      console.log('Bounding box area:', boxArea);
      
      // Categorize size based on area
      if (boxArea < 5000) {
        console.log('Size category: small');
        return 'small';
      } else if (boxArea <= 15000) {
        console.log('Size category: medium');
        return 'medium';
      } else {
        console.log('Size category: large');
        return 'large';
      }
    } else {
      console.log('No valid bounding box found, using default: medium');
      return 'medium';
    }
    
  } catch (error) {
    console.error('Error in bounding box size estimation:', error);
    return 'medium'; // fallback
  }
}

// Calculate location type urgency score based on OSM data
function calculateLocationTypeScore(addressData, lat, lng) {
  console.log('=== FULL OSM RESPONSE ===');
  console.log(JSON.stringify(addressData, null, 2));
  
  const displayName = addressData.display_name || '';
  const road = addressData.address?.road || '';
  const place = addressData.address?.place || '';
  const highway = addressData.address?.highway || '';
  const route = addressData.address?.route || '';
  const roadType = addressData.address?.road_type || '';
  const neighbourhood = addressData.address?.neighbourhood || '';
  const suburb = addressData.address?.suburb || '';
  const city = addressData.address?.city || '';
  const town = addressData.address?.town || '';
  
  const text = `${displayName} ${road} ${place} ${highway} ${route} ${roadType} ${neighbourhood} ${suburb} ${city} ${town}`.toLowerCase();
  
  console.log('=== Location Type Analysis ===');
  console.log('Display name:', displayName);
  console.log('Road:', road);
  console.log('Place:', place);
  console.log('Highway:', highway);
  console.log('Route:', route);
  console.log('Road type:', roadType);
  console.log('Neighbourhood:', neighbourhood);
  console.log('Suburb:', suburb);
  console.log('City:', city);
  console.log('Town:', town);
  console.log('Combined text for analysis:', text);
  
  // High urgency locations (40%) - Highways, main roads, national routes
  if (text.includes('highway') || text.includes('main road') ||text.includes('dharan')|| text.includes('ring road') || 
      text.includes('national highway') || text.includes('provincial highway') || text.includes('puspalal')||text.includes('mandir')||
      text.includes('trunk') || text.includes('primary') || text.includes('secondary') ||text.includes('shani')||
      text.includes('national') || text.includes('provincial') || text.includes('state highway') ||text.includes('mahendra ')||
      text.includes('expressway') || text.includes('freeway') ||text.includes('traffic')|| text.includes('motorway') ||
      text.includes('arterial') || text.includes('major road') || text.includes('main street') ||text.includes('chowk ')||
      text.includes('dharan marg') || text.includes('dharan') || text.includes('marg') ||text.includes('bargachhi')||
      text.includes('pokhara marg') || text.includes('kathmandu marg') || text.includes('biratnagar marg') ||
      text.includes('east west highway') || text.includes('mahendra highway') || text.includes('hulaki marg') ||
      text.includes('sagarmatha highway') || text.includes('prithvi highway') || text.includes('tribhuvan marg') ||
      text.includes('b.p. koirala') || text.includes('bp koirala') || text.includes('koirala')) {
    console.log('✅ Detected HIGH urgency location (40%) - Highway/Main Road (Text Analysis)');
    return 40;
  }
  
  // Coordinate-based highway detection for Biratnagar area
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  // Check if coordinates are on major roads in Biratnagar
  // These are approximate coordinates for major roads in Biratnagar
  const majorRoads = [
    // National Highway 10 (East-West Highway)
    { lat: 26.4525, lng: 87.2718, radius: 0.01 }, // Biratnagar center
    { lat: 26.4992, lng: 87.2853, radius: 0.01 }, // Your reported location
    // Add more major road coordinates as needed
  ];
  
  for (const road of majorRoads) {
    const distance = Math.sqrt(
      Math.pow(latNum - road.lat, 2) + Math.pow(lngNum - road.lng, 2)
    );
    if (distance <= road.radius) {
      console.log('✅ Detected HIGH urgency location (40%) - Highway/Main Road (Coordinate Analysis)');
      console.log(`Coordinates ${latNum}, ${lngNum} are near major road at ${road.lat}, ${road.lng}`);
      return 40;
    }
  }
  
  // Medium-high urgency locations (28%) - Commercial areas, traffic junctions
  if (text.includes('bazaar') || text.includes('traffic') || 
      text.includes('bus park') || text.includes('market') || text.includes('commercial') ||
      text.includes('tertiary') || text.includes('residential') || text.includes('junction') ||
      text.includes('intersection') || text.includes('crossing') || text.includes('square') ||
      text.includes('plaza') || text.includes('center') || text.includes('mall') ||
      text.includes('shopping') || text.includes('business') || text.includes('downtown')) {
    console.log('✅ Detected MEDIUM-HIGH urgency location (28%) - Commercial/Traffic Area');
    return 28;
  }
  
  // Medium urgency locations (16%) - Local areas, neighborhoods
  if (text.includes('galli') || text.includes('tole') || text.includes('ward') || 
      text.includes('colony') || text.includes('area') || text.includes('unclassified') ||
      text.includes('neighbourhood') || text.includes('suburb') || text.includes('district') ||
      text.includes('sector') || text.includes('block') || text.includes('street') ||
      text.includes('lane') || text.includes('avenue') || text.includes('road')) {
    console.log('✅ Detected MEDIUM urgency location (16%) - Local Area');
    return 16;
  }
  
  // Low urgency locations (8%) - Everything else
  console.log('❌ No specific location type detected, using LOW urgency (8%)');
  console.log('Available keywords not found in text. Consider adding more location keywords.');
  return 8;
}

// Calculate repetition factor based on nearby reports
async function calculateRepetitionScore(lat, lng, category, currentReportId = null) {
  try {
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(lat);
    const lon1 = parseFloat(lng);
    
    const table = `${category}_reports`;
    const query = `SELECT id, location_lat, location_lng FROM \`${table}\``;
    
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error querying for repetition:', err);
          resolve(0);
          return;
        }
        
        let nearbyCount = 0;
        
        results.forEach(row => {
          // Skip current report if updating
          if (currentReportId && row.id == currentReportId) return;
          
          const lat2 = parseFloat(row.location_lat);
          const lon2 = parseFloat(row.location_lng);
          
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
          
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c * 1000; // Convert to meters
          
          if (distance <= 50) { // Within 50m radius
            nearbyCount++;
          }
        });
        
        // Calculate repetition score
        let repetitionScore = 0;
        if (nearbyCount >= 6) repetitionScore = 30;
        else if (nearbyCount === 5) repetitionScore = 25;
        else if (nearbyCount === 4) repetitionScore = 20;
        else if (nearbyCount === 3) repetitionScore = 15;
        else if (nearbyCount === 2) repetitionScore = 10;
        else if (nearbyCount === 1) repetitionScore = 5;
        else repetitionScore = 0;
        
        console.log(`Repetition: ${nearbyCount} nearby reports, score: ${repetitionScore}%`);
        resolve(repetitionScore);
      });
    });
  } catch (error) {
    console.error('Error in repetition calculation:', error);
    return 0;
  }
}

// Calculate size factor score
function calculateSizeScore(size) {
  switch (size) {
    case 'large': return 15;
    case 'medium': return 10;
    case 'small': return 5;
    default: return 10;
  }
}

// Calculate manual input factor score
function calculateManualInputScore(urgency) {
  console.log('Manual urgency input received:', urgency, 'Type:', typeof urgency);
  
  // Normalize the input
  const normalizedUrgency = String(urgency).toLowerCase().trim();
  console.log('Normalized urgency:', normalizedUrgency);
  
  switch (normalizedUrgency) {
    case 'high':
    case 'urgent':
    case 'critical':
      console.log('Manual urgency: HIGH (15%)');
      return 15;
    case 'medium':
    case 'moderate':
      console.log('Manual urgency: MEDIUM (10%)');
      return 10;
    case 'low':
    case 'minor':
      console.log('Manual urgency: LOW (5%)');
      return 5;
    default:
      console.log('Manual urgency: UNKNOWN, defaulting to MEDIUM (10%)');
      return 10;
  }
}

// Calculate total urgency score
async function calculateTotalUrgencyScore(lat, lng, category, size, manualUrgency, addressData, currentReportId = null) {
  try {
    console.log('\n=== URGENCY SCORE CALCULATION ===');
    console.log('Input parameters:', { lat, lng, category, size, manualUrgency });
    
    // 1. Location type score (40%)
    const locationScore = calculateLocationTypeScore(addressData, lat, lng);
    console.log(`📍 Location type score: ${locationScore}%`);
    
    // 2. Repetition score (30%)
    const repetitionScore = await calculateRepetitionScore(lat, lng, category, currentReportId);
    console.log(`🔄 Repetition score: ${repetitionScore}%`);
    
    // 3. Size score (15%)
    const sizeScore = calculateSizeScore(size);
    console.log(`📏 Size score: ${sizeScore}% (size: ${size})`);
    
    // 4. Manual input score (15%)
    const manualScore = calculateManualInputScore(manualUrgency);
    console.log(`👤 Manual urgency score: ${manualScore}% (input: ${manualUrgency})`);
    
    // Calculate total
    const totalScore = locationScore + repetitionScore + sizeScore + manualScore;
    console.log('\n📊 SCORE BREAKDOWN:');
    console.log(`   Location Type: ${locationScore}%`);
    console.log(`   Repetition: ${repetitionScore}%`);
    console.log(`   Size: ${sizeScore}%`);
    console.log(`   Manual Input: ${manualScore}%`);
    console.log(`   TOTAL: ${totalScore}%`);
    console.log('=== END URGENCY CALCULATION ===\n');
    
    return totalScore;
  } catch (error) {
    console.error('Error calculating urgency score:', error);
    return 50; // Default fallback score
  }
}

// === Your existing POST /submit-report route with added size detection ===
router.post('/submit-report', upload.single('image'), async (req, res) => {
  try {
    console.log('=== REPORT SUBMISSION START ===');
    console.log('Request body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');

    const allowedCategories = ['pothole', 'garbage', 'others'];

    // Category resolution logic
    let category = '';
    let classification = '';
    
    // Get AI classification and manual selection
    const aiClassification = req.body.classification || '';
    const manualSelection = req.body.category || '';
    
    console.log('AI Classification:', aiClassification);
    console.log('Manual Selection:', manualSelection);
    
    // Priority: Manual selection overrides AI classification
    if (manualSelection && allowedCategories.includes(manualSelection.trim().toLowerCase())) {
      category = manualSelection.trim().toLowerCase();
      classification = manualSelection.trim().toLowerCase();
      console.log('✅ Using manual selection:', category);
    } else if (aiClassification && allowedCategories.includes(aiClassification.trim().toLowerCase())) {
      category = aiClassification.trim().toLowerCase();
      classification = aiClassification.trim().toLowerCase();
      console.log('✅ Using AI classification:', category);
    } else {
      // Map other AI classifications to 'others'
      if (aiClassification) {
        category = 'others';
        classification = aiClassification.trim().toLowerCase();
        console.log('🔄 AI classified as', aiClassification, '→ mapped to others');
      } else {
        category = 'others';
        classification = 'others';
        console.log('❓ No classification provided → defaulting to others');
      }
    }
    
    console.log('Final Category:', category);
    console.log('Final Classification:', classification);

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // === New: run size detection ===
    let sizeCategory = 'medium'; // default fallback
    try {
      // Run ONNX model to get bounding box coordinates
      const inputTensor = await processImage(req.file.path);
      const output = await runModel(inputTensor);
      sizeCategory = estimateSizeFromBoundingBox(output);
      console.log('Size detection result:', sizeCategory);
    } catch (error) {
      console.error('Size detection failed:', error);
      sizeCategory = 'medium'; // fallback
    }
    // === End new ===

    // Extract form data first
    const {
      location_lat,
      location_lng,
      address,
      description,
      urgency,
      contact
    } = req.body;

    // Get human-readable address from coordinates
    let humanReadableAddress = '';
    let addressData = null;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${parseFloat(location_lat)}&lon=${parseFloat(location_lng)}&zoom=18&addressdetails=1`, {
        headers: {
          'User-Agent': 'MyApp/1.0 (myemail@example.com)'
        }
      });

      if (response.ok) {
        addressData = await response.json();
        humanReadableAddress = addressData.display_name || `${location_lat}, ${location_lng}`;
      } else {
        humanReadableAddress = `${location_lat}, ${location_lng}`;
      }
      console.log('Human-readable address:', humanReadableAddress);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      humanReadableAddress = `${location_lat}, ${location_lng}`;
    }

    // Calculate urgency score
    let urgencyScore = 50; // default fallback
    try {
      urgencyScore = await calculateTotalUrgencyScore(
        location_lat, 
        location_lng, 
        category, 
        sizeCategory, 
        urgency, 
        addressData
      );
      console.log('Calculated urgency score:', urgencyScore);
    } catch (error) {
      console.error('Urgency score calculation failed:', error);
    }

    // STEP 2: Create destination folder if missing
    const destDir = path.join(__dirname, '..', 'uploads', category);
    fs.mkdirSync(destDir, { recursive: true });

    // STEP 3: Move file to category folder
    const ext = path.extname(req.file.originalname);
    const newFilename = `${Date.now()}${ext}`;
    const newPath = path.join(destDir, newFilename);

    fs.rename(req.file.path, newPath, (err) => {
      if (err) {
        console.error('❌ File move error:', err);
        return res.status(500).json({ error: 'Failed to move image' });
      }

      const image_url = `uploads/${category}/${newFilename}`;

      const table = `${category}_reports`;

      // === Modified query to add urgency_score column ===
      const query = `INSERT INTO \`${table}\` (location_lat, location_lng, address, human_readable_address, description, urgency, contact, image_url, classification, size, urgency_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        location_lat,
        location_lng,
        address,
        humanReadableAddress,
        description,
        urgency,
        contact,
        image_url,
        classification,
        sizeCategory,
        urgencyScore
      ];

      console.log('Inserting into table:', table, 'with size:', sizeCategory, 'urgency score:', urgencyScore);
      console.log('Human-readable address:', humanReadableAddress);
      console.log('SQL Query:', query);
      console.log('Values:', values);

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('🔥 DB insert error:', err);
          console.error('Error details:', err.message);
          console.error('Error code:', err.code);
          return res.status(500).json({ error: err.message });
        }

        console.log('✅ Database insert successful. Result:', result);
        res.status(200).json({ 
          message: 'Report submitted successfully', 
          size: sizeCategory,
          address: humanReadableAddress,
          urgencyScore: urgencyScore
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports?category=garbage|pothole|others
router.get('/reports', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category } = req.query;

  // Helper to map DB rows to frontend format
  const mapRow = (row, category) => ({
    id: row.id ? String(row.id) : undefined,
    title: row.description ? row.description.slice(0, 30) + (row.description.length > 30 ? '...' : '') : 'Civic Issue',
    description: row.description,
    location: row.human_readable_address || row.address || 'Location not available',
    urgency: row.urgency,
    status: row.status || 'pending',
    reportedBy: row.contact || 'Anonymous',
    reportedAt: row.created_at || '',
    category,
    hasImages: !!row.image_url,
    images: row.image_url ? [row.image_url] : [],
    location_lat: row.location_lat,
    location_lng: row.location_lng,
    classification: row.classification || category,
    size: row.size || 'medium',
    urgencyScore: row.urgency_score || 50
  });

  const fetchCategory = (cat) => {
    return new Promise((resolve, reject) => {
      const table = `${cat}_reports`;
      // Sort by urgency_score in descending order
      db.query(`SELECT * FROM \`${table}\` ORDER BY urgency_score DESC`, (err, results) => {
        if (err) return reject(err);
        resolve(results.map(row => mapRow(row, cat)));
      });
    });
  };

  if (category && allowedCategories.includes(category)) {
    fetchCategory(category)
      .then(data => res.json(data))
      .catch(err => {
        console.error('🔥 DB fetch error:', err);
        res.status(500).json({ error: err.message });
      });
  } else {
    // Fetch all categories in parallel
    Promise.all(allowedCategories.map(fetchCategory))
      .then(results => {
        // Combine all results and sort by urgency_score
        const allResults = [].concat(...results);
        allResults.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
        res.json(allResults);
      })
      .catch(err => {
        console.error('🔥 DB fetch error:', err);
        res.status(500).json({ error: err.message });
      });
  }
});

// PATCH /api/reports/:category/:id - update status
router.patch('/reports/:category/:id', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category, id } = req.params;
  const { status } = req.body;
  console.log('PATCH /reports:', { category, id, status });
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const table = `${category}_reports`;
  db.query(`UPDATE \`${table}\` SET status = ? WHERE id = ?`, [status, id], (err, result) => {
    if (err) {
      console.error('🔥 DB update error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// DELETE /api/reports/:category/:id - delete issue
router.delete('/reports/:category/:id', (req, res) => {
  const allowedCategories = ['pothole', 'garbage', 'others'];
  const { category, id } = req.params;
  console.log('DELETE /reports:', { category, id });
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  const table = `${category}_reports`;
  db.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error('🔥 DB delete error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

module.exports = router;