import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { LoginService } from './login.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:string='';
  password:string='';
  errorMessage:string='';

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  loader=false;
  activeSessionDetails:any;
  currentyear:any;
  showPassword!:boolean;
  showPasswordType!:string;
  showPasswordIconClass!:string;
  constructor(private auth:AuthService,private authService:AuthService,private loginService:LoginService,private router:Router){}

  async ngOnInit():Promise<void>{

    if(localStorage.getItem('isLoggedIn')!=null){
      this.authService.isLoggedIn = localStorage.getItem('isLoggedIn');
    }
    else{
      this.authService.isLoggedIn = false;
    }
    this.showPassword=false;
    this.showPasswordType='password'
    this.showPasswordIconClass='bi bi-eye-fill';
    this.currentyear=new Date().getFullYear();

      console.log("Login KeyValue")
      const localStorageData: { [key: string]: string } = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key at index i
        if (key) {
          const value = localStorage.getItem(key); // Get the corresponding value
          localStorageData[key] = value || ''; // Store in an object
        }
      }
      for (let key in localStorageData) {
        console.log(`${key}: ${localStorageData[key]}`);
      }
   
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
  login(){
    this.loader=true;
    
    console.log("---------login loader"+this.loader)
    
    if(this.email==''){
      // alert('Please enter email');
      this.triggerAlert("Please enter email","warning")
      this.loader=false;
      return;
      
    }
    if(this.password==''){
      // alert('Please enter password');
      this.triggerAlert("Please enter password","warning")
      this.loader=false;
      return;

    }
    let userId,deviceId,userAgent;
    
    
    userId = this.email;

    // Generate a unique device ID
    if(localStorage.getItem('deviceId')!=null){
      deviceId=localStorage.getItem('deviceId')
    }
    else{
    deviceId = uuidv4();
    }
    
    // Extract user agent information from the browser
    userAgent = window.navigator.userAgent;
    
    let mydata={
      "userId":userId,
      "deviceId":deviceId,
      "userAgent":userAgent
    }
    this.activeSessionDetails=mydata
    this.loginService.isSameBrowserAndDevice(mydata).subscribe((data)=>{
      console.log("Active LogIn")
      console.log(data)
      if (!data) {
          this.loader = false;
          setTimeout(() => {
            this.showModal();
          }, 0);
        }
      else{
        this.auth.login(this.email,this.password,mydata);
        this.email='';
        this.password='';
        // this.errorMessage=this.authService.getErrorMessage();
        
        // this.triggerAlert(this.errorMessage,"danger");
        
        //this.loader=false;
        console.log(this.loader)
        this.subscribeToService();
        console.log(this.errorMessage+" in Login");
      }
      },
      (err)=>{
        console.log("Error->"+err)
        this.loader=false;
      })
  
   
  }
  firstNameAutofilled!: boolean;
  lastNameAutofilled!: boolean;

  subscribeToService() {
    this.loginService.getTriggerFunctionSubject().subscribe((mydata:any) => {
      console.log("trigger---->"+mydata.data+" "+mydata.type)
      this.loader=false;
      this.triggerAlert(mydata.data,mydata.type); // Call your component function here
      this.errorMessage=mydata.data;
     
    });
  }
  logoutFromAllDevice(){
    this.loginService.removeSession(this.email).subscribe((data)=>{
      console.log("Removed from all devices")
          const modalElement = document.getElementById('removeLoggedIn');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop manually
      }
    }
        this.auth.login(this.email,this.password,this.activeSessionDetails);
        this.email='';
        this.password='';
        // this.errorMessage=this.authService.getErrorMessage();
        
        // this.triggerAlert(this.errorMessage,"danger");
        
        // this.loader=false;
        console.log(this.loader)
        this.subscribeToService();
        console.log(this.errorMessage+" in Login");
    },
      (err)=>{
        console.log(err);
      },
      ()=>{
    
      })
   
  }
  routeToLogin(){
  
    const modalElement = document.getElementById('removeLoggedIn');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove the backdrop manually
      }
    }
    this.loader=false;

  }
  showModal() {
    this.loader=false;
    const modalElement = document.getElementById('removeLoggedIn');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      myModal.show();
    }
  }
  showPasswordFunc(){
    if(this.showPassword==true){
      this.showPassword=false;
      this.showPasswordType='password';
      this.showPasswordIconClass='bi bi-eye-fill';
     }
    else{
      this.showPassword=true;
      this.showPasswordType='text';
      this.showPasswordIconClass='bi bi-eye-slash-fill';
      
    }
  }
// demo(){
//     this.loginService.demo().subscribe((data)=>{
//       console.log(data)
//     })
//   }  
  
}
