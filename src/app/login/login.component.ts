import { Component, NgZone, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { LoginService } from './login.service';
import {
  SecretsManagerClient,
  GetSecretValueCommand,

} from "@aws-sdk/client-secrets-manager";
import * as AWS from '@aws-sdk/client-secrets-manager';
import { environment } from 'src/environments/environment';
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

  constructor(private auth:AuthService,private authService:AuthService,private loginService:LoginService){}

  async ngOnInit():Promise<void>{
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
    console.log(this.loader)
    if(this.email==''){
      alert('Please enter email');
      return;
    }
    if(this.password==''){
      alert('Please enter password');
      return;
    }
    this.auth.login(this.email,this.password);
    this.email='';
    this.password='';
    // this.errorMessage=this.authService.getErrorMessage();
    
    // this.triggerAlert(this.errorMessage,"danger");
    
    // this.loader=false;
    console.log(this.loader)
    this.subscribeToService();
    console.log(this.errorMessage+"in Login");
   
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

 
  
}
