
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import i18n from "./i18n/config";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import ReportIssue from "./pages/ReportIssue";
import PayTaxes from "./pages/PayTaxes";
import MyApplications from "./pages/MyApplications";
import MyComplaints from "./pages/MyComplaints";
import Downloads from "./pages/Downloads";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/report" element={<ReportIssue />} />
                  <Route path="/pay-taxes" element={<PayTaxes />} />
                  <Route path="/my-applications" element={<MyApplications />} />
                  <Route path="/my-complaints" element={<MyComplaints />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<News />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
