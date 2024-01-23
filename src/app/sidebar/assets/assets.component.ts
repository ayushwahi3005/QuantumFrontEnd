import { Component, ViewEncapsulation } from '@angular/core';
import { AssetsService } from './assets.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Observable, ReplaySubject, delay } from 'rxjs';
import * as XLSX from 'xlsx'; 
import { Assets } from './assets';
import { ExtraFieldName } from './extraFieldName';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';



@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class AssetsComponent {
  assets!:any[];
  searchedAssets!:any[];
  email:any;
  excelFile:any;
  fileName= 'AssetSheet.xlsx'; 
  sortoption:string='';
  searchText:string='';
  imgId:string='';
  assetName:string='';
  detailedAsset:boolean=false;
  previewAsset:boolean=false;
  mainAsset:boolean=true;
  currDetails!:Assets;
  hoverOverSidebar=true;
  extraFieldName!:ExtraFieldName[];
  extraFieldNameList!:string[];
  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  
 
  selectedItems = [];
  

  showFieldsList!:ShowFieldsData[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;
  
  
  dropdownSettings: any ;
  assetForm!:FormGroup;
  myImage:any;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  editVisibility:boolean=false;
  editButtonId:number=-1;
  assetList!:Assets[];
  companyId!:any;
 
  constructor(private assetService:AssetsService,private authService:AuthService,private formBuilder:FormBuilder){
   
   }
  ngOnInit(){
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    console.log(this.email);


    this.assetForm=this.formBuilder.group({
      name:[''],
      customer:[''],
      serialNumber:[''],
      category:[''],
      location:[''],
      status:[''],
      image:[''],
      email:[this.email],
      companyId:[this.companyId]
     

    })


    this.assetService.getAssets(this.companyId).subscribe((data)=>{
      this.assets=data;
      console.log(this.assets);
    },
    (err)=>{
      console.log(err);
    },()=>{
      this.searchedAssets=this.assets;
      console.log(this.searchedAssets)
    })
    this.assetService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      // console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this,this.assetService.getAllShowFields(this.companyId).subscribe((data)=>{
      this.showFieldsList=data;
      console.log("show----------------------->",this.showFieldsList)
      this.showFieldsList.forEach((x)=>{
        this.showFieldsMap.set(x.name,x.show);
      })
      
      if(this.showFieldsList!=null){
      this.showFieldsList.forEach((x)=>{
        if(x.show==true)
        this.assetForm.addControl(x.name,this.formBuilder.control(''));
      })
    }
    
    },
    (err)=>{
      console.log(err);
    })

    this.assetService.getExtraFieldName(this.companyId).subscribe((data)=>{
      
     
      this.extraFieldName=data;
      var arr:string[]=[];
    this.extraFieldName.forEach((x)=>{
      console.log(x.name+" "+this.showFieldsMap.get(x.name))
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

    this.assetService.getExtraFieldNameValue(this.companyId).subscribe((data)=>{
      this.fieldNameValueMap=data;
      if(this.searchedAssets!=null){
      this.searchedAssets.forEach((x1,ind)=>{
        const keys=Object.keys(this.fieldNameValueMap);
        var obj=Object.create(this.fieldNameValueMap);
        var searchAsset=this.searchedAssets[ind] as any;
       
        keys.forEach((key)=>{
          if(x1.id==key){
            
            let myObj=obj[key];
         
            
            const newKeys=Object.keys(obj[key]);
            
            newKeys.forEach((newKey)=>{
             searchAsset[newKey]=myObj[newKey]
         
            })
           // console.log(searchAsset)

            
            // const searchAssetObj=Object.create(searchAsset);
            // console.log("BeforesearchObj",searchAssetObj)
            
            // let myObj=obj[key];
            
           
            //  console.log("searchObj",searchAsset)
          }
        })
        this.searchedAssets[ind]=searchAsset;

      })
    }
    
    },
    (err)=>{
      console.log(err);
    })
    



   
    this.selectedItems = [

    ];

    this.dropdownSettings= {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    
    

    

  }



  onChange(value: string): void {
    if (this.selectedExtraColums.includes(value)) {
      this.selectedExtraColums = this.selectedExtraColums.filter((item) => item !== value);
    } else {
      this.selectedExtraColums.push(value);
    }
    console.log(this.selectedExtraColums)
    this.selectedExtraColums.sort();
    // let obj=Object.create(this.fieldNameValueMap);
  
    // this.selectedExtraColumsNameValue=[];
    // this.selectedExtraColums.forEach((x)=>{
    //   this.selectedExtraColumsNameValue.push(obj[x]);
    // })
    // console.log(this.selectedExtraColumsNameValue);
  }
 
  onSubmit(event:any){
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  

    this.assetService.addAssets(formData,this.companyId).subscribe((data)=>{
      console.log("Successfully uploaded");
    },
    (err)=>{
      console.log(err);
    })
  }
  onAdd(){
    alert("Successfully Uploaded File");
    this.ngOnInit();
  }
  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('asset-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
    onSearch(data:any){

      const value=data.target.value;
      this.searchText=value;
     
      this.searchedAssets=this.assets.filter((assets)=>{
     
        let filterData:any;
        // if(assets.category.toLowerCase().includes(value.toLowerCase())||assets.customer.toLowerCase().includes(value.toLowerCase())||assets.location.toLowerCase().includes(value.toLowerCase())||assets.name.toLowerCase().includes(value.toLowerCase())||assets.serialNumber.toLowerCase().includes(value.toLowerCase())||assets.status.toLowerCase().includes(value.toLowerCase())){
        //   filterData=assets;
        // }
        // else{
        //   filterData=false;
        // }
        // return filterData;
        const keys=Object.keys(assets);
        var obj=Object.create(assets);
        keys.forEach((key)=>{
          let myString:string =assets[key];
          if(myString!=null&&myString.toLowerCase().includes(value.toLowerCase())){
            filterData=assets;
          }
         
          
          
        })
        return filterData;
      });
      
     
    }
    onSort(option:string){
      console.log(option);
      this.sortoption=option;
      console.log(this.searchedAssets)
      this.searchedAssets.sort((a:any,b:any)=>{
        if(option=="name"){
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        }
        else if(option=="serial"){
        
          const first:number= +a.serialNumber;
          const second:number= +b.serialNumber;
          
          return first-second;
        }
        else if(option=="category"){
          return a.category.toLowerCase().localeCompare(b.category.toLowerCase());
        }
        else if(option=="customer"){
          return a.customer.toLowerCase().localeCompare(b.customer.toLowerCase());
        }
        else if(option=="location"){
          return a.location.toLowerCase().localeCompare(b.location.toLowerCase());
        }
        else if(option=="status"){
          return a.status.toLowerCase().localeCompare(b.status.toLowerCase());
        }
        for(let i=0;i<this.selectedExtraColums.length;i++){
            const first:Object=Object.create(a);
            const second:Object=Object.create(b);
          if(option==this.selectedExtraColums[i]&&a[option]!=null&&b[option]!=null&&a[option]!=undefined&&b[option]!=undefined){
            
            console.log(b[option])
            return a[option].toLowerCase().localeCompare(b[option].toLowerCase())
          }
        }
        return 0;
      })

    }
    removeFilter(){
      this.searchedAssets=this.assets;
      this.sortoption='';
      this.ngOnInit();
    }

    imageUpload(event:any){
 
      const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
  
    
   
      this.myImage=reader.result;
      
   
        };
    
   


    }
//added new
    editButtonVisibile(id:number){
   
      this.editButtonId=id;
      this.editVisibility=true;
   
    }
    editButtonNotVisible(){
      
      this.editVisibility=false;
      this.editButtonId=-1;
    }

    addAsset(){
      let myAsset:Assets;
      let extraFieldValueMap=new Map<String,string>();
      let extraFieldTypeMap=new Map<String,string>();
      this.showFieldsList?.forEach((x)=>{
        if(x.show==true){
        extraFieldValueMap.set(x.name,this.assetForm.get(x.name)?.value);
        extraFieldTypeMap.set(x.name,this.assetForm.get(x.type)?.value);
        }
      })
      this.assetForm.controls['image'].setValue(this.myImage);
      console.log(this.assetForm.value);
      let valid=1;
      console.log(this.mandatoryFieldsList)
      this.mandatoryFieldsList?.forEach((val)=>{
        console.log("-============>",val.mandatory+" "+this.assetForm.get(val.name)?.value);
        if(this.showFieldsMap.get(val.name)==false){
          valid=1;
        }
        else if((val.mandatory==true)&&( this.assetForm.get(val.name)?.value==null||this.assetForm.get(val.name)?.value=='')){
          
          // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
          this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
          valid=0;
         
        }
        else if((val.mandatory==true)&&(this.showFieldsMap.get(val.name)==true) &&( this.assetForm.get(val.name)?.value==null||this.assetForm.get(val.name)?.value=='')){
          
          // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
          this.triggerAlert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","warning");
          valid=0;
         
        }
        
        
      })
      if(valid==0){
        return;
      }
      this.assetService.addNewAsset(this.assetForm.value).subscribe((data)=>{
        console.log("Asset Uploaded");
        myAsset=data;
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.ngOnInit();
        this.showFieldsList?.forEach((x)=>{
          const obj={
              "email":this.email,
              "companyId":this.companyId,
              "name":x.name,
              "value":extraFieldValueMap.get(x.name),
              "assetId":myAsset.id,
              "type":extraFieldTypeMap.get(x.name)
          }
          this.assetService.addExtraFields(obj).subscribe((data)=>{
            console.log("added extra fields");
          },
          (err)=>{
            console.log(err);
          })
        })
      })
    }

    changeAssetDetails(item:Assets){
      this.mainAsset=!this.mainAsset;
      this.detailedAsset=!this.detailedAsset;
      this.currDetails=item;

    }
    changeAssetPreview(item:Assets){
      this.mainAsset=!this.mainAsset;
      this.previewAsset=!this.previewAsset;
      this.currDetails=item;

    }
    onBackClicked(eventData:{show:boolean}){
      this.detailedAsset=false;
      this.mainAsset=true;
      console.log(this.previewAsset);
    }
    onBackClicked2(eventData:{show:boolean}){
      this.previewAsset=false;
      this.mainAsset=true;
    }
    toCamelCase(str: string): string {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
    triggerAlert(message: string, type: string) {
      console.log("triiger")
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

}
