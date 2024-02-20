import { Component } from '@angular/core';

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

  ngOnInit(){
    this.custom = "Custom Text";
    this.optional = "Optional Text";
    this.type="1";
  }
  update(val:string){
    this.type=val;
  }

}
