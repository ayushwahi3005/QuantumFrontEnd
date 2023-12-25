import { Component } from '@angular/core';
import { ExtraFieldName } from './extraFieldName';
import { AssetModuleService } from './asset-module.service';

@Component({
  selector: 'app-asset-module',
  templateUrl: './asset-module.component.html',
  styleUrls: ['./asset-module.component.css']
})
export class AssetModuleComponent {
  extraFieldName!:ExtraFieldName[];
  addFieldName!:string;
  
  extraFieldOption!:string;
  currOption:number=1;
  email!:any;
  deletionId:string='';
  constructor(private assetModuleService:AssetModuleService){}
  ngOnInit(){
    this.email=localStorage.getItem('user');
    this.assetModuleService.getExtraFields(this.email).subscribe((data)=>{
      this.extraFieldName=data;
    },
    (err)=>{
      console.log(err);
    })
  }
  onClick(option:number){
    this.currOption=option;
  }
  onAddField(){
    
   
    
    if(this.addFieldName==''||this.addFieldName==null){
      alert("Field Empty!!");
    }
    else{
    const obj={
      
      "name":this.addFieldName.trim(),
      "email":this.email,
       "type":this.extraFieldOption
    }
    this.assetModuleService.addExtraFields(obj).subscribe((data)=>{this.extraFieldOption
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.addFieldName='';
     
      this.extraFieldOption='none';
      this.ngOnInit();

    })
  }
  }
  removeExtraField(){
    this.assetModuleService.removeExtraField(this.deletionId).subscribe((data)=>{
      console.log(data);
      this.deletionId='';
    },
    (err)=>{
      console.log(err);
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
  updateDeleteId(id:string){
    this.deletionId=id;
  }
}
