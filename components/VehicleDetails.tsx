import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ArrowLeft, Battery, Thermometer, Zap, Settings, AlertTriangle, CheckCircle, Gauge, Plug, Car, MapPin } from 'lucide-react';

interface DetailedVehicleData {
  // Essential Battery & Charging Metrics
  batteryLevel: number;
  estBatteryRange: number;
  energyRemaining: number;
  batteryHealth: number;
  batteryTemperature: number;
  
  // Charging session details
  chargeState: string;
  detailedChargeState: string;
  chargingStatus: string;
  chargeAmps: number;
  chargerVoltage: number;
  dcChargingPower: number;
  acChargingPower: number;
  chargingPower: number;
  chargeLimitSoc: number;
  batteryHeaterOn: boolean;
  acChargingEnergyIn: number;
  dcChargingEnergyIn: number;
  
  // BMS and battery insights
  bmsState: string;
  brickVoltageMax: number;
  brickVoltageMin: number;
  voltageSpread: number;
  
  // Charge port and fast charging
  chargePortDoorOpen: boolean;
  chargePortLatch: string;
  chargePortColdWeatherMode: boolean;
  fastChargerPresent: boolean;
  fastChargerType: string;
  
  // Vehicle context
  vehicleSpeed: number;
  odometer: number;
  location: { lat: number; lng: number; name: string };
  doorStates: {
    driverFront: boolean;
    passengerFront: boolean;
    driverRear: boolean;
    passengerRear: boolean;
    frunk: boolean;
    trunk: boolean;
  };
  
  // Performance metrics
  range: number;
  efficiency: number;
  
  // Tire pressure
  tirePressure: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  
  // Enhanced system checks
  systemChecks: {
    name: string;
    status: 'good' | 'warning' | 'error';
    value?: string;
  }[];
  
  lastService: string;
  nextServiceDue: number;
}

interface VehicleDetailsProps {
  vehicleData: DetailedVehicleData;
  onBack: () => void;
}

export function VehicleDetails({ vehicleData, onBack }: VehicleDetailsProps) {
  const isCharging = vehicleData.chargeState === 'Charging';
  const chargingPower = vehicleData.dcChargingPower > 0 ? vehicleData.dcChargingPower : vehicleData.acChargingPower;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Good</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">Error</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const formatPower = (watts: number) => {
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
    return `${watts} W`;
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

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Mobile Header */}
      <div className="flex-none bg-background border-b px-4 py-3 safe-top">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Tesla Vehicle Diagnostics</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4 pb-6">
          {/* Enhanced Battery System */}
          <Card className={`${isCharging ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>
                <Battery className="w-6 h-6 mr-2" />
                Battery System
                {vehicleData.batteryHeaterOn && (
                  <Thermometer className="w-4 h-4 ml-2 text-orange-500" />
                )}
              </CardTitle>
              <CardDescription>State of Charge: {vehicleData.batteryLevel}% • Energy: {vehicleData.energyRemaining} kWh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Battery Display */}
              <div className="text-center">
                <div className={`text-3xl font-bold ${isCharging ? 'text-blue-900' : 'text-green-900'} mb-2`}>
                  {vehicleData.batteryLevel}%
                </div>
                <Progress value={vehicleData.batteryLevel} className="h-3 mb-3" />
                <div className={`text-sm ${isCharging ? 'text-blue-700' : 'text-green-700'}`}>
                  Health: <span className="font-semibold">{vehicleData.batteryHealth}%</span> • 
                  Range: <span className="font-semibold">{vehicleData.estBatteryRange} km</span>
                </div>
              </div>

              {/* Battery Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <Thermometer className={`w-5 h-5 mx-auto mb-1 ${isCharging ? 'text-blue-600' : 'text-green-600'}`} />
                  <div className={`text-lg font-semibold ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>{vehicleData.batteryTemperature}°C</div>
                  <div className={`text-xs ${isCharging ? 'text-blue-700' : 'text-green-700'}`}>Temperature</div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <Gauge className={`w-5 h-5 mx-auto mb-1 ${isCharging ? 'text-blue-600' : 'text-green-600'}`} />
                  <div className={`text-lg font-semibold ${isCharging ? 'text-blue-900' : 'text-green-900'}`}>{vehicleData.chargeLimitSoc}%</div>
                  <div className={`text-xs ${isCharging ? 'text-blue-700' : 'text-green-700'}`}>Charge Limit</div>
                </div>
              </div>

              {/* BMS Status */}
              <div className="bg-white/60 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${isCharging ? 'text-blue-800' : 'text-green-800'}`}>Battery Management System</span>
                  <Badge className={getChargeStateColor(vehicleData.bmsState)}>{vehicleData.bmsState}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Max Voltage:</span>
                    <span className="font-medium ml-1">{vehicleData.brickVoltageMax}V</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Voltage:</span>
                    <span className="font-medium ml-1">{vehicleData.brickVoltageMin}V</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Voltage Spread:</span>
                    <span className="font-medium ml-1">{vehicleData.voltageSpread.toFixed(3)}V</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charging Details */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-900">
                <Plug className="w-6 h-6 mr-2" />
                Charging System
                {isCharging && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-900">
                    {isCharging ? formatPower(chargingPower) : '0 kW'}
                  </div>
                  <div className="text-xs text-blue-700">Current Power</div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <Badge className={getChargeStateColor(vehicleData.chargeState)}>
                    {vehicleData.chargeState}
                  </Badge>
                  <div className="text-xs text-blue-700 mt-1">Status</div>
                </div>
              </div>

              {isCharging && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-900">{vehicleData.chargeAmps}A</div>
                    <div className="text-xs text-blue-700">Charging Current</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-900">{vehicleData.chargerVoltage}V</div>
                    <div className="text-xs text-blue-700">Charger Voltage</div>
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
                  <div className="text-lg font-bold text-blue-900">{vehicleData.chargePortLatch}</div>
                  <div className="text-xs text-blue-700">Port Latch</div>
                </div>
              </div>

              {/* Charge Port Details */}
              <div className="bg-white/60 p-3 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Port Door:</span>
                    <span className="font-medium text-blue-900">{vehicleData.chargePortDoorOpen ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Cold Weather Mode:</span>
                    <span className="font-medium text-blue-900">{vehicleData.chargePortColdWeatherMode ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Fast Charger:</span>
                    <span className="font-medium text-blue-900">{vehicleData.fastChargerType}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Status & Location */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-900">
                <Car className="w-6 h-6 mr-2" />
                Vehicle Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-900">{vehicleData.vehicleSpeed}</div>
                  <div className="text-xs text-purple-700">km/h Speed</div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-900">{vehicleData.odometer.toLocaleString()}</div>
                  <div className="text-xs text-purple-700">Total km</div>
                </div>
              </div>

              <div className="bg-white/60 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Location</span>
                </div>
                <div className="text-sm text-purple-900">{vehicleData.location.name}</div>
                <div className="text-xs text-purple-700 mt-1">
                  {vehicleData.location.lat.toFixed(4)}, {vehicleData.location.lng.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-900">
                <Gauge className="w-6 h-6 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-900">{vehicleData.range}</div>
                  <div className="text-xs text-orange-700">km Range</div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-900">{vehicleData.efficiency}</div>
                  <div className="text-xs text-orange-700">kWh/100km</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tire Pressure */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tire Pressure</CardTitle>
              <CardDescription>All pressures in PSI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Front Tires */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Front</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <div className="text-lg font-bold">{vehicleData.tirePressure.frontLeft}</div>
                      <div className="text-xs text-muted-foreground">Left</div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <div className="text-lg font-bold">{vehicleData.tirePressure.frontRight}</div>
                      <div className="text-xs text-muted-foreground">Right</div>
                    </div>
                  </div>
                </div>
                
                {/* Rear Tires */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Rear</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <div className="text-lg font-bold">{vehicleData.tirePressure.rearLeft}</div>
                      <div className="text-xs text-muted-foreground">Left</div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <div className="text-lg font-bold">{vehicleData.tirePressure.rearRight}</div>
                      <div className="text-xs text-muted-foreground">Right</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tesla System Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tesla System Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vehicleData.systemChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center flex-1 min-w-0">
                      {getStatusIcon(check.status)}
                      <div className="ml-2 flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{check.name}</div>
                        {check.value && (
                          <div className="text-xs text-muted-foreground truncate">{check.value}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-none ml-2">
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Service</span>
                  <span className="font-semibold">{vehicleData.lastService}</span>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Service Due</span>
                  <span className="font-semibold">{vehicleData.nextServiceDue.toLocaleString()} km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}