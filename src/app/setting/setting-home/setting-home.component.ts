import { Component } from '@angular/core';
import { SettingHomeService } from './setting-home.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-setting-home',
  templateUrl: './setting-home.component.html',
  styleUrls: ['./setting-home.component.css']
})
export class SettingHomeComponent {
  email:any='';
  current:number=1;
  username:any='';
    unReadCount:number=0;
    private notificationSubject = new Subject<string>();
    notificationList:Notification[]=[];
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
constructor(private settingHomeService:SettingHomeService,private auth:AuthService,private router:Router,private notificationService:NotificationService){}

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
      
      
    })

    this.settingHomeService.getNotification(this.email).subscribe((data)=>{
      // console.log("Notification Data",data);  
      this.unReadCount=0;
      if(data!=null){
        // console.log("Notification",data);
        this.notificationList=data;
        console.log("Notification",this.notificationList);
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread",notification.isRead);
          if(notification.read === false) {
            this.unReadCount++;
          }
        });
        console.log("Unread Count",this.unReadCount);
      }
      else{
        this.notificationList=[];
      }
    },
    (err)=>{
      console.log("Notification Error",err);
      this.notificationList=[];
    });



    this.notificationService.getNotificationObservable().subscribe((message) => {
      try {
        this.unReadCount=0;
        this.notificationList = typeof message === 'string' ? JSON.parse(message) : message;
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread",notification.isRead);
          if(notification.read === false) {
            this.unReadCount++;
          }
        });
      } catch (e) {
        this.notificationList = [];
        console.error('Failed to parse notification message:', e);
      }
      console.log("Notification received:", this.notificationList);
    });
   
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

  getNotificationObservable() {
    return this.notificationSubject.asObservable();
  }
  notificationClick() {
    console.log("Notification Clicked");
    if(this.unReadCount > 0) {  
    this.settingHomeService.updateNotification(this.notificationList,this.email).subscribe(
      (response) => {
        console.log( response);
        this.unReadCount = 0; // Reset unread count after marking as read
      },
      (error) => {
        console.error("Error updating notification", error);
      }
    );
  }
  }
}
