import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { WorkorderDetailsComponent } from './sidebar/workorder-details/workorder-details.component';
import { SettingHomeComponent } from './setting/setting-home/setting-home.component';
import { InventoryComponent } from './sidebar/inventory/inventory.component';
import { SettingMainComponent } from './setting/setting-main/setting-main.component';
import { EditInventoryComponent } from './sidebar/edit-inventory/edit-inventory.component';
import { AssetPreviewComponent } from './sidebar/asset-preview/asset-preview.component';
import { InvitationComponent } from './invitation/invitation.component';
import { CompanyCustomerDetailsComponent } from './sidebar/company-customer-details/company-customer-details.component';
import { CompanyCustomerDetailsPreviewComponent } from './sidebar/company-customer-details-preview/company-customer-details-preview.component';
import { AuthenticationService } from './shared/authentication.service';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { ResetPasswordAdminComponent } from './admin/reset-password-admin/reset-password-admin.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAuthenticationService } from './shared/admin-authentication.service';
import { PaymentComponent } from './setting/payment/payment.component';
import { CustomerResetPasswordComponent } from './customer-reset-password/customer-reset-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found/page-not-found.component';
import { PaymentLockGuard } from './shared/PaymentLockGuard';
import { CustomersComponent } from './admin/customers/customers.component';

const routes: Routes = [
  {path: '', component:HomeComponent, pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'reset-password', component:  CustomerResetPasswordComponent},
  {path:'register', component:RegisterComponent},
 {path:'dashboard', component:DashboardComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  // {path:'dashboard', component:DashboardComponent},
  {path:'workorder/:id',component:WorkorderDetailsComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'inventory',component:InventoryComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'custom-setting',component:SettingHomeComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'edit-inventory/:id',component:EditInventoryComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'setting-home',component:SettingMainComponent,canActivate:[AuthenticationService]},
  {path:'assets/:id',component:AssetPreviewComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'invitation/:id/:details',component:InvitationComponent},
  {path:'customer/preview/:id',component:CompanyCustomerDetailsPreviewComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'customer/:id',component:CompanyCustomerDetailsComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'payment',component:PaymentComponent,canActivate:[AuthenticationService,PaymentLockGuard]},
  {path:'admin',component:AdminLoginComponent},
  {path:'admin/reset',component:ResetPasswordAdminComponent},
  {path:'admin/home',component:AdminHomeComponent,canActivate:[AdminAuthenticationService]},
  // {path:'admin/customers',component:CustomersComponent,canActivate:[AdminAuthenticationService]},
  {path: '**', component: PageNotFoundComponent }  


  


 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
