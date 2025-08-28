import React, { useEffect, useState } from 'react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
}

const ContactManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { getApiUrl } = await import('@/config/api');
        const res = await fetch(getApiUrl('/admin/contacts'));
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch {}
    })();
  }, []);

  const filtered = messages.filter(m => (
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <p className="text-gray-600">View incoming messages from the Contact page</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search by name, email, or subject..."
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(msg => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{new Date(msg.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium">{msg.name}</td>
                  <td className="py-3 px-4 text-blue-700">{msg.email}</td>
                  <td className="py-3 px-4">{msg.phone || '-'}</td>
                  <td className="py-3 px-4">{msg.subject}</td>
                  <td className="py-3 px-4 max-w-xl truncate" title={msg.message}>{msg.message}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;


