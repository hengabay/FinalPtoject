import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';



const THEME = 'ace/theme/twilight'; 
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;
  
  private codeEditor?: ace.Ace.Editor;
  private editorBeautify:any;
  block?:HostedApplicationBlock;
  nameApp?:string;

  constructor(private rout:ActivatedRoute,private host:HostServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getDataUrl();
    
    this.rout.params.subscribe(
      (params:Params) => {
        this.host.listblock(params['nameapp']).subscribe(
          (app:HostedApplication) => {
            this.nameApp =app.name
            this.block = app.blocks.find(block => params['nameblock'] === block.name);        
            this.codeEditor?.getSession().setMode(`ace/mode/${this.block?.runtime==='static' ? 'xml':this.block?.runtime}`) 
            this.codeEditor?.setValue('');
            this.codeEditor?.insert(`${this.block?.code}`);
          });

      });
    this.configerEditor();

     }

    // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a wolkaround still using ts
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

public beautifyContent() {
  if (this.codeEditor && this.editorBeautify) {
     const session = this.codeEditor.getSession();
     this.editorBeautify.beautify(session);
  };}

public configerEditor(){
  ace.config.set('basePath', '');
  ace.require('ace/ext/language_tools');
  const element = this.codeEditorElmRef?.nativeElement;
  const editorOptions = this.getEditorOptions();
  this.codeEditor = ace.edit(element, editorOptions);
  this.codeEditor.setTheme(THEME);
  this.codeEditor.getSession().setMode(`ace/mode/${this.block?.runtime}`) 
  this.codeEditor.setShowFoldWidgets(true);
  this.editorBeautify = ace.require('ace/ext/beautify');
  this.beautifyContent();
  if(this.block?.code){
    this.codeEditor.setValue('');
    this.codeEditor.insert(`${this.block.code}`);
  }
  else{
    this.codeEditor.insert(`loading...`);
  }
}
public getDataUrl(){
  this.nameApp = this.host.getListApp().find(app =>this.rout.snapshot.params['nameapp'] === app.name)?.name;
  this.block = this.host.getListApp().find(app =>this.rout.snapshot.params['nameapp'] === app.name)?.blocks.find(block => this.rout.snapshot.params['nameblock'] === block.name);
}

  clear(){
    this.codeEditor?.setValue('');
  }

  EditCode(){
    if(typeof this.block?.code==='string' && typeof this.codeEditor?.getValue() === 'string' ){
      this.block.code = this.codeEditor.getValue();
      console.log(this.block.code)
    }
    this.host.displayspinner.next(true);
    const tempblock = HostedApplicationBlock.fromBlock(this.block!)
    this.host.EditBlockCode(this.nameApp,tempblock).subscribe(
      () =>{
        this.host.displayspinner.next(false);
        this.router.navigate(['/']);       
      });
  }
}


