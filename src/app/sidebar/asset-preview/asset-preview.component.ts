import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtraFields } from './extraFields';
import { CheckInOut } from './checkInOut';
import { ExtraFieldName } from './extraFieldName';
import { WorkOrder } from './workorder';
import { AssetFile } from './assetFile';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ActivatedRoute, Route } from '@angular/router';
import { AssetDetailsService } from '../asset-details/asset-details.service';
import { AssetsComponent } from '../assets/assets.component';
import { DatePipe } from '@angular/common';
import { Assets } from './assets';
import { AssetPreviewService } from './asset-preview.service';

@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.css']
})
export class AssetPreviewComponent {
 
  
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
  assetDetails!:Assets;
  companyId!:any;



  constructor(private activatedRoute:ActivatedRoute,private assetPreviewService:AssetPreviewService,private datePipe: DatePipe){
  }
  ngOnInit(){
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    // console.log("--------preview",this.assetComponent.previewAsset)
    this.activatedRoute.paramMap.subscribe(params => {
      this.assetId = params.get('id'); // Replace 'id' with the parameter name in your route
      // Use 'id' or other parameter data as needed
      
    });
    this.assetPreviewService.getAsset(this.assetId).subscribe((data)=>{
      this.assetDetails=data;
      console.log("--------asset image",this.assetDetails.image);
    },(err)=>{
      console.log(err);
    })
    this.assetPreviewService.getCheckInOutList(this.assetId).subscribe((data)=>{
      this.checkInOut=data;
   
      console.log(this.checkInOut[0])
    },
    (err)=>{
      console.log(err);
    })
    this.assetPreviewService.getAssetFile(this.assetId).subscribe((data)=>{
      //console.log("total",data);
      this.fileInfos=data;
      console.log("total",this.fileInfos);
    },
    (err)=>{
      console.log(err);
    })

    this.assetPreviewService.getWorkOrders(this.assetId).subscribe((data)=>{
      this.workOrderList=data;
      console.log("workorders",this.workOrderList)
    },(err)=>{
      console.log(err);
    });


    this.assetPreviewService.getExtraFields(this.assetId).subscribe((data)=>{
      
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

    this.assetPreviewService.getExtraFieldName(this.companyId).subscribe((data)=>{
      this.extraFieldName=data;
      this.extraFieldName.sort((a,b)=>(a.name<b.name)?-1:1)
      console.log("extra->",this.extraFieldName);
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

    this.assetPreviewService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
    })
    
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

onClick(option:number){
  console.log(option)
  this.currOption=option;
}
  // onBack(){
  //   this.assetComponent.ngOnInit();
  //   this.backStatus.emit({show:false})
    
  // }
}
