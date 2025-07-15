import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { VehicleDashboard } from './components/VehicleDashboard';
import { VehicleDetails } from './components/VehicleDetails';
import { ExportView } from './components/ExportView';
import { RegistrationSearch } from './components/RegistrationSearch';
import { Button } from './components/ui/button';
import { Search, LogOut, Home, FileText, RefreshCw } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { vehicleDataService, VehicleData, DetailedVehicleData } from './services/vehicleDataService';
import { TeslaVehicle } from './services/teslaApi';

type Screen = 'login' | 'dashboard' | 'details' | 'export' | 'search' | 'loading';

interface User {
  email: string;
  provider: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<TeslaVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedVehicleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Check for authentication on app load
  useEffect(() => {
    checkAuthentication();
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const checkAuthentication = async () => {
    if (vehicleDataService.isAuthenticated()) {
      try {
        setLoading(true);
        const userVehicles = await vehicleDataService.getVehicles();
        setVehicles(userVehicles);
        
        if (userVehicles.length > 0) {
          const firstVehicle = userVehicles[0];
          setSelectedVehicleId(firstVehicle.id.toString());
          setUser({ email: 'tesla.user@example.com', provider: 'tesla' });
          setCurrentScreen('dashboard');
          await loadVehicleData(firstVehicle.id.toString());
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        toast.error('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const success = await vehicleDataService.authenticateWithCode(code);
      if (success) {
        toast.success('Tesla authentication successful!');
        await checkAuthentication();
        // Clear the URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        toast.error('Tesla authentication failed');
        setCurrentScreen('login');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error('Authentication error occurred');
      setCurrentScreen('login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, provider: string) => {
    if (provider === 'tesla') {
      // For Tesla, redirect to OAuth
      const authUrl = vehicleDataService.getAuthUrl();
      window.location.href = authUrl;
    } else {
      // For demo purposes with other providers, use mock data
      setUser({ email, provider });
      setCurrentScreen('dashboard');
      
      // Load mock data
      try {
        setLoading(true);
        const mockVehicles = await vehicleDataService.getVehicles();
        setVehicles(mockVehicles);
        if (mockVehicles.length > 0) {
          setSelectedVehicleId(mockVehicles[0].id.toString());
          await loadVehicleData(mockVehicles[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to load mock data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadVehicleData = async (vehicleId: string) => {
    try {
      setLoading(true);
      const data = await vehicleDataService.getVehicleData(vehicleId);
      setVehicleData(data);
    } catch (error) {
      console.error('Failed to load vehicle data:', error);
      toast.error('Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  const loadDetailedData = async (vehicleId: string) => {
    try {
      setLoading(true);
      const data = await vehicleDataService.getDetailedVehicleData(vehicleId);
      setDetailedData(data);
    } catch (error) {
      console.error('Failed to load detailed data:', error);
      toast.error('Failed to load detailed diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!selectedVehicleId) return;
    
    setRefreshing(true);
    try {
      await loadVehicleData(selectedVehicleId);
      if (currentScreen === 'details') {
        await loadDetailedData(selectedVehicleId);
      }
      toast.success('Vehicle data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    vehicleDataService.logout();
    setUser(null);
    setVehicles([]);
    setVehicleData(null);
    setDetailedData(null);
    setSelectedVehicleId('');
    setCurrentScreen('login');
    toast.success('Logged out successfully');
  };

  const handleVehicleFound = (vehicle: any) => {
    setCurrentScreen('dashboard');
  };

  const handleViewDetails = async () => {
    if (selectedVehicleId) {
      await loadDetailedData(selectedVehicleId);
      setCurrentScreen('details');
    }
  };

  const handleExport = () => {
    setCurrentScreen('export');
  };

  // Generate export data
  const generateExportData = () => {
    if (!vehicleData) return null;
    
    return {
      vehicleInfo: {
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        vin: vehicleData.vin,
        registration: vehicleData.registration
      },
      batteryData: {
        health: vehicleData.batteryHealth,
        level: vehicleData.batteryLevel,
        range: vehicleData.estBatteryRange,
        energyRemaining: vehicleData.energyRemaining,
        chargeLimitSoc: vehicleData.chargeLimitSoc,
        bmsState: vehicleData.bmsState,
        voltageMax: vehicleData.brickVoltageMax,
        voltageMin: vehicleData.brickVoltageMin
      },
      chargingData: {
        chargeState: vehicleData.chargeState,
        chargePortStatus: vehicleData.chargePortDoorOpen ? 'Open' : 'Closed',
        fastChargerType: vehicleData.fastChargerType,
        batteryHeater: vehicleData.batteryHeaterOn ? 'Active' : 'Inactive'
      },
      metrics: {
        odometer: vehicleData.odometer,
        efficiency: detailedData?.efficiency || 15.2,
        location: vehicleData.location.name,
        lastUpdate: vehicleData.lastUpdate
      },
      exportDate: new Date().toLocaleDateString('en-AU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Loading screen
  if (loading && currentScreen !== 'dashboard') {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2>Loading Tesla Data...</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Connecting to your vehicle
          </p>
        </div>
        <Toaster />
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <>
        <div className="fixed inset-0 bg-background">
          <LoginScreen onLogin={handleLogin} />
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Mobile App Header */}
      <div className="flex-none bg-background border-b px-4 py-3 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">EV Connect</h1>
            <p className="text-xs text-muted-foreground">
              {user?.email?.split('@')[0]} • Tesla API
              {vehicleDataService.isAuthenticated() && (
                <span className="ml-2 text-green-600">● Live</span>
              )}
            </p>
          </div>
          {currentScreen === 'dashboard' && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshData}
                disabled={refreshing}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="p-2"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-hidden">
        {currentScreen === 'dashboard' && vehicleData && (
          <VehicleDashboard
            vehicleData={vehicleData}
            onViewDetails={handleViewDetails}
            onExport={handleExport}
          />
        )}

        {currentScreen === 'details' && detailedData && (
          <VehicleDetails
            vehicleData={detailedData}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'export' && generateExportData() && (
          <ExportView
            exportData={generateExportData()!}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'search' && (
          <RegistrationSearch
            onBack={() => setCurrentScreen('dashboard')}
            onVehicleFound={handleVehicleFound}
          />
        )}

        {/* Loading overlay for data refresh */}
        {loading && currentScreen === 'dashboard' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Updating vehicle data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile App Style */}
      {currentScreen === 'dashboard' && (
        <div className="flex-none bg-background border-t px-2 py-2 safe-bottom">
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="ghost"
              className="flex flex-col h-12 px-2 py-1 text-xs"
              onClick={() => setCurrentScreen('dashboard')}
            >
              <Home className="w-5 h-5 mb-1" />
              <span>Home</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex flex-col h-12 px-2 py-1 text-xs"
              onClick={() => setCurrentScreen('search')}
            >
              <Search className="w-5 h-5 mb-1" />
              <span>Search</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex flex-col h-12 px-2 py-1 text-xs"
              onClick={() => setCurrentScreen('export')}
              disabled={!vehicleData}
            >
              <FileText className="w-5 h-5 mb-1" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}