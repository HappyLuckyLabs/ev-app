import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Download, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportData {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    vin: string;
    registration: string;
  };
  batteryData: {
    health: number;
    level: number;
    range: number;
    energyRemaining: number;
    chargeLimitSoc: number;
    bmsState: string;
    voltageMax: number;
    voltageMin: number;
  };
  chargingData: {
    chargeState: string;
    chargePortStatus: string;
    fastChargerType: string;
    batteryHeater: string;
  };
  metrics: {
    odometer: number;
    efficiency: number;
    location: string;
    lastUpdate: string;
  };
  exportDate: string;
}

interface ExportViewProps {
  exportData: ExportData;
  onBack: () => void;
}

export function ExportView({ exportData, onBack }: ExportViewProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = async () => {
    const shareableText = `
Tesla Vehicle Report - ${exportData.vehicleInfo.year} ${exportData.vehicleInfo.make} ${exportData.vehicleInfo.model}

VEHICLE INFORMATION
Registration: ${exportData.vehicleInfo.registration}
VIN: ${exportData.vehicleInfo.vin}
Location: ${exportData.metrics.location}

BATTERY STATUS & HEALTH
Battery Level: ${exportData.batteryData.level}% (SoC)
Energy Remaining: ${exportData.batteryData.energyRemaining} kWh
Estimated Range: ${exportData.batteryData.range} km
Battery Health: ${exportData.batteryData.health}%
Charge Limit: ${exportData.batteryData.chargeLimitSoc}%

BATTERY MANAGEMENT SYSTEM
BMS State: ${exportData.batteryData.bmsState}
Max Cell Voltage: ${exportData.batteryData.voltageMax}V
Min Cell Voltage: ${exportData.batteryData.voltageMin}V
Voltage Spread: ${(exportData.batteryData.voltageMax - exportData.batteryData.voltageMin).toFixed(3)}V

CHARGING SYSTEM
Charge State: ${exportData.chargingData.chargeState}
Charge Port: ${exportData.chargingData.chargePortStatus}
Fast Charger Support: ${exportData.chargingData.fastChargerType}
Battery Heater: ${exportData.chargingData.batteryHeater}

VEHICLE METRICS
Total Distance: ${exportData.metrics.odometer.toLocaleString()} km
Energy Efficiency: ${exportData.metrics.efficiency} kWh/100km
Last Update: ${exportData.metrics.lastUpdate}

Report generated: ${exportData.exportDate}
Generated by EV Connect - Tesla Vehicle Diagnostics
    `.trim();

    try {
      await navigator.clipboard.writeText(shareableText);
      setCopied(true);
      toast.success('Tesla vehicle data copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${exportData.vehicleInfo.year} ${exportData.vehicleInfo.make} ${exportData.vehicleInfo.model} - Tesla Vehicle Report`,
      text: `Tesla vehicle diagnostics report for ${exportData.vehicleInfo.registration} - Battery: ${exportData.batteryData.level}% • Health: ${exportData.batteryData.health}%`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    const content = exportRef.current?.innerHTML || '';
    const blob = new Blob([`
      <html>
        <head>
          <title>Tesla Vehicle Report - ${exportData.vehicleInfo.registration}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px 0; }
            .badge { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
            .tesla-blue { color: #1976d2; }
            .tesla-green { color: #4caf50; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportData.vehicleInfo.registration}-tesla-report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Tesla report downloaded successfully');
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <div className="flex-none bg-background border-b px-4 py-3 safe-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-3 p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Export Tesla Data</h1>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tesla Report</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Export Actions */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Button onClick={handleCopyLink} variant="outline" size="sm" className="flex-col h-16">
              {copied ? <Check className="w-4 h-4 mb-1" /> : <Copy className="w-4 h-4 mb-1" />}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm" className="flex-col h-16">
              <Share2 className="w-4 h-4 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm" className="flex-col h-16">
              <Download className="w-4 h-4 mb-1" />
              <span className="text-xs">Download</span>
            </Button>
          </div>

          {/* Exportable Content */}
          <div ref={exportRef} className="space-y-4">
            {/* Header Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-900">Tesla Vehicle Report</CardTitle>
                <p className="text-sm text-blue-700">Comprehensive Battery &amp; System Diagnostics</p>
                <p className="text-xs text-blue-600">Generated on {exportData.exportDate}</p>
              </CardHeader>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Make & Model</span>
                    <span className="font-medium">
                      {exportData.vehicleInfo.year} {exportData.vehicleInfo.make} {exportData.vehicleInfo.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration</span>
                    <span className="font-medium">{exportData.vehicleInfo.registration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VIN</span>
                    <span className="font-mono text-sm">{exportData.vehicleInfo.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{exportData.metrics.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery Status & Health */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Battery Status &amp; Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{exportData.batteryData.level}%</div>
                    <div className="text-xs text-green-700">State of Charge</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{exportData.batteryData.health}%</div>
                    <div className="text-xs text-green-700">Battery Health</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Energy Remaining</span>
                    <span className="font-medium text-green-900">{exportData.batteryData.energyRemaining} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Estimated Range</span>
                    <span className="font-medium text-green-900">{exportData.batteryData.range} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Charge Limit</span>
                    <span className="font-medium text-green-900">{exportData.batteryData.chargeLimitSoc}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery Management System */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Battery Management System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">BMS State</span>
                    <Badge className="bg-blue-100 text-blue-800">{exportData.batteryData.bmsState}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/60 p-3 rounded-lg text-center">
                      <div className="font-bold text-blue-900">{exportData.batteryData.voltageMax}V</div>
                      <div className="text-xs text-blue-700">Max Cell Voltage</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg text-center">
                      <div className="font-bold text-blue-900">{exportData.batteryData.voltageMin}V</div>
                      <div className="text-xs text-blue-700">Min Cell Voltage</div>
                    </div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg text-center">
                    <div className="font-bold text-blue-900">
                      {(exportData.batteryData.voltageMax - exportData.batteryData.voltageMin).toFixed(3)}V
                    </div>
                    <div className="text-xs text-blue-700">Voltage Spread (Balance)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charging System */}
            <Card>
              <CardHeader>
                <CardTitle>Charging System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="font-semibold">{exportData.chargingData.chargeState}</div>
                    <div className="text-xs text-muted-foreground">Charge State</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="font-semibold">{exportData.chargingData.chargePortStatus}</div>
                    <div className="text-xs text-muted-foreground">Charge Port</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="font-semibold">{exportData.chargingData.fastChargerType}</div>
                    <div className="text-xs text-muted-foreground">Fast Charger</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="font-semibold">{exportData.chargingData.batteryHeater}</div>
                    <div className="text-xs text-muted-foreground">Battery Heater</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Distance</span>
                    <span className="font-medium">{exportData.metrics.odometer.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy Efficiency</span>
                    <span className="font-medium">{exportData.metrics.efficiency} kWh/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Data Update</span>
                    <span className="font-medium">{exportData.metrics.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  This report contains comprehensive Tesla vehicle diagnostics including battery health, 
                  charging system status, and performance metrics sourced from Tesla's official API.
                </p>
                <p className="text-xs text-muted-foreground">
                  Generated by EV Connect - Tesla Vehicle Diagnostics App
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}