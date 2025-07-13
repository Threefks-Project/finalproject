
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  date: string;
}

const NewsTicker: React.FC = () => {
  const { t } = useTranslation();
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Digital Tax Payment System Now Available for All Citizens',
      date: '2024-06-22'
    },
    {
      id: '2', 
      title: 'Public Notice: Road Construction Project in Ward 5 Starting Next Week',
      date: '2024-06-21'
    },
    {
      id: '3',
      title: 'Municipal Office Hours Extended During Festival Season',
      date: '2024-06-20'
    },
    {
      id: '4',
      title: 'AI-Powered Civic Issue Reporting System Successfully Launched',
      date: '2024-06-19'
    }
  ]);

  return (
    <div className="bg-municipal-green text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="bg-municipal-green-dark px-4 py-1 rounded-md mr-4 flex-shrink-0">
            <span className="font-medium text-sm">{t('latest_news')}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-ticker whitespace-nowrap">
              {newsItems.map((item, index) => (
                <span key={item.id} className="inline-block">
                  <Link 
                    to={`/news/${item.id}`}
                    className="hover:text-yellow-200 transition-colors text-sm"
                  >
                    {item.title}
                  </Link>
                  {index < newsItems.length - 1 && (
                    <span className="mx-8 text-municipal-green-dark">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
