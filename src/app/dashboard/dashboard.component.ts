import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { AssetsComponent } from '../sidebar/assets/assets.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  email:any='';
  current:number=1;
  username:any='';
  hoverOverSidebar=true;
  sideBarOption=[{
    number:1,
    name:'Customers',
    icon:'bi bi-person'
  },
  {
    number:2,
    name:'Assets',
    icon:'bi bi-boxes'
  },
  {
    number:3,
    name:'Inventory',
    icon:'bi bi-journal-text'
  },
  {
    number:4,
    name:'Preventive Maintainance',
    icon:'bi bi-speedometer2'
  },
  {
    number:5,
     name:'Work Order',
    icon:'bi bi-bookshelf'
  }
  // {
  //   number:6,
  //   name:'People',
  //   icon:'bi bi-people-fill'
  // }
  
];

  constructor(private auth:AuthService,private router:Router,private dashService:DashboardService){
   
  }

  ngOnInit(){
    // this.dashService.componentMethodCalled$.subscribe((data) => {
    //   if (data) { // Ensure there's data to handle
    //     // alert('Method called with data: ' + JSON.stringify(data));
    //     console.log(data)
    //     this.current=data;
    //     this.router.navigate(['/dashboard']);

    //   }
    // });
    this.email=localStorage.getItem('user');
    console.log(localStorage.getItem('role'))
    let storedCurr=localStorage.getItem('currOption');
    if(storedCurr!=null){
    this.current=parseInt(storedCurr,10);
    }
    
    console.log("------------------>",localStorage.getItem('authToken'));
    this.dashService.dashboard(this.email).subscribe((data)=>{
    
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
    let myCurrentOption:string=this.current.toString();
    localStorage.setItem('currOption',myCurrentOption);
   
  }
  find(){
console.log(localStorage.getItem('user'));
  }
  logout(){
    console.log("logging out")
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    // localStorage.removeItem('token');
    // localStorage.removeItem('currOption');
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('companyId');
    //   localStorage.removeItem('user');
    //   localStorage.removeItem('selectedExtraColumsAssets')
    //   localStorage.removeItem("showMandatoryBasicFieldsAssets")
      localStorage.clear()
      localStorage.getItem('uploadProgress');
      localStorage.getItem('uploadInProgress');
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
