import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostedApplicationBlock, HostServiceService } from '../service/host-service.service';
import { Router } from '@angular/router';
import { EditorComponent } from '../editor/editor/editor.component';

@Component({
  selector: 'app-edit-block',
  templateUrl: './edit-block.component.html',
  styleUrls: ['./edit-block.component.css']
})
export class EditBlockComponent {

  constructor(private dialog:MatDialog,@Inject(MAT_DIALOG_DATA)
               public data:{block:HostedApplicationBlock,AppName:string},
              private host:HostServiceService,private router:Router) { }

  @ViewChild('editor',{static:true}) codeEditorElmRef?:EditorComponent ;
  public afterEditCode:string = '';

  public update(){
    
    console.log(this.codeEditorElmRef?.getValue());
    // this.host.displayspinner.next(true);
    // this.afterEditCode = this.codeEditorElmRef.codeEditorElmRef.nativeElement.innerText;
    // var numberRow = this.codeEditorElmRef.codeEditor.$lastSel.end.row + 1;
    // this.afterEditCode = this.afterEditCode.replace(this.afterEditCode.slice(0,numberRow*2),'');
    // this.data.block.code = this.afterEditCode;
    // this.host.EditBlockCode(this.data.AppName,this.data.block);
  }
}
