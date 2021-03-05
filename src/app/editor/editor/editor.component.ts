import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { ActivatedRoute, Params } from '@angular/router';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';



const THEME = 'ace/theme/github'; 
const LANG = 'ace/mode/javascript';
const RUBY = 'ace/mode/ruby';
const XML = 'ace/mode/xml';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;
  
  private codeEditor?: ace.Ace.Editor;
  private editorBeautify:any;
  block?:{nameApp?:string,nameblock?:string,runtime?:string,code?:string};

  constructor(private rout:ActivatedRoute,private host:HostServiceService) { }

  ngOnInit(): void {
    let tempApp:HostedApplication|undefined = this.host.getListApp().find(app =>this.rout.snapshot.params['nameapp'] === app.name);
    let tempBlock:HostedApplicationBlock|undefined = this.host.getListApp().find(app =>this.rout.snapshot.params['nameapp'] === app.name)?.blocks.find(block => this.rout.snapshot.params['nameblock'] === block.name);
    this.block = {
      nameApp: tempApp?.name,
      nameblock: tempBlock?.name,
      runtime:tempBlock?.runtime,
      code:tempBlock?.code,
    }
    
    this.rout.params.subscribe(
      (params:Params) => {
        this.host.listblock(params['nameapp']).subscribe(
          (app:HostedApplication) => {
            this.block = {
              nameApp : app.name,
              nameblock : app.blocks.find( block => block.name === params['nameblock'])?.name,
              runtime : app.blocks.find( block => block.name === params['nameblock'])?.runtime ,
              code:app.blocks.find( block => block.name === params['nameblock'])?.code,
            }
            this.codeEditor?.setValue('');

            this.codeEditor?.insert(`${this.block.code}`);
          }
        );
       
        
      }
    );
    ace.require('ace/ext/language_tools');
        const element = this.codeEditorElmRef?.nativeElement;
        const editorOptions = this.getEditorOptions();

        this.codeEditor = ace.edit(element, editorOptions);
        this.codeEditor.setTheme(THEME);
        switch(this.block.runtime) { 
          case 'javascript': { 
            this.codeEditor.getSession().setMode(LANG);
            break; 
          } 
          case 'ruby': { 
            this.codeEditor.getSession().setMode(RUBY); 
             break; 
          } 
          case 'static': { 
            this.codeEditor.getSession().setMode(XML); 
             break; 
          } 
          default: { 
             //statements; 
             break; 
          } 
       } 
        this.codeEditor.setShowFoldWidgets(true);
        this.editorBeautify = ace.require('ace/ext/beautify');
        this.beautifyContent();
        if(this.block.code){
          this.codeEditor.setValue('');
          this.codeEditor.insert(`${this.block.code}`);
        }
        else{
          this.codeEditor.insert(`loading...`);
        }
        
     }

    // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a wolkaround still using ts
    private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
        const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
            highlightActiveLine: true,
            minLines: 14,
            maxLines: Infinity,
            
        };

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
  }
}
configerEditor(){

}


}
