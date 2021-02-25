import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';





const MaterialComponent = [
  MatButtonModule
  ,MatTableModule
  ,MatToolbarModule
  ,MatCardModule
  ,MatIconModule
  ,MatSlideToggleModule
  ,MatMenuModule
  ,MatFormFieldModule
  ,MatPaginatorModule
  ,MatProgressSpinnerModule
  ,MatSelectModule
  ,MatBadgeModule
  ,MatDialogModule
  ,MatGridListModule
  ,MatInputModule
];


@NgModule({
  imports: [MaterialComponent],
  exports:[MaterialComponent]
})
export class MaterialModule { }
