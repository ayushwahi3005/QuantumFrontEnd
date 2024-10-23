import { Component } from '@angular/core';
import { QR } from './qr';
import { AssetQRService } from './asset-qr.service';

@Component({
  selector: 'app-asset-qr',
  templateUrl: './asset-qr.component.html',
  styleUrls: ['./asset-qr.component.css']
})
export class AssetQRComponent {
  qrdata: string = 'Your information to encode into the QR code';
  custom!:string;
  optional!:string ;
  type!:string;
  qr!:QR;
  companyId: any ;

  displayStyle="none";
  message:string='Saved';
  isModalOpen!:boolean;

  constructor(private assetQRService:AssetQRService){}
  ngOnInit(){
    this.custom = "Custom Text";
    this.optional = "Optional Text";
    this.isModalOpen=false;
    
    this.companyId=localStorage.getItem('companyId');
    this.assetQRService.getQR(this.companyId).subscribe((data)=>{
      this.qr=data;
      if(this.qr!=null){
        this.type=this.qr.type;
        this.custom=this.qr.custom;
        this.optional=this.qr.optional;
        // if(this.custom==""||this.custom==null){
        //   this.custom = "Custom Text";
        // }
        // if(this.optional="")
      }
      else{
        this.type="1";
      }
    },
    (err)=>{
      console.log(err);
    })
  }
  update(val:string){
    this.type=val;
  }
  save(){
    const obj={
      "custom":this.custom,
      "optional":this.optional,
      "type":this.type,
      "companyId":this.companyId
    }
    this.assetQRService.updateQR(obj).subscribe((data)=>{
      console.log(data);
      this.message = "Successfully Updated";
      console.log("Successfully Updated QR Setup")
    },
    (err)=>{
      this.message = "Some Error Occured";
      console.log(err);
    },
    ()=>{
      this.openPopup();
    })
  }
  openPopup(){
    console.log("popup");
    this.displayStyle="block";
    this.isModalOpen=true;
    

  }
  closePopup(){
    this.isModalOpen=false;
    this.displayStyle="none";
  }

}
