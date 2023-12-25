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
  // fileInfos!: Observable<any>
  fileInfos!:AssetFile[];
  message!:string;
  currentFile!: any;
  assetFileList:AssetFile[]=[];

  
  constructor(private activatedRoute:ActivatedRoute,private assetDetailService:AssetDetailsService,private assetComponent:AssetsComponent,private datePipe: DatePipe){}
  ngOnInit(){
    this.message='';
    this.progress=20;
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.email=localStorage.getItem('user');
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

    this.assetDetailService.getExtraFieldName(this.email).subscribe((data)=>{
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
  onSave(){
    console.log(typeof(this.assetDetails));
 
  
    
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
        "type":x.type
      }
    }
    else{
      obj={
       
              "email":this.email,
              "name":x.name,
              "value":this.extraFieldValue[ind],
              "assetId":this.assetId,
              "type":x.type
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
  deleteFile(id:string){
    this.assetDetailService.deleteFile(id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit()
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
      alert("Fields are Empty");
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
  // getWorkOrderList(assetId:string){
  //   this.assetDetailService.getWorkOrders(assetId).subscribe((data)=>{
  //     this.workOrderList=data;
  //   },)
  // }
  
}

