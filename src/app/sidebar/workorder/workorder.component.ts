import { Component } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrderService } from './workorder.service';
import { WorkOrder } from './workorder';
import { Assets } from './assets';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ExtraFieldName } from './extraFieldName';
import { User } from './user';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CompanyCustomer } from './company-cutomer';
import { RoleAndPermission } from './RoleAndPermission';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';



@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})
export class WorkorderComponent {
  assetArr!:string[];
  technicianArr!:string[];
  selectedAsset!:string;
  selectedTechnician!:string
  workorderform!:FormGroup;
  workorderlist!:WorkOrder[];
  assetList!:Assets[];
  filterForm!:FormGroup;
  email:any;
  companyId:any;
  priority!:string;
  todayDate!:Date;
  editVisibility:boolean=false;
  editButtonId:number=-1;
  detailedWorkOrder=false;
  selectedWorkOrder!:string;
  loadingScreen=false;
  searchData!:string
  searchDataBy!:string;
  sortedBy!:string;
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  extraFieldName!:ExtraFieldName[];
  extraFieldNameMap!:Map<String,ExtraFieldName>;
  extraFieldNameList!:string[];


  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  searchedWorkorder!:any[];
  pageSize:number=5;
  totalLength:number=100;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  paginationResult!:PaginationResult;
  workorderListWithExtraFields:any = [];
  workorderListWithExtraFieldsWithoutFilter:any = [];
  
  workorders!:any[];

  selectedItems = [];

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  technicalUserList!:User[];
  userRole:any;
  userRoleDetails!:RoleAndPermission;
  companyCustomerList!:CompanyCustomer[];
  companyCustomerArr!:string[];
  selectedCompanyCustomer!:string;
  customerIdNameMap!:Map<String,String>;
  selectFilter!:string;

  selectedFilterList:any=[];
  extraFieldFilterList!:Map<String,String>;
  filterList:any=[];
  workOrderListWithExtraFields:any = [];
  dropdownSettings= {
    singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Custom Columns',
      noDataAvailablePlaceholderText: 'No Custom Columns',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
  };


  constructor(private formBuilder:FormBuilder,private workOrderService:WorkOrderService){

  }

  ngOnInit():void{
    this.email=localStorage.getItem('user');
    this.userRole=localStorage.getItem('role');
    console.log(this.userRole);
    this.selectFilter="";
    this.companyId=localStorage.getItem('companyId');
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldFilterList=new Map<String,String>();
    this.showFieldsMap = new Map<string, boolean>();
    this.filterList=[];
    console.log(this.companyId);
    this.workorderform=this.formBuilder.group({
      description:['',Validators.required],
      customer:['',Validators.required],
      customerId:['',Validators.required],
      dueDate:['',Validators.required],
      assignedTechnician:['',Validators.required],
      assignedTechnicianId:['',Validators.required],
      assetDetails:['',Validators.required],
      assetId:[''],
      priority:['None'],
      lastUpdate:[''],
      companyId:[this.companyId],
      status:['open']
  
      



    });
    this.filterForm=this.formBuilder.group({
      description:[''],
      customer:[''],
      dueDate:[''],
      status:[''],
      priority:[''],
      assignedTechnician:[''],
      assetDetails:[''],
      lastUpdate:[''],
      companyId:[this.companyId]
      // extraFields: this.formBuilder.array([])
     

    });
    this.workOrderService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
      this.userRoleDetails=data;
      console.log(this.userRoleDetails);
    },
    err=>{
      console.log(err);
    });
    this.workOrderService.getCompanyCustomerList(this.companyId).subscribe((data)=>{
      this.companyCustomerList=data;
      this.companyCustomerList.forEach((x)=>{
        this.customerIdNameMap?.set(x.id,x.name);
      })
      console.log(this.companyCustomerList)
    },
    (err)=>{
      console.log(err);
    })
    this.getAllWorkOrderList(this.companyId);
    this.getAllAssets(this.companyId);
    this.todayDate=new Date();
    console.log(this.todayDate);
    console.log("inside"+this.workorderlist)


    this.workOrderService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      // console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.workOrderService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.filterList.push(x.name);
        this.showFieldsMap.set(x.name,x.show);
        if(x.show==true){
          this.extraFieldFilterList.set(x.name,x.type);
        }
      })
      
      if(this.showFieldsList!=null){
      this.showFieldsList.forEach((x)=>{
        if(x.show==true)
        this.workorderform.addControl(x.name,this.formBuilder.control(''));
      })
    }
    
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.workOrderService.getExtraFieldName(this.companyId).subscribe((data)=>{
      
        console.log("In extra workOder")
         this.extraFieldName=data;
         var arr:string[]=[];
       this.extraFieldName.forEach((x)=>{
         this.extraFieldNameMap?.set(x.name,x);
         console.log(x.name+" "+this.showFieldsMap.get(x.name)+" "+x.type)
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
   



    this.workOrderService.getTechnicalUsers(this.companyId).subscribe((data)=>{
      this.technicalUserList=data;
      console.log(this.technicalUserList);
    }
    ,(err)=>{
      console.log(err);
    })


  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(this.pageIndex);

    this.workOrderService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
      this.loadingScreen=true;
      console.log(data);
      this.workorderListWithExtraFields=[]
      this.paginationResult=data;
      this.totalLength=this.paginationResult.totalRecords;
      this.workorders=this.paginationResult.data;
      const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.workorderListWithExtraFields.push(jsonObject)
    });
    this.workorderListWithExtraFieldsWithoutFilter=this.workorderListWithExtraFields;
    console.log(this.workorderListWithExtraFields);
    this.loadingScreen=false;
    },
  (err)=>{
    console.log(err);
    this.loadingScreen=false;
  })
    
  }
  addWorkOrder(){
    
    
    let myWorkorder:WorkOrder;
    console.log(this.workorderform.value);
    this.selectedAsset=this.workorderform.controls['assetDetails'].value;
    console.log(this.selectedAsset)
    if(this.selectedAsset!=null){
    this.assetArr=this.selectedAsset.split(',');
    this.workorderform.controls['assetDetails'].setValue(this.assetArr[0]);
    this.workorderform.controls['assetId'].setValue(this.assetArr[1]);
    }
    this.selectedTechnician=this.workorderform.controls['assignedTechnician'].value;
    if(this.selectedTechnician!=null){
      this.technicianArr=this.selectedTechnician.split(',');

   

      this.workorderform.controls['assignedTechnician'].setValue(this.technicianArr[0]);
      this.workorderform.controls['assignedTechnicianId'].setValue(this.technicianArr[1]);
    }

    
   

    this.workorderform.controls['companyId'].setValue(this.companyId);
    let extraFieldValueMap=new Map<String,string>();
      let extraFieldTypeMap=new Map<String,string>();
    this.showFieldsList?.forEach((x)=>{
      if(x.show==true){
        console.log("----------------------------------------------showList----------+"+this.workorderform.get(x.name)?.value)
      extraFieldValueMap.set(x.name,this.workorderform.get(x.name)?.value);
      extraFieldTypeMap.set(x.name,x.type);
      }
    })
    
    console.log(this.workorderform.value);
    let valid=1;
    console.log(this.mandatoryFieldsList)
    this.mandatoryFieldsList?.forEach((val)=>{
      console.log("-============>",val.mandatory+" "+this.workorderform.get(val.name)?.value);
      if(this.showFieldsMap.get(val.name)==false){
        valid=1;
      }
      else if((val.mandatory==true)&&( this.workorderform.get(val.name)?.value==null||this.workorderform.get(val.name)?.value=='')){
        
        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
        valid=0;
       
      }
      else if((val.mandatory==true)&&(this.showFieldsMap.get(val.name)==true) &&( this.workorderform.get(val.name)?.value==null||this.workorderform.get(val.name)?.value=='')){
        
        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
        valid=0;
       
      }
      
      
    })
    if(valid==0){
      return;
    }
  //  ==================================================
  this.selectedCompanyCustomer=this.workorderform.controls['customer'].value;
  if(this.selectedCompanyCustomer!=null){
    this.companyCustomerArr=this.selectedCompanyCustomer.split(',');
    this.workorderform.controls['customer'].setValue(this.companyCustomerArr[0]);
    this.workorderform.controls['customerId'].setValue(this.companyCustomerArr[1]);
    }
  console.log(this.workorderform.get("companyId")?.value)
    this.workOrderService.addWorkOrder(this.workorderform.value).subscribe((data)=>{
      console.log(data+" WorkOrderInserted");
      myWorkorder=data
      console.log("workOrder id"+myWorkorder.id)
    
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
    // this.ngOnInit();
    this.getAllWorkOrderList(this.companyId);
    this.showFieldsList?.forEach((x)=>{
      const obj={
          "email":this.email,
          "companyId":this.companyId,
          "name":x.name,
          "value":extraFieldValueMap.get(x.name),
          "workorderId":myWorkorder.id,
          "type":extraFieldTypeMap.get(x.name)
      }
      this.workOrderService.addExtraFields(obj).subscribe((data)=>{
        console.log("added extra fields");
        // this.ngOnInit();
        // this.workorderform.reset();
      },
      (err)=>{
        console.log(err);
      })
    })
   
    }
    )
  }
  getAllWorkOrderList(companyId:string){
    // this.workOrderService.getWorkOrder(companyId).subscribe((data)=>{
    //   this.workorderlist=data;
     






    // },(err)=>{
    //   console.log(err);
    // },
    // ()=>{
    //   this.searchedWorkorder=this.workorderlist
    // }
    // )
    this.workOrderService.getAllWorkOrderWithExtraColumn(companyId).subscribe((data)=>{
      this.workOrderListWithExtraFields=[];
      console.log(data);
      this.workorderlist=data;
      const jsonList:string[]=data;
      jsonList.forEach((workorder)=>{
        const jsonObject:any = JSON.parse(workorder);
        console.log(typeof(jsonObject))
        this.workOrderListWithExtraFields.push(jsonObject)
      })
      console.log(this.workOrderListWithExtraFields)
      
     
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      // this.searchedWorkorder=this.workOrderListWithExtraFields;
    })
    

  }
  getAllAssets(companyId:string){
    this.workOrderService.getAssets(companyId).subscribe((data)=>{
      this.assetList=data;
    },(err)=>{
      console.log(err);
    })
  }
  checkDueDate(date:string):boolean{
   
    const dueDate=new Date(date);
   
    if(dueDate.getTime()<this.todayDate.getTime()){
     
      return true;
      
    }
  

    return false;
    
  }
  editButtonVisibile(id:number){
  //  console.log(id);
    this.editButtonId=id;
    this.editVisibility=true;
 
  }
  editButtonNotVisible(){
    
    this.editVisibility=false;
    this.editButtonId=-1;
  }
  workOrderDetail(id:string){
    this.detailedWorkOrder=true;

  this.selectedWorkOrder=id;
  }
  onBackClicked(eventData:{show:boolean}){
    this.ngOnInit();
   
    this.detailedWorkOrder=eventData.show;
  }
  deleteloading(){
    this.loadingScreen=true;
    setInterval(()=>{
      this.loadingScreen=false;
      
    },3000);
    
  }
  
  deleteWorkorder(id:string){
    this.deleteloading();
   setTimeout(()=>{
    this.workOrderService.deleteWorkOrder(id).subscribe((data)=>{
      console.log('Workorder Deleted');
      this.workorderform.reset();
     
    },
    (err)=>{
      console.log(err);
      this.workorderform.reset();
    },()=>{
      this.workOrderService.deleteWorkorderExtraField(id).subscribe((data)=>{
        console.log("ExtraFields Deleted");
      },
      (err)=>{
        console.log(err);
      })
      this.ngOnInit();
    })
   },3000);


    
  }
  
  assetSelected(data:any){
    console.log(data)
  }
  onSearch(data:any){
    console.log(data);
    this.searchData=data;
  }
  searchClick(){
    
    if(this.searchData?.trim()==null||this.searchData?.trim()==''||this.searchDataBy==''){

      this.getAllWorkOrderList(this.companyId);
      
      return;
    }
    if(this.searchDataBy==''||this.searchDataBy==null){
      alert("Please select the category from drop down");
      return;
    }
    this.loadingScreen=true;
    setTimeout(()=>{
      this.workOrderService.getSearchedWorkOrderList(this.companyId,this.searchData?.trim(),this.searchDataBy).subscribe((data)=>{
        this.workOrderListWithExtraFields=[];
      
      this.workorderlist=data;
      const jsonList:string[]=data;
      jsonList.forEach((workorder)=>{
        const jsonObject:any = JSON.parse(workorder);
        
        this.workOrderListWithExtraFields.push(jsonObject)
      })
    
        
      },
      (err)=>{
        console.log(err);
      },()=>{
        this.loadingScreen=false;
      })
     },1000);
    
  }
  searchBy(data:string){
    this.searchDataBy=data;
    console.log(data)
    this.sortedBy='';
  }
  removeSearchDataBy(){
    this.searchDataBy='';
    this.getAllWorkOrderList(this.companyId);
  }
  sortBy(data:string){
    this.searchDataBy='';
    this.sortedBy=data;
    console.log("Sorted By:"+data)
    console.log(this.extraFieldName);
    console.log(this.selectedExtraColumsNameValue);
    const type=this.extraFieldNameMap?.get(data)?.type;
    this.workOrderService.getSortedWorkOrderList(this.companyId,data,type).subscribe((data)=>{
      this.workOrderListWithExtraFields=[];
      
      this.workorderlist=data;
      const jsonList:string[]=data;
      jsonList.forEach((workorder)=>{
        const jsonObject:any = JSON.parse(workorder);
        
        this.workOrderListWithExtraFields.push(jsonObject)
      })
      
    },
    (err)=>{
      console.log(err);
    },()=>{
      this.loadingScreen=false;
    })
  }
  removeSort(){
   this.sortedBy='';
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
  triggerAlert(message: string, type: string) {
    console.log("triiger")
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  Echo(){
    console.log("ecgo")
  }
  resetForm(){
    this.workorderform.reset();

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
    this.workOrderService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
      console.log(data);
      this.workorderListWithExtraFields=[]
    this.paginationResult=data;
    this.totalLength=this.paginationResult.totalRecords;
    this.workorders=this.paginationResult.data;
    const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.workorderListWithExtraFields.push(jsonObject)
    })
    console.log(this.workorderListWithExtraFields);
    this.loadingScreen=false;
    })
  }

  addFilterForm(){
    this.loadingScreen=true;
    console.log(this.filterForm.value);
    this.workOrderService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize).subscribe((data)=>{
      console.log(data);
      this.workorderListWithExtraFields=[]
    this.paginationResult=data;
    this.totalLength=this.paginationResult.totalRecords;
    this.workorders=this.paginationResult.data;
    const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.workorderListWithExtraFields.push(jsonObject)
    });
    this.workorderListWithExtraFieldsWithoutFilter=this.workorderListWithExtraFields;
    console.log(this.workorderListWithExtraFields);
    this.loadingScreen=false;
    },
  (err)=>{
    console.log(err);
    this.loadingScreen=false;
  })
  }
  
}
