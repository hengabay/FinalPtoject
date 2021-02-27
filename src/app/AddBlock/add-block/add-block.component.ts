import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostedApplicationBlock, HostServiceService } from 'src/app/service/host-service.service';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.css']
})
export class AddBlockComponent implements OnInit {
  runtimes:string[] = ['javascript','ruby','static','forward','select'];

  AddBlockForm: FormGroup=new FormGroup({
    'blockname':new FormControl('',Validators.required),
    'runtime':new FormControl(null,Validators.required),
    'code':new FormControl(''),
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private host:HostServiceService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.host.displayspinner.next(true);
    const newBlock = HostedApplicationBlock.fromBlock({
      name:this.AddBlockForm.value.blockname,
      runtime:this.AddBlockForm.value.runtime,
      code:this.AddBlockForm.value.code,
    });
    this.host.postBlock(this.data.name,newBlock).subscribe(data => {
      this.host.displayspinner.next(false);
    })
  }
  

}
