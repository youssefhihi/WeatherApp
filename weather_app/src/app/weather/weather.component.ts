import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})

export class WeatherComponent {

  public data: any = {}; 
  public coordinate: { latitude: number, longitude: number } = { latitude: 0, longitude: 0 };
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.getWeather();
  }
  public getGeolocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve({ latitude: lat, longitude: lng });
          },
          (error) => {
            console.error("Error getting user location:", error);
            reject(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject("Geolocation is not supported by this browser.");
      }
    });
  }

  public async getWeather() {
    try {
        this.coordinate = await this.getGeolocation();
        this.httpClient.get(`${environment.API_URL}/weather?lat=${this.coordinate.latitude}&lon=${this.coordinate.longitude}&appid=${environment.API_KEY}`)
          .subscribe({
            next: (data: any) => {
              console.log(data);
              this.data = data;
            }, error: (err) => console.log(err)
          });
      } catch (error) {
        console.error("Failed to get geolocation:", error);
      }
    }
}
