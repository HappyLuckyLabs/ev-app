import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Battery, Gauge, MapPin, Calendar, ChevronRight, Zap, Activity, Thermometer, Plug, Car } from 'lucide-react';

interface VehicleData {
  make: string;
  model: string;
  year: number;
  vin: string;
  registration: string;
  
  // Essential Battery & Charging Metrics
  batteryLevel: number; // SoC %
  estBatteryRange: number; // km estimated range
  energyRemaining: number; // kWh remaining
  batteryHealth: number;
  
  // Charging Data
  chargeState: string;
  detailedChargeState: string;
  chargeAmps: number;
  chargerVoltage: number;
  dcChargingPower: number;
  acChargingPower: number;
  chargeLimitSoc: number;
  batteryHeaterOn: boolean;
  acChargingEnergyIn: number;
  dcChargingEnergyIn: number;
  
  // Charge Port Status
  chargePortDoorOpen: boolean;
  chargePortLatch: string;
  fastChargerPresent: boolean;
  fastChargerType: string;
  
  // Vehicle Context
  vehicleSpeed: number;
  odometer: number;
  location: { lat: number; lng: number; name: string };
  
  // System Status
  bmsState: string;
  brickVoltageMax: number;
  brickVoltageMin: number;
  
  lastUpdate: string;
}

interface VehicleDashboardProps {
  vehicleData: VehicleData;
  onViewDetails: () => void;
  onExport: () => void;
}

export function VehicleDashboard({ vehicleData, onViewDetails, onExport }: VehicleDashboardProps) {
  const isCharging = vehicleData.chargeState === 'Charging';
  const isConnected = vehicleData.chargePortDoorOpen || isCharging;
  const chargingPower = vehicleData.dcChargingPower > 0 ? vehicleData.dcChargingPower : vehicleData.acChargingPower;
  
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthColor = (health: number) => {
    if (health > 85) return 'text-green-600';
    if (health > 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChargeStateColor = (state: string) => {
    switch (state) {
      case 'Charging': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Stopped': return 'bg-yellow-100 text-yellow-800';
      case 'Disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPower = (watts: number) => {
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
    return `${watts} W`;
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="p-4 space-y-4 pb-20">
        {/* Vehicle Header Card */}
        <Card className={`border-l-4 ${isCharging ? 'border-l-blue-500' : 'border-l-primary'}`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{vehicleData.year} {vehicleData.make} {vehicleData.model}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {vehicleData.registration} • {vehicleData.location.name}
                </CardDescription>
                <CardDescription className="text-xs mt-1">
                  Last update: {vehicleData.lastUpdate} • BMS: {vehicleData.bmsState}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Connected
                </Badge>
                <Badge className={getChargeStateColor(vehicleData.chargeState)}>
                  {vehicleData.chargeState}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              VIN: <span className="font-mono">{vehicleData.vin}</span>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Battery Status */}
        <Card className={`${isCharging ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`flex items-center ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>
              <Battery className="w-6 h-6 mr-2" />
              Battery Status
              {vehicleData.batteryHeaterOn && (
                <Thermometer className="w-4 h-4 ml-2 text-orange-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Large Battery Level Display */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${isCharging ? 'text-blue-900' : 'text-green-900'} mb-2`}>
                {vehicleData.batteryLevel}%
              </div>
              <Progress value={vehicleData.batteryLevel} className="h-4 mb-3" />
              <div className={`text-sm ${isCharging ? 'text-blue-700' : 'text-green-700'} space-y-1`}>
                <div>{vehicleData.estBatteryRange} km estimated range</div>
                <div>{vehicleData.energyRemaining} kWh remaining energy</div>
              </div>
            </div>
            
            {/* Health and Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white/60 rounded-lg border">
                <div className={`text-lg font-bold ${getHealthColor(vehicleData.batteryHealth)}`}>
                  {vehicleData.batteryHealth}%
                </div>
                <div className="text-xs text-muted-foreground">Health</div>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg border">
                <div className={`text-lg font-bold ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>
                  {vehicleData.chargeLimitSoc}%
                </div>
                <div className="text-xs text-muted-foreground">Charge Limit</div>
              </div>
              <div className="text-center p-3 bg-white/60 rounded-lg border">
                <div className={`text-lg font-bold ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>
                  {(vehicleData.brickVoltageMax - vehicleData.brickVoltageMin).toFixed(3)}V
                </div>
                <div className="text-xs text-muted-foreground">Voltage Spread</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charging Session Card (only show when connected or charging) */}
        {(isCharging || isConnected) && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-900">
                <Plug className="w-6 h-6 mr-2" />
                Charging Session
                {isCharging && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCharging && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {formatPower(chargingPower)}
                  </div>
                  <div className="text-sm text-blue-700">
                    {vehicleData.chargeAmps}A @ {vehicleData.chargerVoltage}V
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-900">
                    {(vehicleData.acChargingEnergyIn + vehicleData.dcChargingEnergyIn).toFixed(1)}
                  </div>
                  <div className="text-xs text-blue-700">kWh This Session</div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-900">
                    {vehicleData.chargePortLatch}
                  </div>
                  <div className="text-xs text-blue-700">Port Status</div>
                </div>
              </div>
              
              {vehicleData.batteryHeaterOn && (
                <div className="bg-orange-100 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center text-orange-800">
                    <Thermometer className="w-4 h-4 mr-2" />
                    <span className="text-sm">Battery heater active for optimal charging</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vehicle Context & Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Car className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-semibold text-purple-900">
                {vehicleData.vehicleSpeed}
              </div>
              <div className="text-xs text-purple-700">km/h Speed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-lg font-semibold text-orange-900">
                {vehicleData.odometer.toLocaleString()}
              </div>
              <div className="text-xs text-orange-700">Total km</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onViewDetails} 
            className="w-full h-14 text-base justify-between"
            variant="default"
          >
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Full Diagnostics &amp; Tesla Data</div>
                <div className="text-xs text-primary-foreground/80">
                  BMS, charging, voltage balance &amp; more
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={onExport} 
            variant="outline" 
            className="w-full h-14 text-base justify-between"
          >
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Export Tesla Vehicle Report</div>
                <div className="text-xs text-muted-foreground">
                  Comprehensive battery &amp; system data
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Fast Charger Info */}
        {vehicleData.fastChargerType !== 'Unknown' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Fast Charging
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {vehicleData.fastChargerType}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Vehicle supports {vehicleData.fastChargerType} fast charging. 
                {vehicleData.fastChargerPresent && ' Fast charger detected at current location.'}
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Gauge className="w-5 h-5 mr-2" />
                Tesla Systems
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {vehicleData.bmsState}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Battery Management System operational. Voltage range: {vehicleData.brickVoltageMin}V - {vehicleData.brickVoltageMax}V. 
              Last diagnostic update {vehicleData.lastUpdate}.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}