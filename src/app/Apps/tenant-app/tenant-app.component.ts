import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/delete/delete/delete.component';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';

@Component({
  selector: 'app-tenant-app',
  templateUrl: './tenant-app.component.html',
  styleUrls: ['./tenant-app.component.css']
})
export class TenantAppComponent implements OnInit {
  selected:string = '';
  Apps:HostedApplication[] = [];
  displaySppiner:boolean = false;
  constructor(private host:HostServiceService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displaySppiner =true;
    this.host.displayspinner.subscribe(turn =>{
      this.displaySppiner =turn;
    })
    this.host.ListAppChange.subscribe((ap:HostedApplication[]) =>{
      this.Apps = ap;
    })
    this.getListHost();
  }

  getListHost(tenantid?:string|number){
      this.host.list(tenantid).subscribe(hl =>{
        this.Apps = this.host.getListApp();
        this.displaySppiner = false;
      })
  }
  
  getRunTime(runtime:string){

  }

  delete(appname:string){
    
   this.dialog.open(DeleteComponent,{data:{name:appname}})
  }

}
