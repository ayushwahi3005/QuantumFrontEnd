import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { SettingMainService } from './setting-main.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-setting-main',
  templateUrl: './setting-main.component.html',
  styleUrls: ['./setting-main.component.css']
})
export class SettingMainComponent {
  email:any='';
  current:number=1;
  username:any='';
  companyInformationForm!:FormGroup;
  sideBarOption=[{
    number:1,
    name:'Company Information',
    icon:'bi bi-bookshelf'
  },
  {
    number:2,
    name:'Location',
    icon:'bi bi-geo-alt-fill'
  },
  {
    number:3,
    name:'Custom Fields',
    icon:'bi bi-boxes'
  },
  {
    number:4,
    name:'Import',
    icon:'bi bi-journal-text'
  },
  {
    number:5,
    name:'Role and Role Rights',
    icon:'bi bi-person'
  },
  {
    number:6,
    name:'Employees/Users',
    icon:'bi bi-people-fill'
  },
  {
    number:7,
    name:'Labor Rates',
    icon:'bi bi-currency-dollar'
  },
  {
    number:8,
    name:'Subscription',
    icon:'bi bi-clipboard-check'
  }
  
];
constructor(private settingMainService:SettingMainService,private auth:AuthService,private router:Router,private formBuilder:FormBuilder){}

  ngOnInit(){
    
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.settingMainService.dashboard(this.email).subscribe((data)=>{
      this.username=data.firstName+" "+data.lastName;
    })
   this.companyInformationForm=this.formBuilder.group(({

   }))
  }
  update(val:number){
    console.log(val);
    this.current=val;
    if(val==3){
      this.router.navigate(['/custom-setting'])
    }
  }
  logout(){
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    localStorage.removeItem('token');
      localStorage.removeItem('user');
    this.router.navigate(['/login']);

   
  }
  addCompanyInformation(){
    
  }
}
