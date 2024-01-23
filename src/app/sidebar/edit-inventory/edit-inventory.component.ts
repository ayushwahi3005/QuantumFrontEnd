import { Component, EventEmitter, Output } from '@angular/core';
import { EditInventoryService } from './edit-inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../inventory/inventory';
import { InventoryComponent } from '../inventory/inventory.component';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent {
  email:any='';
  inventoryForm!:FormGroup;
  username:any='';
  imageFile!:any;
  inventory!:Inventory;
  id:any;
  img:any;
  loadingScreen=false;
  companyId!:any;
  constructor(private editInventoryService:EditInventoryService,private formBuilder:FormBuilder,private activeRoute:ActivatedRoute,private router:Router){}
  @Output() messageEvent = new EventEmitter<string>();



  sendMessage() {
    this.messageEvent.emit("update the component");
  }
  ngOnInit(){
    this.companyId=localStorage.getItem('companyId');
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
    this.inventoryForm=this.formBuilder.group({
      id:[''],
      partImage:[''],
      partId:['',Validators.required],
      partName:['',Validators.required],
      price:['',Validators.required],
      cost:['',Validators.required],
      category:['',Validators.required],
      quantity:['',Validators.required],
      companyId:[this.companyId]
      
  
  
  
    });
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
  editInventory(){
    this.inventoryForm.controls['id'].setValue(this.id);
    this.inventoryForm.controls['partImage'].setValue(this.img);
    //   const file = event.target.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //     console.log(reader.result);
    
    // }
   this.editInventoryService.addInventory(this.inventoryForm.value).subscribe((data)=>{
    console.log(data);
    this.loading();
    this.ngOnInit();
   },(err)=>{
    console.log(err);
   },()=>{
    this.imageFile=null;
    // this.inventoryComponent.ngOnInit();
    
   })
  }
  removeTheImage(){
    this.inventoryForm.controls['id'].setValue(this.id);
    this.inventoryForm.controls['partImage'].setValue(null);
    this.img=null;
    this.editInventoryService.addInventory(this.inventoryForm.value).subscribe((data)=>{
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
}
