import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SearchResult {
  registration: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  engineSize?: string;
  found: boolean;
}

interface RegistrationSearchProps {
  onBack: () => void;
  onVehicleFound: (vehicle: SearchResult) => void;
}

export function RegistrationSearch({ onBack, onVehicleFound }: RegistrationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // Mock vehicle database
  const mockVehicleDB: Record<string, SearchResult> = {
    'ABC123': {
      registration: 'ABC123',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      color: 'White',
      fuelType: 'Electric',
      found: true
    },
    'XYZ789': {
      registration: 'XYZ789',
      make: 'BMW',
      model: 'iX3',
      year: 2022,
      color: 'Black',
      fuelType: 'Electric',
      found: true
    },
    'EV2024': {
      registration: 'EV2024',
      make: 'Audi',
      model: 'e-tron GT',
      year: 2024,
      color: 'Blue',
      fuelType: 'Electric',
      found: true
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a registration number');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const normalizedSearch = searchTerm.toUpperCase().replace(/\s+/g, '');
    const result = mockVehicleDB[normalizedSearch];
    
    if (result) {
      setSearchResult(result);
      toast.success('Vehicle found!');
    } else {
      setSearchResult({
        registration: normalizedSearch,
        make: '',
        model: '',
        year: 0,
        color: '',
        fuelType: '',
        found: false
      });
      toast.error('Vehicle not found in database');
    }
    
    setIsSearching(false);
  };

  const handleConnectVehicle = () => {
    if (searchResult && searchResult.found) {
      onVehicleFound(searchResult);
    }
  };

  const formatRegistration = (reg: string) => {
    return reg.replace(/(.{3})/g, '$1 ').trim();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>Registration Search</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle>Find Vehicle by Registration</CardTitle>
            <CardDescription>
              Enter a vehicle registration number to search for vehicle details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="e.g. ABC123 or ABC 123"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="uppercase"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Demo registrations: ABC123, XYZ789, EV2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResult && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {searchResult.found ? (
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  )}
                  Search Results
                </CardTitle>
                <Badge variant={searchResult.found ? "secondary" : "destructive"}>
                  {searchResult.found ? 'Found' : 'Not Found'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {searchResult.found ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registration</span>
                      <span className="font-mono font-bold">
                        {formatRegistration(searchResult.registration)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle</span>
                      <span className="font-medium">
                        {searchResult.year} {searchResult.make} {searchResult.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-medium">{searchResult.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Type</span>
                      <Badge variant="secondary">{searchResult.fuelType}</Badge>
                    </div>
                  </div>
                  
                  {searchResult.fuelType === 'Electric' && (
                    <Button onClick={handleConnectVehicle} className="w-full">
                      Connect to Vehicle
                    </Button>
                  )}
                  
                  {searchResult.fuelType !== 'Electric' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        This vehicle is not electric. EV Connect only supports electric vehicles.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <h3>Vehicle Not Found</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Registration "{formatRegistration(searchResult.registration)}" was not found in our database.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try checking the registration number or contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Search by vehicle registration number</p>
            <p>• Verify vehicle details match your EV</p>
            <p>• Connect to view diagnostics and specifications</p>
            <p>• Only electric vehicles are supported</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}