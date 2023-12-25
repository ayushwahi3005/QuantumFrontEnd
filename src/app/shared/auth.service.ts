import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currUser!:any;
  isLoggedIn:boolean=false;
  currModule:number=-1;

  constructor(private fireAuth: AngularFireAuth,private router:Router) { }

  login(email:string, password:string){
    this.fireAuth.signInWithEmailAndPassword(email,password).then(()=>{
      this.fireAuth.currentUser
      .then((user)=>{
        if(user?.emailVerified){
            localStorage.setItem('token','true'),
            this.currUser=email;
      
            this.fireAuth.authState.subscribe({
              next:(user)=>{localStorage.setItem('user',user?.email!); 
              this.isLoggedIn=true;
              this.router.navigate(['dashboard']);
            },
              error:(err)=>alert("Internal Error"+err),
            
            })
        }
        else{
          alert("Email Not Verified!!");
        }
      },
      (err)=>{
        alert("Error: "+err);
      })
      
      
    },
    err=>{
      alert(err.message);
      this.router.navigate(['/login']);
    })
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
