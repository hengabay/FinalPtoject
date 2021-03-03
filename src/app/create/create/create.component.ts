import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,NgForm,Validators } from '@angular/forms';
import { HostedApplication, HostServiceService } from 'src/app/service/host-service.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  errorInvalidName:boolean = false;
  runtimes:string[] = ['javascript','ruby','static','forward','select'];
  AddAppForm: FormGroup=new FormGroup({
    'appname':new FormControl('',[Validators.required,this.checkValidName.bind(this),Validators.minLength(2)]),
    'blockname':new FormControl('main'),
    'runtime':new FormControl(null,Validators.required),
    'code':new FormControl(''),
  });
  constructor(private host:HostServiceService) { }

  ngOnInit(): void {
    
  }



  onSubmit(){
    console.log(this.AddAppForm.value);
    this.host.displayspinner.next(true);
    const newApp:HostedApplication = HostedApplication.from({
      name:this.AddAppForm.value.appname,
      url:`cx://hosted-app/${this.AddAppForm.value.appname}/${this.AddAppForm.value.blockname}`,
      blocks:[{
        name:this.AddAppForm.value.blockname,
        runtime:this.AddAppForm.value.runtime,
        code:this.AddAppForm.value.code,
        url:`cx://hosted-app/${this.AddAppForm.value.appname}/${this.AddAppForm.value.blockname}`
      }]
    });
    
    this.host.create(newApp).subscribe(data =>{
      this.host.displayspinner.next(false);
    })
  }

  checkValidName(control:FormControl): {[s:string]:boolean}|null {
    let temp:HostedApplication[] =[];
      temp = this.host.getListApp().filter(name => name.name === control.value);
      if(temp.length>0){
        return {'nameExists':true}
      }
      return null;
  }
    
  

  
  
  
}
