import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SoilDetails {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

interface CropReport {
  id: string;
  name: string;
  date: string;
  crop: string;
  season: string;
  yield: number;
  profit: number;
  inputs: {
    fertilizer: number;
    pesticide: number;
    n: number;
    p: number;
    k: number;
    ph: number;
  };
}

interface User {
  name: string;
  phone: string;
  state: string;
  location: string;
  land_area_acres?: number;
  access_token: string;   // JWT — matches backend TokenResponse.access_token
  farmer_id?: string;     // matches backend TokenResponse.farmer_id
  soilDetails?: SoilDetails;
  reports?: CropReport[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (data: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  name: "Ravi Kumar",
  phone: "9999999999",
  state: "Karnataka",
  location: "Mysuru",
  access_token: "demo-token-123",
  farmer_id: "demo-farmer-id",
  soilDetails: { nitrogen: 68, phosphorus: 42, potassium: 38, ph: 6.8 },
  reports: [
    {
      id: 'demo-1',
      name: 'Rabi Wheat Analysis',
      date: new Date().toISOString(),
      crop: 'Wheat',
      season: 'Rabi',
      yield: 2100,
      profit: 32000,
      inputs: { fertilizer: 60, pesticide: 3, n: 68, p: 42, k: 38, ph: 6.8 }
    }
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('agripredict_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsDemoMode(parsed.access_token === 'demo-token-123');
      } catch {
        localStorage.removeItem('agripredict_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((data: User) => {
    setUser(data);
    setIsDemoMode(data.access_token === 'demo-token-123');
    localStorage.setItem('agripredict_user', JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('agripredict_user');
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('agripredict_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, isDemoMode, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { MOCK_USER };
export type { User };
