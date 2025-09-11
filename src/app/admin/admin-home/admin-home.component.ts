import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { AdminHomeService } from './admin-home.service';

@Component({
  selector: 'app-admin-home',


  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private router:Router,private adminHomeService:AdminHomeService) { }
  earn_period = "WEEKLY";
  dark_theme= false;
  public donutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
 
  public donutChartType: ChartType = 'doughnut';
  public donutChartData = {
    labels: ['Subscription','Users'],
    datasets: [
      {
        data: [1,100],
        backgroundColor: ['#42A5F5','grey','green'], // optional
      }
    ]
  };
  ngOnInit() {
    console.log(localStorage.getItem("authToken"))
      this.dark_theme= false;
     this.updateEarnPeriod('WEEKLY');
  }
  updateEarnPeriod = (newPeriod:string) => {
    console.log("New Period:", newPeriod);
     this.adminHomeService.getAdminHomeData('2025-01-01', '2025-12-30', newPeriod).subscribe(
        (response) => {
          console.log("Admin Home Data:", response);

          if (Array.isArray(response) && response.length > 0) {
        const dataObj = response[0];
        // Example: using activeSubscriptions and newSubscriptions for chart
        const newData = [
          dataObj.revenue ?? 0,
          100
        ];
         this.donutChartData = {
          ...this.donutChartData,
          datasets: [
            {
              ...this.donutChartData.datasets[0],
              data: newData
            }
          ]
        };
      }
     
          // Process the response data as needed
        },
        (error) => {
          console.error("Error fetching admin home data:", error);
        });
    this.earn_period = newPeriod;
  };

  logout(){
    localStorage.clear();
    this.router.navigate(['/admin'])
  }
  
  



  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  onThemeSwitch(data:any){
    console.log("theme switch", data.checked)
    this.dark_theme = data.checked;
    // if(data.checked){
    //   document.documentElement.setAttribute('data-theme', 'dark');
    // } else {
    //   document.documentElement.setAttribute('data-theme', 'light');
    // }

  }
}
