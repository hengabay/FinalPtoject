import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';


export class HostedApplicationBlock {
	constructor(
    public name:string,
     public runtime:string,
      public code:string
      ) {}

      public static fromBlock(hostblock:Partial<HostedApplicationBlock>):HostedApplicationBlock {
        return new HostedApplicationBlock(hostblock.name!, hostblock.runtime!, hostblock.code!);
      }
}

export class HostedApplication {
	constructor(
		public id: number,
		public tenantId: number|string,
		public name: string,
		public url: string,
		public blocks:HostedApplicationBlock[]
	) {}

  public static from(hostapp:Partial<HostedApplication>):HostedApplication {
		return new HostedApplication(hostapp.id!, hostapp.tenantId!, hostapp.name!, hostapp.url!, hostapp.blocks!);
	}
}



@Injectable({
  providedIn: 'root'
})

export class HostServiceService {
  private urlBase:string;
  private token:string;
  public ListAppChange = new Subject<HostedApplication[]>();
  private ListApp:HostedApplication[] = [];
  displayspinner = new Subject<boolean>();
  constructor(private httper:HttpClient,private config:ConfigService) { 
     this.urlBase = config.config.api;
     this.token = config.config.token;
  }
  getListApp(){
    return this.ListApp.slice();
  }
  

  list(tenantId?:number|string): Observable<HostedApplication[]> {
		const url = !!tenantId ? `${this.urlBase}/tenants/${tenantId}/hosted-applications` : `${this.urlBase}/hosted-applications`;
  	return this.httper.get<HostedApplication[]>(url,
      {
        headers: new HttpHeaders({Authorization: `Bearer ${this.token}`})
      }
      ).pipe(map(req => req.map(h =>
        {
          const host = HostedApplication.from(h);
          this.ListApp.push(host);
          this.ListAppChange.next(this.ListApp.slice());
          this.displayspinner.next(false)
         return host;
        })));
        
  }
  
  listblock(name:string):Observable<HostedApplication>{
    const url = `${this.urlBase}/hosted-applications/${name}`;
    return this.httper.get<HostedApplication>(url,
      {
        headers: new HttpHeaders({Authorization: `Bearer ${this.token}`})
      }
      ).pipe(map(res => HostedApplication.from(res)));
  }

  create(newApp:HostedApplication){
    return this.httper.post<HostedApplication>(`${this.urlBase}/hosted-applications`,
    newApp,
    {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }).pipe(map( (data:HostedApplication) => {
      this.ListApp.push(data);
      this.ListAppChange.next(this.ListApp.slice());
      
      return data;
    }))
      
   }

   Delete(nameDeleted:string){
    return this.httper.delete(`${this.urlBase}/hosted-applications/${nameDeleted}`,
    {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }).subscribe(() => {
      let temp:HostedApplication[] =[];
      temp = this.ListApp.filter(name => name.name!==nameDeleted);
      this.ListApp = temp;
      this.ListAppChange.next(this.ListApp.slice());
      this.displayspinner.next(false);

    });
   }

   

  
	}
  




