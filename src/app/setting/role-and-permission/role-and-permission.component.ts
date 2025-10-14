import { Component, ElementRef, ViewChild } from '@angular/core';
import { RoleAndPermissionService } from './role-and-permission.service';
import { RoleAndPermission } from './RoleAndPermission';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { count } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { RoleAndPermissionEdit } from './RoleAndPermissionEdit';

@Component({
  selector: 'app-role-and-permission',
  templateUrl: './role-and-permission.component.html',
  styleUrls: ['./role-and-permission.component.css']
})
export class RoleAndPermissionComponent {
  roleAndPermissionForm!:FormGroup;
  roleAndPermissionFormEdit!:FormGroup;
  searchedRole!:any[];
  roleAndPermissionList!:any[];
  roleAndPermission!:any;
  companyId!:any;
  displayedColumns: string[] = ['id', 'name', 'asset'];
  roleAndCountMapping!:Map<String,Number>;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  currItem!:RoleAndPermissionEdit;
  deleteRoleId!:string;
    @ViewChild('closeBox2') closeBox2!: ElementRef<HTMLButtonElement>;
  constructor(private roleAndPermissionService:RoleAndPermissionService,private formBuilder:FormBuilder,private auth:AuthService,private router:Router){}

  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
    this.roleAndCountMapping=new Map<String,Number>();
    this.searchedRole=[];
    this.roleAndPermissionService.getRoleAndPermission(this.companyId).subscribe((data)=>{
      
      this.roleAndPermissionList=data;
      console.log(this.roleAndPermissionList)
      
      this.roleAndPermissionList.forEach((x)=>{
      
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
      console.log('Session expired - Role & Permission Component: Session has expired. Logging out.');
      alert("Session expired");
      this.logout();
    }
      },
    ()=>{
      
      this.searchedRole=this.roleAndPermissionList;
    });
    this.roleAndPermissionForm=this.formBuilder.group({
      name:['',Validators.required],
      type:['CUSTOM',Validators.required],
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

    this.roleAndPermissionFormEdit=this.formBuilder.group({
      id:[''],
      name:['',Validators.required],
      type:['CUSTOM',Validators.required],
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
              this.triggerAlert("Roles Added!!","success")
      },
      err=>{
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
      },
      ()=>{
        this.ngOnInit();
        this.triggerAlert("Role And Permission Added!!","success")
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
    edit(item:any){
      this.currItem=item
      this.roleAndPermissionFormEdit.controls['id'].setValue(this.currItem.id);
      this.roleAndPermissionFormEdit.controls['name'].setValue(this.currItem.name);
      this.roleAndPermissionFormEdit.controls['status'].setValue(this.currItem.status);
      this.roleAndPermissionFormEdit.controls['assets'].setValue(this.currItem.assets);
      this.roleAndPermissionFormEdit.controls['customers'].setValue(this.currItem.customers);
      this.roleAndPermissionFormEdit.controls['workOrders'].setValue(this.currItem.workOrders);
      this.roleAndPermissionFormEdit.controls['users'].setValue(this.currItem.users);
      this.roleAndPermissionFormEdit.controls['roleAndPermissions'].setValue(this.currItem.roleAndPermissions);
      this.roleAndPermissionFormEdit.controls['imports'].setValue(this.currItem.imports);
      this.roleAndPermissionFormEdit.controls['category'].setValue(this.currItem.category);
      this.roleAndPermissionFormEdit.controls['inventory'].setValue(this.currItem.inventory);
      this.roleAndPermissionFormEdit.controls['companyId'].setValue(this.companyId);
      
    }
    updateRoleAndPermission(){
      console.log(this.currItem)
      // this.roleAndPermissionForm.controls['companyId'].setValue(this.companyId);
      let name=this.currItem.name;
      if(name.trim()==''||this.roleAndPermissionFormEdit.controls['name'].value.trim()==''){
        this.triggerAlert("Empty Name Field","warning")
      }
      else{


      this.roleAndPermissionService.updateRoleAndPermission(this.roleAndPermissionFormEdit.value).subscribe((data)=>{
        console.log(data);
      },
      err=>{
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
      },
      ()=>{
        this.triggerAlert("Role And Permission Updated","success")
        this.ngOnInit();
         if (this.closeBox2) {
          this.closeBox2.nativeElement.click();
        }
        
      })
    }
    }
    selectIdDeleteRole(id:string){
      this.deleteRoleId=id;
    }
    deleteRole(){
        this.roleAndPermissionService.deleteRoleAndPermission(this.deleteRoleId).subscribe((data)=>{
          // console.log(data);
          this.deleteRoleId='';
        },
        err=>{
          console.log(err);
           if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
        },
        ()=>{
          this.triggerAlert("Role Deleted!!","success")
          this.ngOnInit();
        })
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
