import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SoilDetails from "./pages/SoilDetails";
import PredictYield from "./pages/PredictYield";
import Profile from "./pages/Profile";
import DiseaseDetection from "./pages/DiseaseDetection";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import RecommendCrop from "./pages/RecommendCrop";
import NotFound from "./pages/NotFound";

import Chatbot from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/soil-details" element={<ProtectedRoute><SoilDetails /></ProtectedRoute>} />
            <Route path="/predict" element={<ProtectedRoute><PredictYield /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/disease" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
            <Route path="/recommend" element={<ProtectedRoute><RecommendCrop /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
