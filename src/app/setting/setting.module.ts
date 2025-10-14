import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AddOneDayPipe } from './subscription/add-one-day.pipe';



@NgModule({
  declarations: [
    
    
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,

  ],
})
export class SettingModule { }
