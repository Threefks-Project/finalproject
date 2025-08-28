import React, { useEffect, useState } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
}

const GalleryManagement: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('general');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const { getApiUrl } = await import('@/config/api');
      const res = await fetch(getApiUrl('/gallery'));
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      setUploading(true);
      const { getApiUrl } = await import('@/config/api');
      const form = new FormData();
      form.append('image', file);
      form.append('title', title);
      form.append('description', description);
      form.append('date', date);
      form.append('location', location);
      form.append('category', category);
      const res = await fetch(getApiUrl('/gallery'), { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Upload failed');
      setTitle(''); setDescription(''); setDate(''); setLocation(''); setCategory('general'); setFile(null);
      await load();
    } catch (e) {
      // no-op
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <p className="text-gray-600">Upload photos and manage the public gallery</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Date</label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Location</label>
          <input value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="general">General</option>
            <option value="events">Events</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="environment">Environment</option>
            <option value="community">Community</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button disabled={isUploading || !file} className="px-4 py-2 bg-municipal-blue text-white rounded-md disabled:opacity-50">{isUploading ? 'Uploading...' : 'Upload'}</button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Existing Photos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-md overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="font-medium">{item.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500">{item.category} • {item.date || '-'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManagement;


