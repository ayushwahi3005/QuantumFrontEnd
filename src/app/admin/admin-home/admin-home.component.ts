import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-home',


  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private router:Router) { }
  earn_period = "week";
  public donutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
 
  public donutChartType: ChartType = 'doughnut';
  public donutChartData = {
    labels: ['Subscription','Users'],
    datasets: [
      {
        data: [350,150,500],
        backgroundColor: ['#42A5F5','grey','green'], // optional
      }
    ]
  };
  ngOnInit() {
    console.log(localStorage.getItem("authToken"))
  }
  updateEarnPeriod = (newPeriod:string) => {
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
}
