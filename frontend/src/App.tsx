// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Импортируем наши новые компоненты с wow эффектами
import GeometricBackground from "./components/GeometricBackground";

const queryClient = new QueryClient();

const App = () => (
  // Используем React.Fragment (<>), чтобы не создавать лишних DOM-элементов
  <>
    {/* Интерактивный сетевой фон с узлами и соединениями */}
    <NetworkBackground />

    {/* Все ваши провайдеры и роуты будут поверх фона */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;