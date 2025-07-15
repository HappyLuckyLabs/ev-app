// Tesla API Service
// This integrates with Tesla's official Fleet API
// Documentation: https://developer.tesla.com/docs/fleet-api

interface TeslaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface TeslaVehicle {
  id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  color: string;
  state: string;
  in_service: boolean;
  id_s: string;
  calendar_enabled: boolean;
  api_version: number;
  backseat_token: string | null;
  backseat_token_updated_at: string | null;
}

interface TeslaVehicleData {
  // Vehicle State
  api_version: number;
  autopark_state_v2: string;
  calendar_supported: boolean;
  car_version: string;
  center_display_state: number;
  df: number;
  dr: number;
  fd_window: number;
  fp_window: number;
  ft: number;
  is_user_present: boolean;
  locked: boolean;
  media_state: any;
  notifications_supported: boolean;
  odometer: number;
  parsed_calendar_supported: boolean;
  pf: number;
  pr: number;
  rd_window: number;
  remote_start: boolean;
  remote_start_enabled: boolean;
  remote_start_supported: boolean;
  rp_window: number;
  rt: number;
  sentry_mode: boolean;
  sentry_mode_available: boolean;
  smart_summon_available: boolean;
  summon_standby_mode_enabled: boolean;
  valet_mode: boolean;
  valet_pin_needed: boolean;
  vehicle_name: string;

  // Charge State
  battery_heater_on: boolean;
  battery_level: number;
  battery_range: number;
  charge_amps: number;
  charge_current_request: number;
  charge_current_request_max: number;
  charge_enable_request: boolean;
  charge_energy_added: number;
  charge_limit_soc: number;
  charge_limit_soc_max: number;
  charge_limit_soc_min: number;
  charge_limit_soc_std: number;
  charge_miles_added_ideal: number;
  charge_miles_added_rated: number;
  charge_port_cold_weather_mode: boolean;
  charge_port_door_open: boolean;
  charge_port_latch: string;
  charge_rate: number;
  charger_actual_current: number;
  charger_phases: number | null;
  charger_pilot_current: number;
  charger_power: number;
  charger_voltage: number;
  charging_state: string;
  conn_charge_cable: string;
  est_battery_range: number;
  fast_charger_brand: string;
  fast_charger_present: boolean;
  fast_charger_type: string;
  ideal_battery_range: number;
  managed_charging_active: boolean;
  managed_charging_start_time: string | null;
  managed_charging_user_canceled: boolean;
  max_range_charge_counter: number;
  minutes_to_full_charge: number;
  not_enough_power_to_heat: boolean | null;
  off_peak_charging_enabled: boolean;
  off_peak_charging_times: string;
  off_peak_hours_end_time: number;
  preconditioning_enabled: boolean;
  preconditioning_times: string;
  scheduled_charging_pending: boolean;
  scheduled_charging_start_time: string | null;
  scheduled_departure_time: number;
  supercharger_session_trip_planner: boolean;
  time_to_full_charge: number;
  trip_charging: boolean;
  usable_battery_level: number;
  user_charge_enable_request: boolean | null;

  // Climate State
  battery_heater: boolean;
  battery_heater_no_power: boolean | null;
  cabin_overheat_protection: string;
  cabin_overheat_protection_actively_cooling: boolean;
  climate_keeper_mode: string;
  defrost_mode: number;
  driver_temp_setting: number;
  fan_status: number;
  hvac_auto_request: string;
  inside_temp: number;
  is_auto_conditioning_on: boolean;
  is_climate_on: boolean;
  is_front_defroster_on: boolean;
  is_preconditioning: boolean;
  is_rear_defroster_on: boolean;
  left_temp_direction: number;
  max_avail_temp: number;
  min_avail_temp: number;
  outside_temp: number;
  passenger_temp_setting: number;
  remote_heater_control_enabled: boolean;
  right_temp_direction: number;
  seat_heater_left: number;
  seat_heater_rear_center: number;
  seat_heater_rear_left: number;
  seat_heater_rear_right: number;
  seat_heater_right: number;
  side_mirror_heaters: boolean;
  steering_wheel_heater: boolean;
  supports_fan_only_cabin_overheat_protection: boolean;
  wiper_blade_heater: boolean;

  // Drive State
  gps_as_of: number;
  heading: number;
  latitude: number;
  longitude: number;
  native_latitude: number;
  native_longitude: number;
  native_location_supported: number;
  native_type: string;
  power: number;
  shift_state: string | null;
  speed: number | null;
  

  // Vehicle Config
  aux_park_lamps: string;
  badge_version: number;
  can_accept_navigation_requests: boolean;
  can_actuate_trunks: boolean;
  car_special_type: string;
  car_type: string;
  charge_port_type: string;
  dashcam_clip_save_supported: boolean;
  default_charge_to_max: boolean;
  driver_assist: string;
  ece_restrictions: boolean;
  efficiency_package: string;
  eu_vehicle: boolean;
  exterior_color: string;
  exterior_trim: string;
  exterior_trim_override: string;
  has_air_suspension: boolean;
  has_ludicrous_mode: boolean;
  has_seat_cooling: boolean;
  headlamp_type: string;
  interior_trim_type: string;
  key_version: number;
  motorized_charge_port: boolean;
  paint_color_override: string;
  performance_package: string;
  plg: boolean;
  pws: boolean;
  rear_drive_unit: string;
  rear_seat_heaters: number;
  rear_seat_type: number;
  rhd: boolean;
  roof_color: string;
  seat_type: number | null;
  spoiler_type: string;
  sun_roof_installed: number | null;
  third_row_seats: string;
  trim_badging: string;
  use_range_badging: boolean;
  utc_offset_seconds: number;
  webcam_selfie_supported: boolean;
  webcam_supported: boolean;
  wheel_type: string;
}

// Configuration interface
interface TeslaConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
  authUrl: string;
}

// Safe environment variable access
function getEnvVar(key: string, defaultValue: string): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, check for global config or use defaults
    const globalConfig = (window as any).__TESLA_CONFIG__;
    if (globalConfig && globalConfig[key]) {
      return globalConfig[key];
    }
    return defaultValue;
  }
  
  // In Node.js environment (if this ever runs server-side)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
}

class TeslaApiService {
  private baseUrl: string;
  private authUrl: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config?: Partial<TeslaConfig>) {
    // Use provided config or fall back to environment variables with defaults
    this.clientId = config?.clientId || getEnvVar('TESLA_CLIENT_ID', 'YOUR_TESLA_CLIENT_ID');
    this.clientSecret = config?.clientSecret || getEnvVar('TESLA_CLIENT_SECRET', 'YOUR_TESLA_CLIENT_SECRET');
    this.redirectUri = config?.redirectUri || getEnvVar('TESLA_REDIRECT_URI', `${typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'}/callback`);
    this.baseUrl = config?.baseUrl || getEnvVar('TESLA_API_BASE_URL', 'https://fleet-api.prd.na.vn.cloud.tesla.com');
    this.authUrl = config?.authUrl || getEnvVar('TESLA_AUTH_URL', 'https://auth.tesla.com');
    
    // Load tokens from localStorage if available
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('tesla_access_token');
      this.refreshToken = localStorage.getItem('tesla_refresh_token');
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tesla_access_token', accessToken);
      localStorage.setItem('tesla_refresh_token', refreshToken);
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tesla_access_token');
      localStorage.removeItem('tesla_refresh_token');
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Check if configuration is valid
  isConfigured(): boolean {
    return this.clientId !== 'YOUR_TESLA_CLIENT_ID' && 
           this.clientSecret !== 'YOUR_TESLA_CLIENT_SECRET';
  }

  // Generate Tesla OAuth URL
  generateAuthUrl(): string {
    if (!this.isConfigured()) {
      throw new Error('Tesla API is not properly configured. Please set up your client credentials.');
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      locale: 'en-US',
      prompt: 'login',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email offline_access vehicle_device_data vehicle_charging_cmds vehicle_cmds',
      state: Math.random().toString(36).substring(7)
    });

    return `${this.authUrl}/oauth2/v3/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Tesla API not configured, cannot exchange code for token');
      return false;
    }

    try {
      const response = await fetch(`${this.authUrl}/oauth2/v3/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: TeslaAuthResponse = await response.json();
      this.saveTokensToStorage(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      console.error('Token exchange failed:', error);
      return false;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken || !this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(`${this.authUrl}/oauth2/v3/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        this.clearTokensFromStorage();
        return false;
      }

      const data: TeslaAuthResponse = await response.json();
      this.saveTokensToStorage(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokensFromStorage();
      return false;
    }
  }

  // Make authenticated API request
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    if (!this.isConfigured()) {
      throw new Error('Tesla API not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        return this.makeAuthenticatedRequest(endpoint, options);
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken && this.isConfigured();
  }

  // Get user's vehicles
  async getVehicles(): Promise<TeslaVehicle[]> {
    try {
      const response = await this.makeAuthenticatedRequest('/api/1/vehicles');
      return response.response || [];
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      throw error;
    }
  }

  // Get specific vehicle data
  async getVehicleData(vehicleId: string): Promise<TeslaVehicleData> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/vehicle_data`);
      return response.response;
    } catch (error) {
      console.error('Failed to fetch vehicle data:', error);
      throw error;
    }
  }

  // Wake up vehicle (required for some API calls)
  async wakeUpVehicle(vehicleId: string): Promise<boolean> {
    try {
      await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/wake_up`, {
        method: 'POST',
      });
      return true;
    } catch (error) {
      console.error('Failed to wake up vehicle:', error);
      return false;
    }
  }

  // Get charge state
  async getChargeState(vehicleId: string): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/data_request/charge_state`);
      return response.response;
    } catch (error) {
      console.error('Failed to fetch charge state:', error);
      throw error;
    }
  }

  // Get climate state
  async getClimateState(vehicleId: string): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/data_request/climate_state`);
      return response.response;
    } catch (error) {
      console.error('Failed to fetch climate state:', error);
      throw error;
    }
  }

  // Get drive state
  async getDriveState(vehicleId: string): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/data_request/drive_state`);
      return response.response;
    } catch (error) {
      console.error('Failed to fetch drive state:', error);
      throw error;
    }
  }

  // Get vehicle state
  async getVehicleState(vehicleId: string): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/1/vehicles/${vehicleId}/data_request/vehicle_state`);
      return response.response;
    } catch (error) {
      console.error('Failed to fetch vehicle state:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    this.clearTokensFromStorage();
  }
}

// Export singleton instance
export const teslaApi = new TeslaApiService();
export type { TeslaVehicle, TeslaVehicleData, TeslaConfig };