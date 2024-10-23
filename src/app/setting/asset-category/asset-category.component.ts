import { Component } from '@angular/core';
import { CategoryName } from './categoryName';
import { AssetCategoryService } from './asset-category.service';

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

  constructor(private assetCategoryService:AssetCategoryService){}
  ngOnInit(){

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
    (err)=>{
      console.log(err);
    })



    
  }

  onAddField(){
    
   
    
    if(this.addFieldName==''||this.addFieldName==null){
      alert("Field Empty!!");
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
    (err)=>{
      console.log(err.error.errorMessage);
      
      this.triggerAlert(err.error.errorMessage,"danger");
    },
    ()=>{
      this.addFieldName='';
     
      
      this.ngOnInit();

    })
  }
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
    (err)=>{
      console.log(err.error);
      
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      this.addFieldName='';
     
      
      this.ngOnInit();

    })

  }
  removeField(){
    this.assetCategoryService.deleteAssetCategory(this.deletionId).subscribe((data)=>{
      console.log(data);
      this.deletionId='';
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      this.triggerAlert("Deleted Successfully","primary");
      this.ngOnInit();
      
    }
    )

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
}
