import { Component, NgZone, OnInit } from '@angular/core';
import { CapacitorForegroundLocationService, ForegroundLocation } from 'capacitor-foreground-location-service'


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  lat = 0;
  lng = 0;
  message = "updating location..";
  constructor(
    private ngZone: NgZone
  ) {
    
  }
  ngOnInit(): void {
    this.init();
  }

  async init(){
    CapacitorForegroundLocationService.startService()
      .then(() => console.log('Service started'))
      .catch((err: any) => console.error('Failed to start service:', err));

    CapacitorForegroundLocationService.addListener('locationUpdate', (location: ForegroundLocation) => {
      console.log('[JS] Lat:', location.lat, 'Lng:', location.lng);
      this.ngZone.run(() => {
        this.lat = location.lat;
        this.lng = location.lng;
        this.message = `Location updated: ${new Date()}`;
      });
    });

  }

}
