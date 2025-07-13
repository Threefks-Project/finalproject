import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "city_name": "Biratnagar Metropolitan City",
      "language": "Language",
      
      // Navigation
      "home": "Home",
      "services": "eGov Services",
      "about": "About Us",
      "contact": "Contact",
      "login": "Login",
      "logout": "Logout",
      "gallery": "Gallery",
      
      // Homepage
      "welcome_title": "Welcome to Biratnagar Metropolitan City",
      "welcome_subtitle": "Digital Services for Citizens",
      "latest_news": "Latest News & Notices",
      "quick_services": "Quick Services",
      
      // Services
      "report_issue": "Report Civic Issue",
      "pay_taxes": "Pay Taxes",
      "applications": "Application Services",
      "downloads": "Downloads & Forms",
      "my_complaints": "My Complaints",
      
      // Issue Reporting
      "report_issue_title": "Report an Issue",
      "report_issue_subtitle": "Take a photo or upload one, we'll handle the rest",
      "image_required": "Issue Photo *",
      "use_camera": "Use Camera",
      "take_photo_directly": "Take photo directly",
      "upload_file": "Upload File",
      "choose_from_gallery": "Choose from gallery",
      "ai_classification": "AI Issue Identification",
      "ai_analyzing": "AI is analyzing the image...",
      "please_wait": "Please wait a moment",
      "identified_issue": "Identified Issue",
      "confidence": "Confidence",
      "if_wrong_description": "If this is incorrect, you can write the correct information in the description",
      "location": "Location",
      "location_set": "Location Set",
      "change": "Change",
      "select_location": "Select Location",
      "click_map_to_pin": "Click on the map to pin location",
      "search_location": "Search location...",
      "biratnagar": "Biratnagar",
      "morang": "Morang",
      "municipality_map": "Municipality Map",
      "selected_location": "Selected Location",
      "confirm_location": "Confirm Location",
      "issue_description": "Issue Description",
      "issue_description_required": "Issue Description *",
      "describe_issue_detail": "Describe the issue in detail...",
      "manual_location_description_required": "Description is mandatory when location is selected manually",
      "issue_description_optional": "Issue Description (Optional)",
      "additional_info": "Provide additional information (optional)...",
      "priority": "Priority ",
      "low_priority": "Low Priority",
      "medium_priority": "Medium Priority",
      "high_priority": "Urgent",
      "contact_info": "Contact Information (Optional)",
      "phone_email_optional": "Phone number or email address (optional)",
      "submit_report": "Submit Report",
      "submitting": "Submitting...",
      "smart_photo": "Smart Photo",
      "ai_identifies_issue": "AI identifies issues from photos",
      "automatic_location": "Automatic Location",
      "auto_gps_data": "Automatically captures GPS data",
      "quick_process": "Quick Process",
      "report_without_login": "Report without login",
      
      // Gallery
      "photo_gallery": "Photo Gallery",
      "beautiful_moments": "Beautiful moments of Biratnagar Metropolitan City",
      "all": "All",
      "environment": "Environment",
      "infrastructure": "Infrastructure",
      "events": "Events",
      "nature": "Nature",
      "community": "Community",
      "no_images_found": "No images found",
      "no_images_category": "No images are currently available in this category.",
      
      // Common
      "submit": "Submit",
      "cancel": "Cancel",
      "back": "Back",
      "next": "Next",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "download": "Download",
      "search": "Search",
      
      // Footer
      "all_rights_reserved": "All rights reserved",
      "developed_by": "Developed by"
    }
  },
  ne: {
    translation: {
      // Header
      "city_name": "विराटनगर महानगरपालिका",
      "language": "भाषा",
      
      // Navigation
      "home": "गृहपृष्ठ",
      "services": "ई-सेवाहरू",
      "about": "हाम्रो बारे",
      "contact": "सम्पर्क",
      "login": "लगइन",
      "logout": "लगआउट",
      "gallery": "ग्यालेरी",
      
      // Homepage
      "welcome_title": "विराटनगर महानगरपालिकामा स्वागत छ",
      "welcome_subtitle": "नागरिकहरूका लागि डिजिटल सेवाहरू",
      "latest_news": "ताजा समाचार र सूचनाहरू",
      "quick_services": "द्रुत सेवाहरू",
      
      // Services
      "report_issue": "समस्या रिपोर्ट गर्नुहोस्",
      "pay_taxes": "कर तिर्नुहोस्",
      "applications": "आवेदन सेवाहरू",
      "downloads": "डाउनलोड र फारमहरू",
      "my_complaints": "मेरा उजुरीहरू",
      
      // Issue Reporting
      "report_issue_title": "समस्या रिपोर्ट गर्नुहोस्",
      "report_issue_subtitle": "तस्बिर खिच्नुहोस् वा अपलोड गर्नुहोस्, हामी बाँकी काम गर्छौं",
      "image_required": "समस्याको तस्बिर *",
      "use_camera": "क्यामेरा प्रयोग गर्नुहोस्",
      "take_photo_directly": "सिधै तस्बिर खिच्नुहोस्",
      "upload_file": "फाइल अपलोड गर्नुहोस्",
      "choose_from_gallery": "ग्यालेरीबाट छान्नुहोस्",
      "ai_classification": "AI समस्या पहिचान",
      "ai_analyzing": "AI ले तस्बिर विश्लेषण गर्दै...",
      "please_wait": "कृपया केही क्षण पर्खनुहोस्",
      "identified_issue": "पहिचान गरिएको समस्या",
      "confidence": "विश्वसनीयता",
      "if_wrong_description": "यदि यो गलत छ भने, तपाईं विवरणमा सही जानकारी लेख्न सक्नुहुन्छ",
      "location": "स्थान",
      "location_set": "स्थान सेट गरियो",
      "change": "परिवर्तन गर्नुहोस्",
      "select_location": "स्थान चयन गर्नुहोस्",
      "click_map_to_pin": "म्यापमा क्लिक गरेर स्थान चिन्ह लगाउनुहोस्",
      "search_location": "स्थान खोज्नुहोस्...",
      "biratnagar": "बिराटनगर",
      "morang": "मोरङ",
      "municipality_map": "नगरपालिका म्याप",
      "selected_location": "चयनित स्थान",
      "confirm_location": "स्थान पुष्टि गर्नुहोस्",
      "issue_description": "समस्याको विवरण",
      "issue_description_required": "समस्याको विवरण *",
      "describe_issue_detail": "समस्याको बारेमा विस्तारमा लेख्नुहोस्...",
      "manual_location_description_required": "स्थान म्यानुअल रूपमा चयन गरेकोले विवरण अनिवार्य छ",
      "issue_description_optional": "समस्याको विवरण (वैकल्पिक)",
      "additional_info": "थप जानकारी प्रदान गर्नुहोस् (वैकल्पिक)...",
      "priority": "प्राथमिकता",
      "low_priority": "कम महत्वपूर्ण",
      "medium_priority": "मध्यम महत्वपूर्ण",
      "high_priority": "अत्यावश्यक",
      "contact_info": "सम्पर्क जानकारी (वैकल्पिक)",
      "phone_email_optional": "फोन नम्बर वा इमेल ठेगाना (वैकल्पिक)",
      "submit_report": "रिपोर्ट पेश गर्नुहोस्",
      "submitting": "पेश गर्दै...",
      "smart_photo": "स्मार्ट तस्बिर",
      "ai_identifies_issue": "AI ले तस्बिरबाट समस्या पहिचान गर्छ",
      "automatic_location": "स्वचालित स्थान",
      "auto_gps_data": "GPS डाटा स्वतः प्राप्त गर्छ",
      "quick_process": "द्रुत प्रक्रिया",
      "report_without_login": "लगइन बिना नै रिपोर्ट गर्नुहोस्",
      
      // Gallery
      "photo_gallery": "फोटो ग्यालेरी",
      "beautiful_moments": "बिराटनगर महानगरपालिकाका सुन्दर क्षणहरू",
      "all": "सबै",
      "environment": "वातावरण",
      "infrastructure": "पूर्वाधार",
      "events": "कार्यक्रमहरू",
      "nature": "प्रकृति",
      "community": "समुदाय",
      "no_images_found": "कुनै तस्बिरहरू फेला परेनन्",
      "no_images_category": "यस श्रेणीमा हाल कुनै तस्बिरहरू उपलब्ध छैनन्।",
      
      // Common
      "submit": "पेश गर्नुहोस्",
      "cancel": "रद्द गर्नुहोस्",
      "back": "फिर्ता",
      "next": "अगाडि",
      "loading": "लोड हुँदै...",
      "error": "त्रुटि",
      "success": "सफल",
      "download": "डाउनलोड",
      "search": "खोज्नुहोस्",
      
      // Footer
      "all_rights_reserved": "सबै अधिकार सुरक्षित",
      "developed_by": "द्वारा विकसित"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferred_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
