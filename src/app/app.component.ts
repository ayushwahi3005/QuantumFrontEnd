import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AssetYug';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.startTokenMonitoring();
  }

  ngOnDestroy(): void {
    this.authService.stopTokenMonitoring();
  }
}
