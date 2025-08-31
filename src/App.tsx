import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/dashboard/HomePage";
import ReportsPage from "./pages/dashboard/insights/ReportsPage";
import GoalsPage from "./pages/dashboard/insights/GoalsPage";
import ProjetosPage from "./pages/dashboard/ProjetosPage";
import CadastroHospitalPage from "./pages/dashboard/CadastroHospitalPage";
import CampanhasPage from "./pages/dashboard/CampanhasPage";
import CriarCampanhaPage from "./pages/dashboard/CriarCampanhaPage";
import PesquisaPublica from "./pages/PesquisaPublica";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pesquisa/:campanhaId" element={<PesquisaPublica />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }>
            <Route path="home" element={<HomePage />} />
            <Route path="campanhas" element={<CampanhasPage />} />
            <Route path="campanhas/criar/:tipo" element={<CriarCampanhaPage />} />
            <Route path="campanhas/criar/:tipo/:id" element={<CriarCampanhaPage />} />
            <Route path="insights/reports" element={<ReportsPage />} />
            <Route path="insights/goals" element={<GoalsPage />} />
            <Route path="projetos" element={<ProjetosPage />} />
            <Route path="projetos/cadastro" element={<CadastroHospitalPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
