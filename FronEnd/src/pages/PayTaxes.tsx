import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, Download, Eye, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface TaxRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const PayTaxes: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTax, setSelectedTax] = useState<TaxRecord | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const taxRecords: TaxRecord[] = [
    {
      id: "BMC-2024-001",
      type: "Property Tax",
      amount: 15000,
      dueDate: "2024-07-15",
      status: "pending",
    },
    {
      id: "BMC-2024-002",
      type: "Business License Fee",
      amount: 8500,
      dueDate: "2024-06-30",
      status: "overdue",
    },
    {
      id: "BMC-2023-045",
      type: "Property Tax",
      amount: 14500,
      dueDate: "2023-12-31",
      status: "paid",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handlePayment = (tax: TaxRecord) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    // Simulate payment process
    toast({
      title: "Payment initiated",
      description: `Payment of NPR ${tax.amount} for ${tax.type} has been initiated.`,
    });
  };

  const downloadReceipt = (tax: TaxRecord) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    toast({
      title: "Receipt downloaded",
      description: `Receipt for ${tax.type} has been downloaded.`,
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
                window.dispatchEvent(new CustomEvent("openLoginModal"));
              }}
              className="flex-1 municipal-button"
            >
              {t("login")}
            </button>
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                setShowSignup(true);
              }}
              className="flex-1 px-4 py-2 bg-white text-municipal-blue border border-municipal-blue rounded-md hover:bg-municipal-blue/10 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  type TaxType = "property" | "business";
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<any>({
    name: "",
    ward: "",
    phone: "",
    email: "",
    taxType: "property",
    land_area_sqft: "",
    kitta_no: "",
    building_area_sqft: "",
    use: "residential",
    location_type: "prime",
    category: "small",
    pan_no: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const canGoNext = useMemo(() => {
    if (step === 1) {
      if (
        !form.name ||
        !form.ward ||
        !form.phone ||
        !form.email ||
        !form.taxType
      )
        return false;
      if (form.taxType === "property") {
        return (
          form.land_area_sqft &&
          form.kitta_no &&
          form.building_area_sqft &&
          form.use &&
          form.location_type
        );
      }
      if (form.taxType === "business") {
        return !!form.category && !!form.pan_no;
      }
      // both
      return (
        form.land_area_sqft &&
        form.kitta_no &&
        form.building_area_sqft &&
        form.use &&
        form.location_type &&
        form.category &&
        form.pan_no
      );
    }
    if (step === 2) {
      return (
        form.username &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword
      );
    }
    return false;
  }, [step, form]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop default form submission

    if (!canGoNext) return;

    try {
      const response = await fetch('/api/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to register",
        });
      } else {
        toast({ title: "Success", description: "Account created" });
        setShowSignup(false);
      }
    } catch (err) {
      toast({ title: "Error", description: "Server error" });
    }
  };

  const SignupModal = () => {
    const taxType = (form.taxType as TaxType) || "property";
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg w-full max-w-2xl h-[90vh] max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold">Create Account</h2>
              <p className="text-sm text-gray-500">
                Register to continue with tax services
              </p>
            </div>
            <div className="p-6 flex-1 min-h-0 overflow-y-auto">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      autoFocus={focusedField === "name"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Ward
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={form.ward}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("ward")}
                      autoFocus={focusedField === "ward"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Phone No
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      autoFocus={focusedField === "phone"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      autoComplete="email"
                      onFocus={() => setFocusedField("email")}
                      autoFocus={focusedField === "email"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Tax Type
                    </label>
                    <select
                      name="taxType"
                      value={form.taxType}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("taxType")}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    >
                      <option value="property">Property Tax</option>
                      <option value="business">Business Tax</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {taxType === "property" ? (
                    <>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Land Area (sqft)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          name="land_area_sqft"
                          value={form.land_area_sqft}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("land_area_sqft")}
                          autoFocus={focusedField === "land_area_sqft"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Kitta No
                        </label>
                        <input
                          type="text"
                          name="kitta_no"
                          value={form.kitta_no}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("kitta_no")}
                          autoFocus={focusedField === "kitta_no"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Building Area (sqft)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          name="building_area_sqft"
                          value={form.building_area_sqft}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("building_area_sqft")}
                          autoFocus={focusedField === "building_area_sqft"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Use
                        </label>
                        <select
                          name="use"
                          value={form.use}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("use")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="industrial">Industrial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Location Type
                        </label>
                        <select
                          name="location_type"
                          value={form.location_type}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("location_type")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="prime">Prime Area</option>
                          <option value="normal">Normal</option>
                          <option value="remote">Remote</option>
                        </select>
                      </div>
                    </>
                  ) : taxType === "business" ? (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">
                          Business Category
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("category")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="small">
                            Small (Rs. 0 - 1,000,000)
                          </option>
                          <option value="medium">
                            Medium (Rs. 1,000,000 - 5,000,000)
                          </option>
                          <option value="large">
                            Large (Rs. 5,000,000 - 20,000,000)
                          </option>
                          <option value="big industry">
                            Big Industry (&gt; 20,000,000)
                          </option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">
                          PAN No
                        </label>
                        <input
                          type="text"
                          name="pan_no"
                          value={form.pan_no}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("pan_no")}
                          autoFocus={focusedField === "pan_no"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Property Details
                        </h4>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Land Area (sqft)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          name="land_area_sqft"
                          value={form.land_area_sqft}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("land_area_sqft")}
                          autoFocus={focusedField === "land_area_sqft"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Kitta No
                        </label>
                        <input
                          type="text"
                          name="kitta_no"
                          value={form.kitta_no}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("kitta_no")}
                          autoFocus={focusedField === "kitta_no"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Building Area (sqft)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          name="building_area_sqft"
                          value={form.building_area_sqft}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("building_area_sqft")}
                          autoFocus={focusedField === "building_area_sqft"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Use
                        </label>
                        <select
                          name="use"
                          value={form.use}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("use")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="industrial">Industrial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Location Type
                        </label>
                        <select
                          name="location_type"
                          value={form.location_type}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("location_type")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="prime">Prime Area</option>
                          <option value="normal">Normal</option>
                          <option value="remote">Remote</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Business Details
                        </h4>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">
                          Business Category
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("category")}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        >
                          <option value="small">
                            Small (Rs. 0 - 1,000,000)
                          </option>
                          <option value="medium">
                            Medium (Rs. 1,000,000 - 5,000,000)
                          </option>
                          <option value="large">
                            Large (Rs. 5,000,000 - 20,000,000)
                          </option>
                          <option value="big industry">
                            Big Industry (&gt; 20,000,000)
                          </option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-1">
                          PAN No
                        </label>
                        <input
                          type="text"
                          name="pan_no"
                          value={form.pan_no}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("pan_no")}
                          autoFocus={focusedField === "pan_no"}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Choose Username
                    </label>
                    <input
                      type="text"
                      autoComplete="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("username")}
                      autoFocus={focusedField === "username"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      autoFocus={focusedField === "password"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("confirmPassword")}
                      autoFocus={focusedField === "confirmPassword"}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-municipal-blue"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-between flex-shrink-0">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setShowSignup(false)}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                {step === 2 && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                )}
                {step === 1 && (
                  <button
                    type="button"
                    disabled={!canGoNext}
                    className={`px-4 py-2 rounded-md ${
                      canGoNext
                        ? "bg-municipal-blue text-white hover:bg-municipal-blue-dark"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    disabled={!canGoNext}
                    className={`px-4 py-2 rounded-md ${
                      canGoNext
                        ? "bg-municipal-blue text-white hover:bg-municipal-blue-dark"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-municipal-blue mb-8">
        {t("pay_taxes")}
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
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowLoginPrompt(true)}
                    className="municipal-button"
                  >
                    Login to Continue
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="px-4 py-2 bg-white text-municipal-blue border border-municipal-blue rounded-md hover:bg-municipal-blue/10 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      NPR 23,500
                    </div>
                    <div className="text-sm text-red-800">Outstanding</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      NPR 45,200
                    </div>
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
                  <div
                    key={tax.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{tax.type}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              tax.status
                            )}`}
                          >
                            {tax.status.charAt(0).toUpperCase() +
                              tax.status.slice(1)}
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
                          {tax.status === "paid" ? (
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
      {showSignup && <SignupModal />}
    </div>
  );
};

export default PayTaxes;
