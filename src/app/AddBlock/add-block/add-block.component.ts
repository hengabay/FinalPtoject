import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostedApplication, HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.css']
})
export class AddBlockComponent implements OnInit {
  runtimes:string[] = ['javascript','ruby','static','forward','select'];

  AddBlockForm: FormGroup=new FormGroup({
    'blockname':new FormControl('',[Validators.required,this.checkValidName.bind(this),Validators.minLength(2)]),
    'runtime':new FormControl(null,Validators.required),
    'code':new FormControl(''),
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public app:any,private host:HostServiceService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.host.displayspinner.next(true);
    const newBlock = HostedApplicationBlock.fromBlock({
      name:this.AddBlockForm.value.blockname,
      runtime:this.AddBlockForm.value.runtime,
      code:this.AddBlockForm.value.code,
      application:this.app.name,
      url:`cx://hosted-app/${this.app.name}/${this.AddBlockForm.value.blockname}`
    });
    this.host.postBlock(this.app.name,newBlock).subscribe(data => {
      console.log(data);
      this.host.displayspinner.next(false);
    })
  }

  checkValidName(control:FormControl): {[s:string]:boolean}|null {
    let temp:HostedApplicationBlock[] =[];
    this.host.getListApp().forEach((element:HostedApplication) => {
      if(element.name == this.app.name)
        temp = element.blocks.filter(name => name.name === control.value)      
    });
      if(temp.length>0){
        return {'nameExists':true}
      }
      return null;
  }

}
