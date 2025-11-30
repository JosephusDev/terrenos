import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Api } from "@/services/api"
import { useToast } from '@/hooks/use-toast';
import { AlertTriangleIcon } from 'lucide-react';


interface AuthContextType {
  isAuthenticated: boolean;
  usuario: string;
  login: (user: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState('');

  // Verificar o token no localStorage ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const usuario = localStorage.getItem('usuario');
    const nivel = localStorage.getItem('nivel');
    if (token && id && usuario && nivel) {
      setIsAuthenticated(true);
      setUsuario(usuario);
    }
  }, []);

  const { toast } = useToast()

  const alerta = () => {
    toast({
      description: 
        <div className="flex">
            <AlertTriangleIcon size="20" /> 
            <div className="ml-2 font-bold">
                Utilizador não encontrado.
            </div>
        </div>,
        variant: "destructive"
      })
  }

  const login = async (user: string, password: string) => {
    try {
      const response = await Api.post('/auth/login', { username: user, password: password });
      const { token, id, nivel } = response.data;
      if(response.data.token) {
        setIsAuthenticated(true);
        setUsuario(user);
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        localStorage.setItem('usuario', user);
        localStorage.setItem('nivel', nivel);      
      }else{
        alerta();
      }
    } catch (error) {
      console.error('Login failed', error);
      alerta();
    }
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsuario('');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nivel');
  }, []);

  useEffect(() => {
    const intervalId = setInterval(()=>{
      Api.get("/verify", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response)=>{
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error.message);
        logout()
      })
    }, 60000)
    return () => clearInterval(intervalId)
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
