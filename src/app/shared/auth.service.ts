import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuthDetail } from './AuthDetail';
import { TokenAuthenticationService } from './token-authentication.service';
import { CompanyId } from './companyId';
import * as jwt_decode from 'jwt-decode';
import { AccountLockInfo } from './AccountLockInfo';
import { LoginService } from '../login/login.service';
import { HttpClient } from '@angular/common/http';
import { RegisterService } from '../register/register.service';
import { InvitationService } from '../invitation/invitation.service';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from '../dialogue/dialogue.component';







@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currUser!:any;
  isLoggedIn:any;
  currModule:number=-1;
  authDetails!:AuthDetail;
  myToken!:string;
  errorMessage!:string;
  companyId!:CompanyId;
  accountLockInfo!:any;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  email!:any;
  private tokenCheckInterval: any;
  private hasAlerted = false; 
  sessionExpired$ = new BehaviorSubject<boolean>(false);
  constructor(private fireAuth: AngularFireAuth,private router:Router,private tokenAuthenticationService:TokenAuthenticationService,private loginService:LoginService,private http: HttpClient, private registerService:RegisterService,private invitationService:InvitationService) { }
 
  readonly dialog = inject(MatDialog);
      
          openSessionExpiredDialog(): void {
          const dialogRef = this.dialog.open(DialogueComponent, {
             disableClose: true, 
          });
      
          dialogRef.afterClosed().subscribe(result => {
             this.logout().then(() => {
                        this.router.navigate(['/login']); // Redirect after logout
                      }).catch(err => {
                        console.error('Logout failed:', err);
                      });
            console.log('The dialog was closed');
           
          });
        }

 
  ngOnInit(){
    this.accountLockInfo=null;
    
  }


  // Simulate session expiration
  simulateSessionExpiration(): void {
    setTimeout(() => {
      this.sessionExpired$.next(true);
    }, 5000); // Expire session after 5 seconds
  }

  login(email:string, password:string,loggedData:any){
    this.tokenAuthenticationService.getAccountInfo(email).subscribe((data)=>{
      this.accountLockInfo=data;
      console.log(this.accountLockInfo)
      if(data==null||this.accountLockInfo.lockedStatus==false){
       
            if(this.accountLockInfo!=null){
              let obj={
                "id":this.accountLockInfo.id,
                "customerEmail":email,
                "lockedStatus":false,
                "incorrectAttemptCount":0
              }
              this.tokenAuthenticationService.updateAccountInfo(obj).subscribe((data)=>{
                console.log("successful login accountlockstatus");
              })
            }
       
        this.fireAuth.signInWithEmailAndPassword(email,password).then(()=>{
          this.fireAuth.currentUser
          .then((user)=>{
            if(user?.emailVerified){
                this.tokenAuthenticationService.loginToken(email,password,loggedData.deviceId).subscribe((data)=>{
                  this.authDetails=data;
                  this.myToken=this.authDetails.token;
                  const token =  this.myToken; // Replace this with your actual JWT token
                  const decodedToken:any = jwt_decode.jwtDecode(token);
                  const expTime=new Date(decodedToken.exp * 1000);
                  console.log("Exp Time "+expTime);
                  localStorage.setItem('expiry-time',expTime.toString());
                  if(decodedToken.Role){
                  localStorage.setItem('role',decodedToken.Role[0].authority);
                  }
                  console.log("mytoken->",this.myToken)
                  localStorage.setItem('authToken', this.myToken);
                  
                  
                
                  // console.log(decodedToken.sub); // Access the subject (user ID)
                 
    
                  this.fireAuth.authState.subscribe({
                    next:(user)=>{
                      console.log(user);
                    localStorage.setItem('user',user?.email!);
                     this.tokenAuthenticationService.getCompanyId(user?.email).subscribe((data)=>{
                      this.companyId=data;
                      console.log(this.companyId)
                      localStorage.setItem('companyId',this.companyId?.id);
                      console.log("CompanyId"+this.companyId?.id+" "+localStorage.getItem('user'))
                      this.isLoggedIn="true";
                      localStorage.setItem('isLoggedIn',"true");
                      //loggedIN data saving
                      this.tokenAuthenticationService.addLoggedIn(loggedData).subscribe((data)=>{
                        console.log("Logged Data added");
                        localStorage.setItem('deviceId',loggedData.deviceId)
                        this.router.navigate(['dashboard']);
                      },
                      (err)=>{
                        console.log(err)
                      })
                    
                     },
                     (err)=>{
                      console.log(err);
                     })
                    
    
                    
                  },
                    error:(err)=>{
                      alert("Internal Error"+err);
                      let obj={
                        "data":err,
                        "type":"danger"
                      }
                      this.loginService.triggerComponentFunction(obj);
                    this.errorMessage=err.errorMessage;},
                  
                  })
                  
                },
                (err)=>{
                  this.errorMessage=err.errorMessage;
                  
                  console.log("myerror",err);
                  let obj={
                    "data":err.error.errorMessage,
                    "type":"danger"
                  }
                  this.loginService.triggerComponentFunction(obj);
                this.errorMessage=err.errorMessage;
                  
                })
                localStorage.setItem('token','true'),
                
                
                this.currUser=email;
          
                
            }
            else{
             
              this.errorMessage="Email Not Verified!!";
              alert("Email Not Verified!!");
                      let obj={
                        "data":"Email Not Verified!!",
                        "type":"danger"
                      }
                      this.loginService.triggerComponentFunction(obj);
            }
          },
          (err)=>{
            alert("Error: "+err.message);
            this.errorMessage=err.errorMessage;
            let obj={
              "data":"Error: "+err.message,
              "type":"danger"
            }
            this.loginService.triggerComponentFunction(obj);
            
          })
          
          
        },
        err=>{
          let userNotFoundFlag=0;
          this.errorMessage=err.message;
          console.log("-----??------->"+this.errorMessage)
          this.tokenAuthenticationService.getCustomer(email).subscribe((data)=>{
            console.log("USer check data"+data)
            if(data==null||data==''){
              let errorobj={
                "data":"No User Found",
                "type":"danger"
              }
              this.loginService.triggerComponentFunction(errorobj);
              userNotFoundFlag=1;
            }
            else{
              if(err.code=="auth/invalid-credential"|| err.code == "auth/wrong-password"){
           
                let obj=null;
                if(this.accountLockInfo==null){
                  obj={
                    "customerEmail":email,
                    "lockedStatus":false,
                    "incorrectAttemptCount":1
                  }
                  let errorobj={
                    "data":"Wrong Credentials. 4 attempts left",
                    "type":"danger"
                  }
                  this.loginService.triggerComponentFunction(errorobj);
                }
                else{
                  if(this.accountLockInfo.incorrectAttemptCount>=4){
                    obj={
                      "id":this.accountLockInfo.id,
                      "customerEmail":email,
                      "lockedStatus":true,
                      "incorrectAttemptCount":this.accountLockInfo.incorrectAttemptCount+1
                    }
                  }
                  else{
                    obj={
                      "id":this.accountLockInfo.id,
                      "customerEmail":email,
                      "lockedStatus":false,
                      "incorrectAttemptCount":this.accountLockInfo.incorrectAttemptCount+1
                    }
                  }
                }
                console.log(obj);
                this.tokenAuthenticationService.updateAccountInfo(obj).subscribe((data)=>{
                  console.log("accountLockInfoUpdated")
                },
                (err)=>{
                  console.log(err);
                },
                ()=>{
                  // alert("Wrong Credentials");
                  // alert(4-this.accountLockInfo.incorrectAttemptCount+" attempts left.");
                  let myerror="Wrong Credentials !!";
                
                  myerror+=4-this.accountLockInfo.incorrectAttemptCount+" attempts left."
                  if(this.accountLockInfo.incorrectAttemptCount==4){
                    myerror = "Wrong Credentials. Account Locked !!"
                  }
                  console.log(myerror);
                  let obj={
                    "data":myerror,
                    "type":"danger"
                  }
                  this.loginService.triggerComponentFunction(obj);
                })
              }
              this.router.navigate(['/login']);
            }
          },
          (err)=>{
            console.log(err);
          })
          // if(userNotFoundFlag==1) return;
          
        })
      }
      else{
       
        this.errorMessage = "Account Locked !!";
        let obj={
          "data":"account locked",
          "type":"danger"
        }
        this.loginService.triggerComponentFunction(obj);
      }


    })
    
    console.log("Myeerior"+this.errorMessage)
  }
  getErrorMessage(){
    return this.errorMessage;
  }

  sendVerification(){
    return this.fireAuth.currentUser
    .then((user)=>{
      user?.sendEmailVerification();
    })
  }
  async checkAccount(email: string): Promise<boolean> {
    console.log(email);

    try {
      const providers = await this.fireAuth.fetchSignInMethodsForEmail(email);
      
      if (providers && providers.length > 0) {
        console.log('Account exists');
        return true;
      } else {
        console.log('Account does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking account:', error);
      return false; // Handle error appropriately
    }
  }
  checkAccountExistence(email: string): Promise<boolean> {
    return this.http.get(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=<AIzaSyCCGJcT8gSMoK41gjswNqyna5wiT8fqfNQ>&email=${email}`)
      .toPromise()
      .then((response: any) => {
        return response.users && response.users.length > 0;
      })
      .catch(error => {
        console.error('Error checking account existence:', error);
        throw error; // Handle error appropriately
      });
  }
  resetPassword(email:string) {
    this.fireAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent successfully');
        // Optionally, navigate to a confirmation page
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        // Handle error, e.g., display error message to the user
      });
  }
  register(email:string,password:string){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then(()=>{
      this.sendVerification();
       console.log("Register");
      let obj={
        "data":"Verification Email Sent Successfully",
        "type":"success"
      }
      this.registerService.triggerComponentFunctionRegister(obj);
      
     
    },
    err=>{
      alert(err.message);
      this.router.navigate(['/register']);
      
    })
  }
   registerForUser(email:string,password:string):Promise<boolean>{
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then(()=>{
      this.sendVerification();
      // alert("Verification Email Sent Successfully");
      let obj={
        "data":"Verification Email Sent Successfully",
        "type":"success"
      }
      this.invitationService.triggerComponentFunctionRegister(obj);
      return true;
     
    },
    err=>{
      console.log(err.code);
      let myError;
      if(err.code=="auth/weak-password"){
        myError= "Weak Password!! Try New Passoword";
      }
     let obj={
        "data":myError,
        "type":"danger"
      }
      this.invitationService.triggerComponentFunctionRegister(obj);
      return false;
      
    });
   
  }
  logout(){
    
    return this.fireAuth.signOut().then(() => {
      
      this.tokenAuthenticationService.removeSession(localStorage.getItem('user')!).subscribe((data)=>{
        console.log("Logged in data deleted");
      },
      (err)=>{
        console.log(err);
      });
      localStorage.clear();
      // localStorage.removeItem('token');
      // localStorage.removeItem('companyId');
      //   localStorage.removeItem('role');
      //   localStorage.removeItem('isLoggedIn');
        this.currUser = null;

      // this.email = localStorage.getItem('user');
      // console.log("User=====>" + this.email);
      // this.tokenAuthenticationService.removeSession(this.email).subscribe((data) => {
      //   localStorage.clear();
      //   // localStorage.removeItem('token');
      //   localStorage.removeItem('user');
      //   // localStorage.removeItem('companyId');
      //   // localStorage.removeItem('role');
      //   // localStorage.removeItem('isLoggedIn');
      //   // this.currUser = null;

      //   this.isLoggedIn = false;
      //   console.log("Session Removed");
      // },
      //   (err) => {
      //     console.log("Session delete error ", err);
      //   });

    }, err => {
      alert(err.message);

    });
    // this.router.navigate(['/login']);
    // this.ngOnInit();
  }
 getEmail():string{
  return this.currUser
 }


 startTokenMonitoring(): void {
  this.tokenCheckInterval = setInterval(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;
        // console.log('Time left:', timeLeft);
        const timeLeftInMinutes = Math.floor(timeLeft / 60000); // Convert to minutes
// console.log(`Time left: ${timeLeftInMinutes} minutes`);
        if (timeLeft <= 1 * 60 * 1000) {
          // alert('Session has expired. Please log in again.');
          this.email = localStorage.getItem('user');
          this.tokenAuthenticationService.removeSession(this.email).subscribe((data) => {
            localStorage.clear();
            // localStorage.removeItem('token');
            localStorage.removeItem('user');
            // localStorage.removeItem('companyId');
            // localStorage.removeItem('role');
            // localStorage.removeItem('isLoggedIn');
            // this.currUser = null;
    
            this.isLoggedIn = "false";
            console.log("Session Removed");
          },
            (err) => {
              console.log("Session delete error ", err);
            });
            const currentUrl = this.router.url;
            if(currentUrl.length!=0 &&!currentUrl.startsWith('/login')&&!currentUrl.startsWith('/register')&&!currentUrl.startsWith('/admin')&&!currentUrl.startsWith('/invitation')){
              console.log('Session expired - Auth Service: Session has expired. Redirecting to login.');
              // alert('Session has expired. Please log in again.');
              this.openSessionExpiredDialog();
              // this.router.navigate(['/login']);
            }
       

          this.stopTokenMonitoring(); // Stop monitoring when session expires
          // Optionally log the user out here
        } else if (timeLeft <= 6 * 60 * 1000 && !this.hasAlerted) {
          console.log('Session warning - Auth Service: Session will expire in less than 5 minutes.');
          alert('Your session will expire in less than 5 minutes.');
          this.hasAlerted = true; // Set the flag to avoid repeated alerts
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, 1000)
}

stopTokenMonitoring(): void {
  if (this.tokenCheckInterval) {
    clearInterval(this.tokenCheckInterval);
  }
}



 
}
