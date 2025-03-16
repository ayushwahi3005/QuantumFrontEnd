import { Component } from '@angular/core';
import { CategoryName } from './categoryName';
import { AssetCategoryService } from './asset-category.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.css']
})
export class AssetCategoryComponent {
  categoryNameList!:CategoryName[];
  searchedResult!:CategoryName[];
  addFieldName!:string;
  

  currOption:number=1;
  email!:any;

  deletionId:string='';
  deletionName!:string;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  companyId!:any;
  editCurrCategory!:CategoryName;
  editId:string='';
  editName!:string;
  constructor(private assetCategoryService:AssetCategoryService,private auth:AuthService,private router:Router){}
  ngOnInit(){
    this.editCurrCategory=new CategoryName;
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.assetCategoryService.getAssetCategory(this.companyId).subscribe((data)=>{
      this.categoryNameList=data;
      this.searchedResult=this.categoryNameList
      // console.log("--------extra------------->"+this.companyId+"---"+this.categoryNameList);
      // this.categoryNameList.forEach((x)=>{
      //   console.log(x.companyId+" "+x.name+" "+x.email)
      // })
    },
    (err)=>{ this.handleError(err)
      console.log(err);
    })



    
  }
  logout(){
    this.auth.currUser=null;
    this.auth.isLoggedIn=false;
    this.assetCategoryService.removeSession(this.email).subscribe((data)=>{
      console.log("Session Removed")
    },
    (err)=>{ this.handleError(err)
      console.log("Session delete error ",err)
    })
    localStorage.removeItem('token');
      localStorage.removeItem('user');
   
    localStorage.removeItem('currOption');
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');

    this.router.navigate(['/login']);

   
  }
  handleError(error: any) {
    console.log(error);
    if(error.status=="403"||error.status=="401"){
      localStorage.clear()
      alert("Session expired");
     
      this.logout();

    }
  }

  onAddField(){
    
   
    
    if(this.addFieldName?.trim()==''||this.addFieldName==null){
      // alert("Field Empty!!");
      this.triggerAlert("Name Field Empty!","warning");
    }
    else{
    const obj={
      
      "name":this.addFieldName.trim().toLowerCase(),
       "status":"active",

       "companyId":this.companyId
    }
    console.log(obj)
    this.assetCategoryService.addAssetCategory(obj).subscribe((data)=>{
      console.log(data);
     
      
      this.ngOnInit();
    },
    (err)=>{ this.handleError(err)
      console.log(err.error.errorMessage);
      
      this.triggerAlert(err.error.errorMessage,"danger");
    },
    ()=>{
      this.addFieldName='';
     
      
      this.ngOnInit();

    })
  }
  }
  updateEditName(name:string){
    this.editName=name;
  }
  updateField(event:any,name:string,id:string,companyId:string){
    // console.log(event.checked+" "+name+" "+id+" "+companyId)

    const obj={
      "id":id,
        "name":name.trim().toLowerCase(),
       "status":event.checked==true?"active":"inactive",
       "companyId":this.companyId
    }
    this.assetCategoryService.updateAssetCategory(obj).subscribe((data)=>{
      console.log(data);
      this.triggerAlert("Successfully updated","success");
      
      this.ngOnInit();
    },
    (err)=>{ this.handleError(err)
      console.log(err.error);
      
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      this.addFieldName='';
     
      
      this.ngOnInit();

    })

  }
  removeField(){
// <<<<<<< HEAD
    this.assetCategoryService.countAssetByCategory(this.deletionName.toLowerCase()).subscribe((data)=>{

// =======
//     this.assetCategoryService.deleteAssetCategory(this.deletionId).subscribe((data)=>{
//       console.log(data);
//       this.deletionId='';
//     },
//     (err)=>{ this.handleError(err)
//       console.log(err);
//       this.triggerAlert(err.error.message,"danger");
//     },
//     ()=>{
//       this.triggerAlert("Deleted Successfully","primary");
//       this.ngOnInit();
// >>>>>>> c76357d6ff37298b2abc3a005a33f527121f016e
      
      console.log(data);
      if(data>0){
        this.triggerAlert("Cannot delete category as it is associated with "+data+" assets","danger");
        return;
      }
      else{
        this.assetCategoryService.deleteAssetCategory(this.deletionId).subscribe((data)=>{
          console.log(data);
          this.deletionId='';
        },
        (err)=>{ this.handleError(err)
          console.log(err);
          this.triggerAlert(err.error.message,"danger");
        },
        ()=>{
          this.triggerAlert("Deleted Successfully","primary");
          this.ngOnInit();
          
        }
        )
      }
    },
    (err)=>{ this.handleError(err)
      console.log(err);
    });
    

  }
  updateDeletionName(name:string){
    this.deletionName=name;
  }
 
  updateDeleteId(id:string){
    this.deletionId=id;
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
 

  addField(data:any){
   
    this.addFieldName=data;
  }

  find(data:any){
     
    const value=data.target.value;
    console.log(value)
   
    this.searchedResult=this.categoryNameList.filter((mydata)=>{

      let filterData:any;
      if(mydata.name.toLowerCase().includes(value.toLowerCase())||mydata.status.toLowerCase().includes(value.toLowerCase())){
        filterData=mydata;
      }
      else{
        filterData=false;
      }
      return filterData;

    });
  }
  updateEditId(id:string){
    this.editId=id;
    this.assetCategoryService.getCustomerCategoryById(this.companyId,id).subscribe((data)=>{
      this.editCurrCategory=data;
    },
   (err)=>{ this.handleError(err)
    console.log(err);
   })

  }
  updateCategory(){
    console.log(this.editCurrCategory);
    const obj={
        "id":this.editCurrCategory.id,
        "name":this.editCurrCategory.name.trim().toLowerCase(),
       "status":this.editCurrCategory.status,
       "companyId":this.companyId
    }
    this.assetCategoryService.updateAssetCategory(obj).subscribe((data)=>{
      console.log(data);
      this.triggerAlert("Successfully updated","success");
      
      this.ngOnInit();
    },
    (err)=>{ this.handleError(err)
      console.log(err.error);
      
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      // this.editCurrCategory=ne;
     
      
      this.ngOnInit();

    })
  }
}
