import { Component, ElementRef, Inject, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/delete/delete/delete.component';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateComponent } from 'src/app/create/create/create.component';
import { EditBlockComponent } from 'src/app/edit-block/edit-block.component';
@Component({
  selector: 'app-tenant-app',
  templateUrl: './tenant-app.component.html',
  styleUrls: ['./tenant-app.component.css']
})
export class TenantAppComponent implements OnInit {
  @ViewChild('codeEditor',{static:false}) codeEditorElmRef?: ElementRef;
  public Apps:HostedApplication[] = [];
  displaySppiner:boolean = false;

  constructor(private host:HostServiceService,
              public dialog: MatDialog,             
              private router:Router,
              private rout:ActivatedRoute) { 
    this.host.createIcons();
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

  icon(appName:string,blockName:string){
    this.dialog.open(DialogDeleteBlock,{data:{app:appName,block:blockName}}) 
  }
  
  delete(appname:string){  
    this.dialog.open(DeleteComponent,{data:{name:appname}})
  }
  addBlock(nameApp:string){
    this.dialog.open(CreateComponent,{data:{name:nameApp}})
  }

  editblock(editBlock:HostedApplicationBlock,AppName:string){
    this.dialog.open(EditBlockComponent,{data:{block:editBlock,AppName:AppName},
      height: '60vh',width:'100%'})
  }
}
  @Component({
    selector: 'dialog-delete-block',
    templateUrl: './dialog-delete-block.html',
  })
  export class DialogDeleteBlock {
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,private host:HostServiceService) {}

      Deleteblock(){
        this.host.displayspinner.next(true);
        this.host.Deleteblock(this.data.app,this.data.block);
      }
    }