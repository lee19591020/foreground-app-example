import { Component, NgZone, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  CapacitorForegroundLocationService,
  ForegroundLocation,
  ForegroundLocationConfiguration,
  PermissionResponse,
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

  async ionViewDidEnter() {
    console.log('enter now');
  }

  async init() {
    //request permission here using capacitor
    const config: ForegroundLocationConfiguration = {
      distanceFilter: 20,
      interval: 5000,
      notificationMessage: 'Something is tracking your location',
      notificationTitle: 'I am a tracker',
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
    console.log(response);
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
  }
  async initIOS() {
    await CapacitorForegroundLocationService.initialize();
    const response =
      await CapacitorForegroundLocationService.requestPermission().catch(
        (err: any) => {
          console.log(`Error man ue: ` + err);
          return {
            granted: false,
          } as PermissionResponse;
        }
      );
    console.log(response);
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
}
