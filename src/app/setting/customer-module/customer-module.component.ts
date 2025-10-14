import { Component } from '@angular/core';
import { ExtraFieldName } from './extraFieldName';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { CustomerModuleService } from './customer-module.service';

@Component({
  selector: 'app-customer-module',
  templateUrl: './customer-module.component.html',
  styleUrls: ['./customer-module.component.css']
})
export class CustomerModuleComponent {
  extraFieldName!:ExtraFieldName[];
  addFieldName!:string;
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  extraFieldOption!:string;
  currOption:number=1;
  email!:any;
  editOn:boolean=true;
  deletionId:string='';
  deletionName!:string;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  isSubscribedToEmailsMessage!:boolean;
  companyId!:any;
  mandatoryFields=[{
    name:"name",
    type:"String"
  },
  {
    name:"email",
    type:"String"
  },
  {
    name:"phone",
    type:"String"
  },
  {
    name:"address",
    type:"String"
  },
  {
    name:"city",
    type:"String"
  },
  {
    name:"state",
    type:"String"
  },
  {
    name:"zipCode",
    type:"String"
  },
  {
    name:"category",
    type:"String"
  },
  {
    name:"status",
    type:"String"
  }]
  constructor(private customerModuleService:CustomerModuleService){}
  ngOnInit(){
    this.extraFieldOption='number';
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.customerModuleService.getExtraFields(this.companyId).subscribe((data)=>{
      this.extraFieldName=data;
      console.log("--------extra------------->"+this.companyId+"---"+this.extraFieldName);
      this.extraFieldName.forEach((x)=>{
        console.log(x.companyId+" "+x.name+" "+x.email)
      })
    },
    (err)=>{
      console.log(err);
    })

    this.customerModuleService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      // console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.customerModuleService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      // console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
    })

    
  }
  onClick(option:number){
    this.currOption=option;
  }
  onAddField(){
    
   
    
    if(this.addFieldName?.trim()==''||this.addFieldName==null){
      this.triggerAlert("Name Field Empty!","warning");
      // alert("Field Empty!!");
    }
    else{
    const obj={
      
      "name":this.addFieldName.trim(),
       "type":this.extraFieldOption,
       "email":this.email,
       "companyId":this.companyId
    }
    this.customerModuleService.addExtraFields(obj).subscribe((data)=>{this.extraFieldOption
      console.log(data);
      const event = { checked: true }; 
      // this.showField(event,this.addFieldName.trim().toLowerCase(),this.extraFieldOption)
      this.showField(event,this.addFieldName.trim(),this.extraFieldOption)
      this.ngOnInit();
    },
    (err)=>{
      console.log(err.error);
      // alert(err.error.errorMessage)
      this.triggerAlert(err.error.message,"danger");
    },
    ()=>{
      this.addFieldName='';
     
      this.extraFieldOption='number';
      this.ngOnInit();

    })
  }
  }
  removeExtraField(){
    this.customerModuleService.removeExtraField(this.deletionId).subscribe((data)=>{
      console.log(data);
      this.deletionId='';
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
      
    }
    )
    this.customerModuleService.deleteShowAndMandatoryFields(this.deletionName,this.companyId).subscribe((data)=>{
      console.log("deleted extra fields mandate and show");
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
      
    }
    )
  }
  updateDeletionName(name:string){
    this.deletionName=name;
  }
  addFieldOption(id:string){
    this.extraFieldOption=id;
  }
  removeFieldOption(){
    this.extraFieldOption='none';
  }
  updateDeleteId(id:string){
    this.deletionId=id;
  }
  updateFields(){

  }
  mandatoryField(event:any,name:string,type:string){
    console.log(event.checked);
    console.log(name);
    this.customerModuleService.getMandatoryFields(name,this.companyId).subscribe((data)=>{
      let obj;
      console.log(data);
      if(data==null){
        obj={
          "name":name,
          "email":this.email,
          "mandatory":event.checked,
          "type":type,
          "companyId":this.companyId
        }
        
      }
      else{
        obj={
          "id":data['id'],
          "name":name,
          "email":this.email,
          "mandatory":event.checked,
          "type":type,
          "companyId":this.companyId
        }
      }
      this.customerModuleService.mandatoryFields(obj).subscribe((data)=>{
        console.log("Updated");
        this.triggerAlert("Field settings updated successfully","success");
      },
      (err)=>{
        console.log(err);
      })
      
    })
  
  }
  onEditingShowAndMandatory(){
    
  }
  onEdit(){
    this.editOn=!this.editOn;
    if(this.editOn!=true){
      alert("Edit mode on");
    }
    else{
      alert("Saving Data");
    }
  }
  showField(event:any,name:string,type:string){
    
    console.log(event.checked);
    console.log(name);
    this.customerModuleService.getShowFields(name,this.companyId).subscribe((data)=>{
      let obj;
      console.log(data);
      if(data==null){
        obj={
          "name":name,
          "email":this.email,
          "show":event.checked,
          "type":type,
          "companyId":this.companyId
        }
        
      }
      else{
        obj={
          "id":data['id'],
          "name":name,
          "email":this.email,
          "show":event.checked,
          "type":type,
          "companyId":this.companyId
        }
      }
      console.log(obj)
      this.customerModuleService.showFields(obj).subscribe((data)=>{
        console.log("Updated");
        this.triggerAlert("SuccessFully Updated Field","success");
        this.ngOnInit();
      },
      (err)=>{
        console.log(err);
      })
      
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
  getValueOfMandatoryMap(name:string):boolean{
    if (this.mandatoryFieldsMap && this.mandatoryFieldsMap.has(name)) {
      return this.mandatoryFieldsMap.get(name) || false;
    }
    return false;
  }
  getValueOfShowMap(name:string):boolean{
    if (this.showFieldsMap && this.showFieldsMap.has(name)) {
      return this.showFieldsMap.get(name) || false;
    }
    return false;
  }
  print(){
    console.log(this.isSubscribedToEmailsMessage)
  }
  addFieldType(data:any){
    console.log(data);
    this.extraFieldOption=data;
  }
}
