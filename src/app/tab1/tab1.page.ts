import { Component, NgZone, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BatteryOptimization } from '@capawesome-team/capacitor-android-battery-optimization';
import { Platform } from '@ionic/angular';
import {
  CapacitorForegroundLocationService,
  ForegroundLocation,
  ForegroundLocationConfiguration,
  PermissionResponse,
  NotificationImportance,
  SetApiOptions,
  Endpoint,
  GeofenceData,
  Geofence,
  UserData,
  LogsEndpoint,
} from 'capacitor-foreground-location-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  lat = 0;
  lng = 0;
  message = 'updating location..';
  isBatterOptimizerExcepted = true;
  constructor(private ngZone: NgZone, private flatform: Platform) {}
  ngOnInit(): void {
    console.log(this.flatform.is('android'));
    if (this.flatform.is('android')) {
      this.init();
    }
    if (this.flatform.is('ios')) {
      this.initIOS();
    }
  }

  async stopLocationUpdate() {
    if (this.flatform.is('android')) {
      CapacitorForegroundLocationService.stopService();
    }
    if (this.flatform.is('ios')) {
      CapacitorForegroundLocationService.stopUpdatingLocation();
    }
  }

  async startLocationUpdate(){
    if (this.flatform.is('android')) {
      CapacitorForegroundLocationService.startService();
    }
  }

  async init() {

    const endPoint: Endpoint = {
      endPoint: 'https://leading-terribly-tortoise.ngrok-free.app/api/recorded'
    }


    const geofence: Geofence[] = [
      {
        clockDescription: 'Geofence 1',
        clockNumber: 1,
        lat: 10.062958175504694,
        lng: 124.98625442924767,
        locationCode: 'Clock 1',
        locationDescription: 'VIC',
        radius: 300
      },
      {
        clockDescription: 'Geofence 2',
        clockNumber: 2,
        lat: 10.097838860165792, 
        lng: 124.94873423458931,
        locationCode: 'Clock 2',
        locationDescription: 'MEL',
        radius: 300
      }
    ]

    const geofenceData: GeofenceData = {
      geofenceData: geofence
    }

    const usr: UserData = {
      _token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODM5MzUwMzM0ZGQzYTY3YzFlYzM1MmEiLCJ1c2VybmFtZSI6ImplbnNsZWUiLCJpYXQiOjE3NDg3NjM1MDcsImV4cCI6MTc0ODc4MTUwN30.XEChD0emM2tX3CnRXi4M1llCJjD3cWcm6kD9bDiwZPU',
      userId: 50547,
      username: '50547'
    }

    const logsEndpoint: LogsEndpoint = {
      logsEndpoint: 'https://leading-terribly-tortoise.ngrok-free.app/api/add-logs'
    }

    const apiOptions: SetApiOptions = {
      endpoint: endPoint,
      geofenceData: geofenceData,
      userData: usr,
      logsEndpoint: logsEndpoint
    }

    const resultValue = await CapacitorForegroundLocationService.setApiOptions(apiOptions);
    const config: ForegroundLocationConfiguration = {
      distanceFilter: 20,
      interval: 5000,
      notificationMessage: 'Something is tracking your location',
      notificationTitle: 'I am a tracker',
      notificationImportance: NotificationImportance.DEFAULT,
      notificationChannelId: 627,
    };
    await CapacitorForegroundLocationService.config(config);
    const response =
      await CapacitorForegroundLocationService.requestPermission().catch(
        (err: any) => {
          console.log(`Error man ue: ` + err);
          return {
            granted: false,
          } as PermissionResponse;
        }
      );
    if (response.granted) {
      CapacitorForegroundLocationService.startService();
      CapacitorForegroundLocationService.addListener(
        'locationUpdate',
        (location: ForegroundLocation) => {
          console.log('[JS] Lat:', location.lat, 'Lng:', location.lng);
          this.ngZone.run(() => {
            this.lat = location.lat;
            this.lng = location.lng;
            this.message = `Location updated: ${new Date().getTime()}`;
          });
        }
      );
    }

    this.isBatterOptimizerExcepted = await isBatteryOptimizationEnabled();
    console.log(this.isBatterOptimizerExcepted);
  }
  async initIOS() {
    await CapacitorForegroundLocationService.initialize({
      accuracy: 'high', // or "low"
      distanceFilter: 10, // meters
      updateInterval: 30, // seconds (throttle update frequency)
      batteryMode: 'lowPower', // "default", "fitness", "navigation", "lowPower"
    });
    const response =
      await CapacitorForegroundLocationService.requestPermission().catch(
        (err: any) => {
          console.log(`Error man ue: ` + err);
          return {
            granted: false,
          } as PermissionResponse;
        }
      );

    if (response.granted) {
      CapacitorForegroundLocationService.startUpdatingLocation();
      CapacitorForegroundLocationService.addListener(
        'locationUpdate',
        (location: ForegroundLocation) => {
          console.log('[JS] Lat:', location.lat, 'Lng:', location.lng);
          this.ngZone.run(() => {
            this.lat = location.lat;
            this.lng = location.lng;
            this.message = `Location updated: ${new Date().getTime()}`;
          });
        }
      );
    }
  }
  async requestBatteryOptimizationDisabled(){
    await requestIgnoreBatteryOptimization();
  }
  async checkOptimizer(){
    await openBatteryOptimizationSettings();
  }
  
}

const isBatteryOptimizationEnabled = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return false;
  }
  const { enabled } = await BatteryOptimization.isBatteryOptimizationEnabled();
  return enabled;
};

const openBatteryOptimizationSettings = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }
  await BatteryOptimization.openBatteryOptimizationSettings();
};

const requestIgnoreBatteryOptimization = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }
  await BatteryOptimization.requestIgnoreBatteryOptimization();
};