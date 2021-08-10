import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { ActivatedRoute, Router } from '@angular/router';
import {  HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';

const THEME = 'ace/theme/monokai'; 
@Component({
  selector: 'app-editor',
  template: `
    <div 
      class="app-ace-editor"
      #codeEditor
      style="width: 100%;height: 250px;"
    ></div>
  `,

styles: [
  `
    .app-ace-editor {
      border: 2px solid #f8f9fa;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `,
]
})
export class EditorComponent implements OnInit {
  @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;
  @Input() item?:{block:HostedApplicationBlock,readOnly:boolean};
  public binding:string = ''
  private codeEditor?: ace.Ace.Editor;
  private editorBeautify:any;
  public forward:boolean = true;
  public disabled:boolean = true;
  nameApp?:string;

  constructor(private rout:ActivatedRoute,private host:HostServiceService,private router:Router) { }

  ngOnInit(): void {
      this.configerEditor();
    }
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: this.item?.readOnly ? 13 : 17,
          maxLines: Infinity,
          fontSize:16,
          autoScrollEditorIntoView:false,
          readOnly:this.item?.readOnly,
          useSoftTabs:true
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
    };}

  public configerEditor(){
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef?.nativeElement;
    const editorOptions = this.getEditorOptions();
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(`ace/mode/${this.item?.block?.runtime !== 'static' ? this.item?.block?.runtime : 'xml'}`) 
    this.codeEditor.setShowFoldWidgets(true);
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.beautifyContent();
    this.codeEditor.setValue('');
    this.codeEditor.insert(`${this.item?.block?.code}`);
    }

    public getValue() : string {
      if(this.codeEditor) {
        return this.codeEditor.getValue();
      }
        return '';
    }
}