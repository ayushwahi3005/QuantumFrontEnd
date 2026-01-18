import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-home-page',
  templateUrl: './analytics-home-page.component.html',
  styleUrl: './analytics-home-page.component.css'
})
export class AnalyticsHomePageComponent {
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    console.log("Analytics Home Page Loaded");
  }

}
