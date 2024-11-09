import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
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
import { InventoryComponent } from './sidebar/inventory/inventory.component';
import { SettingMainComponent } from './setting/setting-main/setting-main.component';
import { EditInventoryComponent } from './sidebar/edit-inventory/edit-inventory.component';
import { CustomFieldsSettingsComponent } from './setting/custom-fields-settings/custom-fields-settings.component';
import { TickAnimationComponent } from './tick-animation/tick-animation.component';
import { AssetPreviewComponent } from './sidebar/asset-preview/asset-preview.component';
import { ImportComponent } from './setting/import/import.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { WorkorderModuleComponent } from './setting/workorder-module/workorder-module.component';
import { InvitationComponent } from './invitation/invitation.component';
import { AssetQRComponent } from './setting/asset-qr/asset-qr.component';
import { QRCodeModule } from 'angularx-qrcode';
import {MatTableModule} from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { InventoryModuleComponent } from './setting/inventory-module/inventory-module.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { CompanyCustomerComponent } from './sidebar/company-customer/company-customer.component';
import { CompanyCustomerDetailsComponent } from './sidebar/company-customer-details/company-customer-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CompanyCustomerDetailsPreviewComponent } from './sidebar/company-customer-details-preview/company-customer-details-preview.component';
import { RoleAndPermissionComponent } from './setting/role-and-permission/role-and-permission.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CustomerModuleComponent } from './setting/customer-module/customer-module.component';
import { LocationComponent } from './setting/location/location.component';
import { SecretService } from 'src/secret.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SubscriptionComponent } from './setting/subscription/subscription.component';
import { CategoryComponent } from './setting/category/category.component';
import { AssetCategoryComponent } from './setting/asset-category/asset-category.component';
import { WorkorderCategoryComponent } from './setting/workorder-category/workorder-category.component';
import { InventoryCategoryComponent } from './setting/inventory-category/inventory-category.component';
import { CustomerCategoryComponent } from './setting/customer-category/customer-category.component';
import { ImportHistoryComponent } from './setting/import-history/import-history.component';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';



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
    ImportComponent,
    WorkorderModuleComponent,
    InvitationComponent,
    AssetQRComponent,
    InventoryModuleComponent,
    CompanyCustomerComponent,
    CompanyCustomerDetailsComponent,
    CompanyCustomerDetailsPreviewComponent,
    RoleAndPermissionComponent,
    CustomerModuleComponent,
    LocationComponent,
    SubscriptionComponent,
    PaymentComponent,
    CategoryComponent,
    AssetCategoryComponent,
    WorkorderCategoryComponent,
    InventoryCategoryComponent,
    CustomerCategoryComponent,
    ImportHistoryComponent
    
    
 
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule,MatProgressSpinnerModule,MatBadgeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSlideToggleModule,
    QRCodeModule,
    NgSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule
  
    
    
  ],
  providers: [DatePipe,
    SecretService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initializeAppFactory(secretsService: SecretService) {
  return async(): Promise<any> => secretsService.initializeEnvironmentVariables().then(() => {
    // Initialize Firebase here after secrets are fetched
    // console.log(environment.firebaseConfig)
    // AngularFireModule.initializeApp(environment.firebaseConfig);
  });
}
