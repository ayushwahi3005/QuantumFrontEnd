import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyCustomerService } from './company-customer.service';
import { CompanyCustomer } from './company-cutomer';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ExtraFieldName } from './extraFieldName';
import { RoleAndPermission } from './RoleAndPermission';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { CategoryName } from './categoryName';

@Component({
  selector: 'app-company-customer',
  templateUrl: './company-customer.component.html',
  styleUrls: ['./company-customer.component.css']
})
export class CompanyCustomerComponent {
  @ViewChild('closeBox') closeBox: ElementRef | undefined ;
  companyCustomerForm!:FormGroup;
  filterForm!:FormGroup;
  companyCustomerlist!:CompanyCustomer[];
  companyCustomerCategoryList!:CategoryName[]
  detailModule!:Boolean;
  detailId!:String;
  email:any;
  companyId:any;
  priority!:string;
  todayDate!:Date;
  editVisibility:boolean=false;
  editButtonId:number=-1;
  detailedWorkOrder=false;
  selectedWorkOrder!:string;
  loadingScreen=false;
  searchData!:string;
  searchDataBy!:string;
  sortedBy!:string;
  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  extraFieldName!:ExtraFieldName[];
  extraFieldNameMap!:Map<String,ExtraFieldName>;
  extraFieldNameList!:string[];
  selectedFilterList:any=[];

  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  searchedCompanyCustomer!:any[];
  loading:boolean=true;
 
  selectedItems = [];

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.


  userRole:any;
  checkBoxColor="primary"
  showMandatoryBasicFields!:Map<string,Boolean>;

  companyCustomerListWithExtraFields:any = [];

  userRoleDetails!: RoleAndPermission;
  myList:string[]=[];
  pageSize:number=10;
  totalLength!:number;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  paginationResult!:PaginationResult;
  companyCustomer!:any[];
  companyCustomerListWithExtraFieldsWithoutFilter=[]
  mandatoryFieldFilterList!:Map<string,Boolean>;
  appliedFilterListMap!:Map<string,string>;
  appliedFilterList!:Set<string>;
  extraFieldFilterList!:Map<String,String>;
  savedExtraColumn!:any
  selectedExtraColumsMap!:Map<string,Boolean>;
  myArray=[]
  stateList=[]
  asc:Boolean=true;
  constructor(private formBuilder:FormBuilder,private companyCustomerService:CompanyCustomerService,private dashboard:DashboardComponent){

  }

  ngOnInit():void{
    this.companyCustomerForm=this.formBuilder.group({
      name:['',Validators.required],
      companyId:[this.companyId],
      category:[''],
      status:['active'],
      phone:['',Validators.pattern('^[ 0-9\(\)\-]{14}$')],
      email:[''],
      address:[''],
      apartment:[''],
      city:[''],
      state:[''],
      zipCode:['']
  
      



    });
    
      this.pageIndex=parseInt(localStorage.getItem('customerPageInd')||'0')
      this.pageSize=parseInt(localStorage.getItem('customerPageSize')||'10')


    
   

    console.log(this.companyCustomerForm.value)
    this.loading=true;
    this.sortedBy="";
    this.searchData="";
    this.detailModule=false;
    this.appliedFilterList=new Set<string>();
    this.appliedFilterListMap=new Map<string,string>;
    this.extraFieldFilterList=new Map<String,String>();
    this.selectedExtraColumsMap=new Map<string,Boolean>;
    this.showMandatoryBasicFields=new Map<string,Boolean>();
    this.email=localStorage.getItem('user');
    this.userRole=localStorage.getItem('role');
    this.companyId=localStorage.getItem('companyId');
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();

    console.log(this.companyId);
  
    this.companyCustomerService.stateList().subscribe((data)=>{
      this.stateList=data;
      // console.log("stateList-------->"+this.stateList)
    })



    this.filterForm=this.formBuilder.group({
      companyCustomerId:[''],
      name:[''],
      customer:[''],
      phone:[''],
      address:[''],
      category:[''],
      apartment:[''],
      status:[''],
      email:[''],
      city:[''],
      state:[''],
      zipCode:[''],
      companyId:[this.companyId]
      // extraFields: this.formBuilder.array([])
     

    });
    // this.myList=['name','category','status','phone','email','address','apartment','city','state','zipCode'];
    // let intialField=['phone','address','status']
    // intialField.forEach((data)=>{
    //   this.showMandatoryBasicFields.set(data,true);
    // });
    this.savedExtraColumn=localStorage.getItem("showMandatoryBasicFieldsCustomers")
    this.myArray=JSON.parse(this.savedExtraColumn)
    this.mandatoryFieldFilterList=new Map<string,Boolean>();
    this.myList=['companyCustomerId','name','category','status','phone','email','address','phone','status'];

    this.showMandatoryBasicFields.set('email',true);
    this.showMandatoryBasicFields.set('name',true);
    console.log(this.myArray)
    this.myList.forEach((x)=>{
      if(this.myArray!=null){
      this.myArray?.forEach((ele:any)=>{
        if(x===ele){
          this.showMandatoryBasicFields.set(x,true);
        }
      })
    }
    else{
      this.showMandatoryBasicFields.set(x,true);
    }
      this.mandatoryFieldFilterList.set(x,true);
    });
    this.companyCustomerService.getCompanyCustomerCategory(this.companyId).subscribe((data)=>{
      this.companyCustomerCategoryList=data;
      console.log("Asset-Category->"+data)
    },
    (err)=>{
      console.log(err);
    })

    this.savedExtraColumn=localStorage.getItem("selectedExtraColumsCustomer")
    console.log("savedextra->"+this.savedExtraColumn)
    this.selectedExtraColums=JSON.parse(this.savedExtraColumn)
    console.log("selected columns"+this.selectedExtraColums)
    if(this.savedExtraColumn!=null){
      this.selectedExtraColums=JSON.parse(this.savedExtraColumn);
      this.selectedExtraColums.forEach((data)=>{
        this.selectedExtraColumsMap.set(data,true);
      })
    }
    console.log("selectedExtraColumsMap->"+this.selectedExtraColumsMap)
    // this.advanceFilterFunc();
    let myPageEvent=new PageEvent();
    myPageEvent.length=this.totalLength;
    myPageEvent.pageIndex=this.pageIndex
    myPageEvent.pageSize=this.pageSize;


    this.handlePageEvent(myPageEvent);
    this.companyCustomerService.getRoleAndPermission(this.companyId,this.userRole).subscribe((data)=>{
      this.userRoleDetails=data;
      console.log(this.userRoleDetails);
    },
    err=>{
      console.log(err);
    });
   
    console.log("inside"+this.companyCustomerlist)


    this.companyCustomerService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.companyCustomerService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      console.log("show----------------------->",this.showFieldsList);
      this.selectedFilterList=[]
      this.showFieldsList.forEach((x)=>{
        this.filterForm.addControl(x.name,this.formBuilder.control('',Validators.required));
        this.selectedFilterList.push(x.name);
        this.showFieldsMap.set(x.name,x.show);
      })
      
      if(this.showFieldsList!=null){
      this.showFieldsList.forEach((x)=>{
        if(x.show==true)
        this.companyCustomerForm.addControl(x.name,this.formBuilder.control(''));
        if(x.show==true){
          this.extraFieldFilterList.set(x.name,x.type);
        }
      })
      
    }
    
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.companyCustomerService.getExtraFieldName(this.companyId).subscribe((data)=>{
      
        console.log("In extra workOder")
         this.extraFieldName=data;
         var arr:string[]=[];
       this.extraFieldName.forEach((x)=>{
         this.extraFieldNameMap?.set(x.name,x);
         console.log(x.name+" "+this.showFieldsMap.get(x.name)+" "+x.type)
           if(this.showFieldsMap.get(x.name)==true){
           arr.push(x.name);
           }
         })
         
         this.extraFieldNameList=arr;
         //console.log(this.extraFieldNameList)
         
      
        
         
         
       },
       (err)=>{
         console.log(err);
       })
    })
   



   
    this.companyCustomerService.working().subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err)
    })

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    console.log(this.pageEvent)
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.log(this.pageIndex+" "+e.pageIndex);
    localStorage.setItem('customerPageInd',this.pageIndex.toString())
    localStorage.setItem('customerPageSize',this.pageSize.toString())
    this.advanceFilterFunc();

   
    
  }
  formatPhoneNumber(event: Event) {
   
    let input = (event.target as HTMLInputElement).value;


    input = input.replace(/\D/g, ''); // Remove all non-digit characters
    if (input.length > 6) {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
    } else if (input.length > 3) {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}`;
    } else if (input.length > 0) {
      input = `(${input.substring(0, 3)}`;
    }
    (event.target as HTMLInputElement).value = input;
    this.companyCustomerForm.controls['phone'].setValue(input); // Update the form control value
  }

advanceFilterFunc() {
  this.loadingScreen = true; // Start loading

  this.companyCustomerService.advanceFilter(
    this.filterForm.value, 
    this.pageIndex, 
    this.pageSize, 
    this.sortedBy, 
    this.searchData, 
    this.asc
  ).subscribe(
    (data) => {
      console.log("advanceSearch--->", data);

      // Reset customer list and populate with new data
      this.companyCustomerListWithExtraFields = [];
      this.paginationResult = data;
      if(this.paginationResult.data.length==0&&this.pageIndex!=0){
        this.pageIndex=0;
        localStorage.setItem('customerPageInd',this.pageIndex.toString());
        this.advanceFilterFunc();
      }
      this.totalLength = this.paginationResult.totalRecords;
      this.companyCustomer = this.paginationResult.data;

      const jsonList: string[] = this.paginationResult.data;
      jsonList.forEach((workorder) => {
        const jsonObject: any = JSON.parse(workorder);
        this.companyCustomerListWithExtraFields.push(jsonObject);
      });

      this.companyCustomerListWithExtraFieldsWithoutFilter = this.companyCustomerListWithExtraFields;
    },
    (err) => {
      console.log("advanceSearch failed--->", err);
      this.loadingScreen = false; 
    },
    () => {
      // Once everything is done, hide loading screen
      this.searchedCompanyCustomer = this.companyCustomer;
      this.loadingScreen = false; // Stop loading
    }
  );
}


  mandatoryFieldCheckBox(isChecked:any,item:string){
     
    if(isChecked){
      this.showMandatoryBasicFields.set(item,true);
    }
    else{
      this.showMandatoryBasicFields.set(item,false);
    }
    const myArry:any=[];
      this.showMandatoryBasicFields.forEach((val,ele)=>{
        if(val==true){
        myArry.push(ele)
        }
      })
      // console.log(JSON.stringify(Object.fromEntries(this.showMandatoryBasicFields)));
      localStorage.setItem("showMandatoryBasicFieldsCustomers",  JSON.stringify(myArry));
    console.log(item+"-"+this.showMandatoryBasicFields.get(item));
  }
  customCheckBox(isChecked:any,item:string){
    console.log(item+" "+isChecked);
    if (!this.selectedExtraColums) {
      this.selectedExtraColums = [];
    }
    if(isChecked){
      this.selectedExtraColums.push(item);
      this.selectedExtraColumsMap.set(item,true);
    }
    else{
      this.selectedExtraColums=this.selectedExtraColums.filter((data)=> data!=item);
      this.selectedExtraColumsMap?.set(item,false);
    }
    console.log(this.selectedExtraColums);
    localStorage.setItem("selectedExtraColumsCustomer",JSON.stringify(this.selectedExtraColums))
  }
  get appliedFilterListSize(): number {
    return this.appliedFilterList.size;
  }
  addCompanyCustomer(){
    
    

    let myCompanyCustomer:CompanyCustomer;
   

    this.companyCustomerForm.controls['companyId'].setValue(this.companyId);
    let extraFieldValueMap=new Map<String,string>();
      let extraFieldTypeMap=new Map<String,string>();
    this.showFieldsList?.forEach((x)=>{
      if(x.show==true){
        console.log("----------------------------------------------showList----------+"+this.companyCustomerForm.get(x.name)?.value)
      extraFieldValueMap.set(x.name,this.companyCustomerForm.get(x.name)?.value);
      extraFieldTypeMap.set(x.name,x.type);
      }
    })
    
    console.log(this.companyCustomerForm.value);
    let valid=1;
    console.log(this.mandatoryFieldsList)
    this.mandatoryFieldsList?.forEach((val)=>{
      console.log(val.name,"-============>",val.mandatory+" "+this.companyCustomerForm.get(val.name)?.value);
      if(this.showFieldsMap.get(val.name)==false){
        valid=1;
      }
      // if(this.showFieldsMap.get(val.name)==true){
      //   valid=1;
      // }
      else if((val.mandatory==true)&&( this.companyCustomerForm.get(val.name)?.value==null||this.companyCustomerForm.get(val.name)?.value=='')){
        
        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
        valid=0;
       
      }
      else if((val.mandatory==true)&&(this.showFieldsMap.get(val.name)==true) &&( this.companyCustomerForm.get(val.name)?.value==null||this.companyCustomerForm.get(val.name)?.value=='')){
        
        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
        valid=0;
       
      }
      
      
    })
    if(valid==0){
      return;
    }
  //  ==================================================
  console.log(this.companyCustomerForm.get("companyId")?.value)

  this.myList.forEach((col)=>{
    if(this.companyCustomerForm.get(col)?.value==null){
      console.log("field value---> is null for "+col);
      this.companyCustomerForm.controls[col]?.setValue("");
    }
  })
  console.log(this.companyCustomerForm.value);
    this.companyCustomerService.addCompanyCustomer(this.companyCustomerForm.value).subscribe((data)=>{
      console.log(data+" CompanyCustomerInserted");
      myCompanyCustomer=data
      console.log("CompanyCustomer id"+myCompanyCustomer.id)
    
    },
    (err)=>{
      console.log(err);
      this.loadingScreen=false;
    },
    ()=>{
    // this.ngOnInit();
    // this.getAllCompanyCustomerList(this.companyId);
    if (this.closeBox) {
      this.closeBox.nativeElement.click();
    }
    this.advanceFilterFunc();
    this.loadingScreen=true;
    this.showFieldsList?.forEach((x)=>{
      const obj={
          "email":this.email,
          "companyId":this.companyId,
          "name":x.name,
          "value":(extraFieldValueMap.get(x.name)==null)?"": extraFieldValueMap.get(x.name),
          "companyCustomerId":myCompanyCustomer.id,
          "type":extraFieldTypeMap.get(x.name)
      }
      console.log("extra field object"+obj.companyCustomerId+"--"+obj.companyId+"--"+obj.name+"--"+obj.value)
      this.companyCustomerService.addExtraFields(obj).subscribe((data)=>{
        console.log("added extra fields");
        // this.ngOnInit();
        // this.workorderform.reset();
      },
      (err)=>{
        console.log(err);
        this.loadingScreen=false;
      },
    ()=>{
      this.loadingScreen=false;
    })
    })
   
    }
    )
  }


  getAllCompanyCustomerList(companyId:string){
    // this.workOrderService.getWorkOrder(companyId).subscribe((data)=>{
    //   this.workorderlist=data;
     






    // },(err)=>{
    //   console.log(err);
    // },
    // ()=>{
    //   this.searchedWorkorder=this.workorderlist
    // }
    // )
    this.companyCustomerService.getAllCompanyCustomerWithExtraColumn(companyId).subscribe((data)=>{
      this.companyCustomerListWithExtraFields=[];
      console.log(data);
      this.companyCustomerlist=data;
      const jsonList:string[]=data;
      jsonList.forEach((workorder)=>{
        const jsonObject:any = JSON.parse(workorder);
        console.log(typeof(jsonObject))
        this.companyCustomerListWithExtraFields.push(jsonObject)
      })
      console.log(this.companyCustomerListWithExtraFields)
      
     
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      // this.searchedWorkorder=this.workOrderListWithExtraFields;
    })
    

  }


  editButtonVisibile(id:number){
  //  console.log(id);
    this.editButtonId=id;
    this.editVisibility=true;
 
  }
  editButtonNotVisible(){
    
    this.editVisibility=false;
    this.editButtonId=-1;
  }
  companyCustomerDetail(id:string){
    this.detailedWorkOrder=true;
    this.detailModule=true;
    this.detailId=id;
    console.log(this.detailModule+" "+ this.detailId)
    // this.dashboard.current=6
    // localStorage.setItem('currOption','6');
  this.selectedWorkOrder=id;
  }
  onBackClicked(eventData:{show:boolean}){
    this.ngOnInit();
   
    this.detailedWorkOrder=eventData.show;
  }
  deleteloading(){
    this.loadingScreen=true;
    setInterval(()=>{
      // this.loadingScreen=false;
      this.loadingScreen=false;
    },3000);
    
  }
  
  deleteCompanyCustomer(id:string){
    this.loadingScreen=true;
  
    this.companyCustomerService.deleteCompanyCustomer(id).subscribe((data)=>{
      console.log('Workorder Deleted');
      this.companyCustomerForm.reset();
     
    },
    (err)=>{
      console.log(err);
      this.companyCustomerForm.reset();
    },()=>{
      this.companyCustomerService.deleteWorkorderExtraField(id).subscribe((data)=>{
        console.log("ExtraFields Deleted");
      },
      (err)=>{
        console.log(err);
      })
      this.ngOnInit();
      this.loadingScreen=false;
    })
   


    
  }
  
  assetSelected(data:any){
    console.log(data)
  }
  onSearch(data:any){
    console.log(data);
    this.searchData=data;
  }
  searchClick(){
    // console.log
   this.advanceFilterFunc();
    
  }
  searchBy(data:string){
    this.searchDataBy=data;
    console.log(data)
    this.sortedBy='';
  }
  removeSearchDataBy(){
    this.searchDataBy='';
    this.getAllCompanyCustomerList(this.companyId);
  }
  sortBy(data:string){
 this.sortedBy=data;
 console.log(this.sortedBy);
 this.advanceFilterFunc();
  }
  removeSort(){
   this.sortedBy='';
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
  triggerAlert(message: string, type: string) {
    console.log("triiger"+message)
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  Echo(){
    console.log("ecgo")
  }
  resetForm(){
    this.companyCustomerForm.reset();

  }

  addFilterForm(){
    // this.loading=true;
    console.log(this.filterForm.value);
    console.log(this.mandatoryFieldFilterList.size)
    this.mandatoryFieldFilterList.forEach((value,data)=>{
      console.log(value+" "+data)
      if(value==true&&this.filterForm.controls[data]?.value!=null&&this.filterForm.controls[data]?.value!=""){
        
        this.appliedFilterListMap.set(data,this.filterForm.get(data)?.value);
        this.appliedFilterList.add(data);
      }
    })
    
    this.selectedFilterList.forEach((name: string)=>{
      if(this.filterForm.controls[name].value!=null&&this.filterForm.controls[name].value!=""){
      this.appliedFilterListMap.set(name,this.filterForm.get(name)?.value);
      this.appliedFilterList.add(name);
      }
    })
    console.log("applied filter"+this.appliedFilterList.size);
    this.advanceFilterFunc();

  }
  reset(){
    this.loadingScreen=true;
    this.filterForm.reset();
    this.sortedBy="";
    // this.searchData=null;
    this.appliedFilterList=new Set<string>();
    this.appliedFilterListMap=new Map<string,string>;
    
    this.filterForm.controls['companyId'].setValue(this.companyId);
    this.myList.forEach((field)=>{
      this.mandatoryFieldFilterList.set(field,true);
      this.filterForm.addControl(field,this.formBuilder.control('',Validators.required));
    });
    this.selectedFilterList=[];
    this.showFieldsList.forEach((x)=>{
     
      this.selectedFilterList.push(x.name);
      this.filterForm.addControl(x.name,this.formBuilder.control('',Validators.required));
      this.showFieldsMap.set(x.name,x.show);
     
    })
    // this.assetService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize,this.sortedBy).subscribe((data)=>{
    //   console.log(data);
    //   this.assetListWithExtraFields=[]
    // this.paginationResult=data;
    // this.totalLength=this.paginationResult.totalRecords;
    // this.assets=this.paginationResult.data;
    // const jsonList:string[]=this.paginationResult.data;
    // jsonList.forEach((workorder)=>{
    //   const jsonObject:any = JSON.parse(workorder);
    //   console.log(typeof(jsonObject))
    //   this.assetListWithExtraFields.push(jsonObject)
    // })
    // console.log(this.assetListWithExtraFields);
    // this.loading=false;
    // })
    this.loadingScreen=false;
    this.advanceFilterFunc();

  }
  
  removeSingleFilter(name:string){
    console.log("single: "+name)
    this.appliedFilterList.delete(name);

    this.filterForm.get(name)?.setValue(null);


  this.advanceFilterFunc();

  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchClick();
    }
  }
}
