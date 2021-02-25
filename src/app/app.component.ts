import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ConfigService } from './service/config.service';
import { HostedApplication, HostServiceService } from './service/host-service.service';
import {PageEvent} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from './create/create/create.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  
  constructor(private service:HostServiceService,public dialog: MatDialog ){
    
  }
  

  ngOnInit(){

  }

  AddApp(){
    this.dialog.open(CreateComponent);  
  }

  

  
  }



