import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assets } from './assets';
import { AssetDetailsService } from './asset-details.service';
import { AssetsService } from '../assets/assets.service';
import { AssetsComponent } from '../assets/assets.component';
import { ExtraFields } from './extraFields';
import { ExtraFieldName } from './extraFieldName';
import { CheckInOut } from './checkInOut';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AssetFile } from './assetFile';
import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';
import * as saveAs from 'file-saver';
import { WorkOrder } from './workorder';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent {

  @Input() assetDetails!:Assets;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  assetId:any='';
  img:string=''
  newObjName:string='';
  newObjVal:string='';
  currOption:number=1;
  extraFields!:ExtraFields[];
  checkInOut:CheckInOut[]=[];

  extraFieldOption!:string;
  email:any;
  extraFieldName!:ExtraFieldName[];
  extraFieldValue:string[]=[];
  extraFieldNameString:string[]=[];
  extraFieldString:string[]=[];
  progress!:number;
  workOrderList:WorkOrder[]=[];
  fileInfos!:AssetFile[];
  message!:string;
  currentFile!: any;
  assetFileList:AssetFile[]=[];
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  extraFieldMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  deleteFileId!:string;
  companyId!:any;


  
  constructor(private activatedRoute:ActivatedRoute,private assetDetailService:AssetDetailsService,private assetComponent:AssetsComponent,private datePipe: DatePipe){}
  ngOnInit(){
    
    this.message='';
    this.progress=20;
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.activatedRoute.paramMap.subscribe((data)=>{
      this.assetId=data.get('id');
      this.assetId=this.assetDetails.id
      console.log("assetid",this.assetDetails.id);
   
      
      this.img=this.assetDetails.image;
    });
    this.assetDetailService.getWorkOrders(this.assetId).subscribe((data)=>{
      this.workOrderList=data;
      console.log("workorders",this.workOrderList)
    },(err)=>{
      console.log(err);
    });
    this.assetDetailService.getAssetFile(this.assetId).subscribe((data)=>{
      //console.log("total",data);
      this.fileInfos=data;
      console.log("total",this.fileInfos);
    },
    (err)=>{
      console.log(err);
    })
    this.assetDetailService.getExtraFields(this.assetDetails.id).subscribe((data)=>{
      
      this.extraFields=data;
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
      console.log(this.extraFields);
    },
    (err)=>{
      console.log(err);
    })

    this.assetDetailService.getExtraFieldName(this.companyId).subscribe((data)=>{
      this.extraFieldName=data;
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

    this.assetDetailService.getCheckInOutList(this.assetDetails.id).subscribe((data)=>{
      this.checkInOut=data;
   
      console.log(this.checkInOut[0])
    },
    (err)=>{
      console.log(err);
    })
    this.assetDetailService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      //console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this,this.assetDetailService.getAllShowFields(this.companyId).subscribe((data)=>{
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
  show(){
    console.log(this.extraFieldString)
  }
  onBack(){
    this.assetComponent.ngOnInit();
    this.backStatus.emit({show:false})
    
  }
  onDelete(){
    console.log("removed id is"+this.assetDetails.id);
    this.assetDetailService.removeAsset(this.assetDetails.id).subscribe((data)=>{
      console.log(data+this.assetDetails.id+" removed");

    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.assetComponent.ngOnInit();
      this.backStatus.emit({show:false});
    })
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
  onCheck(){
    console.log(typeof(this.assetDetails));
    // this.mandatoryFieldsMap.forEach((val,key)=>{
    //   if(this.assetDetails.get(key))
    // })
    if(this.mandatoryFieldsMap.get("customer")==true){
      if(this.assetDetails.customer==''||this.assetDetails.customer==null){
       
       
        this.triggerAlert("Fill Mandatory field 'Customer'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("category")==true){
      if(this.assetDetails.category==''||this.assetDetails.category==null){
        this.triggerAlert("Fill Mandatory field 'Category'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("serial")==true){
      if(this.assetDetails.serialNumber==''||this.assetDetails.serialNumber==null){
        this.triggerAlert("Fill Mandatory field 'Serial Number'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("name")==true){
      if(this.assetDetails.name==''||this.assetDetails.name==null){
        this.triggerAlert("Fill Mandatory field 'Name'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("location")==true){
      if(this.assetDetails.location==''||this.assetDetails.location==null){
        this.triggerAlert("Fill Mandatory field 'Location'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("status")==true){
      if(this.assetDetails.status==''||this.assetDetails.status==null){
        this.triggerAlert("Fill Mandatory field 'Status'","danger")
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
        "email":this.email,
        "name":x.name,
        "value":this.extraFields[index].value,
        "assetId":this.assetId,
        "type":x.type,
        "companyId":x.companyId
      }
    }
    else{
      obj={
       
              "email":this.email,
              "name":x.name,
              "value":this.extraFieldValue[ind],
              "assetId":this.assetId,
              "type":x.type,
              "companyId":x.companyId
            }
    }
      
      if(x.type=='checkbox'){
        console.log(this.extraFieldValue[ind])
      }
      this.assetDetailService.addExtraFields(obj).subscribe((data)=>{
        console.log("added extra fields");
      },
      (err)=>{
        console.log(err);
      })
      })

    console.log(this.assetDetails);
    this.assetDetailService.updateAsset(this.assetDetails).subscribe((data)=>{
      console.log(data);
      
    },
    (err)=>{
      console.log(err);
    })


    
  
    this.triggerAlert("Successfully Updated","success");
    
  }
  
  removeTheImage(){
    console.log("new click remove"+this.assetDetails.id)

    this.assetDetailService.removeImage(this.assetDetails.id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    }
    ,()=>{
     console.log(this.img);
     this.getAsset(this.assetDetails.id);
     this.assetComponent.ngOnInit();
      
      
    })
  }
  fileUpload(event:any){
    this.currentFile= event.target.files[0];
    
    

   
 

    
    
    this.progress=0;
      this.assetDetailService.addAssetFile(this.currentFile,this.assetId).subscribe(event => {
        
        if (event.type === HttpEventType.UploadProgress) {
          
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          
          this.message = event.body.message;
         
          // this.currentFile
          // this.fileInfos = this.assetDetailService.getAssetFile(this.assetId);
          
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        console.log(this.message);
       
      },()=>{
        if(this.progress==100){
          setTimeout(()=>{
            alert("successfully uploaded");
            this.currentFile=null;
          this.ngOnInit();
          },1500);
          
        }
      })
     
    
  }
  download(id:string,name:string){
    this.assetDetailService.download(id).subscribe((data:any)=>{

      console.log(name);
      const blob:any=new Blob([data],{type:'text/json; charset=utf-8'});
      const link=document.createElement("a");
      const url=window.URL.createObjectURL(blob);
      // link.download=name;
      // link.click();
      // window.URL.revokeObjectURL(link.href);
      // link.remove();
      saveAs(blob, name);
    
    },
    (err)=>{
      console.log(err);
    })
  }
  deleteFile(){
    this.assetDetailService.deleteFile(this.deleteFileId).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
      this.deleteFileId='';
    })
  }
  imageUpload(event:any){
    console.log(this.assetId)
    const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      console.log(reader.result);
  
  const obj={
    "id":this.assetDetails.id,
    "image": reader.result
  }

  this.assetDetailService.uploadImage(obj).subscribe((data)=>{
        console.log(data);
      
      },
      (err)=>{
        console.log(err);
        
      },
      ()=>{
        this,this.getAsset(this.assetDetails.id);
        this.assetComponent.ngOnInit();
        
      })
      };
  
 


  }
  getAsset(id:any){
    this.assetDetailService.getAsset(id).subscribe((data)=>{
      this.assetDetails=data;
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
  }
  onClick(option:number){
    console.log(option)
    this.currOption=option;
  }
  CheckInOutSubmit(employee:string,notes:string,location:string){
    let obj={};
    var today=new Date();
    if(employee==null||employee==''||notes==null||notes==''||location==null||location==''){
      // alert("Fields are Empty");
      this.triggerAlert("Check In/Out Fields are Empty","warning");
    }
    else{
      if(this.checkInOut.length==0){
        obj={
          "assetId":this.assetId,
          "status":"Checked Out",
          "date":this.datePipe.transform(today,'yyyy-MM-dd'),
          "employee":employee,
          "notes":notes,
          "location":location
        }
      }
      else if(this.checkInOut[0].status=='CheckedIn'){
        obj={
          "assetId":this.assetId,
          "status":"Checked Out",
          "date":this.datePipe.transform(today,'yyyy-MM-dd'),
          "employee":employee,
          "notes":notes,
          "location":location
        }
      }
      else{
        obj={
          "assetId":this.assetId,
          "status":"Checked In",
          "date":this.datePipe.transform(today,'yyyy-MM-dd'),
          "employee":employee,
          "notes":notes,
          "location":location
        }
      }
      console.log(obj)
      this.assetDetailService.addCheckInOut(obj).subscribe((data)=>{
        console.log(data);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.ngOnInit()
      })
     
    }
    
    
    
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
  removeExtraField(id:string){
    this.assetDetailService.removeExtraField(id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
      
    }
    )
  }
  addFieldOption(id:string){
    this.extraFieldOption=id;
  }
  removeFieldOption(){
    this.extraFieldOption='none';
  }
  itemDeleteDetails(id:string){
    this.deleteFileId=id;

  }

  
}

