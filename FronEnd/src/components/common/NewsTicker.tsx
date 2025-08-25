
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ApiNewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

interface NewsItem extends ApiNewsItem {}

interface NewsModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{new Date(item.pubDate).toLocaleString()}</p>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{item.contentSnippet}</p>
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-municipal-blue text-white rounded-md hover:bg-municipal-blue-dark"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </div>
  );
};

const NewsTicker: React.FC = () => {
  const { t } = useTranslation();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/news')
      .then(res => res.json())
      .then((data: ApiNewsItem[]) => {
        if (!Array.isArray(data)) return;
        if (isMounted) setNewsItems(data);
      })
      .catch(() => {})
    return () => { isMounted = false };
  }, []);

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
                <span key={`${item.link}-${index}`} className="inline-block">
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="hover:text-yellow-200 transition-colors text-sm"
                  >
                    {item.title}
                  </button>
                  {index < newsItems.length - 1 && (
                    <span className="mx-8 text-municipal-green-dark">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default NewsTicker;
