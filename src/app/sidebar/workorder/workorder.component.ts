import { Component } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrderService } from './workorder.service';
import { WorkOrder } from './workorder';
import { Assets } from './assets';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ExtraFieldName } from './extraFieldName';


@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})
export class WorkorderComponent {
  assetArr!:string[];
  selectedAsset!:string;
  workorderform!:FormGroup;
  workorderlist!:WorkOrder[];
  assetList!:Assets[];
  
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
  extraFieldNameList!:string[];


  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  searchedWorkorder!:any[];
  
 
  selectedItems = [];

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  dropdownSettings= {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

  constructor(private formBuilder:FormBuilder,private workOrderService:WorkOrderService){}

  ngOnInit():void{
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    console.log(this.companyId);
    this.workorderform=this.formBuilder.group({
      description:['',Validators.required],
      customer:['',Validators.required],
      dueDate:['',Validators.required],
      assignedTechnician:['',Validators.required],
      assetDetails:['',Validators.required],
      assetId:[''],
      priority:['None'],
      lastUpdate:[''],
      companyId:[this.companyId],
      status:['open']
  
      



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
    this,this.workOrderService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
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
    })
    this.workOrderService.getExtraFieldName(this.companyId).subscribe((data)=>{
      
     console.log("In extra workOder")
      this.extraFieldName=data;
      var arr:string[]=[];
    this.extraFieldName.forEach((x)=>{
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

    this.workOrderService.getExtraFieldNameValue(this.companyId).subscribe((data)=>{
      this.fieldNameValueMap=data;
      if(this.searchedWorkorder!=null){
      this.searchedWorkorder.forEach((x1,ind)=>{
        const keys=Object.keys(this.fieldNameValueMap);
        var obj=Object.create(this.fieldNameValueMap);
        var searchAsset=this.searchedWorkorder[ind] as any;
       
        keys.forEach((key)=>{
          if(x1.id==key){
            
            let myObj=obj[key];
         
            
            const newKeys=Object.keys(obj[key]);
            
            newKeys.forEach((newKey)=>{
             searchAsset[newKey]=myObj[newKey]
         
            })
           
          }
        })
        this.searchedWorkorder[ind]=searchAsset;

      })
    }
    
    },
    (err)=>{
      console.log(err);
    })


  }
  addWorkOrder(){
    let myWorkorder:WorkOrder;
    this.selectedAsset=this.workorderform.controls['assetDetails'].value;
    this.assetArr=this.selectedAsset.split(',');
    this.workorderform.controls['assetDetails'].setValue(this.assetArr[0]);
    this.workorderform.controls['assetId'].setValue(this.assetArr[1]);
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
  
  // let finalObj: { [key: string]: any } = {};
  // this.showFieldsList?.forEach((x)=>{
    
    
  //   // myObj.workorderId=myWorkorder.id;
  //   // console.log("----------------------MyObj-------------------->"+extraFieldTypeMap.get(x.name));

  //   const obj={
       
  //       "companyId":this.companyId,
  //       "name":x.name,
  //       "value":extraFieldValueMap.get(x.name),
  //       // "workorderId":myWorkorder.id,
  //       "type":extraFieldTypeMap.get(x.name)
  //   }
  //   // console.log("----------------------MyObj-2------------------->"+JSON.stringify(obj));
   
  //   finalObj[x.name]=obj;
  // })
  // // console.log("----------------------MyObj-1------------------->"+ myMap.get("house no"));
  // // console.log("----------------------MyObj-------------------->"+ JSON.stringify(myMap));
  // // =================
  // // myMap.forEach((x1,x2)=>{
  // //   console.log("-------------------"+JSON.stringify(x1)+" "+x2)
  // // })
  // this.workorderform.controls['extraFields'].setValue(finalObj);
  // console.log(this.workorderform.controls['extraFields'].value)
  // console.log(this.workorderform.value);
    this.workOrderService.addWorkOrder(this.workorderform.value).subscribe((data)=>{
      console.log(data+" WorkOrderInserted");
      myWorkorder=data
      console.log("workOrder id"+myWorkorder.id)
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
    this.ngOnInit();
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
      },
      (err)=>{
        console.log(err);
      })
    })
   
    }
    )
  }
  getAllWorkOrderList(companyId:string){
    this.workOrderService.getWorkOrder(companyId).subscribe((data)=>{
      this.workorderlist=data;
     






    },(err)=>{
      console.log(err);
    },
    ()=>{
      this.searchedWorkorder=this.workorderlist
    }
    )
    

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
     
    },
    (err)=>{
      console.log(err);
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
        this.workorderlist=data;
        console.log(this.workorderlist);
        
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
    this.workOrderService.getSortedWorkOrderList(this.companyId,data).subscribe((data)=>{
      this.workorderlist=data;
      console.log(this.workorderlist);
      
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
}
