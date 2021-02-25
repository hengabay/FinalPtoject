import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantAppComponent } from '../Apps/tenant-app/tenant-app.component';

const routes: Routes = [
  {path:'',component:TenantAppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
