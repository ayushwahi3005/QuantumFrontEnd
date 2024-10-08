import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from './inventory.service';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inventory } from './inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  email:any='';
  inventoryForm!:FormGroup;

  imageFile!:any
  popUpImage:string='';
  inventoryList:Inventory[]=[];
  editVisibility:boolean=false;
  editButtonId:number=-1;
  companyId!:any;
 
constructor(private router:Router,private inventoryService:InventoryService,private auth:AuthService,private formBuilder:FormBuilder){}
ngOnInit(){
  this.email=localStorage.getItem('user');
  this.companyId=localStorage.getItem('companyId');
  console.log(this.companyId);
  
  this.inventoryService.getAllInventory(this.companyId).subscribe((data)=>{
    this.inventoryList=data;
  },
  (err)=>{
    console.log(err);
  })


  this.inventoryForm=this.formBuilder.group({

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
updatePopUpImage(data:string){
this.popUpImage=data;
}
addInventory(){
  
  this.inventoryForm.controls['partImage'].setValue(this.imageFile);
  //   const file = event.target.files[0];
  // const reader = new FileReader();
  // reader.readAsDataURL(file);
  // reader.onload = () => {
  //     console.log(reader.result);
  
  // }
 this.inventoryService.addInventory(this.inventoryForm.value).subscribe((data)=>{
  console.log(data);
 },(err)=>{
  console.log(err);
 },()=>{
  this.imageFile=null;
  this.ngOnInit();
 })
}
imageChange(event:any){
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
      // console.log(reader.result);
      this.imageFile=reader.result;
  
  }
}
editButtonVisibile(id:number){
   
  this.editButtonId=id;
  this.editVisibility=true;

}
editButtonNotVisible(){
  
  this.editVisibility=false;
  this.editButtonId=-1;
}
deleteInventory(id:String){
  this.inventoryService.deleteInventory(id).subscribe((data)=>{
    console.log(data);
  
  },
  (err)=>{
    console.log(err);
  },()=>{
    this.ngOnInit();
  })

  }
}