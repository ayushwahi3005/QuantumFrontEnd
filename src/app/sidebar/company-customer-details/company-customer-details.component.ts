import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyCustomerDetailsService } from './company-customer-details.service';
import { CompanyCustomer } from './company-cutomer';
import { ExtraFieldName } from './extraFieldName';
import { ExtraField } from './extraField';
import { MandatoryFields } from './mandatoryFields';
import { ShowFieldsData } from '../assets/showFieldsData';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { CompanyCustomerFile } from '../company-customer/companyCustomerFile';
import * as saveAs from 'file-saver';
import { Assets } from './assets';
import { WorkOrder } from './workorder';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
import { AuthService } from 'src/app/shared/auth.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { CategoryName } from './categoryName';

@Component({
  selector: 'app-company-customer-details',
  templateUrl: './company-customer-details.component.html',
  styleUrls: ['./company-customer-details.component.css']
})
export class CompanyCustomerDetailsComponent {
  hoverOverSidebar=true;
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
  companyCustomerCategoryList!:CategoryName[];
  currentFile!: any;
  progress!:number;
  message: any;
  fileInfos!:CompanyCustomerFile[];
  deleteFileId!: string;
  customerAssetList:any=[]
  customerWorkOrderList!:WorkOrder[]
  userRoleDetails: any;
  userRole: any;
  pageSize:number=5;
  totalLength:number=100;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  paginationResult!:PaginationResult;
  assets!:any[];
  username:any;
  sideBarCurr=1
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

  constructor(private activeRoute:ActivatedRoute,private router:Router,private companyCustomerDetailsService:CompanyCustomerDetailsService,private auth:AuthService,private dashboardService:DashboardService ){}

  ngOnInit(){
    console.log("Detail Worinfg")
    this.username= localStorage.getItem('name')
    console.log("Username"+this.username)
    this.extraFields=[]
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
    this.companyCustomerDetailsService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
      this.userRoleDetails=data;
      console.log(this.userRoleDetails);
    },
    err=>{
      console.log(err);
    });
    this.companyCustomerDetailsService.getCompanyCustomer(this.companyCustomerId).subscribe((data)=>{
      this.companyCustomer=data as CompanyCustomer;
      this.companyCustomerDetailsService.getAssetByCustomerId(this.companyCustomerId,this.pageIndex).subscribe((data)=>{
        this.paginationResult=data;
        this.totalLength=this.paginationResult.totalRecords;
        this.assets=this.paginationResult.data;
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
      
 
    this.companyCustomerDetailsService.getWorkOrderByCustomerId(this.companyCustomerId).subscribe((data)=>{
        this.customerWorkOrderList=data;
        console.log(this.customerWorkOrderList)
      },
      (err)=>{
        console.log(err);
      })
    
    },
    (err)=>{
      console.log(err);
    });
    this.companyCustomerDetailsService.getCustomerCategory(this.companyId).subscribe((data)=>{
      this.companyCustomerCategoryList=data;
      console.log("companyCustomerCategoryList"+this.companyCustomerCategoryList)
    },
    (err)=>{
      console.log(err)
    })
    this.companyCustomerDetailsService.getExtraFields(this.companyCustomerId).subscribe((data)=>{
  
      this.extraFields=data;
      console.log("extra Fieldsss"+this.extraFields);
      this.extraFields?.sort((a,b)=>(a.name<b.name)?-1:1)
      if(this.extraFields!=null){
        this.extraFields.forEach((x)=>{
          this.extraFieldString.push(x.name);
          this.extraFieldMap.set(x.name,true);
        
        })
        console.log("140 line extrafields"+this.extraFieldValue)
      }
      else{
        console.log("empty ExtraField",data)
      }
      
    },
    (err)=>{
      console.log(err);
    })
    this.companyCustomerDetailsService.getCompanyCustomerFile(this.companyCustomerId).subscribe((data)=>{
      //console.log("total",data);
      this.fileInfos=data;
      console.log("total",this.fileInfos);
    },
    (err)=>{
      console.log(err);
    })

    this.companyCustomerDetailsService.getExtraFieldName(this.companyId).subscribe((data)=>{
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
    this.companyCustomerDetailsService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      //console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.companyCustomerDetailsService.getAllShowFields(this.companyId).subscribe((data)=>{
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
  
    
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(this.pageIndex);

   
    this.companyCustomerDetailsService.getAssetByCustomerId(this.companyCustomerId,this.pageIndex).subscribe((data)=>{
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
   
    // else{
    //   const type=this.extraFieldNameMap?.get(this.sortedBy)?.type;
    //   this.assetService.getSortedAssetList(this.companyId,this.sortedBy,type,this.pageIndex,this.pageSize).subscribe((data)=>{
    //     this.loadingScreen=true;
    //     this.assetListWithExtraFields=[]
    //   this.paginationResult=data;
    //   this.totalLength=this.paginationResult.totalRecords;
    //   this.assets=this.paginationResult.data;
    //   const jsonList:string[]=this.paginationResult.data;
    //     jsonList.forEach((workorder)=>{
    //       const jsonObject:any = JSON.parse(workorder);
          
    //       this.assetListWithExtraFields.push(jsonObject)
    //     })
        
    //   },
    //   (err)=>{
    //     console.log(err);
    //   },()=>{
    //     this.loadingScreen=false;
    //   })
    // }
    
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
    console.log("extraField-->",this.extraFields)
    if (Array.isArray(this.extraFields)) {
      this.extraFields.forEach((x) => {
        if ((x.value === '' || x.value == null) &&
            this.showFieldsMap.get(x.name) === true &&
            this.mandatoryFieldsMap.get(x.name) === true) {
          this.triggerAlert("Fill Mandatory field '" + this.toCamelCase(x.name) + "' in Custom", "danger");
          mandatoryFlag = 0;
        }
      });
    }
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
  if(this.companyCustomer.status=="inActive"){
    console.log("prompt")
    if(confirm("Are you sure to make it inactive. All assets and workOrders associated with it will be changed to inactive ")){
      this.companyCustomerDetailsService.closeWorkOrders(this.companyCustomer.id).subscribe((data)=>{
        this.loadingScreen=true;
      },
    err=>{
      console.log(err);
      this.loadingScreen=false;
    },
    ()=>{
      this.companyCustomerDetailsService.inActiveAssets(this.companyCustomer.id).subscribe((data)=>{

      },
      err=>{
        console.log(err);
        this.loadingScreen=false;
      },
    ()=>{
      if(this.userRoleDetails?.customer=='full'||this.userRoleDetails?.customer=="edit"||this.userRole=="ADMIN"){
      this.onSave();

      }
      else{
        this.loadingScreen=false;
      }
    })
    })
     

    }
    
   
  }
  else{
    this.loadingScreen=true;
    if(this.userRoleDetails?.customer=='full'||this.userRoleDetails?.customer=="edit"||this.userRole=="ADMIN"){
    this.onSave();
    }
    else{
      this.loadingScreen=false;
    }
  }

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
        this.companyCustomerDetailsService.addExtraFields(obj).subscribe((data)=>{
          console.log("added extra fields");
        },
        (err)=>{
          console.log(err);
          this.loadingScreen=false;
        })
        })
  
      // console.log(this.assetDetails);
      this.companyCustomerDetailsService.updateCompanyCustomer(this.companyCustomer).subscribe((data)=>{
        console.log("Data Updated");
        // this.loading();
      },
      (err)=>{
        console.log(err);
        this.loadingScreen=false;
      })
  
  
      
    
      // this.triggerAlert("Successfully Updated","success");
      this.loadingScreen=false;
      this.router.navigate(['/dashboard'])

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
    }, 50000); // Hide the alert after 5 seconds (adjust as needed)
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
  fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
    let fileName=event.target.files[0].name;
    console.log("Filename"+fileName);
    

   
 

    
    let base64String:string;
    this.progress=0;
    if(this.currentFile){
    this.fileToBase64(this.currentFile).then(
      (base64: string) => {
        console.log('Base64 string:', base64);
        base64String=base64;
        this.companyCustomerDetailsService.addCompanyCustomerFile(this.currentFile,this.companyCustomerId).subscribe(event => {
          // this.companyCustomerDetailsService.addCompanyCustomerFile(this.currentFile,this.companyCustomerId).subscribe(event => {
        
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
        // You can now use the base64 string for further processing
      },
      error => {
        console.error('Error converting file to base64:', error);
      }
    );
  }
      // this.companyCustomerDetailsService.addCompanyCustomerFile(base64String,this.companyCustomerId).subscribe(event => {
        
      //   if (event.type === HttpEventType.UploadProgress) {
          
      //     this.progress = Math.round(100 * event.loaded / event.total);
      //   } else if (event instanceof HttpResponse) {
          
      //     this.message = event.body.message;
         
      //     // this.currentFile
      //     // this.fileInfos = this.assetDetailService.getAssetFile(this.assetId);
          
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
  itemDeleteDetails(id:string){
    this.deleteFileId=id;

  }
  // download(id:string,name:string){
  //   this.companyCustomerDetailsService.download(id).subscribe((data:any)=>{

  //     console.log(name);
    
  //     const blob:any=new Blob([data],{type:'text/json; charset=utf-8'});
  //     console.log(blob);
  //     const link=document.createElement("a");
  //     const url=window.URL.createObjectURL(blob);
  //     // link.download=name;
  //     // link.click();
  //     // window.URL.revokeObjectURL(link.href);
  //     // link.remove();
  //     saveAs(blob, name);
    
  //   },
  //   (err)=>{
  //     console.log(err);
  //   })
  // }
  download(id:string,name:string){
    this.companyCustomerDetailsService.download(id).subscribe((data:any)=>{

      console.log(name);
    
      const blob:any=new Blob([data],{type:'text/json; charset=utf-8'});
      console.log(blob);
      console.log(data);
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
    this.companyCustomerDetailsService.deleteFile(this.deleteFileId).subscribe((data)=>{
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
  deleteCustomer(){
    console.log("length "+this.customerWorkOrderList?.length+" "+this.customerAssetList?.length)
    if(this.customerWorkOrderList?.length==0||this.customerWorkOrderList?.length==undefined&&this.customerAssetList?.length==0){
      this.companyCustomerDetailsService.deleteCompanyCustomer(this.companyCustomerId).subscribe((data)=>{
        console.log("Deleted Customer");
        // this.triggerAlert("Customer Deleted Successfully","success");
        this.router.navigate(['/dashboard']);
      },
    (err)=>{
      console.log(err);
    })
  }
  else{
    this.triggerAlert("Cannot Delete User. Assets and WorkOrders are there related to this customer","danger");
  }
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
