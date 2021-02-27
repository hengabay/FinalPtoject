import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostServiceService } from 'src/app/service/host-service.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private host:HostServiceService) { }

  ngOnInit(): void {
    
  }

  Delete(){
    this.host.displayspinner.next(true);
    this.host.Delete(this.data.name);
  }

}
