import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionPlanComponent } from "../subscription-plan/subscription-plan.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',


  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private router:Router) { }
  earn_period = "week";
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
}
