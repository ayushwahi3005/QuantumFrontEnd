import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  email:any='';
  notificationList:Notification[]=[];
  unReadCount:number=0;
  current:number=2;
  username:any='';
  hoverOverSidebar=true;
  loading:boolean=true;
  freeTrialDetails:any;
  trialDayLeft!:number;
  currentSubscription:any;
  currentSubcriptionMessage:string='';
  currentSubscriptionMessageStyle:string='color: wheat; border-radius: 5px ; padding: 5px; margin-left:-4px; font-weight: 500;';
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
    number:6,
    name:'Analytics',
    icon:'bi bi-bar-chart'
  },
  // {
  //   number:3,
  //   name:'Inventory',
  //   icon:'bi bi-journal-text'
  // },
  // {
  //   number:4,
  //   name:'Preventive Maintainance',
  //   icon:'bi bi-speedometer2'
  // },
  // {
  //   number:5,
  //    name:'Work Order',
  //   icon:'bi bi-bookshelf'
  // }
  // {
  //   number:6,
  //   name:'People',
  //   icon:'bi bi-people-fill'
  // }
  
];

  constructor(private auth:AuthService,private router:Router,private dashService:DashboardService,private notificationService:NotificationService) {
    // this.notificationService.getNotificationObservable().subscribe((message) => {
    //   this.notification = message;
    //   console.log("Notification received:", this.notification);
    // });
    this.hoverOverSidebar=true;
    this.current=parseInt(localStorage.getItem('currOption')||'2',10);
    console.log("Current Option in Dashboard Component: ",this.current);
   
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
    document.body.style.overflow = 'hidden';
    console.log("isLoggedIn->"+localStorage.getItem('isLoggedIn'))
    console.log("deviceId->"+localStorage.getItem('deviceId'))
    this.email=localStorage.getItem('user');
    console.log(localStorage.getItem('role'))
    let storedCurr=localStorage.getItem('currOption');
    if(storedCurr!=null){
    this.current=parseInt(storedCurr,10);
    }
    // this.dashService.getNotification(this.email).subscribe((data)=>{
    //   // console.log("Notification Data",data);  
    //   this.unReadCount=0;
    //   if(data!=null){
    //     // console.log("Notification",data);
    //     this.notificationList=data;
    //     console.log("Notification",this.notificationList);
    //     this.notificationList.forEach((notification: any) => {
    //       console.log("Is Unread",notification.isRead);
    //       if(notification.read === false) {
    //         this.unReadCount++;
    //       }
    //     });
    //     console.log("Unread Count",this.unReadCount);
    //   }
    //   else{
    //     this.notificationList=[];
    //   }
    // },
    // (err)=>{
    //   console.log("Notification Error",err);
    //   this.notificationList=[];
    // });



    // this.notificationService.getNotificationObservable().subscribe((message) => {
    //   try {
    //     this.unReadCount=0;
    //     this.notificationList = typeof message === 'string' ? JSON.parse(message) : message;
    //     this.notificationList.forEach((notification: any) => {
    //       console.log("Is Unread",notification.isRead);
    //       if(notification.read === false) {
    //         this.unReadCount++;
    //       }
    //     });
    //   } catch (e) {
    //     this.notificationList = [];
    //     console.error('Failed to parse notification message:', e);
    //   }
    //   console.log("Notification received:", this.notificationList);
    // });
    // console.log("------------------>",localStorage.getItem('authToken'));
    // this.dashService.dashboard(this.email).subscribe((data)=>{
    
    //   this.username=data.firstName+" "+data.lastName;
    //   console.log("dashboard"+ this.username)
     
    //   if(this.username==''||this.username==null){
    //     this.ngOnInit();
    //   }
    //   else{
       
    //     localStorage.setItem('name',this.username);
      
    //   }
      
    // },
    // (err)=>{
    //   console.log("myerr------------>",err.status);
      
    //   // if(err.status=="403"||err.status=="401"){
    //   //   alert("Session expired");
    //   //   this.logout();

    //   // }
    // })
    let companyId=localStorage.getItem('companyId');
    console.log(companyId);
    
    this.dashService.getCompanyInformation(companyId).subscribe((data)=>{
      console.log("Company Information",data)
      localStorage.setItem('companyEmail',data.customerEmail)
      localStorage.setItem('companyName',data.companyName)
    },(err)=>{
      console.log("Company Information Error",err)
    });

    this.dashService.getFreeTrailDetails(companyId).subscribe((data)=>{
      console.log("Free Trial Details",data)
      this.freeTrialDetails=data;
       if(this.freeTrialDetails.trialExpired==false){
        
        const today = new Date();
        const trialEndDate = new Date(this.freeTrialDetails.trialEndDate);
        const timeDiff = trialEndDate.getTime() - today.getTime();
        this.trialDayLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      this.dashService.getCurrSubscription(companyId).subscribe((data)=>{
      console.log("Current Subscription",data)
      this.currentSubscription=data;
      if(this.currentSubscription!=null&&this.currentSubscription.status==='ACTIVE'){
        this.currentSubcriptionMessage=' Plan : '+this.currentSubscription.subscriptionName;
        
        this.currentSubscriptionMessageStyle+=' border:solid #800e94ff 1px; background-color: #9C27B0';
      }
      else if((this.currentSubscription==null||this.currentSubscription.status!='ACTIVE')&&this.freeTrialDetails.trialExpired===false &&this.trialDayLeft>0){
        this.currentSubcriptionMessage='Trial Period - '+this.trialDayLeft+ ' Days Left';
        this.currentSubscriptionMessageStyle+='border:solid #ffab00 1px; background-color: #ff9600;';
      }
      else{
        this.currentSubcriptionMessage='No Plan';
        this.currentSubscriptionMessageStyle+=' border:solid #dd1e10ff 1px; background-color: #F44336';
      }
    },
    (err)=>{
      console.log("Current Subscription Error",err)
    });
      this.loading=false;
    },(err)=>{
      console.log("Free Trial Details Error",err)
      this.loading=false;
    });
    
   
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
  // async logout(): Promise<void>{
  //   this.router.navigate(['/login']);
  //   console.log("logging out")
  //   this.auth.currUser=null;
  //   this.auth.isLoggedIn=false;
  //   // localStorage.removeItem('token');
  //   // localStorage.removeItem('currOption');
  //   // localStorage.removeItem('authToken');
  //   // localStorage.removeItem('companyId');
  //   //   localStorage.removeItem('user');
  //   //   localStorage.removeItem('selectedExtraColumsAssets')
  //   //   localStorage.removeItem("showMandatoryBasicFieldsAssets")
  //     this.dashService.removeSession(this.email).subscribe((data)=>{
  //       console.log("Session Removed")
  //     },
  //     (err)=>{
  //       console.log("Session delete error ",err)
  //     })
  //     localStorage.clear()
  //     // localStorage.getItem('uploadProgress');
  //     // localStorage.getItem('uploadInProgress');
    

   
  // }
  onHover(){
    this.hoverOverSidebar=false;
    
    // console.log(this.hoverOverSidebar);
  }
  offHover(){
    this.hoverOverSidebar=true;

    // console.log(this.hoverOverSidebar);
  }

  // notificationClick() {
  //   console.log("Notification Clicked");
  //   if(this.unReadCount > 0) {  
  //   this.dashService.updateNotification(this.notificationList,this.email).subscribe(
  //     (response) => {
  //       console.log( response);
  //       this.unReadCount = 0; // Reset unread count after marking as read
  //     },
  //     (error) => {
  //       console.error("Error updating notification", error);
  //     }
  //   );
  // }
  // }
openSettings() {
  // Get last selected tab from localStorage (used in SettingMainComponent)
  const savedOption = localStorage.getItem('settingHomeOption');
  const tabNumber = savedOption ? savedOption : 'company'; // default tab = 1

  // Save it again to ensure consistency
  localStorage.setItem('settingHomeOption', tabNumber.toString());

  // Navigate to setting-home with query param 'tab'
  // The SettingMainComponent will read this query param and show correct tab
  this.router.navigate(['/setting-home'], { queryParams: { tab: tabNumber } });
}

  

  
  



}
