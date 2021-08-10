import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostServiceService } from 'src/app/service/host-service.service';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private host:HostServiceService) { }
  Delete(){
    this.host.displayspinner.next(true);
    this.host.Delete(this.data.name);
  }
}
