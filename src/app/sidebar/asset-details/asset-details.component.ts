import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
import { User } from './user';
import { QR } from './qr';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { CompanyCustomer } from './company-cutomer';
import { CategoryName } from 'src/app/setting/asset-category/categoryName';
import { nonWhiteSpace } from 'html2canvas/dist/types/css/syntax/parser';
import { InspectionInstance } from './inspectionInstance';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent {

  @ViewChild('dropdownContainer', { static: false }) dropdownContainer!: ElementRef;
  @Input() assetDetails!:Assets;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  @ViewChild('notes') notesRef!: ElementRef;
  @ViewChild('location') locationRef!: ElementRef;
  username:any;
  assetId:any='';
  img:string=''
  newObjName:string='';
  newObjVal:string='';
  currOption:number=1;
  extraFields!:ExtraFields[];
  checkInOut:CheckInOut[]=[];
  assetCategoryList!:CategoryName[];
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

  technicalUserList!:User[];
  qr!:QR;
  qrData!:string;
  qrSize!:number;

  companyCustomerList!:CompanyCustomer[];
  companyCustomerArr!:string[];
  selectedCompanyCustomer!:string;
  selectedCustomerId!:string;

  changedCustomerName!:string;
  changedCustomerId!:string;
  loading=false;
  userRole:any;
  userRoleDetails:any;
  selectedEmpName:any;
  allInspection:any=[]
  allInspectionInstance:any=[]
  currentInspection:any;
  checkBoxColor="primary"
  selectedInspectionInstance:any;
  inspectionInstance: InspectionInstance = {
    assetId: '',
    companyId: '',
    assetCategoryInspectionId: '',
    assetCategoryInspectionName: '',
    actionPerformedBy:'',
    notes:'',
    date:'',
    stepValues: []
  };
  filteredLocationOrBinList: any=[];
  locationWithBins:any=[];
  dropdownOptions:any = [];
  dropdownOpenLocation = false;
    selectedLocation: any = null;
    selectedLocationId:any=null;
    loggedUser!:User;
  // username:any;
  constructor(private activatedRoute:ActivatedRoute,private assetDetailService:AssetDetailsService,private assetComponent:AssetsComponent,private datePipe: DatePipe,private router:Router){}
  ngOnInit(){
    this.loggedUser=new User();
    this.selectedCustomerId=this.assetDetails.customerId;
    this.selectedLocation= this.assetDetails.location;

    console.log(this.selectedEmpName)
    console.log("----//////------------>>>>>>>>"+this.assetDetails.customerId)
    console.log(this.assetDetails);

    this.currentInspection=null;
    this.username= localStorage.getItem('name')
    this.selectedEmpName=this.username;
    this.message='';
    this.progress=20;
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.qrSize=3;
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.activatedRoute.paramMap.subscribe((data)=>{
      console.log(this.assetDetails)
      this.assetId=data.get('id');
      this.assetId=this.assetDetails.id
      console.log("assetid",this.assetDetails.id);
   
      
      this.img=this.assetDetails.image;
    });
    this.userRole=localStorage.getItem('role');
    this.assetDetailService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
      console.log("ROLE")
      console.log( this.userRole)
      this.userRoleDetails=data;
      console.log(this.userRoleDetails);
    },
    err=>{
      console.log(err);
    });
    this.assetDetailService.getAllAssetInspectionInstance(this.companyId).subscribe((data)=>{
      this.allInspectionInstance=data;
      console.log(this.allInspectionInstance)
    },
    (err)=>{
      console.log(err);
    })
    this.assetDetailService.getCompanyCustomerList(this.companyId).subscribe((data)=>{
      this.companyCustomerList=data;
      this.companyCustomerList.forEach((x)=>{
        console.log(x.name+" "+(x.id===this.assetDetails.customerId))
      })
      console.log(this.companyCustomerList)
    },
    (err)=>{
      console.log(err);
    })

    //inspection
    this.assetDetailService.getAllAssetInspection(this.companyId).subscribe((data)=>{
      this.allInspection=data;
      console.log(this.allInspection)
    })
   
    this.assetDetailService.getAssetCategory(this.companyId).subscribe((data)=>{
      this.assetCategoryList=data;
    },
    (err)=>{
      console.log(err)
    })
    // this.assetDetailService.getWorkOrders(this.assetId).subscribe((data)=>{
    //   this.workOrderList=data;
    //   console.log("workorders",this.workOrderList)
    // },(err)=>{
    //   console.log(err);
    // });
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
      this.extraFields?.sort((a,b)=>(a.name<b.name)?-1:1)
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
      console.log(this.checkInOut)
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
    this.assetDetailService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      // console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
    })


    this.assetDetailService.getTechnicalUsers(this.companyId).subscribe((data)=>{
      console.log("Userss=====>")
      this.technicalUserList=data;
      
      // this.loggedUser.firstName=this.username.split(' ')[0];
      // this.loggedUser.lastName=this.username.split(' ')[1];


      // this.technicalUserList.push(this.loggedUser);
      
      console.log(this.technicalUserList);
    }
    ,(err)=>{
      console.log(err);
    })


    this.assetDetailService.getQR(this.companyId).subscribe((data)=>{
      this.qr=data;
      
    },
    (err)=>{
      console.log(err);
    })

    this.qrData="assets/id?"+this.assetDetails.id;

    this.assetDetailService.getAllLocationWithBin(this.companyId).subscribe((data)=>{
      this.locationWithBins=data;
      this.filteredLocationOrBinList = this.locationWithBins;

      this.locationWithBins.forEach((loc:any) => {
        if (loc.bins && loc.bins.length > 0) {
          loc.bins.forEach((bin:any) => {
            this.dropdownOptions.push({
              label: `${loc.name} → ${bin.binNumber}`,
              value: `bin:${bin.id}`
            });
          });
        } else {
          this.dropdownOptions.push({
            label: loc.name,
            value: `location:${loc.id}`
          });
        }
      });
      console.log(this.dropdownOptions)
    },
    (err)=>{
      console.log(err);
    });

  }

  @HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent) {
  // console.log("clicked outside")
  const clickedInside = this.dropdownContainer.nativeElement.contains(event.target);
  if (!clickedInside) {
    // this.dropdownOpenLocation = false; // ✅ Close the dropdown
    this.dropdownOpenLocation=false;
  }
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
      this.triggerAlert(err.error.errorMessage,"danger");
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
  // this.onSave()
  if(this.userRoleDetails?.customer=='full'||this.userRoleDetails?.customer=="edit"||this.userRole=="ADMIN"){
    this.onSave();

    }
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
        this.triggerAlert(err.error.errorMessage,"danger");
      })
      })

    console.log(this.assetDetails);
    this.selectedCompanyCustomer=this.assetDetails.customer
    console.log(this.selectedCompanyCustomer);
    if(this.changedCustomerName!=null&& this.changedCustomerId!=null){
      
      this.assetDetails.customer=this.changedCustomerName
      this.assetDetails.customerId=this.changedCustomerId;
      }
      
      console.log(this.assetDetails);
      this.assetDetails.location=this.selectedLocationId;
    this.assetDetailService.updateAsset(this.assetDetails).subscribe((data)=>{
      console.log(data);
      this.triggerAlert("Successfully Updated","success");
      this.router.navigate(['/assets/'+this.assetDetails.id])
    },
    (err)=>{
      console.log(err.error.errorMessage);
      this.triggerAlert(err.error.errorMessage,"danger");
    })


    
  
   
    
  }
  
  removeTheImage(){
    console.log("new click remove"+this.assetDetails.id)

    this.assetDetailService.removeImage(this.assetDetails.id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
    }
    ,()=>{
     console.log(this.img);
     this.getAsset(this.assetDetails.id);
     this.assetComponent.ngOnInit();
      
      
    })
  }
  fileUpload(event:any){
    this.currentFile= event.target.files[0];
    
    

    this.assetDetailService.addAssetFile(this.currentFile, this.assetId).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          // Progress event
          if (event.total) {
            this.progress = Math.round((100 * event.loaded) / event.total);
            console.log(`Progress: ${this.progress}%`);
          }
        } else if (event.type === HttpEventType.Response) {
          // Response event
          console.log('Upload Complete:', event.body);
          this.progress = 100;
          setTimeout(() => {
            alert('Successfully uploaded');
            this.currentFile = null;
            this.ngOnInit();
          }, 1500);
        }
      },
      err => {
        this.currentFile= null;
        this.progress = 0;
        this.message = 'Could not upload the file!';
        console.log(this.message);
        this.triggerAlert(err.error.errorMessage,"danger");
      }
    );
    
 

    
    
    
      // this.assetDetailService.addAssetFile(this.currentFile,this.assetId).subscribe(event => {
      //   console.log(event.status)
      //   if (event.status === 'progress') {
      //     this.progress = event.message;
      //     console.log(`Progress: ${this.progress}%`);
      //   } else if (event.status === 'done') {
      //     console.log('Upload Complete:', event.message);
      //     this.progress = 100;
      //     setTimeout(() => {
      //       alert('Successfully uploaded');
      //       this.currentFile = null;
      //       this.ngOnInit();
      //     }, 1500);
      //   }
      // },
      // err => {
      //   this.progress = 0;
      //   this.message = 'Could not upload the file!';
      //   console.log(this.message);
       
      // },()=>{
      //   if(this.progress==100){
      //     setTimeout(()=>{
      //       alert("successfully uploaded");
      //       this.currentFile=null;
      //     this.ngOnInit();
      //     },1500);
          
      //   }
      // })
     
    
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
      this.triggerAlert(err.error.errorMessage,"danger");
    })
  }
  deleteFile(){
    this.assetDetailService.deleteFile(this.deleteFileId).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
      this.triggerAlert(err.error.errorMessage,"danger");
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
        this.triggerAlert(err.error.errorMessage,"danger");
        
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
  onTechnicianChange(data:any){
    console.log(data.target.value)
    this.selectedEmpName = data.target.value;
  }
  handleSubmit(employee: any, notes: string, location: string) {
    console.log("emp=> "+this.selectedEmpName)
    console.log("emp=> "+employee)
    if(this.selectedEmpName==null||this.selectedEmpName==''){
      this.CheckInOutSubmit(employee, notes, location);
    }
    else{
      this.CheckInOutSubmit(this.selectedEmpName, notes, location);
    }
   
   
    if (employee) employee = '';
    this.selectedEmpName=this.username;
    if (notes) notes = '';
    if (location) location = '';
     this.notesRef.nativeElement.value = '';
    this.locationRef.nativeElement.value = '';
  }
  
  CheckInOutSubmit(employee:any,notes:string,location:string){
    console.log(employee+ " "+notes)
    if(employee==null&&this.userRole.toLowerCase()!='admin'){
      
      employee=this.username
    }
    let obj={};
    var today=new Date();
    if(employee==null||employee==''||notes==null||notes==''){
      // alert("Fields are Empty");
      this.triggerAlert("Check In/Out Fields are Empty","warning");
    }
    else{
      if(this.userRole.toLowerCase()!='admin'){
        if(localStorage.getItem('name')!=null){
          employee=localStorage.getItem('name');
        }
        
      }
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
      this.assetDetailService.addCheckInOut(obj).subscribe((data)=>{
        console.log(data);

      },
      (err)=>{
        console.log(err);
        this.triggerAlert(err.error.errorMessage,"danger");
  
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
      this.triggerAlert(err.error.errorMessage,"danger");
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
  customerChange(event:any) {
    console.log("changed->"+event.target.value)
    let myData:string=event.target.value;
    if(myData!=null){
      this.companyCustomerArr=myData.split(',');
      this.changedCustomerName=this.companyCustomerArr[0];
      this.changedCustomerId=this.companyCustomerArr[1];
      }
    }
    preview(){
      console.log("clicked")
      this.router.navigate(['/assets/'+this.assetId])
    }

    inspectionChanged(){
      console.log(this.currentInspection)
      console.log(this.assetId)
      
      this.inspectionInstance.assetId = this.assetId;
      this.inspectionInstance.companyId = this.companyId;
      this.inspectionInstance.assetCategoryInspectionId = this.currentInspection.id;
      this.inspectionInstance.assetCategoryInspectionName = this.currentInspection.name;

      let steps: any[] = [];

      this.currentInspection.steps.forEach((step: any,ind:any) => {
            let obj: any = {
              name: step.name,
              inspectionStepId: ind,
              value: step.type=='CHECKBOX'?false:'',
              type:step.type
            };
            steps.push(obj);
          });

      this.inspectionInstance.stepValues = steps;
    }
    saveInpectionValue(){
      console.log(this.inspectionInstance)
      this.inspectionInstance.actionPerformedBy=this.username;
      const currDateTime=new Date();

      this.inspectionInstance.date=currDateTime.toLocaleString();
      console.log(this.inspectionInstance)
      this.assetDetailService.addAssetInspection(this.inspectionInstance).subscribe((data)=>{
        console.log("Inspection Saved"+data);
        this.triggerAlert("Inspection saved sucessfully","success");
      },
      (err)=>{
        console.log(err);
        this.triggerAlert(err.error.errorMessage,"danger");
      },
      ()=>{
        this.ngOnInit();
      })
    }
    handleStepChange(event: any, index: number, type: string): void {
      if (!this.inspectionInstance.stepValues[index]) return;
      console.log(type)
      if (type === 'checkbox') {
        // For checkbox, use `event.target.checked`
        console.log(event.target.checked)
        this.inspectionInstance.stepValues[index].value = event.target.checked ? 'checked' : '';
      } else {
        // For text, number, etc., use `event.target.value`
        this.inspectionInstance.stepValues[index].value = event.target.value;
      }
    }
    handleStepCheckox(isChecked:any, index: number, type: string){
        
        this.inspectionInstance.stepValues[index].value = isChecked
     
    }
    addNote(event:any){
      this.inspectionInstance.notes=event.target.value;
    }
    selectedInspectionInstanceFunc(data:InspectionInstance){
      console.log(data)
      this.selectedInspectionInstance=data;
      this.inspectionInstance=data;
      this.inspectionInstance.assetId=this.assetId;
      this.inspectionInstance.companyId=this.companyId;
      this.inspectionInstance.actionPerformedBy=this.username;

      this.selectedInspectionInstance.stepValues
      ?.forEach((step: { type: string; value: string | boolean; }) => {
   
        if (step.type === 'CHECKBOX') {
          step.value = step.value === 'true'?true:false; // convert to boolean
        }
      });
      console.log(this.selectedInspectionInstance)

    }
    ParseInt(val:string):number{
      return parseInt(val);
    }
    updateInspectionInstance(){
      console.log(this.selectedInspectionInstance)
      this.assetDetailService.updateAssetInspection(this.selectedInspectionInstance).subscribe((data)=>{
        console.log("Updated Inspection"+data);
        this.triggerAlert("Inspection updated sucessfully","success");
      },
      (err)=>{
        console.log(err);
        this.triggerAlert(err.error.errorMessage,"danger");
      },
      ()=>{
        this.ngOnInit();
      })
    }

    
    toggleDropdownLocation() {
      console.log(this.filteredLocationOrBinList)
      this.dropdownOpenLocation = !this.dropdownOpenLocation;
    }
  
    selectLocationOrBin(locationOrBinId:any,locationOrBin: any) {
      console.log(locationOrBin)
      this.selectedLocation = locationOrBin;
      this.selectedLocationId = locationOrBinId;
      console.log(this.selectedLocationId)
      // this.selectedCustomerId=customer.companyCustomerId;
      this.dropdownOpenLocation = false;
    }
    // selectLocationOrBinId(locationOrBinId: any) {
    //   // console.log(locationOrBinId)
    //   this.selectedLocationId = locationOrBinId;
    //   // this.selectedCustomerId=customer.companyCustomerId;
    //   this.dropdownOpenLocation = false;
    // }
    filterLocations(event: Event) {
      const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
      console.log("searchValue"+searchValue)
      this.filteredLocationOrBinList = this.locationWithBins.filter((loc: any) => {
        const locationMatch = loc.name?.toLowerCase().includes(searchValue);
      
        const binMatch = loc.bins?.some((bin: any) =>
          bin.binNumber?.toLowerCase().includes(searchValue)
        );
      
        return locationMatch || binMatch;
      });
      
    }
    
}

