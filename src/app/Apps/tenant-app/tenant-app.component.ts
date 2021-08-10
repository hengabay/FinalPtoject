import { Component, ElementRef, Inject, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteComponent } from 'src/app/delete/delete/delete.component';
import { HostedApplication, HostServiceService } from 'src/app/service/host-service.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { CreateComponent } from 'src/app/create/create/create.component';


const THEME = 'ace/theme/twilight'; 
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-tenant-app',
  templateUrl: './tenant-app.component.html',
  styleUrls: ['./tenant-app.component.css']
})
export class TenantAppComponent implements OnInit {
 
  @ViewChild('codeEditor',{static:false}) codeEditorElmRef?: ElementRef;
  
  public Apps:HostedApplication[] = [];
  displaySppiner:boolean = false;
  private codeEditor?: ace.Ace.Editor;
  private editorBeautify:any;

  constructor(private host:HostServiceService,
              public dialog: MatDialog,             
              private router:Router,
              private rout:ActivatedRoute) { 
    this.host.createIcons();
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

setTimeout(()=> {
  for (let index = 0; index < this.Apps.length; index++) {
    ace.edit(document.getElementById(`editor_${index}`)!);      
   }
     //// ace.edit('editor_0');
     // ace.edit('editor_1');

    } , 1000);
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
    this.dialog.open(CreateComponent,{data:{name:nameApp}})
  }

  info(nApp:string,nBlock:string){
    this.router.navigate([`/editor/${nApp}/${nBlock}`],{relativeTo:this.rout})
  }
  
  

  editor(){
    ace.config.set('basePath', '');
    ace.require('ace/ext/language_tools');
    const editorOptions = this.getEditorOptions();

    const element = this.codeEditorElmRef?.nativeElement;
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
 }
 private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
  const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 13,
      maxLines: Infinity,
      fontSize:20,
    autoScrollEditorIntoView:true};
  const extraEditorOptions = {
      enableBasicAutocompletion: true
  };
  const margedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
  return margedOptions;
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