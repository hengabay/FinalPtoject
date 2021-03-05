import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantAppComponent } from '../Apps/tenant-app/tenant-app.component';
import { EditorComponent } from '../editor/editor/editor.component';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';


const routes: Routes = [
  {path:'',component:TenantAppComponent},
  {path:'editor/:nameapp/:nameblock',component:EditorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
