import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { AdminHomeService } from './admin-home.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
export interface PeriodicElement {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  mobileNumber: number;
  status: string;
  role: string;
}
@Component({
  selector: 'app-admin-home',


  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})

export class AdminHomeComponent {

  constructor(private router:Router,private adminHomeService:AdminHomeService) { }
   showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  
  selectedTab=1;
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
      // this.adminHomeService.getAllCustomers().subscribe((data)=>{
      //   this.allCustomers=data;
      //   this.dataSource=new MatTableDataSource<PeriodicElement>(this.allCustomers)
      //   console.log("All Customers:",this.allCustomers);    
      // },
      // (error)=>{
      //   console.error("Error fetching customers:", error);
      // });
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
  updateTab(tab:number){
    this.selectedTab=tab;
  }
  // resendEmailVerificationLink(email:any,companyId:any){
  //   this.adminHomeService.resendFirebaseVerificationEmail(companyId,email).subscribe((data)=>{
  //     console.log(data);
  //     this.triggerAlert(data.message,data.status);
  //   },
  //   (err)=>{
  //     console.log(err);
  //     this.triggerAlert(err.error.errorMessage,"danger");
  //   })
  // }
    triggerAlert(message: string, type: string) {
    console.log("triiger")
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  receiveMessage($event: string[]) {
    // console.log("received in admin home")
    this.triggerAlert($event[0],$event[1]);
  }
}
