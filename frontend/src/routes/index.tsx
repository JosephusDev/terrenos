// RoutesComponent.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Reservas from "@/pages/reservas";
import Espacos from "@/pages/Espacos";
import Utentes from "@/pages/utentes";
import Login from "@/pages/login";
import { useAuth } from "@/context/AuthContext";

export default function RoutesComponent() {

  const {isAuthenticated} = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/sign-in" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}/>

      {/* Rotas privadas, redireciona para o login se não autenticado */}
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/sign-in" />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/sign-in" />} />
      <Route path="/reservas" element={isAuthenticated ? <Reservas /> : <Navigate to="/sign-in" />} />
      <Route path="/espacos" element={isAuthenticated ? <Espacos /> : <Navigate to="/sign-in" />} />
      <Route path="/utentes" element={isAuthenticated ? <Utentes /> : <Navigate to="/sign-in" />} />

      {/* Rota para lidar com páginas não encontradas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/sign-in"} />} />
    </Routes>
  );
}
