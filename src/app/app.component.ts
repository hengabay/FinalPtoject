import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ConfigService } from './service/config.service';
import { HostedApplication, HostServiceService } from './service/host-service.service';
import {PageEvent} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from './create/create/create.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  nametanent:string = '';
  constructor(private service:HostServiceService,public dialog: MatDialog,private router:Router ){
    
  }
  

  ngOnInit(){
    this.service.getTenant().subscribe(tenant =>{
      console.log(tenant)
      this.nametanent = tenant.name;
    });

    
  }

  AddApp(){
    this.dialog.open(CreateComponent);  
  }

  

  
  }



