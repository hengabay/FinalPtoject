import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddBlockComponent } from 'src/app/AddBlock/add-block/add-block.component';
import { DeleteComponent } from 'src/app/delete/delete/delete.component';
import { HostedApplication, HostServiceService } from 'src/app/service/host-service.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ace from 'ace-builds'; 
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';


const THEME = 'ace/theme/github'; 
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-tenant-app',
  templateUrl: './tenant-app.component.html',
  styleUrls: ['./tenant-app.component.css']
})
export class TenantAppComponent implements OnInit {
  @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;

  
  public Apps:HostedApplication[] = [];
  displaySppiner:boolean = false;
  private codeEditor?: ace.Ace.Editor;

  constructor(private host:HostServiceService,
              public dialog: MatDialog,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private router:Router,
              private rout:ActivatedRoute) { 
    this.createIcons();
  }

  ngOnInit(): void {
    this.editor();
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
  this.dialog.open(DialogDeleteBlock,{data:{app:appName,block:blockName}})  }
  

  delete(appname:string){
    
   this.dialog.open(DeleteComponent,{data:{name:appname}})
  }
  addBlock(nameApp:string){
    this.dialog.open(AddBlockComponent,{data:{name:nameApp}})
  }

  info(nApp:string,nBlock:string){
    this.router.navigate([`/editor/${nApp}/${nBlock}`],{relativeTo:this.rout})
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

  editor(){
    const element = this.codeEditorElmRef?.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
        highlightActiveLine: true,
        minLines: 10,
        maxLines: Infinity,
    };

    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
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
        this.host.Deleteblock(this.data.app,this.data.block).subscribe(
          () => {
            this.host.displayspinner.next(false);            
          }
        )
      }
    }