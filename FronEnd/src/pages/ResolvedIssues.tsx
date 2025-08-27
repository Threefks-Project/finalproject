import React, { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { getImageUrl } from '@/config/api';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  reportedAt: string;
  category: 'garbage' | 'pothole' | 'others';
  status?: 'pending' | 'verified' | 'resolved' | 'rejected';
  images?: string[];
}

const ResolvedIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Issue | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch('/api/reports?status=resolved')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load resolved issues');
        return res.json();
      })
      .then((data: Issue[]) => {
        if (mounted) setIssues(Array.isArray(data) ? data : []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    return () => { mounted = false };
  }, []);

  const resolvedWithImages = useMemo(() => (
    issues
      .filter(i => i.status === 'resolved')
      .filter(i => Array.isArray(i.images) && i.images.length > 0)
  ), [issues]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Resolved Issues</h1>

      {loading && (
        <div className="text-center text-gray-500 py-16">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-16">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resolvedWithImages.map((issue, idx) => (
            <button
              key={issue.id || idx}
              className="group relative overflow-hidden rounded-xl shadow hover:shadow-xl transition-all duration-300 bg-white text-left"
              onClick={() => setSelected(issue)}
            >
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={getImageUrl(issue.images![0])}
                  alt={issue.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Hover overlay with location and description */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px]" />
                <div className="relative p-4 text-white w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/90">Resolved</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 capitalize">{issue.category}</span>
                  </div>
                  <h3 className="font-semibold line-clamp-1 mb-2">{issue.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/95 mb-2">
                    <MapPin className="w-4 h-4 text-white/90" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>
                  <p className="text-xs text-white/90 line-clamp-3">{issue.description}</p>
                </div>
              </div>

            </button>
          ))}
        </div>
      )}

      {/* Modal for full details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-72 bg-gray-100 overflow-hidden">
              {selected.images && selected.images[0] && (
                <img src={getImageUrl(selected.images[0])} alt={selected.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{selected.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Resolved</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <span className="capitalize">{selected.category}</span> • {selected.reportedAt ? new Date(selected.reportedAt).toLocaleString() : ''}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <MapPin className="w-4 h-4 text-municipal-blue" />
                <span className="truncate">{selected.location}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{selected.description}</p>
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;

