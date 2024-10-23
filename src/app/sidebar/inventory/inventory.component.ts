import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from './inventory.service';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inventory } from './inventory';
import { ExtraFieldName } from './extraFieldName';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { RoleAndPermission } from './RoleAndPermission';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  userRoleDetails!: RoleAndPermission;
  userRole: any ;


 loadingScreen!:boolean;
  email:any='';
  inventoryForm!:FormGroup;
  filterForm!:FormGroup;

  imageFile!:any
  popUpImage:string='';
  inventoryList:Inventory[]=[];
  editVisibility:boolean=false;
  editButtonId:number=-1;
  companyId!:any;

  extraFieldName!:ExtraFieldName[];
  extraFieldNameList!:string[];
  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  
 
  selectedItems = [];
  

  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;

  dropdownSettings: any ;

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  myInventory!:any;

  InventoryListWithExtraFields:any = [];

  selectedFilterList:any=[];
  extraFieldFilterList!:Map<String,String>;
  filterList:any=[];
  selectFilter!:string;
  inventoryListWithExtraFields:any = [];
  inventoryListWithExtraFieldsWithoutFilter:any = [];
  pageSize:number=5;
  totalLength:number=100;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  paginationResult!:PaginationResult;
  inventory!:any[];

constructor(private router:Router,private inventoryService:InventoryService,private auth:AuthService,private formBuilder:FormBuilder){}
ngOnInit(){
  this.mandatoryFieldsMap = new Map<string, boolean>();
  this.loadingScreen=false;
  this.showFieldsMap = new Map<string, boolean>();
  this.userRole=localStorage.getItem('role');
  this.email=localStorage.getItem('user');
  this.companyId=localStorage.getItem('companyId');
  console.log(this.companyId);
  this.extraFieldFilterList=new Map<String,String>();
  this.selectFilter="";
  this.inventoryService.getAllInventory(this.companyId).subscribe((data)=>{
    this.inventoryList=data;
  },
  (err)=>{
    console.log(err);
  });
  this.inventoryService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
    this.userRoleDetails=data;
    console.log(this.userRoleDetails);
  },
  err=>{
    console.log(err);
  });

  this.inventoryService.getAllInventoryWithExtraColumn(this.companyId).subscribe((data)=>{
    this.InventoryListWithExtraFields=[];
    console.log(data);
    this.inventoryList=data;
    const jsonList:string[]=data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.InventoryListWithExtraFields.push(jsonObject)
    })
    console.log(this.InventoryListWithExtraFields)
    
   
  },
  (err)=>{
    console.log(err);
  },
  ()=>{
    // this.searchedWorkorder=this.workOrderListWithExtraFields;
  })




  this.inventoryService.testFUnction().subscribe((data)=>{
    console.log("-------------->>>>>>",data);
  },
(err)=>{
  console.log(err);
})



  this.inventoryForm=this.formBuilder.group({

    partImage:[''],
    partId:['',Validators.required],
    partName:['',Validators.required],
    price:['',Validators.required],
    cost:['',Validators.required],
    category:['',Validators.required],
    quantity:['',Validators.required],
    companyId:[this.companyId]
    



  });

  this.filterForm=this.formBuilder.group({
    partId:[''],
    partName:[''],
    price:[''],
    cost:[''],
    category:[''],
    quantity:[''],
    companyId:[this.companyId]
    // extraFields: this.formBuilder.array([])
   

  });

  this.inventoryService.testFUnction().subscribe((data)=>{
    console.log(data)
  },
  (err)=>{
    console.log(err);
  })

  this.inventoryService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
    this.mandatoryFieldsList=data;
    console.log("mandatory----------------------->",this.mandatoryFieldsList)
    this.mandatoryFieldsList.forEach((x)=>{
      this.mandatoryFieldsMap.set(x.name,x.mandatory);
    })
  },
  (err)=>{
    console.log(err);
  })
  this.inventoryService.getAllShowFields(this.companyId).subscribe((data)=>{
    this.showFieldsList=data;
    console.log("show----------------------->",this.showFieldsList)
    this.showFieldsList.forEach((x)=>{
      this.showFieldsMap.set(x.name,x.show);
      this.filterList.push(x.name);
      if(x.show==true){
        this.extraFieldFilterList.set(x.name,x.type);
      }
    })
    
    if(this.showFieldsList!=null){
    this.showFieldsList.forEach((x)=>{
      if(x.show==true)
      this.inventoryForm.addControl(x.name,this.formBuilder.control(''));
    })
  }
  
  },
  (err)=>{
    console.log(err);
  },
  ()=>{
    this.inventoryService.getExtraFieldName(this.companyId).subscribe((data)=>{
    
   
      this.extraFieldName=data;
      var arr:string[]=[];
    this.extraFieldName.forEach((x)=>{
      console.log(x.name+" "+this.showFieldsMap.get(x.name))
        if(this.showFieldsMap.get(x.name)==true){
        arr.push(x.name);
        }
      })
      
      this.extraFieldNameList=arr;
      //console.log(this.extraFieldNameList)
      
   
     
      
      
    },
    (err)=>{
      console.log(err);
    })
  })



  this.inventoryService.getExtraFieldNameValue(this.companyId).subscribe((data)=>{
    this.fieldNameValueMap=data;
    console.log(data)

  },
  (err)=>{
    console.log(err);
  })

  this.dropdownSettings= {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  
}
handlePageEvent(e: PageEvent) {
  this.pageEvent = e;
  this.totalLength = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  console.log(this.pageIndex);

  this.inventoryService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
    this.loadingScreen=true;
    console.log(data);
    this.inventoryListWithExtraFields=[]
    this.paginationResult=data;
    this.totalLength=this.paginationResult.totalRecords;
    this.inventory=this.paginationResult.data;
    const jsonList:string[]=this.paginationResult.data;
  jsonList.forEach((workorder)=>{
    const jsonObject:any = JSON.parse(workorder);
    console.log(typeof(jsonObject))
    this.inventoryListWithExtraFields.push(jsonObject)
  });
  this.inventoryListWithExtraFieldsWithoutFilter=this.inventoryListWithExtraFields;
  console.log(this.inventoryListWithExtraFields);
  this.loadingScreen=false;
  },
(err)=>{
  console.log(err);
  this.loadingScreen=false;
})
  
}


updatePopUpImage(data:string){
this.popUpImage=data;
}
 addInventory(){
  
  



 let extraFieldValueMap=new Map<String,string>();
 let extraFieldTypeMap=new Map<String,string>();
 this.showFieldsList?.forEach((x)=>{
  
   if(x.show==true){
   
   extraFieldValueMap.set(x.name,this.inventoryForm.get(x.name)?.value);
   extraFieldTypeMap.set(x.name,x.type);
   }
 })

 this.inventoryForm.controls['partImage'].setValue(this.imageFile);
 console.log(this.inventoryForm.value);
 let valid="true";
 console.log(this.mandatoryFieldsList)
 this.mandatoryFieldsList?.forEach((val)=>{
   
   if(this.showFieldsMap.get(val.name)==false){
     valid="true";
   }
   else if((val.mandatory==true)&&( this.inventoryForm.get(val.name)?.value==null||this.inventoryForm.get(val.name)?.value=='')){
     
   
     this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
     valid="false";
    
   }
   else if((val.mandatory==true)&&(this.showFieldsMap.get(val.name)==true) &&( this.inventoryForm.get(val.name)?.value==null||this.inventoryForm.get(val.name)?.value=='')){
     
    
     this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
     valid="false";
    
   }
   
   
 })

 let myNewInventory:Inventory;
 if(valid=="true"){
  this.inventoryService.addInventory(this.inventoryForm.value).subscribe((data)=>{
    console.log(data?.id+" Inventory");
    this.myInventory=data as Inventory;
    const jsonObject:any = JSON.parse(this.myInventory);
      console.log(typeof(jsonObject))
      myNewInventory=jsonObject;
   
   
   
  
  },
  (err)=>{
    console.log(err);
    this.ngOnInit();
  },
  ()=>{
  
if(this.showFieldsList.length==0){
  this.ngOnInit();
}
  this.showFieldsList?.forEach((x)=>{
    console.log("inventory id---> "+extraFieldTypeMap.get(x.name))
    const obj={
        "email":this.email,
        "companyId":this.companyId,
        "name":x.name,
        "value":extraFieldValueMap.get(x.name),
        "inventoryId":myNewInventory?.id,
        "type":extraFieldTypeMap.get(x.name)
    }
  
    this.inventoryService.addExtraFields(obj).subscribe((data)=>{
      console.log("added extra fields");
      this.ngOnInit();
      // this.workorderform.reset();
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
    
  })
  
  }
  )
 }
 else{
  this.inventoryForm.reset();
 }
 



}
imageChange(event:any){
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      // console.log(reader.result);
      this.imageFile=reader.result;
  
  }
}
editButtonVisibile(id:number){
   
  this.editButtonId=id;
  this.editVisibility=true;

}
editButtonNotVisible(){
  
  this.editVisibility=false;
  this.editButtonId=-1;
}
deleteInventory(id:String){
  this.inventoryService.deleteInventory(id).subscribe((data)=>{
    console.log(data);
  
  },
  (err)=>{
    console.log(err);
  },()=>{
    this.ngOnInit();
  })

  }

  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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

  async mandatoryCheck(){


    for (let val of this.mandatoryFieldsList) {
      // Code to check validity
      if ((val.mandatory==true)&&( this.inventoryForm.get(val.name)?.value==null||this.inventoryForm.get(val.name)?.value=='')) {
          console.log("Validation failed for " + val.name);
          return false;
      }
      else if((val.mandatory==true)&&(this.showFieldsMap.get(val.name)==true) &&( this.inventoryForm.get(val.name)?.value==null||this.inventoryForm.get(val.name)?.value=='')){
        console.log("Validation failed for " + val.name);
        return false;
      }
  }
  return true;

  
  }


  updateSelectedField(data:string){
    this.selectFilter=data;
    console.log(data);

  }
  addFilter(){

    this.filterForm.addControl(this.selectFilter,this.formBuilder.control(''));
    console.log(this.selectFilter);
      if(this.selectFilter!=""){
      this.selectedFilterList.push(this.selectFilter);
      console.log(this.selectedFilterList);
      const index=this.filterList.indexOf(this.selectFilter);
      this.filterList = this.filterList.filter((item: string) => item !== this.selectFilter);

 
      

    }
    this.selectFilter="";
  
  }
  removeInputField(name: any) {

    console.log("remover"+name)
    this.filterForm.removeControl(name);
    this.filterList.push(name);
    this.selectedFilterList = this.selectedFilterList.filter((item: string) => item !== name);
    
   
    console.log(this.filterForm.value);
  }

  reset(){
    this.loadingScreen=true;
    this.filterForm.reset();
    this.filterForm.controls['email'].setValue(this.email);
    this.filterForm.controls['companyId'].setValue(this.companyId);
    this.inventoryService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
      console.log(data);
      this.inventoryListWithExtraFields=[]
    this.paginationResult=data;
    this.totalLength=this.paginationResult.totalRecords;
    this.inventory=this.paginationResult.data;
    const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.inventoryListWithExtraFields.push(jsonObject)
    })
    console.log(this.inventoryListWithExtraFields);
    this.loadingScreen=false;
    })
  }

  addFilterForm(){
    this.loadingScreen=true;
    console.log(this.filterForm.value);
    this.inventoryService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
      console.log(data);
      this.inventoryListWithExtraFields=[]
    this.paginationResult=data;
    this.totalLength=this.paginationResult.totalRecords;
    this.inventory=this.paginationResult.data;
    const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.inventoryListWithExtraFields.push(jsonObject)
    });
    this.inventoryListWithExtraFieldsWithoutFilter=this.inventoryListWithExtraFields;
    console.log(this.inventoryListWithExtraFields);
    this.loadingScreen=false;
    },
  (err)=>{
    console.log(err);
    this.loadingScreen=false;
  })
  }


  exportexcel 
() {
throw new Error('Method not implemented.');
}
onSort(arg0: string) {
throw new Error('Method not implemented.');
}
onSearch($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}
}