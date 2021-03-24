import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { HttpClientModule } from "@angular/common/http";
import { ConfigService } from './service/config.service';
import { DialogDeleteBlock, TenantAppComponent } from './Apps/tenant-app/tenant-app.component';
import { CreateComponent } from './create/create/create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DeleteComponent } from './delete/delete/delete.component';
import { AddBlockComponent } from './AddBlock/add-block/add-block.component';
import { EditorComponent } from './editor/editor/editor.component';
import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  declarations: [
    AppComponent,
    TenantAppComponent,
    CreateComponent,
    DeleteComponent,
    AddBlockComponent,
    EditorComponent,
    DialogDeleteBlock
  ],
  entryComponents:[CreateComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFileUploadModule
  ],
  providers: [
    ConfigService,
		{
			provide: APP_INITIALIZER, useFactory: (c: ConfigService) => c.factory,
			deps: [ ConfigService ], multi: true,
		}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
