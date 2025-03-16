import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { SettingMainService } from './setting-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Lottie from 'lottie-web';
import { CompanyInformation } from './companyInformation';

@Component({
  selector: 'app-setting-main',
  templateUrl: './setting-main.component.html',
  styleUrls: ['./setting-main.component.css']
})
export class SettingMainComponent {
  @ViewChild('lottieAnimation') lottieAnimationContainer!: ElementRef;
  email:any='';
  current:number=1;
  username:any='';
  companyInformationForm!:FormGroup;
  companyImage:any;
  companyInformation!:CompanyInformation;
  companyId!:any;
  sideBarOption=[{
    number:1,
    name:'Company Information',
    icon:'bi bi-bookshelf'
  },
  {
    number:2,
    name:'Locations and Bins',
    icon:'bi bi-geo-alt-fill'
  },
  {
    number:3,
    name:'Custom Fields',
    icon:'bi bi-boxes'
  },
  {
    number:4,
    name:'Categories',
    icon:'bi bi-boxes'
  },
  {
    number:5,
    name:'Import',
    icon:'bi bi-journal-text'
  },
  {
    number:11,
    name:'Import History',
    icon:'bi bi-clock-history'
  },
  {
    number:6,
    name:'Roles and Permissions',
    icon:'bi bi-person'
  },
  {
    number:7,
    name:'Users',
    icon:'bi bi-people-fill'
  },
  // {
  //   number:8,
  //   name:'Labor Rates',
  //   icon:'bi bi-currency-dollar'
  // },
  {
    number:9,
    name:'Subscription',
    icon:'bi bi-clipboard-check'
  },
  {
    number:10,
    name:'Asset QR code',
    icon:'bi bi-qr-code'
  }
  
];
constructor(private settingMainService:SettingMainService,private auth:AuthService,private router:Router,private formBuilder:FormBuilder){}

  ngOnInit(){
    
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.companyId=localStorage.getItem('companyId');
   
    this.settingMainService.dashboard(this.email).subscribe((data)=>{
      this.username=data.firstName+" "+data.lastName;
    },(err)=>{
      console.log(err);
    
    })
    this.fetchCompanyInformation();
   this.companyInformationForm=this.formBuilder.group(({
    companyName:['',Validators.required],
    comapanyLogo:[''],
    id:[''],
    address1:['',Validators.required],
    address2:[''],
    city:['',Validators.required],
    state:['',Validators.required],
    zipCode:['',Validators.required],
    phoneNo:['',Validators.required],
    website:['',Validators.required],
    customerEmail:['']
   }))

   this.settingMainService.dashboard(this.email).subscribe((data)=>{
    
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
// <<<<<<< HEAD
 
// =======
    
//     if(err.status=="403"||err.status=="401"){
//       // localStorage.clear()
//       // alert("Session expired");
     
//       // this.logout();

//     }
// >>>>>>> c76357d6ff37298b2abc3a005a33f527121f016e
  })
  }
  fetchCompanyInformation(){
    this.settingMainService.getCompanyInformation(this.companyId).subscribe((data)=>{
      
      this.companyInformation=data;
      this.companyImage=this.companyInformation?.comapanyLogo;
      console.log(this.companyInformation)
    },
    (err)=>{
      console.log(err);
    })
  }

  playLottieAnimation() {
    Lottie.loadAnimation({
      container: this.lottieAnimationContainer.nativeElement,
      renderer: 'svg', // or 'canvas', choose based on your preference
      loop: true, // Set loop to true if needed
      autoplay: true, // Autoplay the animation
      path: 'assets/tick.json' // Path to your animation JSON file
    });
  }
  update(val:number){
    console.log(val);
    this.current=val;
    // if(val==3){
    //   this.router.navigate(['/custom-setting'])
    // }
  }
  logout(){
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    this.settingMainService.removeSession(this.email).subscribe((data)=>{
      console.log("Session Removed")
    },
    (err)=>{
      console.log("Session delete error ",err)
    })
    localStorage.removeItem('token');
      localStorage.removeItem('user');
   
    localStorage.removeItem('currOption');
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');

    this.router.navigate(['/login']);

   
  }
  imageUpload(event:any){
    console.log(event);
    const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      console.log(reader.result);
  
      this.companyImage=reader.result;

 
      };
  
 


  }
  addCompanyInformation(){
    this.companyInformationForm.controls['customerEmail'].setValue(this.email);
    this.companyInformationForm.controls['comapanyLogo'].setValue(this.companyImage);
    this.companyInformationForm.controls['id'].setValue(this.companyId);
    this.settingMainService.addCompanyInformation(this.companyInformationForm.value).subscribe((data)=>{
      console.log("Company Data Uploaded");
      // this.ngOnInit()
    },
    (err)=>{
      console.log(err);
      alert(err)
    }
    ,()=>{
      console.log("Update")
      // this.ngOnInit()
      this.fetchCompanyInformation();
    })
  }
}
