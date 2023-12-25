import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
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

  constructor(private auth:AuthService,private router:Router){}

  ngOnInit(){
    
    this.email=localStorage.getItem('user');
    console.log(this.email);
    
   
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
