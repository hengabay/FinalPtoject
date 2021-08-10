import {  HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';
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
    selectedRuntime:string = '';
    Recode:string|undefined;
    errorInvalidName:boolean = false;
    runtimes:string[] = [];
    CreateForm: FormGroup=new FormGroup({
      'appname':new FormControl('',[Validators.required,this.checkValidName.bind(this)]),
      'defaultBlock':new FormControl('main'),
      'blockname':new FormControl('',[Validators.required,this.checkValisNameBlock.bind(this)]),
      'runtime':new FormControl(null,Validators.required),
      'forward':new FormControl(),
    });
  constructor(private host:HostServiceService,
              private router:Router, 
              private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data:{name:string}) {}

    @ViewChild('codeEditor',{static:true}) codeEditorElmRef?: ElementRef;
    private codeEditor?: ace.Ace.Editor;
    private editorBeautify:any;
    public CheckFild:string = '';

  ngOnInit(): void { 
    this.host.listRunTime().subscribe(runtime => {
      this.runtimes.push(...runtime);
    });                  
    this.configerEditor();
  }

  onSubmit(){
    if(!this.data){
      if(this.CheckFild == 'forward')  this.codeEditor?.setValue(`${this.CreateForm.value.forward}`);
      this.host.displayspinner.next(true);
      const newApp:HostedApplication = HostedApplication.from({
        name:this.CreateForm.value.appname,
        url:`cx://hosted-app/${this.CreateForm.value.appname}`,
        blocks:[{
          name:this.CreateForm.value.defaultBlock,
          runtime:this.CreateForm.value.runtime,
          code:this.codeEditor!.getValue(),
          application:this.CreateForm.value.appname,
          url:`cx://hosted-app/${this.CreateForm.value.appname}/${this.CreateForm.value.defaultBlock}`
        }]
      });
      this.host.create(newApp).subscribe(data =>{
        this.host.Recode ='';
        this.host.displayspinner.next(false);
      },
      (err:HttpErrorResponse) => {
        this.host.displayspinner.next(false);
        if(err.status === 409){
          alert("We are sorry there is a conflict, choose another name for the application");
          this.host.Recode =this.codeEditor?.getValue()
          this.dialog.open(CreateComponent);  
        }})    
      }
      else{
        if(this.CheckFild == 'forward')  this.codeEditor?.setValue(`${this.CreateForm.value.forward}`);
        this.host.displayspinner.next(true);
        const newBlock = HostedApplicationBlock.fromBlock({
          name:this.CreateForm.value.blockname,
          runtime:this.CreateForm.value.runtime,
          code:this.codeEditor!.getValue(),
          application:this.data.name,
          url:`cx://hosted-app/${this.data.name}/${this.CreateForm.value.blockname}`
        });
        this.host.postBlock(this.data.name,newBlock).subscribe(data => {
          this.host.displayspinner.next(false);
        },
        (err:HttpErrorResponse) => {
          this.host.displayspinner.next(false);
          if(err.status === 409){
            alert("We are sorry there is a conflict, choose another name for the block");
            this.host.Recode =this.codeEditor?.getValue()
            this.dialog.open(CreateComponent);  
          }})
        }
    }

  checkValidName(control:FormControl): {[s:string]:boolean}|null {
    let temp:HostedApplication[] =[];
      temp = this.host.getListApp().filter(name => name.name === control.value);
      if(temp.length>0){
        return {'nameExists':true}
      }
      return null;
  }
  checkValisNameBlock(control: FormControl): {[s:string]: boolean} | null {
    let temp:HostedApplicationBlock[]|undefined = [];
    if(this.data) {
      temp = this.host.getListApp().find(name => name.name === this.data.name)?.blocks.filter(block => block.name === control.value);
    }
      if(temp!.length>0) {
        return {'nameExists':true}
      }
      return null;
  }

  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
        highlightActiveLine: true,
        minLines: 11,
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

  public configerEditor() {
    ace.config.set('basePath', '');
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef?.nativeElement;
    const editorOptions = this.getEditorOptions();
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(`ace/theme/twilight`);
    this.codeEditor.getSession().setMode(`ace/mode/javascript`) 
    this.codeEditor.setShowFoldWidgets(true);
    this.editorBeautify = ace.require('ace/ext/beautify');
    this.beautifyContent();
    this.codeEditor?.insert(`${this.host.Recode}`);
  }
  getRuntime(runtime:string){
    switch(runtime) { 
      case 'javascript': { 
        this.CheckFild = "";
        this.codeEditor?.setReadOnly(false);
        this.codeEditor?.getSession().setMode(`ace/mode/javascript`);
        this.codeEditor?.setValue('');
        this.codeEditor?.insert("function preamble() { return '<?xml version='1.0'?>'; }\nfunction response(content) { return `<Response>${content}</Response>`; }\nfunction dial(content) { return `<Dial>${content}</Dial>`; }\nfunction queue(name, url) { return '<Queue ' + (url?`url='${url}'`:'') + `>${name}</Queue>`; }\nfunction getQueueName(event) { return 'sales'; }\nexports.handler = function(ev, ctx, callback) {\ntry {\ncallback(null, preamble() + response(dial(queue(getQueueName(ev), 'queue-announce'))));}\n catch (err) {callback(err);}};");
 
         break; 
      } 
      case 'ruby': { 
        this.CheckFild = "";
        this.codeEditor?.setReadOnly(false);
        this.codeEditor?.getSession().setMode(`ace/mode/ruby`); 
        this.codeEditor?.setValue('');
        this.codeEditor?.insert("\ndef handler(ev, ctx)\n'<?xml version=\'1.0\'?>\n<Response>\n<Say>\nYou are about to be connected to a sales representative,please hold on the line\n</Say>\n</Response>'\nend\n")
         break; 
      } 
      case 'static': { 
        this.CheckFild = "";
        this.codeEditor?.setReadOnly(false);
        this.codeEditor?.getSession().setMode(`ace/mode/xml`);
        this.codeEditor?.setValue('');
        this.codeEditor?.insert("\n<?xml version='1.0'?>\n<Response>\n<Gather action='main-routing' input='dtmf' numDigits='1'>\n<Say>Welcome to Famous Company Ltd. For sales press 1, for customer support press 2, and for billing press 3.</Say>\n</Gather>\n</Response>\n")  
         break; 
      } 
      case 'forward': {
        this.codeEditor?.getSession().setMode(''); 
        this.codeEditor?.setValue("Fill the input below")
        this.codeEditor?.setReadOnly(true);
        this.CheckFild = 'forward';
        break;
      }
      default: {
        this.CheckFild = "";
        this.codeEditor?.setReadOnly(false);
        this.codeEditor?.setValue('');
        this.codeEditor?.insert("1: sales-queue\n2: support-menu\n3: dial-billing");
        break;
      }
   } 
  }
  uploadFile(file:any) {
    let files:File =file.target.files[0];
    let type:string = files.type;
    if(type.search("text") !== -1){
      getBase64(files).then(
        (data:any) => this.host.getfile(data).subscribe(data =>{},
        (err:HttpErrorResponse) =>    this.codeEditor?.insert(`${err.error.text}`)));    
    } else {
      alert("Please choose text file")
    }
   
    function getBase64(file:any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
  }
}
