import { Component } from '@angular/core';
import { CategoryName } from './categoryName';
import { CustomerCategoryService } from './customer-category.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.css']
})
export class CustomerCategoryComponent {
  categoryNameList!:CategoryName[];
  searchedResult!:CategoryName[];
  addFieldName!:string;
  

  currOption:number=1;
  email!:any;

  deletionId:string='';
  deletionName!:string;
  editId:string='';
  editName!:string;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  categoryForm!:FormGroup;
  companyId!:any;
  editCurrCategory!:CategoryName;
  constructor(private customerCategoryService:CustomerCategoryService,private formBuilder:FormBuilder){}
  ngOnInit(){

    this.categoryForm=this.formBuilder.group({
      parentLocation:[''],
      address:[''],
      apartment:[''],
      city:[''],
      state:[''],
      zipCode:[''],
      status:['active'],
      companyId:[this.companyId]
     

    });
    this.editCurrCategory=new CategoryName;
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.customerCategoryService.getCustomerCategory(this.companyId).subscribe((data)=>{
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
    
   
    
    if(this.addFieldName?.trim()==''||this.addFieldName==null){
      // alert("Field Empty!!");
      this.triggerAlert("Name Field Empty!","warning");
    }
    else{
    const obj={
      
      "name":this.addFieldName.trim(),
       "status":"active",

       "companyId":this.companyId
    }
    console.log(obj)
    this.customerCategoryService.addCustomerCategory(obj).subscribe((data)=>{
      console.log(data);
     
      
      this.ngOnInit();
    },
    (err)=>{
      console.log(err.error);
      if(err.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
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
        "name":name.trim(),
       "status":event.checked==true?"active":"inactive",
       "companyId":this.companyId
    }
    this.customerCategoryService.updateCustomerCategory(obj).subscribe((data)=>{
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
    this.customerCategoryService.countCompanyCustomerByCategory(this.deletionName.toLowerCase()).subscribe((data)=>{
      
      console.log(data);
      if(data>0){
        this.triggerAlert("Cannot delete category as it is associated with "+data+" customers","danger");
        return;
      }
      else{
        this.customerCategoryService.deleteCustomerCategory(this.deletionId).subscribe((data)=>{
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
    });


  }
  updateDeletionName(name:string){
    this.deletionName=name;
  }
 
  updateDeleteId(id:string){
    this.deletionId=id;
  }

  updateEditName(name:string){
    this.editName=name;
  }
 
  updateEditId(id:string){
    this.editId=id;
    this.customerCategoryService.getCustomerCategoryById(this.companyId,id).subscribe((data)=>{
      this.editCurrCategory=data;
    },
   (err)=>{
    console.log(err);
   })

  }
  updateCategory(){
    console.log(this.editCurrCategory);
    const obj={
        "id":this.editCurrCategory.id,
        "name":this.editCurrCategory.name.trim(),
       "status":this.editCurrCategory.status,
       "companyId":this.companyId
    }
    this.customerCategoryService.updateCustomerCategory(obj).subscribe((data)=>{
      console.log(data);
      this.triggerAlert("Successfully updated","success");
      
      this.ngOnInit();
    },
    (err)=>{
      console.log(err.error);
      
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      // this.editCurrCategory=ne;
     
      
      this.ngOnInit();

    })
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
