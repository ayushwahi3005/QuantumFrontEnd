import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-fields-settings',
  templateUrl: './custom-fields-settings.component.html',
  styleUrls: ['./custom-fields-settings.component.css']
})
export class CustomFieldsSettingsComponent {
  currOption:number=1;
  ngOnInit(){

  }
  onClick(option:number){
    console.log(option)
    this.currOption=option;
  }
}
