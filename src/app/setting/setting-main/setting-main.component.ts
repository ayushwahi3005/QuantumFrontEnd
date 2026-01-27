import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingMainService } from './setting-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Lottie from 'lottie-web';
import { CompanyInformation } from './companyInformation';
import { map, Subject, switchMap } from 'rxjs';
import { NotificationService } from 'src/app/notification/notification.service';
import { state } from '@angular/animations';

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
  country:any
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
    stateList:any = [];
  countryList=[
  "Canada",
  "Mexico",
  "United States of America",

  "Antigua and Barbuda",
  "The Bahamas",
  "Barbados",
  "Cuba",
  "Dominica",
  "Dominican Republic",
  "Grenada",
  "Haiti",
  "Jamaica",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Trinidad and Tobago",

  "Belize",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panama"
]
currentSelectedCountryCode='US'
selectedCountryCode='United States of America';
  sideBarOption = [


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
  constructor(private settingMainService: SettingMainService, private auth: AuthService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private notificationService: NotificationService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
      this.companyInformationForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: [''],
      state: [''],
      country: [''],  // Keep in form group
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z]{6,15}$')]],
      phoneNo: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      website: ['', [Validators.required, Validators.pattern('^.+\\.com$')]],
      comapanyLogo: ['']
    });
    let trialInfo=localStorage.getItem('trialAlertDismissedInfo');
    
    this.email = localStorage.getItem('user');
    console.log(this.email);
    this.companyId = localStorage.getItem('companyId');
        this.role = localStorage.getItem('role')
    this.loadCompanyInformation();

    
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
        const trialDate = trialInfo ? new Date(trialInfo) : new Date(0); 
        const now = new Date();

        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const isWithinOneDay = (now.getTime() - trialDate.getTime()) <= ONE_DAY_MS;

        if(trialInfo!==null&&trialInfo!==undefined&&isWithinOneDay){
         this.showTrialAlert=false;
        }else{
          this.showTrialAlert=true;
        }
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
    
    this.companyInformationForm = this.formBuilder.group(({
      companyName: ['', Validators.required],
      comapanyLogo: [''],
      id: [''],
      country: [''],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNo: ['', Validators.required],
      website: ['', Validators.required],
      customerEmail: ['']
    }))
    // this.fetchCompanyInformation();

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
     
     
      this.stateList = [];
      
console.log("Company Information",this.companyInformationForm.value);


      
     
  }
    loadCompanyInformation(): void {
    this.settingMainService
      .getCompanyInformation(this.companyId)
      .pipe(
        switchMap((company: any) => {
          this.companyInformation = company;
          this.selectedCountryCode = company.country || '';

          return this.settingMainService
            .countryStateList(this.selectedCountryCode)
            .pipe(
              map((states: any[]) => {
                return { company, states };
              })
            );
        })
      )
      .subscribe({
        next: (result: { company: any; states: any[] }) => {
          this.stateList = result.states;

          this.companyInformationForm.patchValue({
            companyName: result.company.companyName,
            address1: result.company.address1,
            address2: result.company.address2,
            city: result.company.city,
            state: result.company.state,
            country: result.company.country,
            zipCode: result.company.zipCode,
            phoneNo: result.company.phoneNo,
            website: result.company.website
          });
        },
        error: (err) => console.error(err)
      });
  }
  fetchCompanyInformation() {
    this.settingMainService.getCompanyInformation(this.companyId).subscribe((data) => {
      console.log("Company Information", data)
       this.companyInformationForm.patchValue({
        country: this.companyInformation?.country || '',
        state: this.companyInformation?.state || ''
      })
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
    if (this.companyInformationForm.invalid) {
      this.triggerAlert('Please fill all required fields correctly', 'danger');
      return;
    }
    // Include country in the payload
    const formData = this.companyInformationForm.value;
    this.companyInformationForm.controls['customerEmail'].setValue(this.email);
    this.companyInformationForm.controls['comapanyLogo'].setValue(this.companyImage);
    this.companyInformationForm.controls['id'].setValue(this.companyId);
    console.log(this.country)
    console.log("Form Data:", this.companyInformationForm.value);


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
        // this.fetchCompanyInformation();
      })
      // this.ngOnInit();
      //  this.fetchCompanyInformation();
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
  getStateList(country:any){
    this.settingMainService.countryStateList(country).subscribe((data)=>{
      this.stateList=data;
      console.log("State List",this.stateList);
    },
    (err)=>{
      console.log(err);
    });
  }
  makeTrialAlertFalse(){
    this.showTrialAlert=false;
    // let obj={
    //   trialAlertDismissed:true,
    //   dimissTime:new Date().toISOString()
    // }
    localStorage.setItem('trialAlertDismissedInfo',new Date().toISOString());
  }
}
