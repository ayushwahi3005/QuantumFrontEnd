import { Component, EventEmitter, Output } from '@angular/core';
import { EditInventoryService } from './edit-inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ExtraFieldName } from './extraFieldName';
import { ExtraField } from './extraField';
import { MandatoryFields } from './mandatoryFields';
import { ShowFieldsData } from './showFieldsData';
import { Inventory } from './inventory';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent {
  email:any='';
  username:any='';
  imageFile!:any;
  inventory!:Inventory;
  id:any;
  img:any;
  loadingScreen=false;
  companyId!:any;

  extraFieldName!:ExtraFieldName[];
  extraFieldsList!:any[];
  extraFields!:ExtraField[];
  extraFieldString:string[]=[];
  extraFieldMap!:Map<string,boolean>;
  showFieldsMap!:Map<string,boolean>;

  extraFieldNameString:string[]=[];
  mandatoryFieldsList!:MandatoryFields[];
  mandatoryFieldsMap!:Map<string,boolean>;
  showFieldsList!:ShowFieldsData[];
  extraFieldValue:string[]=[]

  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';

  constructor(private editInventoryService:EditInventoryService,private formBuilder:FormBuilder,private activeRoute:ActivatedRoute,private router:Router){}
  @Output() messageEvent = new EventEmitter<string>();



  sendMessage() {
    this.messageEvent.emit("update the component");
  }
  ngOnInit(){
    this.inventory=new Inventory();
    this.companyId=localStorage.getItem('companyId');
    this.extraFieldString=[];
    this.extraFieldNameString=[];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.activeRoute.paramMap.subscribe((data)=>{
      // this.workOrderId=data.get('id');
      this.id=data.get('id');
     
    })
    this.editInventoryService.getInventory(this.id).subscribe((data)=>{
      
      this.inventory=data;
      this.img=this.inventory.partImage;
      console.log("----------->",this.inventory);
    },
    (err)=>{
    console.log(err)
  });
    // this.inventoryForm=this.formBuilder.group({
    //   id:[''],
    //   partImage:[''],
    //   partId:['',Validators.required],
    //   partName:['',Validators.required],
    //   price:['',Validators.required],
    //   cost:['',Validators.required],
    //   category:['',Validators.required],
    //   quantity:['',Validators.required],
    //   companyId:[this.companyId]
      
  
  
  
    // });


    this.editInventoryService.getExtraFields(this.id).subscribe((data)=>{
  
      this.extraFields=data;
      console.log("extra Fieldsss"+this.extraFields);
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
      
    },
    (err)=>{
      console.log(err);
    })

    this.editInventoryService.getExtraFieldName(this.companyId).subscribe((data)=>{
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
    this.editInventoryService.getAllMandatoryFields(this.companyId).subscribe((data)=>{
      this.mandatoryFieldsList=data;
      //console.log("mandatory----------------------->",this.mandatoryFieldsList)
      this.mandatoryFieldsList.forEach((x)=>{
        this.mandatoryFieldsMap.set(x.name,x.mandatory);
      })
    },
    (err)=>{
      console.log(err);
    })
    this.editInventoryService.getAllShowFields(this.companyId).subscribe((data)=>{
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

  onCheck(){
    // console.log(typeof(this.workOrder));
    // this.mandatoryFieldsMap.forEach((val,key)=>{
    //   if(this.assetDetails.get(key))
    // })
    console.log(this.inventory);
    if(this.mandatoryFieldsMap.get("partId")==true){
      if(this.inventory.partId==''||this.inventory.partId==null){
       
       
        this.triggerAlert("Fill Mandatory field 'Part Id'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("cost")==true){
      if(this.inventory.cost==null){
        this.triggerAlert("Fill Mandatory field 'Cost'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("partName")==true){
      if(this.inventory.partName==''||this.inventory.partName==null){
        this.triggerAlert("Fill Mandatory field 'Part Name'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("category")==true){
      if(this.inventory.category==''||this.inventory.category==null){
        this.triggerAlert("Fill Mandatory field 'Category'","danger")
        return;
      }
    }
    if(this.mandatoryFieldsMap.get("price")==true){
      if(this.inventory.price==null){
        this.triggerAlert("Fill Mandatory field 'Price'","danger")
        return ;
      }
    }
    if(this.mandatoryFieldsMap.get("quantity")==true){
      if(this.inventory.quantity==null){
        this.triggerAlert("Fill Mandatory field 'Quantity'","danger")
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
          "inventoryId":this.id,
          "type":x.type,
          "companyId":x.companyId
        }
      }
      else{
        obj={
         
                
                "name":x.name,
                "value":this.extraFieldValue[ind],
                "inventoryId":this.id,
                "type":x.type,
                "companyId":x.companyId
              }
      }
        
        if(x.type=='checkbox'){
          console.log(this.extraFieldValue[ind])
        }
        this.editInventoryService.addExtraFields(obj).subscribe((data)=>{
          console.log("added extra fields");
        },
        (err)=>{
          console.log(err);
        })
        })
  
      // console.log(this.assetDetails);
 
    
    //   const file = event.target.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //     console.log(reader.result);
    
    // }
    
    this.inventory.partImage=this.img;
    console.log("updated inventpry data-> "+this.inventory.partId)
   this.editInventoryService.updateInventory(this.inventory).subscribe((data)=>{
    console.log(data);
    this.loading();
    this.ngOnInit();
   },(err)=>{
    console.log(err);
   },()=>{
    this.imageFile=null;
    // this.inventoryComponent.ngOnInit();
    
   })
  
  
      
    
      // this.triggerAlert("Successfully Updated","success");
      
    }
  imageChange(event:any){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        // console.log(reader.result);
        this.img=reader.result;
        
    
    }
    
  }
  // editInventory(){
  //   this.inventoryForm.controls['id'].setValue(this.id);
  //   this.inventoryForm.controls['partImage'].setValue(this.img);
  //   //   const file = event.target.files[0];
  //   // const reader = new FileReader();
  //   // reader.readAsDataURL(file);
  //   // reader.onload = () => {
  //   //     console.log(reader.result);
    
  //   // }
  //  this.editInventoryService.addInventory(this.inventoryForm.value).subscribe((data)=>{
  //   console.log(data);
  //   this.loading();
  //   this.ngOnInit();
  //  },(err)=>{
  //   console.log(err);
  //  },()=>{
  //   this.imageFile=null;
  //   // this.inventoryComponent.ngOnInit();
    
  //  })
  // }
  removeTheImage(){
   this.inventory.partImage='';
    this.img=null;
    this.editInventoryService.addInventory(this.inventory).subscribe((data)=>{
      console.log(data);
     },(err)=>{
      console.log(err);
     },()=>{
      this.imageFile=null;
      
     })
  }
  deleteInventory(){
    this.editInventoryService.deleteInventory(this.id).subscribe((data)=>{
      console.log(data);
      this.router.navigate(['dashboard'])
    },
    (err)=>{
      console.log(err);
    })
  }
  loading(){
    this.loadingScreen=true;
   
   
    setTimeout(()=>{
      this.loadingScreen=false;
     
    },2000)
    
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
}
