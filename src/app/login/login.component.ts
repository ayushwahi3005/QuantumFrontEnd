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
  constructor(private auth:AuthService,private authService:AuthService,private loginService:LoginService,private router:Router){}

  async ngOnInit():Promise<void>{
    this.currentyear=new Date().getFullYear();
    // console.log("--------------AuthTokenIn------------------"+localStorage.getItem('authToken'));
    // console.log("--------------------------"+localStorage.getItem('companyId'));

      // let response;
      // console.log("start secret->")
      // try {
      //   response = await this.client.send(
      //     new GetSecretValueCommand({
      //       SecretId: this.secret_name,
      //       VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      //     })
      //   );
      //     } catch (error) {
      //       // For a list of exceptions thrown, see
      //       // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      //       console.log("error->"+error)
      //       throw error;
           
      //     }

      // const secret = response.SecretString;
      // console.log("secret->"+secret)
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
    //this.loader=true;
    console.log(this.loader)
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
      if(!data){
        // alert('Already LoggedIn from different device');
        this.showModal()
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
    },
      (err)=>{
        console.log(err);
      },
      ()=>{
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
    const modalElement = document.getElementById('removeLoggedIn');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      myModal.show();
    }
  }
// demo(){
//     this.loginService.demo().subscribe((data)=>{
//       console.log(data)
//     })
//   }  
  
}
