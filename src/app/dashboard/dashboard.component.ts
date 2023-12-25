import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { AssetsComponent } from '../sidebar/assets/assets.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  email:any='';
  current:number=1;
  username:any='';
  hoverOverSidebar=true;
  sideBarOption=[{
    number:1,
    name:'Work Order',
    icon:'bi bi-bookshelf'
  },
  {
    number:2,
    name:'Preventive Maintainance',
    icon:'bi bi-speedometer2'
  },
  {
    number:3,
    name:'Assets',
    icon:'bi bi-boxes'
  },
  {
    number:4,
    name:'Inventory',
    icon:'bi bi-journal-text'
  },
  {
    number:5,
    name:'Customers and Vendors',
    icon:'bi bi-person'
  },
  {
    number:6,
    name:'People',
    icon:'bi bi-people-fill'
  }
  
];

  constructor(private auth:AuthService,private router:Router,private dashService:DashboardService){}

  ngOnInit(){
    
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.dashService.dashboard(this.email).subscribe((data)=>{
      this.username=data.firstName+" "+data.lastName;
      console.log(this.username)
    })
   
  }
  update(val:number){
    console.log(val);
    this.current=val;
   
  }
  find(){
console.log(localStorage.getItem('user'));
  }
  logout(){
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    localStorage.removeItem('token');
      localStorage.removeItem('user');
    this.router.navigate(['/login']);

   
  }
  onHover(){
    this.hoverOverSidebar=false;
    
    // console.log(this.hoverOverSidebar);
  }
  offHover(){
    this.hoverOverSidebar=true;

    // console.log(this.hoverOverSidebar);
  }



}
