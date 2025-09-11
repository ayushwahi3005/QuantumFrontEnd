import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CustomerResetPasswordService } from './customer-reset-password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-reset-password',
  templateUrl: './customer-reset-password.component.html',
  styleUrl: './customer-reset-password.component.css'
})
export class CustomerResetPasswordComponent {
  email:string='';
  password:string='';
  otp:string='';
  errorMessage:string='';
  state=1;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  loader=false;
  activeSessionDetails:any;
  otpArray: string[] = Array(6).fill('');
  myOtp: string[] = Array(6).fill('');
  currentyear:any;
  constructor(private customerResetPasswordService:CustomerResetPasswordService,private router:Router){}

  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6')
  otpInputs!: QueryList<ElementRef>;

  // Moves to the next input when a character is typed
  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement | null;
    if (input && input.value.length === 1 && index < 5) {
      const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }
  
  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement | null;
    if (input && event.key === 'Backspace' && !input.value && index > 0) {
      const previousInput = this.otpInputs.toArray()[index - 1].nativeElement;
      previousInput.focus();
    }
  }
  

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
      this.state=1;
   
  }
  // @ViewChildren('otp') otpInputs!: QueryList<ElementRef>;

  // onOtpInput(event: Event, index: number) {
  //   const input = event.target as HTMLInputElement;
  //   console.log(input.value)
  //   if (input.value.length === 1) {
  //     // this.otpInputs.toArray()[index + 1].nativeElement.focus();
  //     this.otpArray[index]=input.value
  //     // console.log(this.otpArray[index])
  //   }
  // }

  // onOtpKeyDown(event: KeyboardEvent, index: number) {
  //   if (event.key === 'Backspace') {
      
  //     this.otpArray[index]=''
  //   }
  // }
  triggerAlert(message: string, type: string,redirectToLogin:boolean) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
      if(redirectToLogin==true){
        this.router.navigate(['/login']);
      }
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  resendOTP(){

  }
  sendOTP(){
    this.loader=true;
    console.log(this.loader)
    if(this.email==''&&this.state==1){
      // alert('Please enter email');
      this.triggerAlert("Please enter email","warning",false)
      this.loader=false;
      return;
      
    }
    
    
    this.customerResetPasswordService.sendOTPToEmail(this.email).subscribe((data)=>{
      console.log("OTP sent to email")
     this.state=2;
     this.loader=false;
      },
      (err)=>{
        console.log(err.error.errorMessage)
        this.triggerAlert(err.error.errorMessage,"danger",false)
        this.loader=false;
      })
    
   
  }
  getOtpValue() {
    const otpValue =  this.otpArray
      .map(input => {
        
        return input;
      })
      .join(''); // Combine all values into a single string
    console.log('OTP:', otpValue);

    return this.otpInputs
    .toArray()
    .map(input => (input.nativeElement as HTMLInputElement).value)
    .join('');
    // return otpValue;
  }
  changePassword(){
    
    if(this.password==''&&this.state==2){
      // alert('Please enter password');
      this.triggerAlert("Please enter password","warning",false)
      this.loader=false;
      return;

    }
    const otp = this.getOtpValue();
    console.log("otp"+otp)
    if(otp.length!=6&&this.state==2){
      // alert('Please enter password');
      this.triggerAlert("Please enter OTP","warning",false)
      this.loader=false;
      return;

    }
    const obj={
      "email":this.email,
      "password":this.password,
      "otp":otp
    }


    this.customerResetPasswordService.updatePassword(obj).subscribe((data)=>{
      console.log("Password Updated Successfully");
      this.triggerAlert("Password Updated Successfully","success",true)
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger",false)
    })
  }


  // subscribeToService() {
  //   this.loginService.getTriggerFunctionSubject().subscribe((mydata:any) => {
  //     console.log("trigger---->"+mydata.data+" "+mydata.type)
  //     this.loader=false;
  //     this.triggerAlert(mydata.data,mydata.type); // Call your component function here
  //     this.errorMessage=mydata.data;
     
  //   });
  // }
  // logoutFromAllDevice(){
  //   this.loginService.removeSession(this.email).subscribe((data)=>{
  //     console.log("Removed from all devices")
  //   },
  //     (err)=>{
  //       console.log(err);
  //     },
  //     ()=>{
  //       const modalElement = document.getElementById('removeLoggedIn');
  //   if (modalElement) {
  //     modalElement.classList.remove('show');
  //     modalElement.style.display = 'none';
  //     document.body.classList.remove('modal-open'); // Remove the 'modal-open' class from the body
  //     const backdrop = document.querySelector('.modal-backdrop');
  //     if (backdrop) {
  //       backdrop.remove(); // Remove the backdrop manually
  //     }
  //   }
  //       this.auth.login(this.email,this.password,this.activeSessionDetails);
  //       this.email='';
  //       this.password='';
  //       // this.errorMessage=this.authService.getErrorMessage();
        
  //       // this.triggerAlert(this.errorMessage,"danger");
        
  //       // this.loader=false;
  //       console.log(this.loader)
  //       this.subscribeToService();
  //       console.log(this.errorMessage+" in Login");
  //     })
   
  // }
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
  // showModal() {
  //   const modalElement = document.getElementById('removeLoggedIn');
  //   if (modalElement) {
  //     const myModal = new bootstrap.Modal(modalElement, {
  //       backdrop: 'static',
  //       keyboard: false
  //     });
  //     myModal.show();
  //   }
  // }
}
function uuidv4(): any {
  throw new Error('Function not implemented.');
}

