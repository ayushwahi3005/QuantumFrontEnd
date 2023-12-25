import { Component, ViewEncapsulation } from '@angular/core';
import { AssetsService } from './assets.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Observable, ReplaySubject, delay } from 'rxjs';
import * as XLSX from 'xlsx'; 
import { Assets } from './assets';
import { ExtraFieldName } from './extraFieldName';
import { FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';



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
  currDetails!:Assets;
  hoverOverSidebar=true;
  extraFieldName!:ExtraFieldName[];
  extraFieldNameList!:string[];
  selectedExtraColums :string[]=[];
  selectedExtraColumsNameValue:any[]=[];
  fieldNameValueMap!:object;
  
 
  selectedItems = [];
  dropdownSettings = {};
 
  constructor(private assetService:AssetsService,private authService:AuthService){
   
   }
  ngOnInit(){
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.assetService.getAssets(this.email).subscribe((data)=>{
      this.assets=data;
      //console.log(this.assets);
    },
    (err)=>{
      console.log(err);
    },()=>{
      this.searchedAssets=this.assets;
    })

    this.assetService.getExtraFieldName(this.email).subscribe((data)=>{
      
     
      this.extraFieldName=data;
      var arr:string[]=[];
    this.extraFieldName.forEach((x)=>{
        arr.push(x.name);
      })
      
      this.extraFieldNameList=arr;
      //console.log(this.extraFieldNameList)
      
   
     
      
      
    },
    (err)=>{
      console.log(err);
    })

    this.assetService.getExtraFieldNameValue(this.email).subscribe((data)=>{
      this.fieldNameValueMap=data;
      
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
       
    
    },
    (err)=>{
      console.log(err);
    })



   
    this.selectedItems = [

    ];
    // this.dropdownSettings:IDropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
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
  

    this.assetService.addAssets(formData,this.email).subscribe((data)=>{
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
        console.log(reader.result);
    
    const obj={
      "id":this.imgId,
      "image": reader.result
    }
  
    this.assetService.uploadImage(obj).subscribe((data)=>{
          console.log(data);
        
        },
        (err)=>{
          console.log(err);
          
        },
        ()=>{
          this.ngOnInit();
        })
        };
    
   


    }

    uploadImage(id:string){
      console.log("clicked"+id)
      this.imgId=id;
    }
    removeImage(){
      console.log("new 11click")
      console.log(this.imgId)
      this.assetService.removeImage(this.imgId).subscribe((data)=>{
        console.log(data);
      },
      (err)=>{
        console.log(err);
      }
      ,()=>{
        this.ngOnInit();
        this.imgId='';
      })
    }

    changeAssetDetails(item:Assets){
      this.detailedAsset=!this.detailedAsset;
      this.currDetails=item;

    }
    onBackClicked(eventData:{show:boolean}){
      this.detailedAsset=eventData.show;
    }

}
