import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuthDetail } from './AuthDetail';
import { TokenAuthenticationService } from './token-authentication.service';
import { CompanyId } from './companyId';
import * as jwt_decode from 'jwt-decode';







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
              const token =  this.myToken; // Replace this with your actual JWT token
              const decodedToken:any = jwt_decode.jwtDecode(token);
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
   registerForUser(email:string,password:string){
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then(()=>{
      this.sendVerification();
      alert("Verification Email Sent Successfully");
     
    },
    err=>{
      alert(err.message);
      
    });
   
  }
  logout(){
    this.fireAuth.signOut().then(()=>{
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companyId');
      localStorage.removeItem('role');
     
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
