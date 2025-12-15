import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingMainService } from './setting-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Lottie from 'lottie-web';
import { CompanyInformation } from './companyInformation';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';

declare var bootstrap: any; // important

@Component({
  selector: 'app-setting-main',
  templateUrl: './setting-main.component.html',
  styleUrls: ['./setting-main.component.css']
})
export class SettingMainComponent {
  @ViewChild('lottieAnimation') lottieAnimationContainer!: ElementRef;
  email: any = '';
  current: number = 1;
  username: any = '';
  companyInformationForm!: FormGroup;
  companyImage: any;
  companyInformation!: CompanyInformation;
  companyId!: any;
  role: any;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  showTrialAlert: boolean = false; // Flag for trial expiry alert in template
  unReadCount: number = 0;
  private notificationSubject = new Subject<string>();
  notificationList: Notification[] = [];
  trialStatus:any;
  trialDayLeft!:number;
  currentSubscription:any;
  sideBarOption = [
    // {
    //   number:1,
    //   name:'Company Information',
    //   icon:'bi bi-bookshelf'
    // },
    // {
    //   number:2,
    //   name:'Locations and Bins',
    //   icon:'bi bi-geo-alt-fill'
    // },

    // {
    //   number:3,
    //   name:'Custom Fields',
    //   icon:'bi bi-boxes'
    // },
    // {
    //   number:4,
    //   name:'Categories',
    //   icon:'bi bi-boxes'
    // },
    //   {
    //   number:12,
    //   name:'Inspection Template',
    //   icon:'bi bi-boxes'
    // },
    // {
    //   number:5,
    //   name:'Import',
    //   icon:'bi bi-journal-text'
    // },
    // {
    //   number:11,
    //   name:'Import History',
    //   icon:'bi bi-clock-history'
    // },
    // {
    //   number:6,
    //   name:'Roles and Permissions',
    //   icon:'bi bi-person'
    // },
    // {
    //   number:7,
    //   name:'Users',
    //   icon:'bi bi-people-fill'
    // },
    // {
    //   number:8,
    //   name:'Labor Rates',
    //   icon:'bi bi-currency-dollar'
    // },
    // {
    //   number:9,
    //   name:'Subscription',
    //   icon:'bi bi-clipboard-check'
    // },
    // {
    //   number:10,
    //   name:'Asset QR code',
    //   icon:'bi bi-qr-code'
    // }

    { number: 1, name: 'Company Information', icon: 'bi bi-bookshelf', tab: 'company' },
    { number: 2, name: 'Locations and Bins', icon: 'bi bi-geo-alt-fill', tab: 'location' },
    { number: 3, name: 'Custom Fields', icon: 'bi bi-boxes', tab: 'custom-fields' },
    { number: 4, name: 'Categories', icon: 'bi bi-boxes', tab: 'category' },
    { number: 12, name: 'Inspection Template', icon: 'bi bi-boxes', tab: 'inspection-template' },
    { number: 5, name: 'Import', icon: 'bi bi-journal-text', tab: 'import' },
    { number: 11, name: 'Import History', icon: 'bi bi-clock-history', tab: 'import-history' },
    { number: 6, name: 'Roles and Permissions', icon: 'bi bi-person', tab: 'role' },
    { number: 7, name: 'Users', icon: 'bi bi-people-fill', tab: 'users' },
    { number: 9, name: 'Subscription', icon: 'bi bi-clipboard-check', tab: 'subscription' },
    { number: 10, name: 'Asset QR code', icon: 'bi bi-qr-code', tab: 'asset-qr' },

  ];
  constructor(private settingMainService: SettingMainService, private auth: AuthService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    if (localStorage.getItem('settingHomeOption') != null) {
      console.log("localStorage.getItem('settingHomeOption')->", localStorage.getItem('settingHomeOption'));
      // localStorage.getItem('settingHomeOption')
      this.current = Number(this.sideBarOption.find(opt => opt.tab === localStorage.getItem('settingHomeOption'))?.number);
    }
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      console.log("Tab Param:", tab);
      if (tab) {
        const match = this.sideBarOption.find(opt => opt.tab === tab);
        if (match) {
          this.current = match.number;
          localStorage.setItem('settingHomeOption', match.tab.toString());
          console.log(localStorage.getItem('settingHomeOption'))
        }
      }
    });
    this.email = localStorage.getItem('user');
    console.log(this.email);
    this.companyId = localStorage.getItem('companyId');
    this.role = localStorage.getItem('role')
    this.settingMainService.dashboard(this.email).subscribe((data) => {
      this.username = data.firstName + " " + data.lastName;
    }, (err) => {
      console.log(err);

    })
    this.settingMainService.getFreeTrail(this.companyId).subscribe((data)=>{
      this.trialStatus=data;
      if(this.trialStatus.trialExpired==false){
       
        const today = new Date();
        const trialEndDate = new Date(this.trialStatus.trialEndDate);
        const timeDiff = trialEndDate.getTime() - today.getTime();
        this.trialDayLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      console.log(this.trialStatus)
       this.settingMainService.getCurrSubscription(this.companyId).subscribe((data)=>{
        console.log("Current Subscription",data)
        this.currentSubscription=data;
       
      if((this.currentSubscription==null||this.currentSubscription.status!='ACTIVE')&&this.trialStatus.trialExpired===false &&this.trialDayLeft>0){
         this.showTrialAlert=true;
      }
      else{
        this.showTrialAlert=false;
      }
      },
      (err)=>{
        console.log(err);
      });
    },
    (err)=>{
      console.log(err);
    });
    this.fetchCompanyInformation();
    this.companyInformationForm = this.formBuilder.group(({
      companyName: ['', Validators.required],
      comapanyLogo: [''],
      id: [''],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNo: ['', Validators.required],
      website: ['', Validators.required],
      customerEmail: ['']
    }))

    this.settingMainService.getNotification(this.email).subscribe((data) => {
      // console.log("Notification Data",data);  
      this.unReadCount = 0;
      if (data != null) {
        // console.log("Notification",data);
        this.notificationList = data;
        console.log("Notification", this.notificationList);
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread", notification.isRead);
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
        console.log("Unread Count", this.unReadCount);
      }
      else {
        this.notificationList = [];
      }
    },
      (err) => {
        console.log("Notification Error", err);
        this.notificationList = [];
      });



    this.notificationService.getNotificationObservable().subscribe((message) => {
      try {
        this.unReadCount = 0;
        this.notificationList = typeof message === 'string' ? JSON.parse(message) : message;
        this.notificationList.forEach((notification: any) => {
          console.log("Is Unread", notification.isRead);
          if (notification.read === false) {
            this.unReadCount++;
          }
        });
      } catch (e) {
        this.notificationList = [];
        console.error('Failed to parse notification message:', e);
      }
      console.log("Notification received:", this.notificationList);
    });

    this.settingMainService.dashboard(this.email).subscribe((data) => {

      this.username = data.firstName + " " + data.lastName;
      console.log("dashboard" + this.username)

      if (this.username == '' || this.username == null) {
        this.ngOnInit();
      }
      else {

        localStorage.setItem('name', this.username);

      }

    },
      (err) => {
        console.log("myerr------------>", err.status);
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
  fetchCompanyInformation() {
    this.settingMainService.getCompanyInformation(this.companyId).subscribe((data) => {

      this.companyInformation = data;
      this.companyImage = this.companyInformation?.comapanyLogo;
      console.log(this.companyInformation)
    },
      (err) => {
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
  update(val: number) {
    console.log(val);
    this.current = val;
    const selectedVal = this.sideBarOption.find(opt => opt.number === this.current);
    console.log("Selected Value:", selectedVal?.tab);
    localStorage.setItem('settingHomeOption', selectedVal?.tab.toString() || 'company');
    const selected = this.sideBarOption.find(opt => opt.number === val);
    if (selected) {
      // Update the URL with query param ?tab=tabName
      this.router.navigate(['/setting-home'], { queryParams: { tab: selected.tab } });
    }

    // if(val==3){
    //   this.router.navigate(['/custom-setting'])
    // }
  }
  logout() {
    this.auth.currUser = null;
    this.auth.isLoggedIn = false;
    this.settingMainService.removeSession(this.email).subscribe((data) => {
      console.log("Session Removed")
    },
      (err) => {
        console.log("Session delete error ", err)
      })
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    localStorage.removeItem('currOption');
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');

    this.router.navigate(['/login']);


  }
  imageUpload(event: any) {
    console.log(event);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);

      this.companyImage = reader.result;


    };




  }
  addCompanyInformation() {

    this.companyInformationForm.controls['customerEmail'].setValue(this.email);
    this.companyInformationForm.controls['comapanyLogo'].setValue(this.companyImage);
    this.companyInformationForm.controls['id'].setValue(this.companyId);


    const includedFields = ['companyName', 'address1', 'address2', 'city', 'state', 'zipCode', 'phoneNo', 'website'];
    let allFieldsValid = true;
    includedFields.forEach(field => {
      const value = this.companyInformationForm.get(field)?.value;
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        this.triggerAlert(`Please Fill all Fields.`, 'danger');
        allFieldsValid = false;
        return; // Stop submission if any field is invalid

      } else {
        console.log(`Field "${field}" has value:`, value);
      }
    })
    if (!allFieldsValid) {
      return; // Stop submission if any field is invalid
    }
    // for (const key of Object.keys(this.companyInformationForm.controls)) {
    //   if (!excludedFields.includes(key)) {
    //     const value = this.companyInformationForm.get(key)?.value;
    //     if (!value || (typeof value === 'string' && value.trim() === '')) {
    //         this.triggerAlert(`Please fill out the "${key}" field.`, 'danger');
    //         allFieldsValid = false;
    //         break;
    //     } else {
    //       console.log(`Field "${key}" has value:`, value);
    //     }
    //   }
    // }

    // if (!allFieldsValid) {
    //   return; // Stop submission if any field is invalid
    // }
    this.settingMainService.addCompanyInformation(this.companyInformationForm.value).subscribe((data) => {
      console.log("Company Data Uploaded");
      this.triggerAlert("Company Information Updated Successfully", 'success');
      // this.ngOnInit()
    },
      (err) => {
        console.log(err);

        alert(err)
      }
      , () => {
        console.log("Update")
        // this.ngOnInit()
        this.fetchCompanyInformation();
      })
  }
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }

  notificationClick() {
    console.log("Notification Clicked");
    if (this.unReadCount > 0) {
      this.settingMainService.updateNotification(this.notificationList, this.email).subscribe(
        (response) => {
          console.log(response);
          this.unReadCount = 0; // Reset unread count after marking as read
        },
        (error) => {
          console.error("Error updating notification", error);
        }
      );
    }
  }


  forgotpassword() {
    const modalElement = document.getElementById('manageaccount');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  if (modalInstance) {
    modalInstance.hide();  // closes modal cleanly
  }

  this.router.navigate(['/reset-password']);
  }
}
