import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup,NgForm,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostedApplication, HostServiceService } from 'src/app/service/host-service.service';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  savecode:string|undefined;
  errorInvalidName:boolean = false;
  runtimes:string[] = ['javascript','ruby','static','forward','select'];
  AddAppForm: FormGroup=new FormGroup({
    'appname':new FormControl('',[Validators.required,this.checkValidName.bind(this)]),
    'blockname':new FormControl('main'),
    'runtime':new FormControl(null,Validators.required),
  });
  constructor(private host:HostServiceService,
              private router:Router, 
              private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data:any|undefined) {
                
                host.listRunTime().subscribe(
                 runtime =>  console.log(runtime)
                )
              }
  @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;
  
  private codeEditor?: ace.Ace.Editor;
  private editorBeautify:any;
  ngOnInit(): void {    
    this.configerEditor();
  }

  onSubmit(){
    
    console.log(this.codeEditor?.getValue())
    this.host.displayspinner.next(true);
    const newApp:HostedApplication = HostedApplication.from({
      name:this.AddAppForm.value.appname,
      url:`cx://hosted-app/${this.AddAppForm.value.appname}/${this.AddAppForm.value.blockname}`,
      blocks:[{
        name:this.AddAppForm.value.blockname,
        runtime:this.AddAppForm.value.runtime,
        code:this.codeEditor!.getValue()
      }]
    });
    
    this.host.create(newApp).subscribe(data =>{
      this.router.navigate(['/']);
      this.host.displayspinner.next(false);
    },
    (err:HttpErrorResponse) => {
      this.host.displayspinner.next(false);
      if(err.status === 409){
        alert("We are sorry there is a conflict, choose another name for the application")
        this.dialog.open(CreateComponent,{data:{runtime:this.AddAppForm.value.runtime,code:this.codeEditor?.getValue()}});  
      }})
    }

  checkValidName(control:FormControl): {[s:string]:boolean}|null {
    let temp:HostedApplication[] =[];
      temp = this.host.getListApp().filter(name => name.name === control.value);
      if(temp.length>0){
        return {'nameExists':true}
      }
      return null;
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
        highlightActiveLine: true,
        minLines: 15,
        maxLines: Infinity,
        fontSize:15};
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
    this.codeEditor.setTheme(`ace/theme/twilight`);
    this.codeEditor.getSession().setMode(`ace/mode/javascript`) 
    this.codeEditor.setShowFoldWidgets(true);
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.beautifyContent();
    if(this.data != null){
      this.codeEditor?.insert(`${this.data.code}`);
    }  
    
  }
    
  

  
  
  
}
