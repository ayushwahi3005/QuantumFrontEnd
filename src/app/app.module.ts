import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {  AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './sidebar/users/users.component';
import { WorkorderComponent } from './sidebar/workorder/workorder.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './payment/payment.component';
import { AssetsComponent } from './sidebar/assets/assets.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { AssetDetailsComponent } from './sidebar/asset-details/asset-details.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WorkorderDetailsComponent } from './sidebar/workorder-details/workorder-details.component';
import { SettingHomeComponent } from './setting/setting-home/setting-home.component';
import { AssetModuleComponent } from './setting/asset-module/asset-module.component';
import { DatePipe } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GoogleMapsModule } from '@angular/google-maps';
import { InventoryComponent } from './sidebar/inventory/inventory.component';
import { SettingMainComponent } from './setting/setting-main/setting-main.component';
import { EditInventoryComponent } from './sidebar/edit-inventory/edit-inventory.component';
import { CustomFieldsSettingsComponent } from './setting/custom-fields-settings/custom-fields-settings.component';
import { TickAnimationComponent } from './tick-animation/tick-animation.component';
import { AssetPreviewComponent } from './sidebar/asset-preview/asset-preview.component';
import { ImportComponent } from './setting/import/import.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    UsersComponent,
    WorkorderComponent,
    PaymentComponent,
    AssetsComponent,
    AssetDetailsComponent,
    SideNavComponent,
    WorkorderDetailsComponent,
    SettingHomeComponent,
    AssetModuleComponent,
    InventoryComponent,
    SettingMainComponent,
    EditInventoryComponent,
    CustomFieldsSettingsComponent,
    TickAnimationComponent,
    AssetPreviewComponent,
    ImportComponent
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule,MatProgressSpinnerModule,MatBadgeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    GoogleMapsModule,
    MatSlideToggleModule
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
