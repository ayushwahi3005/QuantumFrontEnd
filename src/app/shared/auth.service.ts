import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuthDetail } from './AuthDetail';
import { TokenAuthenticationService } from './token-authentication.service';
import { CompanyId } from './companyId';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currUser!:any;
  isLoggedIn:boolean=false;
  currModule:number=-1;
  authDetails!:AuthDetail;
  myToken!:string;
  errorMessage!:string;
  companyId!:CompanyId;
  constructor(private fireAuth: AngularFireAuth,private router:Router,private tokenAuthenticationService:TokenAuthenticationService) { }

  login(email:string, password:string){
    this.fireAuth.signInWithEmailAndPassword(email,password).then(()=>{
      this.fireAuth.currentUser
      .then((user)=>{
        if(user?.emailVerified){
            this.tokenAuthenticationService.loginToken(email).subscribe((data)=>{
              this.authDetails=data;
              this.myToken=this.authDetails.token;
              console.log("mytoken->",this.myToken)
              localStorage.setItem('authToken', this.myToken);
              this.fireAuth.authState.subscribe({
                next:(user)=>{
                localStorage.setItem('user',user?.email!);
                 this.tokenAuthenticationService.getCompanyId(user?.email).subscribe((data)=>{
                  this.companyId=data;
                  localStorage.setItem('companyId',this.companyId.id);
                  console.log("CompanyId"+this.companyId.id+" "+localStorage.getItem('user'))
                  this.isLoggedIn=true;
                this.router.navigate(['dashboard']);
                 },
                 (err)=>{
                  console.log(err);
                 })
                

                
              },
                error:(err)=>{
                  alert("Internal Error"+err);
                this.errorMessage=err.errorMessage;},
              
              })
              
            },
            (err)=>{
              this.errorMessage=err.errorMessage;
              console.log("myerror",err);
            })
            localStorage.setItem('token','true'),
            
            
            this.currUser=email;
      
            
        }
        else{
          alert("Email Not Verified!!");
        }
      },
      (err)=>{
        alert("Error: "+err.message);
        this.errorMessage=err.errorMessage;
      })
      
      
    },
    err=>{
     
      this.errorMessage=err.message;
      console.log("------------>"+this.errorMessage)
      alert(err.message);
      this.router.navigate(['/login']);
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
  register(email:string,password:string){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then(()=>{
      this.sendVerification();
      alert("Verification Email Sent Successfully");
      this.router.navigate(['/login']);
    },
    err=>{
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }
  logout(){
    this.fireAuth.signOut().then(()=>{
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyId');
     
      this.currUser=null;
      this.isLoggedIn=false;
    },err=>{
      alert(err.message);
      
    })
  }
 getEmail():string{
  return this.currUser
 }
 
}
