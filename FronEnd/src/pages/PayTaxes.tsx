
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Download, Eye, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface TaxRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const PayTaxes: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTax, setSelectedTax] = useState<TaxRecord | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const taxRecords: TaxRecord[] = [
    {
      id: 'BMC-2024-001',
      type: 'Property Tax',
      amount: 15000,
      dueDate: '2024-07-15',
      status: 'pending'
    },
    {
      id: 'BMC-2024-002',
      type: 'Business License Fee',
      amount: 8500,
      dueDate: '2024-06-30',
      status: 'overdue'
    },
    {
      id: 'BMC-2023-045',
      type: 'Property Tax',
      amount: 14500,
      dueDate: '2023-12-31',
      status: 'paid'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePayment = (tax: TaxRecord) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Simulate payment process
    toast({
      title: 'Payment initiated',
      description: `Payment of NPR ${tax.amount} for ${tax.type} has been initiated.`
    });
  };

  const downloadReceipt = (tax: TaxRecord) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    toast({
      title: 'Receipt downloaded',
      description: `Receipt for ${tax.type} has been downloaded.`
    });
  };

  const LoginPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center">
          <CreditCard className="h-16 w-16 text-municipal-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-municipal-blue mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access tax payment features and view your records.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                // This would trigger the login modal from the header
                window.dispatchEvent(new CustomEvent('openLoginModal'));
              }}
              className="flex-1 municipal-button"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-municipal-blue mb-8">
        {t('pay_taxes')}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tax Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="municipal-card p-6">
            <h2 className="text-xl font-semibold mb-4">Tax Information</h2>
            
            {!user ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-municipal-blue mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Login to view your tax records and make payments
                </p>
                <button
                  onClick={() => setShowLoginPrompt(true)}
                  className="municipal-button"
                >
                  Login to Continue
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">NPR 23,500</div>
                    <div className="text-sm text-red-800">Outstanding</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">NPR 45,200</div>
                    <div className="text-sm text-green-800">Paid This Year</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-blue-800">Total Records</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tax Records - Only show when logged in */}
          {user && (
            <div className="municipal-card p-6">
              <h2 className="text-xl font-semibold mb-4">Tax Records</h2>
              
              <div className="space-y-4">
                {taxRecords.map((tax) => (
                  <div key={tax.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{tax.type}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tax.status)}`}>
                            {tax.status.charAt(0).toUpperCase() + tax.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>ID: {tax.id}</div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(tax.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-municipal-blue mb-2">
                          NPR {tax.amount.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          {tax.status === 'paid' ? (
                            <button
                              onClick={() => downloadReceipt(tax)}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              <Download className="h-3 w-3" />
                              Receipt
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePayment(tax)}
                              className="px-4 py-2 municipal-button text-sm"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTax(tax)}
                            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods & Info */}
        <div className="space-y-6">
          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CreditCard className="h-5 w-5 text-municipal-blue" />
                <span className="text-sm">Credit/Debit Card</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="text-sm">eSewa</span>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">K</span>
                </div>
                <span className="text-sm">Khalti</span>
              </div>
            </div>
          </div>

          <div className="municipal-card p-6">
            <h3 className="font-semibold mb-4">Important Information</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Login required for tax payments</li>
              <li>• Late payment charges apply after due date</li>
              <li>• Receipts are generated automatically</li>
              <li>• Contact support for payment issues</li>
              <li>• All transactions are secure and encrypted</li>
            </ul>
          </div>
        </div>
      </div>

      {showLoginPrompt && <LoginPrompt />}
    </div>
  );
};

export default PayTaxes;
