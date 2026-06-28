import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AddOneDayPipe } from './subscription/add-one-day.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    
    
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,MatButtonModule, MatMenuModule

  ],
})
export class SettingModule { }
