import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkorderDetailsService } from './workorder-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrder } from './workorder';
import { coerceStringArray } from '@angular/cdk/coercion';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExtraField } from './extraField';
import { ExtraFieldName } from './extraFieldName';
import { MandatoryFields } from './mandatoryFields';
import { ShowFieldsData } from './showFieldsData';
import { CompanyCustomer } from './company-cutomer';

@Component({
  selector: 'app-workorder-details',
  templateUrl: './workorder-details.component.html',
  styleUrls: ['./workorder-details.component.css']
})
export class WorkorderDetailsComponent {

  @Input() id!:string;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  workOrder!: WorkOrder;
  workOrderUpdateForm!:FormGroup;

  currColor='open';
  loadingScreen=false;
  workOrderId!:any;
  workOrderObject:any;
  extraFieldName!:ExtraFieldName[];
  extraFieldsList!:any[];
  extraFields!:ExtraField[];
  extraFieldString:string[]=[];
  extraFieldMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  companyId!:any;
  extraFieldNameString:string[]=[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsList!:ShowFieldsData[];
  extraFieldValue:string[]=[]

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';


  companyCustomerList!:CompanyCustomer[];
  companyCustomerArr!:string[];
  selectedCompanyCustomer!:string;
  selectedCustomerId!:string;

  changedCustomerName!:string;
  changedCustomerId!:string;
  constructor(private workOrderDetailService:WorkorderDetailsService,private formBuilder:FormBuilder,private activeRoute:ActivatedRoute,private router:Router,private datePipe: DatePipe){}

  ngOnInit(){
  
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.workOrder=new WorkOrder;

    this.companyId=localStorage.getItem('companyId');
    this.activeRoute.paramMap.subscribe((data)=>{
      this.workOrderId=data.get('id');
      console.log("workOrderId-------------->"+this.workOrderId)
    })
   
    this.workOrderDetailService.getWorkOrder(this.workOrderId).subscribe((data)=>{
      this.workOrder=data;
      this.selectedCustomerId=this.workOrder.customerId;
      this.workOrderObject=this.workOrder as any;
     
     
       
       
      
      this.workOrder.dueDate=this.workOrder.dueDate.substring(0,10);
     
      
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.currColor=this.workOrder.status;
      
    });

    this.workOrderDetailService.getExtraFields(this.workOrderId).subscribe((data)=>{
  
      this.extraFields=data;
      console.log("extra Fieldsss"+this.extraFields);
      this.extraFields.sort((a,b)=>(a.name<b.name)?-1:1)
      if(this.extraFields!=null){
        this.extraFields.forEach((x)=>{
          this.extraFieldString.push(x.name);
          this.extraFieldMap.set(x.name,true);
        
        })
      }
      else{
        console.log("empty ExtraField",data)
      }
      
    },
    (err)=>{
      console.log(err);
    })

    this.workOrderDetailService.getExtraFieldName(this.companyId).subscribe((data)=>{
      this.extraFieldName=data;
      console.log("extra FieldsssName"+this.extraFieldName[0]);
      this.extraFieldName.sort((a,b)=>(a.name<b.name)?-1:1)
      console.log(data);
      if(this.extraFieldName!=null){
      this.extraFieldName.forEach((x)=>{
        this.extraFieldNameString.push(x.name);
      
      })
      console.log(this.extraFieldNameString)
    }
    else{
      console.log("empty extraFieldName")
    }
     
    },
    (err)=>{
      console.log(err);
    })
    this.workOrderDetailService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      //console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.workOrderDetailService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      // console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
    })


    this.workOrderDetailService.getCompanyCustomerList(this.companyId).subscribe((data)=>{
      this.companyCustomerList=data;
      this.companyCustomerList.forEach((x)=>{
        // console.log(x.name+" "+(x.id===this.assetDetails.customerId))
      })
      console.log(this.companyCustomerList)
    },
    (err)=>{
      console.log(err);
    })

    
  }
  

  
  onCheck(){
    console.log(typeof(this.workOrder));
    // this.mandatoryFieldsMap.forEach((val,key)=>{
    //   if(this.assetDetails.get(key))
    // })
    console.log(this.workOrder);
    if(this.mandatoryFieldsMap.get("customer")==true){
      if(this.workOrder.customer==''||this.workOrder.customer==null){
       
       
        this.triggerAlert("Fill Mandatory field 'Customer'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("description")==true){
      if(this.workOrder.description==''||this.workOrder.description==null){
        this.triggerAlert("Fill Mandatory field 'Description'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("status")==true){
      if(this.workOrder.status==''||this.workOrder.status==null){
        this.triggerAlert("Fill Mandatory field 'Status'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("priority")==true){
      if(this.workOrder.priority==''||this.workOrder.priority==null){
        this.triggerAlert("Fill Mandatory field 'Priority'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("dueDate")==true){
      if(this.workOrder.dueDate==''||this.workOrder.dueDate==null){
        this.triggerAlert("Fill Mandatory field 'Due Date'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("assignedTechnician")==true){
      if(this.workOrder.assignedTechnician==''||this.workOrder.assignedTechnician==null){
        this.triggerAlert("Fill Mandatory field 'Assigned Technician'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("assetDetails")==true){
      if(this.workOrder.assetDetails==''||this.workOrder.assetDetails==null){
        this.triggerAlert("Fill Mandatory field 'Asset Details'","danger")
        return ;
      }
    }
    let mandatoryFlag=1;
    console.log("extraField",this.extraFields)
    
  this.extraFields?.forEach((x)=>{
    if((x.value==''||x.value==null)&&(this.showFieldsMap.get(x.name)==true)&&(this.mandatoryFieldsMap.get(x.name)==true)){
      this.triggerAlert("Fill Mandatory field '"+this.toCamelCase(x.name)+"' in Custom","danger")
      mandatoryFlag=0;
    }
  })
  if(mandatoryFlag==0){
    return ;
  }
  this.extraFieldName?.forEach((x,ind)=>{
    
    console.log(ind+" "+x.name+" "+this.mandatoryFieldsMap.get(x.name)+" "+this.extraFieldValue);
    if((this.extraFieldMap.get(x.name)!=true)&&(this.showFieldsMap.get(x.name)==true)&&(this.extraFieldValue[this.extraFieldName.indexOf(x)]==''||this.extraFieldValue[this.extraFieldName.indexOf(x)]==null)&&(this.mandatoryFieldsMap.get(x.name)==true)){
      this.triggerAlert("Fill Mandatory field '"+this.toCamelCase(x.name)+"' in Custom","danger")
      mandatoryFlag=0;
      
    }
  })
  
  if(mandatoryFlag==0){
    return;
  }
  this.onSave()
  }
  onSave(){
    
 
    
    this.extraFieldName.forEach((x,ind)=>{
      let obj={}
      if(this.extraFieldString.includes(x.name)){
        
        const index = this.extraFields.findIndex(ele => ele.name === x.name);
         obj={
          
          "id":this.extraFields[index].id,
          
          "name":x.name,
          "value":this.extraFields[index].value,
          "workorderId":this.workOrderId,
          "type":x.type,
          "companyId":x.companyId
        }
      }
      else{
        obj={
         
                
                "name":x.name,
                "value":this.extraFieldValue[ind],
                "workorderId":this.workOrderId,
                "type":x.type,
                "companyId":x.companyId
              }
      }
        
        if(x.type=='checkbox'){
          console.log(this.extraFieldValue[ind])
        }
        this.workOrderDetailService.addExtraFields(obj).subscribe((data)=>{
          console.log("added extra fields");
        },
        (err)=>{
          console.log(err);
        })
        })
  
      // console.log(this.assetDetails);
      this.selectedCompanyCustomer=this.workOrder.customer
      console.log(this.selectedCompanyCustomer);
      if(this.changedCustomerName!=null&& this.changedCustomerId!=null){
        
        this.workOrder.customer=this.changedCustomerName
        this.workOrder.customerId=this.changedCustomerId;
        }
      this.workOrderDetailService.updateWorkOrder(this.workOrder).subscribe((data)=>{
        console.log("Data Updated");
        this.loading();
      },
      (err)=>{
        console.log(err);
      })
  
  
      
    
      // this.triggerAlert("Successfully Updated","success");
      
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

  onBack(){
    
    this.backStatus.emit({show:false});
  }
  // onSubmit(){
    
  //   this.workOrderUpdateForm.controls['id'].setValue(this.workOrder.id)
  //   this.workOrderUpdateForm.controls['companyId'].setValue(this.workOrder.companyId)
  //   // const originalDate = this.workOrderUpdateForm.get('dueDate')?.value;
  //   // let formattedDate = this.datePipe.transform(originalDate, 'yyyy-MM-dd');
  //   // let date=new Date(this.workOrderUpdateForm.get('dueDate')?.value).toISOString().split('T')[0];
  //   // console.log(formattedDate);
  //   // this.workOrderUpdateForm.controls['dueDate'].setValue(formattedDate);
  //   this.workOrderUpdateForm.controls['assetId'].setValue(this.workOrder.assetId)
  //   // console.log("mydate",this.workOrderUpdateForm.controls['dueDate'].value)

  //   this.workOrderDetailService.updateWorkOrder(this.workOrderUpdateForm.value).subscribe((data)=>{
  //     console.log("Data Updated");
  //     this.loading();
  //   },
  //   (err)=>{
  //     console.log(err);
  //   })
  
  // }
  onDropDownChange(event:any){
  
  if(event.toLowerCase()=='open'){
    this.currColor='open';
  }
  else if(event.toLowerCase()=='inprogress'){
    this.currColor='inprogress';
  }
  else if(event.toLowerCase()=='onhold'){
    this.currColor='onhold';
  }
  else{
    this.currColor='closed';
  }
  }
  loading(){
    this.loadingScreen=true;
   
   
    setTimeout(()=>{
      this.loadingScreen=false;
      this.router.navigate(['/dashboard'])
    },2000)
    
  }
  updateValue(key: String, value: any) {
    // Update the value of extraFields based on the key
    // this.workOrder.extraFields[key].value = value;
    if (this.workOrder.extraFields && typeof this.workOrder.extraFields.get === 'function') {
      const field = this.workOrder.extraFields.get(key);
      if (field) {
          field.value = value;
      }
  }
}
customerChange(event:any) {
  console.log("changed->"+event.target.value)
  let myData:string=event.target.value;
  if(myData!=null){
    this.companyCustomerArr=myData.split(',');
    this.changedCustomerName=this.companyCustomerArr[0];
    this.changedCustomerId=this.companyCustomerArr[1];
    }
  }
 

}
