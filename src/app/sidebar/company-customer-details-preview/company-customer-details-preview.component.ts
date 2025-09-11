import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyCustomer } from './company-cutomer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExtraFieldName } from './extraFieldName';
import { ExtraField } from './extraField';
import { MandatoryFields } from './mandatoryFields';
import { ShowFieldsData } from '../assets/showFieldsData';
import { CompanyCustomerFile } from '../company-customer/companyCustomerFile';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyCustomerDetailsPreviewService } from './company-customer-details-preview.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { Assets } from './assets';
import { WorkOrder } from './workorder';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-company-customer-details-preview',
  templateUrl: './company-customer-details-preview.component.html',
  styleUrls: ['./company-customer-details-preview.component.css']
})
export class CompanyCustomerDetailsPreviewComponent {
  companyCustomerId:any;
  @Input() id!:string;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  companyCustomer!: CompanyCustomer;
  companyCustomerUpdateForm!:FormGroup;
  currOption:number=1;
  currColor='open';
  loadingScreen=false;
  loginCustomerName:any;
  companyCustomerObject:any;
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
  email:any;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';

  currentFile!: any;
  progress!:number;
  message: any;
  fileInfos!:CompanyCustomerFile[];
  deleteFileId!: string;

  customerAssetList!:Assets[]
  customerWorkOrderList!:WorkOrder[]
  userRoleDetails: any;
  userRole!: any ;

  pageSize:number=5;
  totalLength:number=100;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  paginationResult!:PaginationResult;
  assets!:any[];
  hoverOverSidebar=true;
  username:any;
  current=1
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
  }
  // {
  //   number:4,
  //   name:'Preventive Maintainance',
  //   icon:'bi bi-speedometer2'
  // },
  // {
  //   number:5,
  //    name:'Work Order',
  //   icon:'bi bi-bookshelf'
  // }
  // {
  //   number:6,
  //   name:'People',
  //   icon:'bi bi-people-fill'
  // }
  
];

  constructor(private formBuilder:FormBuilder,private activeRoute:ActivatedRoute,private router:Router,private companyCustomerDetailsPreviewService:CompanyCustomerDetailsPreviewService,private auth:AuthService ){}

  ngOnInit(){
    this.username= localStorage.getItem('name')
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.companyCustomer=new CompanyCustomer;


    this.companyId=localStorage.getItem('companyId');
    this.email=localStorage.getItem('user');
    this.loginCustomerName=localStorage.getItem('name');
    this.userRole=localStorage.getItem('role');
    this.activeRoute.paramMap.subscribe((data)=>{
      this.companyCustomerId=data.get('id');
      
      console.log("workOrderId-------------->"+this.companyCustomerId)
    });
    this.companyCustomerDetailsPreviewService.getCompanyCustomer(this.companyCustomerId).subscribe((data)=>{
      this.companyCustomer=data as CompanyCustomer;

      console.log(data);
     

      this.companyCustomerDetailsPreviewService.getAssetByCustomerId(this.companyCustomerId,this.pageIndex).subscribe((data)=>{
        this.paginationResult=data;
        this.totalLength=this.paginationResult.totalRecords;
        this.assets=this.paginationResult.data;
        this.customerAssetList=[];
        const jsonList:string[]=this.paginationResult.data;
    jsonList.forEach((workorder)=>{
      const jsonObject:any = JSON.parse(workorder);
      console.log(typeof(jsonObject))
      this.customerAssetList.push(jsonObject)
    });
        console.log(this.customerAssetList)
      },
      (err)=>{
        console.log(err);
      });


      // this.companyCustomerDetailsPreviewService.getWorkOrderByCustomerId(this.companyCustomerId).subscribe((data)=>{
      //   this.customerWorkOrderList=data;
      //   console.log(this.customerWorkOrderList)
      // },
      // (err)=>{
      //   console.log(err);
      // })
    });

    this.companyCustomerDetailsPreviewService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
      this.userRoleDetails=data;
      console.log(this.userRoleDetails);
    },
    err=>{
      console.log(err);
    });


    this.companyCustomerDetailsPreviewService.getExtraFields(this.companyCustomerId).subscribe((data)=>{
  
      this.extraFields=data;
      console.log("extra Fieldsss"+this.extraFields);
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
      
    },
    (err)=>{
      console.log(err);
    })
    this.companyCustomerDetailsPreviewService.getCompanyCustomerFile(this.companyCustomerId).subscribe((data)=>{
      //console.log("total",data);
      this.fileInfos=data;
      console.log("total",this.fileInfos);
    },
    (err)=>{
      console.log(err);
    })

    this.companyCustomerDetailsPreviewService.getExtraFieldName(this.companyId).subscribe((data)=>{
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
    this.companyCustomerDetailsPreviewService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.companyCustomerDetailsPreviewService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
       console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
    },
    (err)=>{
      console.log(err);
    })

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(this.pageIndex);

   
    this.companyCustomerDetailsPreviewService.getAssetByCustomerId(this.companyCustomerId,this.pageIndex).subscribe((data)=>{
      this.paginationResult=data;
      this.totalLength=this.paginationResult.totalRecords;
      this.assets=this.paginationResult.data;
      this.customerAssetList=[];
      const jsonList:string[]=this.paginationResult.data;
  jsonList.forEach((workorder)=>{
    const jsonObject:any = JSON.parse(workorder);
    console.log(typeof(jsonObject))
    this.customerAssetList.push(jsonObject)
  });
      console.log(this.customerAssetList)
    },
    (err)=>{
      console.log(err);
    });
   

    
  }

  onCheck(){
   
    // this.mandatoryFieldsMap.forEach((val,key)=>{
    //   if(this.assetDetails.get(key))
    // })
    
    if(this.mandatoryFieldsMap.get("name")==true){
      if(this.companyCustomer.name==''||this.companyCustomer.name==null){
       
       
        this.triggerAlert("Fill Mandatory field 'name'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("category")==true){
      if(this.companyCustomer.category==''||this.companyCustomer.category==null){
        this.triggerAlert("Fill Mandatory field 'category'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("status")==true){
      if(this.companyCustomer.status==''||this.companyCustomer.status==null){
        this.triggerAlert("Fill Mandatory field 'Status'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("phone")==true){
      if(this.companyCustomer.phone==''||this.companyCustomer.phone==null){
        this.triggerAlert("Fill Mandatory field 'phone'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("email")==true){
      if(this.companyCustomer.email==''||this.companyCustomer.email==null){
        this.triggerAlert("Fill Mandatory field 'email'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("address")==true){
      if(this.companyCustomer.address==''||this.companyCustomer.address==null){
        this.triggerAlert("Fill Mandatory field 'Street'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("apartment")==true){
      if(this.companyCustomer.apartment==''||this.companyCustomer.apartment==null){
        this.triggerAlert("Fill Mandatory field 'apartment'","danger")
        return ;
      }
    }

    if(this.mandatoryFieldsMap.get("city")==true){
      if(this.companyCustomer.city==''||this.companyCustomer.city==null){
        this.triggerAlert("Fill Mandatory field 'city'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("state")==true){
      if(this.companyCustomer.state==''||this.companyCustomer.state==null){
        this.triggerAlert("Fill Mandatory field 'state'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("zipCode")==true){
      if(this.companyCustomer.apartment==''||this.companyCustomer.apartment==null){
        this.triggerAlert("Fill Mandatory field 'zipCode'","danger")
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
          "companyCustomerId":this.companyCustomerId,
          "type":x.type,
          "companyId":x.companyId
        }
      }
      else{
        obj={
         
                
                "name":x.name,
                "value":this.extraFieldValue[ind],
                "companyCustomerId":this.companyCustomerId,
                "type":x.type,
                "companyId":x.companyId
              }
      }
        
        if(x.type=='checkbox'){
          console.log(this.extraFieldValue[ind])
        }
        this.companyCustomerDetailsPreviewService.addExtraFields(obj).subscribe((data)=>{
          console.log("added extra fields");
        },
        (err)=>{
          console.log(err);
           if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
        })
        })
  
      // console.log(this.assetDetails);
      this.companyCustomerDetailsPreviewService.updateCompanyCustomer(this.companyCustomer).subscribe((data)=>{
        console.log("Data Updated");
        this.loading();
      },
      (err)=>{
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
      })
  
  
      
    
      // this.triggerAlert("Successfully Updated","success");
      this.router.navigate(['/customer/'+this.companyCustomer.id])
      
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
    if (this.companyCustomer.extraFields && typeof this.companyCustomer.extraFields.get === 'function') {
      const field = this.companyCustomer.extraFields.get(key);
      if (field) {
          field.value = value;
      }
  }
  }

  onClick(option:number){
    console.log(option)
    this.currOption=option;
  }
  fileUpload(event:any){
    this.currentFile= event.target.files[0];
    
    

   
 

    
    
    this.progress=0;
      this.companyCustomerDetailsPreviewService.addCompanyCustomerFile(this.currentFile,this.companyCustomerId).subscribe(event => {
        
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
  itemDeleteDetails(id:string){
    this.deleteFileId=id;

  }
  download(id:string,name:string){
    this.companyCustomerDetailsPreviewService.download(id).subscribe((data:any)=>{

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
       if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
    })
  }
  deleteFile(){
    this.companyCustomerDetailsPreviewService.deleteFile(this.deleteFileId).subscribe((data)=>{
      console.log(data);
      this.triggerAlert("File Deleted Successfully","success")
    },
    (err)=>{
      console.log(err);
       if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
    },
    ()=>{
      this.ngOnInit();
      this.deleteFileId='';
    })
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
  update(id:string){
    console.log("companyCustomerComponent"+id)
    // this.sideBarCurr=id
    // this.dashboardService.callComponentMethod(id)
    if(id!='5'){
    localStorage.setItem('currOption',id);
    this.router.navigate(['/dashboard']);
    }
    // this.dashboardComponent.current=id;
  }
}
