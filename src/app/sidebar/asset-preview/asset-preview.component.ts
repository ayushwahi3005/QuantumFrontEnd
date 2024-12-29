import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtraFields } from './extraFields';
import { CheckInOut } from './checkInOut';
import { ExtraFieldName } from './extraFieldName';
import { WorkOrder } from './workorder';
import { AssetFile } from './assetFile';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AssetDetailsService } from '../asset-details/asset-details.service';
import { AssetsComponent } from '../assets/assets.component';
import * as saveAs from 'file-saver';
import { DatePipe } from '@angular/common';
import { Assets } from './assets';
import { AssetPreviewService } from './asset-preview.service';
import { CompanyCustomer } from '../assets/company-cutomer';
import { AuthService } from 'src/app/shared/auth.service';
import { AssetsService } from '../assets/assets.service';
import { QR } from './qr';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { User } from './user';

@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.css']
})
export class AssetPreviewComponent {
  qr!:QR;
  qrData!:string;
  hoverOverSidebar=true;
  assetId:any='';
  img:string=''
  newObjName:string='';
  newObjVal:string='';
  currOption:number=1;
  extraFields!:ExtraFields[];
  checkInOut:CheckInOut[]=[];
loading=true;
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
  customer!:CompanyCustomer
  username:any;
  sideBarCurr=2
  current=2
  qrSize!:number;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  deleteFileId!:string; // Alert type: success, warning, error, etc.
  technicalUserList!:User[];
  sideBarOption=[{
    number:1,
    name:'Customers',
    icon:'bi bi-person'
  },
  {
    number:2,
    name:'Assets',
    icon:'bi bi-boxes'
  },
  {
    number:3,
    name:'Inventory',
    icon:'bi bi-journal-text'
  },
  {
    number:4,
    name:'Preventive Maintainance',
    icon:'bi bi-speedometer2'
  },
  {
    number:5,
     name:'Work Order',
    icon:'bi bi-bookshelf'
  }
  // {
  //   number:6,
  //   name:'People',
  //   icon:'bi bi-people-fill'
  // }
  
];

  constructor(private activatedRoute:ActivatedRoute,private assetPreviewService:AssetPreviewService,private datePipe: DatePipe,private auth:AuthService,private router:Router,private assetService:AssetsService){
  }
  ngOnInit(){
    this.loading=true;
    this.username= localStorage.getItem('name')
    this.extraFieldString=[];
    this.qrSize=3;
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
    console.log(this.assetId)
    this.assetPreviewService.getAsset(this.assetId).subscribe((data)=>{
      this.loading=true;
      console.log("details"+data)
      this.assetDetails=data;
      console.log("preview:-"+this.assetDetails.customerId)
      this.assetPreviewService.getCompanyCustomer(this.assetDetails.customerId).subscribe((data)=>{
        this.customer=data;
     
        console.log(this.customer)
      },
      (err)=>{
        console.log(err);
      })
      console.log("--------asset image",this.assetDetails.image);
    },(err)=>{
      console.log(err);
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })
    this.assetPreviewService.getTechnicalUsers(this.companyId).subscribe((data)=>{
      console.log("Userss=====>")
      this.technicalUserList=data;

      console.log(this.technicalUserList);
    }
    ,(err)=>{
      console.log(err);
    })
    this.assetPreviewService.getCheckInOutList(this.assetId).subscribe((data)=>{
      this.loading=true;
      this.checkInOut=data;
   
      console.log("checkinout->"+this.checkInOut[0].detailsList)
      this.checkInOut[0].detailsList.forEach((ele)=>{
        console.log("checkinout->"+ele)
      })
    },
    (err)=>{
      console.log(err);
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })
    this.assetPreviewService.getAssetFile(this.assetId).subscribe((data)=>{
      //console.log("total",data);
      this.loading=true;
      this.fileInfos=data;
      console.log("total",this.fileInfos);
    },
    (err)=>{
      console.log(err);
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })

    // this.assetPreviewService.getWorkOrders(this.assetId).subscribe((data)=>{
    //   this.loading=true;
    //   this.workOrderList=data;
    //   console.log("workorders",this.workOrderList)
    // },(err)=>{
    //   console.log(err);
    //   this.loading=false;
    // },
    // ()=>{
    //   this.loading=false;
    // });


    this.assetPreviewService.getExtraFields(this.assetId).subscribe((data)=>{
      this.loading=true;
      this.extraFields=data as ExtraFields[];
      console.log("extra fieldsss"+this.extraFields)
      console.log("extra fieldsss data"+data)
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
      console.log("extra field->"+this.extraFields[0].name);
    },
    (err)=>{
      console.log(err);
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })

    this.assetPreviewService.getExtraFieldName(this.companyId).subscribe((data)=>{
      this.loading=true;
      this.extraFieldName=data as [];
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
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })

    this.assetPreviewService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      this.loading=true;
      this.showFieldsList.forEach((x)=>{
        console.log("showFirelds"+x.name)
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
      this.loading=false;
    },
    ()=>{
      this.loading=false;
    })
    this.assetPreviewService.getQR(this.companyId).subscribe((data)=>{
      this.qr=data;
      this.qrData="assets/id?"+this.assetDetails.id;
      
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
logout(){
  console.log("logging out")
  this.auth.currUser=null;
  this.auth.isLoggedIn=false;
  // localStorage.removeItem('token');
  // localStorage.removeItem('currOption');
  // localStorage.removeItem('authToken');
  // localStorage.removeItem('companyId');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('selectedExtraColumsAssets')
  //   localStorage.removeItem("showMandatoryBasicFieldsAssets")
    localStorage.clear()
  this.router.navigate(['/login']);

 
}

onHover(){
  this.hoverOverSidebar=false;
  
  // console.log(this.hoverOverSidebar);
}
offHover(){
  this.hoverOverSidebar=true;

  // console.log(this.hoverOverSidebar);
}
  onBack(){
    // this.assetComponent.ngOnInit();
    // this.backStatus.emit({show:false})
    this.router.navigate(['/dashboard'])
    
  }
  edit(){
    localStorage.setItem("assetIdDetail",this.assetId);
    this.router.navigate(['/dashboard']).then(() => {
      // Code executed after successful navigation
      this.assetService.detailAsset(this.assetDetails);
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }
  update(id:string){
    console.log("companyCustomerComponent"+id)
    // this.sideBarCurr=id
    // this.dashboardService.callComponentMethod(id)
    if(id!='3'){
    localStorage.setItem('currOption',id);
    this.router.navigate(['/dashboard']);
    }
    // this.dashboardComponent.current=id;
  }

  CheckInOutSubmit(employee:string,notes:string,location:string){
    let obj={};
    var today=new Date();
    console.log("today--->"+today)
    if(employee==null||employee==''||notes==null||notes==''){
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
          "location":location,
          "companyId":this.companyId
        }
      }
      else if(this.checkInOut[0].status=='Checked In'){
        obj={
          "assetId":this.assetId,
          "status":"Checked Out",
          "date":this.datePipe.transform(today,'yyyy-MM-dd'),
          "employee":employee,
          "notes":notes,
          "location":location,
          "companyId":this.companyId
        }
      }
      else{
        obj={
          "assetId":this.assetId,
          "status":"Checked In",
          "date":this.datePipe.transform(today,'yyyy-MM-dd'),
          "employee":employee,
          "notes":notes,
          "location":location,
          "companyId":this.companyId
        }
      }
      console.log(obj)
      this.assetPreviewService.addCheckInOut(obj).subscribe((data)=>{
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
    }, 50000); // Hide the alert after 5 seconds (adjust as needed)
  }

  generatePdf(elementId: string, fileName: string) {
    const element:any = document.getElementById(elementId);

    html2canvas(element, {
      scale: 2,  // Increase scale to improve quality
      backgroundColor: null,  // Ensures no background color is added
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = this.qrSize * 100;
      const pdfHeight = this.qrSize * 100;
      const pdf = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName + '.pdf');
    });
    
  }
  downloadQR(){
    this.generatePdf('myqr',this.assetDetails.name+"_"+this.assetDetails.serialNumber+"_QR");
  }

    download(id:string,name:string){
      this.assetPreviewService.download(id).subscribe((data:any)=>{
  
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
    itemDeleteDetails(id:string){
      this.deleteFileId=id;
  
    }
    deleteFile(){
      this.assetPreviewService.deleteFile(this.deleteFileId).subscribe((data)=>{
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
}
