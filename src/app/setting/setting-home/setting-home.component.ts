import { Component } from '@angular/core';
import { SettingHomeService } from './setting-home.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-home',
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.css']
})
export class SettingHomeComponent {
  email:any='';
  current:number=1;
  username:any='';
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
constructor(private settingHomeService:SettingHomeService,private auth:AuthService,private router:Router){}

  ngOnInit(){
    
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.settingHomeService.dashboard(this.email).subscribe((data)=>{
      this.username=data.firstName+" "+data.lastName;
    })
    this.settingHomeService.dashboard(this.email).subscribe((data)=>{
    
      this.username=data.firstName+" "+data.lastName;
      console.log("dashboard"+ this.username)
     
      if(this.username==''||this.username==null){
        this.ngOnInit();
      }
      else{
       
        localStorage.setItem('name',this.username);
      
      }
      
    },
    (err)=>{
      console.log("myerr------------>",err.status);
      
      if(err.status=="403"){
        alert("Session expired");
        this.logout();

      }
    })
   
  }
  update(val:number){
    console.log(val);
    this.current=val;
  }
  logout(){
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    localStorage.removeItem('token');
      localStorage.removeItem('user');
    this.router.navigate(['/login']);

   
  }
}
