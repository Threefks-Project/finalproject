
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Eye } from 'lucide-react';

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  size: string;
  lastUpdated: string;
}

const Downloads: React.FC = () => {
  const { t } = useTranslation();

  const downloadItems: DownloadItem[] = [
    {
      id: '1',
      title: 'Building Permit Application Form',
      description: 'Application form for building permit and construction approval',
      category: 'Building & Construction',
      fileType: 'PDF',
      size: '245 KB',
      lastUpdated: '2024-06-15'
    },
    {
      id: '2',
      title: 'Business License Application',
      description: 'Form for new business registration and license application',
      category: 'Business Services',
      fileType: 'PDF',
      size: '189 KB',
      lastUpdated: '2024-06-10'
    },
    {
      id: '3',
      title: 'Citizenship Certificate Guidelines',
      description: 'Complete guidelines and requirements for citizenship certificate',
      category: 'Civil Documents',
      fileType: 'PDF',
      size: '312 KB',
      lastUpdated: '2024-06-08'
    },
    {
      id: '4',
      title: 'Property Tax Payment Guidelines',
      description: 'Instructions for property tax calculation and payment methods',
      category: 'Tax Services',
      fileType: 'PDF',
      size: '156 KB',
      lastUpdated: '2024-06-05'
    },
    {
      id: '5',
      title: 'Marriage Certificate Application',
      description: 'Application form and requirements for marriage certificate',
      category: 'Civil Documents',
      fileType: 'PDF',
      size: '198 KB',
      lastUpdated: '2024-06-01'
    },
    {
      id: '6',
      title: 'Municipal Service Fee Structure',
      description: 'Complete fee structure for all municipal services',
      category: 'General Information',
      fileType: 'PDF',
      size: '234 KB',
      lastUpdated: '2024-05-28'
    }
  ];

  const categories = [
    'All Categories',
    'Building & Construction',
    'Business Services',
    'Civil Documents',
    'Tax Services',
    'General Information'
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');

  const filteredItems = selectedCategory === 'All Categories' 
    ? downloadItems 
    : downloadItems.filter(item => item.category === selectedCategory);

  const handleDownload = (item: DownloadItem) => {
    // Simulate download
    console.log(`Downloading: ${item.title}`);
  };

  const handlePreview = (item: DownloadItem) => {
    // Simulate preview
    console.log(`Previewing: ${item.title}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-municipal-blue mb-8">
        {t('downloads')}
      </h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="municipal-card p-6">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-municipal-blue text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="lg:col-span-3">
          <div className="municipal-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Available Downloads 
                {selectedCategory !== 'All Categories' && (
                  <span className="text-municipal-blue"> - {selectedCategory}</span>
                )}
              </h2>
              <div className="text-sm text-gray-600">
                {filteredItems.length} items found
              </div>
            </div>
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No downloads found in this category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-municipal-blue" />
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {item.fileType}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{item.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Category:</span> {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {item.size}
                          </div>
                          <div>
                            <span className="font-medium">Updated:</span> {new Date(item.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(item)}
                          className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="flex items-center gap-1 px-4 py-2 text-sm municipal-button"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
