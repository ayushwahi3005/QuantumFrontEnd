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

const routes: Routes = [
  {path: '', component:HomeComponent, pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
 //{path:'dashboard', component:DashboardComponent,canActivate:[AuthenticationService]},
  {path:'dashboard', component:DashboardComponent},
  {path:'workorder/:id',component:WorkorderDetailsComponent},
  {path:'inventory',component:InventoryComponent},
  {path:'custom-setting',component:SettingHomeComponent},
  {path:'edit-inventory/:id',component:EditInventoryComponent},
  {path:'setting-home',component:SettingMainComponent},

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
