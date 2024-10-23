import { Component } from '@angular/core';
import { RoleAndPermissionService } from './role-and-permission.service';
import { RoleAndPermission } from './RoleAndPermission';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { count } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-and-permission',
  templateUrl: './role-and-permission.component.html',
  styleUrls: ['./role-and-permission.component.css']
})
export class RoleAndPermissionComponent {
  roleAndPermissionForm!:FormGroup;
  searchedRole!:any[];
  roleAndPermissionList!:any[];
  roleAndPermission!:any;
  companyId!:any;
  displayedColumns: string[] = ['id', 'name', 'asset'];
  roleAndCountMapping!:Map<String,Number>;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  constructor(private roleAndPermissionService:RoleAndPermissionService,private formBuilder:FormBuilder,private auth:AuthService,private router:Router){}

  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
    this.roleAndCountMapping=new Map<String,Number>();
    this.roleAndPermission=new RoleAndPermission();

    this.roleAndPermission.name='ADMIN';
      this.roleAndPermission.status='Active';
      this.roleAndPermission.type='Standard';
      this.roleAndPermission.ofUser=1;
    this.roleAndPermissionService.getRoleAndPermission(this.companyId).subscribe((data)=>{
      
      this.roleAndPermissionList=data;
      
      this.roleAndPermissionList.forEach((x)=>{
        x.type='Custom';
        this.roleAndPermissionService.countByRoleAndCompanyId(x.name,this.companyId).subscribe((data)=>{
          let count;
          count=data as Number;
          x.ofUser=count;
          // console.log(x.name+" "+x.ofUser);
          this.roleAndCountMapping.set(x.name,count);
        })
        
      })
      console.log(this.roleAndPermissionList)
    },
    err=>{
    console.log(err.status);
    if(err.status=="403"){
      alert("Session expired");
      this.logout();

    }
      },
    ()=>{
      this.roleAndPermissionList.unshift( this.roleAndPermission);
      this.searchedRole=this.roleAndPermissionList;
    });
    this.roleAndPermissionForm=this.formBuilder.group({
      name:['',Validators.required],
      status:['active',Validators.required],
      assets:['none',Validators.required],
      customers:['none',Validators.required],
      workOrders:['none',Validators.required],
      users:['none',Validators.required],
      roleAndPermissions:['none',Validators.required],
      imports:['none',Validators.required],
      category:['none',Validators.required],
      inventory:['none',Validators.required],
      companyId:['']
      
  
      



    })
  }

  addRoleAndPermission() {
      this.roleAndPermissionForm.controls['companyId'].setValue(this.companyId);
      let name=this.roleAndPermissionForm.controls['name'].value;
      if(name.trim()==''){
        this.triggerAlert("Empty Name Field","warning")
      }
      else{


      this.roleAndPermissionService.addRoleAndPermission(this.roleAndPermissionForm.value).subscribe((data)=>{
        console.log(data);
      },
      err=>{
        console.log(err);
      },
      ()=>{
        this.ngOnInit();
      })
    }
    }

    find(data:any){
     
      const value=data.target.value;
     
      this.searchedRole=this.roleAndPermissionList.filter((mydata)=>{
    //  console.log(mydata)
        let filterData:any;
        if(mydata.name.toLowerCase().includes(value.toLowerCase())||mydata.type.toLowerCase().includes(value.toLowerCase())||mydata.status.toLowerCase().includes(value.toLowerCase())||(mydata.ofUser==value)){
          filterData=mydata;
        }
        else{
          filterData=false;
        }
        return filterData;
       
        // keys.forEach((key)=>{
        //   const myString:String =data[key];
        //   if(myString!=null&&myString.toLowerCase().includes(value.toLowerCase())){
        //     filterData=data;
        //   }
         
          
          
        // })
        // return filterData;
      });
    }
    logout(){
      this.auth.currUser=null;
      this.auth.isLoggedIn=false;
      localStorage.removeItem('token');
        localStorage.removeItem('user');
      this.router.navigate(['/login']);
  
     
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
}
