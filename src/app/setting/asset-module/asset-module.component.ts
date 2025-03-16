import { Component } from '@angular/core';
import { ExtraFieldName } from './extraFieldName';
import { AssetModuleService } from './asset-module.service';
import { MandatoryFields } from './mandatoryFields';
import { ShowFieldsData } from './showFieldsData';

@Component({
  selector: 'app-asset-module',
  templateUrl: './asset-module.component.html',
  styleUrls: ['./asset-module.component.css'],
  
})
export class AssetModuleComponent {
  extraFieldName!:ExtraFieldName[];
  addFieldName!:string;
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  extraFieldOption!:string;
  currOption:number=1;
  email!:any;
  savedExtraColumn!:any
  editOn:boolean=true;
  deletionId:string='';
  deletionName!:string;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  isSubscribedToEmailsMessage!:boolean;
  companyId!:any;
  selectedExtraColums :string[]=[];
  mandatoryFields=[
    {
      name:"name",
      type:"String"
    },{
    name:"image",
    type:"file"
  },
 
  {
    name:"serialNumber",
    type:"Number"
  },
  {
    name:"category",
    type:"String"
  },
  {
    name:"customer",
    type:"String"
  },
  {
    name:"location",
    type:"String"
  },
  {
    name:"status",
    type:"Option"
  }]
  constructor(private assetModuleService:AssetModuleService){}
  ngOnInit(){
    this.extraFieldOption="number";
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.assetModuleService.getExtraFields(this.companyId).subscribe((data)=>{
      this.extraFieldName=data;
      console.log("--------extra------------->"+this.companyId+" "+this.extraFieldName.length);
      this.extraFieldName.forEach((x)=>{
        console.log(x.companyId+" "+x.name+" "+x.email)
      })
    },
    (err)=>{
      console.log(err);
    })

    this.assetModuleService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      // console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.assetModuleService.getAllShowFields(this.companyId).subscribe((data)=>{
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
    
   
    
    if(this.addFieldName==''||this.addFieldName==null){
      alert("Field Empty!!");
    }
    else{
    const obj={
      
      // "name":this.addFieldName.trim().toLowerCase(),
      "name":this.addFieldName.trim(),
      "email":this.email,
       "type":this.extraFieldOption,
       "companyId":this.companyId
    }
    this.assetModuleService.addExtraFields(obj).subscribe((data)=>{this.extraFieldOption
      console.log(data);
      const event = { checked: true }; 
      this.showField(event,this.addFieldName.trim().toLowerCase(),this.extraFieldOption)
      // this.showField(event,this.addFieldName.trim(),this.extraFieldOption)
      this.ngOnInit();
    },
    (err)=>{
      console.log(err.error);
      // alert(err.error.errorMessage)
      this.triggerAlert(err.error.errorMessage,"danger");
    },
    ()=>{
      this.addFieldName='';
      
      this.extraFieldOption='number';
      this.ngOnInit();

    })
  }
  }
  removeExtraField(){
    this.assetModuleService.removeExtraField(this.deletionId).subscribe((data)=>{
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
    this.assetModuleService.deleteShowAndMandatoryFields(this.deletionName,this.companyId).subscribe((data)=>{
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
    this.assetModuleService.getMandatoryFields(name,this.companyId).subscribe((data)=>{
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
      this.assetModuleService.mandatoryFields(obj).subscribe((data)=>{
        console.log("Updated");
        this.triggerAlert("SuccessFully Updated Field","success");
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
    
    if(event.checked==false){
      console.log("Remving------------------")
      console.log(name);
     

      this.savedExtraColumn=localStorage.getItem("selectedExtraColumsAssets")
  
        this.selectedExtraColums=JSON.parse(this.savedExtraColumn);
        this.selectedExtraColums=this.selectedExtraColums.filter((data)=> data!=name);
        localStorage.setItem("selectedExtraColumsAssets",  JSON.stringify(this.selectedExtraColums));
        
      
    }
    this.assetModuleService.getShowFields(name,this.companyId).subscribe((data)=>{
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
      this.assetModuleService.showFields(obj).subscribe((data)=>{
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
