
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bubbles, setBubbles] = useState<{ id: number; size: number; left: number; duration: number; delay: number; }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast({
        title: t('success'),
        description: 'Login successful!'
      });
      onClose();
      setUsername('');
      setPassword('');
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Login failed. Please try again.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    // generate floating bubble configs
    const count = 14;
    const created = Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      size: 10 + Math.random() * 80,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 12,
      delay: Math.random() * 4,
    }));
    setBubbles(created);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 overflow-hidden">
        {/* animated bubbles background */}
        <div className="absolute inset-0 pointer-events-none">
          {bubbles.map(b => (
            <span
              key={b.id}
              className="absolute rounded-full bg-municipal-blue/10 animate-[float_var(--dur)_infinite]"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.left}%`,
                bottom: `-100px`,
                // @ts-ignore custom property for arbitrary animation duration
                ['--dur' as any]: `${b.duration}s` as any,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-municipal-blue">{t('login')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="municipal-input w-full bg-white/80 backdrop-blur"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="municipal-input w-full bg-white/80 backdrop-blur"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 municipal-button disabled:opacity-50"
            >
              {isLoading ? t('loading') : t('login')}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes float { from { transform: translateY(0) scale(1); opacity: 0.3; } 50% { opacity: 0.6; } to { transform: translateY(-120vh) scale(1.1); opacity: 0; } }
          .animate-[float_var(--dur)_infinite] { animation-name: float; animation-duration: var(--dur); animation-iteration-count: infinite; animation-timing-function: ease-in; }
        `}</style>
      </div>
    </div>
  );
};

export default LoginModal;
