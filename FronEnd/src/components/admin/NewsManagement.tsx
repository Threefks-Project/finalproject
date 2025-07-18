
import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Search,
  Filter,
  Megaphone,
  Clock
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'notice' | 'announcement';
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  createdAt: string;
  views: number;
  isUrgent: boolean;
}

const NewsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const mockNews: NewsItem[] = [
    {
      id: 'NEWS-001',
      title: 'New Digital Tax Payment System Now Available',
      content: 'Citizens can now pay their taxes online through our new digital platform. The system accepts all major payment methods...',
      type: 'news',
      status: 'published',
      publishDate: '2024-01-15',
      createdAt: '2024-01-14',
      views: 1250,
      isUrgent: false
    },
    {
      id: 'NEWS-002',
      title: 'Public Notice: Road Construction in Ward 5',
      content: 'Road construction work will begin next week in Ward 5. Traffic diversions will be in place...',
      type: 'notice',
      status: 'published',
      publishDate: '2024-01-14',
      createdAt: '2024-01-13',
      views: 890,
      isUrgent: true
    },
    {
      id: 'NEWS-003',
      title: 'Municipal Office Hours Extended During Festival',
      content: 'To better serve citizens during the festival season, municipal office hours will be extended...',
      type: 'announcement',
      status: 'scheduled',
      publishDate: '2024-01-20',
      createdAt: '2024-01-12',
      views: 0,
      isUrgent: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'text-blue-600 bg-blue-100';
      case 'notice': return 'text-orange-600 bg-orange-100';
      case 'announcement': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNews = mockNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Notices Management</h2>
          <p className="text-gray-600">Create and manage public announcements</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-municipal-blue text-white rounded-md hover:bg-municipal-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create News
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="notice">Notice</option>
            <option value="announcement">Announcement</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  {item.isUrgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                      <Megaphone className="h-3 w-3" />
                      Urgent
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {item.publishDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {item.views} views
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={() => setSelectedNews(item)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
                  title="View"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Edit">
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Delete">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Create News Item</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
                  placeholder="News title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue">
                    <option value="news">News</option>
                    <option value="notice">Notice</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
                  placeholder="Write your news content here..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-municipal-blue"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm font-medium text-gray-700">Mark as urgent</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-municipal-blue text-white rounded-md hover:bg-municipal-blue-dark transition-colors">
                Create News
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">News Details</h3>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedNews.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedNews.type)}`}>
                    {selectedNews.type.charAt(0).toUpperCase() + selectedNews.type.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedNews.status)}`}>
                    {selectedNews.status.charAt(0).toUpperCase() + selectedNews.status.slice(1)}
                  </span>
                  <span>Published: {selectedNews.publishDate}</span>
                  <span>{selectedNews.views} views</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedNews.content}</p>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-municipal-blue text-white rounded-md hover:bg-municipal-blue-dark transition-colors">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
