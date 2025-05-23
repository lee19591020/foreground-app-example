import { Component, NgZone, OnInit } from '@angular/core';
import {
  CapacitorForegroundLocationService,
  ForegroundLocation,
  PermissionResponse
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
  constructor(private ngZone: NgZone) {}
  ngOnInit(): void {
    this.init();
  }

  async init() {
    //request permission here using capacitor
    console.log("NABUANG NAH!");
    const response = await CapacitorForegroundLocationService.requestPermission()
      .catch((err: any) => {
        console.log(`Error man ue: ` + err);
        return {
          granted: false
        } as PermissionResponse;
      });
      console.log(response);
    if(response.granted){
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
}
