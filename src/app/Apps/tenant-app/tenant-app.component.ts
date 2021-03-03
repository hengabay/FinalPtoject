import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddBlockComponent } from 'src/app/AddBlock/add-block/add-block.component';
import { DeleteComponent } from 'src/app/delete/delete/delete.component';
import { HostedApplication, HostServiceService } from 'src/app/service/host-service.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";



@Component({
  selector: 'app-tenant-app',
  templateUrl: './tenant-app.component.html',
  styleUrls: ['./tenant-app.component.css']
})
export class TenantAppComponent implements OnInit {
  Apps:HostedApplication[] = [];
  displaySppiner:boolean = false;
  constructor(private host:HostServiceService,public dialog: MatDialog,private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) { 
    this.createIcons();
  }

  ngOnInit(): void {
    this.displaySppiner =true;
    this.host.displayspinner.subscribe(turn =>{
      this.displaySppiner =turn;
    });
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
  
  getselected(blockname:string,appname:string){
    // this.selected ='';
    // this.selected = appname;
    const chosen:HostedApplication|undefined = this.Apps.find(data => data.name===appname);

  }

  delete(appname:string){
    
   this.dialog.open(DeleteComponent,{data:{name:appname}})
  }
  addBlock(nameApp:string){
    this.dialog.open(AddBlockComponent,{data:{name:nameApp}})
  }

  info(){
    
  }

  createIcons(){
    this.matIconRegistry.addSvgIcon(
      "javascript",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/javascript_icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "ruby",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/ruby_PNG28.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "static",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/xml.icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "forward",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/forward_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "select",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/select_icon.svg")
    );
  }

}
