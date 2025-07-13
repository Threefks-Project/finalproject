
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image?: string;
}

const News: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'New Digital Tax Payment System Now Available for All Citizens',
      excerpt: 'Biratnagar Metropolitan City launches comprehensive digital tax payment platform with multiple payment options.',
      content: 'Biratnagar Metropolitan City has successfully launched a new digital tax payment system that allows citizens to pay their taxes online securely. The system supports multiple payment methods including credit cards, eSewa, and Khalti. Citizens can now view their tax history, download receipts, and set up payment reminders. This initiative is part of our digital transformation to provide better services to our citizens.',
      author: 'Municipal Administration',
      publishDate: '2024-06-22',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Public Notice: Road Construction Project in Ward 5 Starting Next Week',
      excerpt: 'Major road construction and improvement project will begin in Ward 5 area starting next Monday.',
      content: 'The municipal office announces that a major road construction project will commence in Ward 5 starting Monday, June 24th, 2024. The project aims to improve road infrastructure and includes proper drainage systems. Citizens are advised to use alternative routes during construction hours (8 AM to 5 PM). The project is expected to complete within 45 days. We apologize for any inconvenience caused during this period.',
      author: 'Engineering Department',
      publishDate: '2024-06-21',
      category: 'Infrastructure'
    },
    {
      id: '3',
      title: 'Municipal Office Hours Extended During Festival Season',
      excerpt: 'Extended office hours announced to serve citizens better during the upcoming festival season.',
      content: 'To better serve our citizens during the upcoming festival season, Biratnagar Metropolitan City office will extend its operating hours. From July 1st to July 15th, the office will remain open from 8 AM to 7 PM on weekdays and 10 AM to 3 PM on Saturdays. All departments including tax services, civil registration, and permit offices will be available during these extended hours.',
      author: 'Administrative Office',
      publishDate: '2024-06-20',
      category: 'Announcement'
    },
    {
      id: '4',
      title: 'AI-Powered Civic Issue Reporting System Successfully Launched',
      excerpt: 'Revolutionary AI system helps categorize and prioritize civic issues reported by citizens.',
      content: 'Biratnagar Metropolitan City proudly announces the successful launch of an AI-powered civic issue reporting system. This innovative platform automatically categorizes issues uploaded by citizens and assigns priority levels for efficient resolution. The system has already processed over 100 reports with 95% accuracy in classification. Citizens can report issues through our website or mobile app with GPS location tracking for precise issue mapping.',
      author: 'IT Department',
      publishDate: '2024-06-19',
      category: 'Technology'
    }
  ];

  // If viewing a specific article
  if (id) {
    const article = newsArticles.find(a => a.id === id);
    
    if (!article) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-municipal-blue mb-4">Article not found</h1>
            <Link to="/news" className="municipal-button">
              Back to News
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/news" 
            className="flex items-center gap-2 text-municipal-blue hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          
          <article className="municipal-card p-8">
            <div className="mb-6">
              <span className="px-3 py-1 bg-municipal-blue text-white text-sm rounded">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-municipal-blue mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.publishDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.content}
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // News listing page
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-municipal-blue mb-8">
        {t('latest_news')}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main News List */}
        <div className="lg:col-span-2 space-y-6">
          {newsArticles.map((article) => (
            <article key={article.id} className="municipal-card p-6">
              <div className="mb-4">
                <span className="px-3 py-1 bg-municipal-blue text-white text-sm rounded">
                  {article.category}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-municipal-blue mb-3">
                <Link 
                  to={`/news/${article.id}`}
                  className="hover:underline"
                >
                  {article.title}
                </Link>
              </h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.publishDate).toLocaleDateString()}
                  </div>
                </div>
                
                <Link 
                  to={`/news/${article.id}`}
                  className="text-municipal-blue hover:underline text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {['All', 'Technology', 'Infrastructure', 'Announcement'].map((category) => (
                <button
                  key={category}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Recent Updates</h3>
            <div className="space-y-3">
              {newsArticles.slice(0, 3).map((article) => (
                <div key={article.id}>
                  <Link 
                    to={`/news/${article.id}`}
                    className="text-sm hover:text-municipal-blue line-clamp-2"
                  >
                    {article.title}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(article.publishDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
