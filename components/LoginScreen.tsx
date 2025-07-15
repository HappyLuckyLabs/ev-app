import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Zap, Car, AlertCircle, ExternalLink } from 'lucide-react';
import { teslaApi } from '../services/teslaApi';

interface LoginScreenProps {
  onLogin: (email: string, provider: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState('tesla');
  const [showTeslaWarning, setShowTeslaWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (provider === 'tesla' && !teslaApi.isConfigured()) {
      setShowTeslaWarning(true);
      return;
    }
    
    if (email) {
      onLogin(email, provider);
    }
  };

  const handleDemoMode = () => {
    onLogin('demo@example.com', 'demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle>EV Connect</CardTitle>
          <CardDescription>
            Connect your electric vehicle account to view detailed diagnostics and specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tesla Configuration Warning */}
          {showTeslaWarning && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-2">
                  <p className="font-medium">Tesla API Not Configured</p>
                  <p className="text-sm">
                    To connect to real Tesla vehicles, you need to set up API credentials:
                  </p>
                  <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
                    <li>Sign up at <a href="https://developer.tesla.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center">developer.tesla.com <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                    <li>Create a Tesla App and get your credentials</li>
                    <li>Configure your environment variables</li>
                  </ol>
                  <div className="pt-2">
                    <Button 
                      onClick={handleDemoMode}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Try Demo Mode Instead
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">EV Provider</Label>
              <select 
                id="provider"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                  setShowTeslaWarning(false);
                }}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="tesla">Tesla (Official API)</option>
                <option value="bmw">BMW (Demo)</option>
                <option value="audi">Audi e-tron (Demo)</option>
                <option value="mercedes">Mercedes EQS (Demo)</option>
                <option value="nissan">Nissan Leaf (Demo)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Car className="w-4 h-4 mr-2" />
              {provider === 'tesla' ? 'Connect Tesla Account' : 'Connect Vehicle'}
            </Button>
          </form>
          
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              onClick={handleDemoMode}
              variant="outline" 
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Try Demo Mode
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {provider === 'tesla' && teslaApi.isConfigured() ? 
                'Tesla API configured - OAuth authentication will be used' :
                provider === 'tesla' ?
                'Tesla API not configured - click above for setup instructions' :
                'Demo mode - synthetic vehicle data will be used'
              }
            </p>
            
            {provider === 'tesla' && teslaApi.isConfigured() && (
              <div className="text-xs text-green-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Tesla API Ready
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}