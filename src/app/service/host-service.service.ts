import {  Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Observable, Subject, throwError } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
export class HostedApplicationBlock {
	constructor(
    public name:string,
    public runtime:string,
    public code:string,
    public application:string,
    public url:string
      ) {}

      public static fromBlock(hostblock:Partial<HostedApplicationBlock>):HostedApplicationBlock {
        return new HostedApplicationBlock(hostblock.name!, hostblock.runtime!, hostblock.code!,hostblock.application!,hostblock.url!);
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
export class Tenant {
	constructor(
		public id: number,
		public name: string,
		public profile: {[key: string]: any},
		public active: boolean,
		public createdAt?:Date,
		public lastActivity?:Date,
	) {}
	public static from(tenant:Partial<Tenant>):Tenant {
		return new Tenant(tenant.id!, tenant.name!, tenant.profile!, tenant.active!);
	}
}




@Injectable({
  providedIn: 'root'
})

export class HostServiceService {
  public Recode:string|undefined = '';
  private urlBase:string;
  private token:string;
  public ListAppChange = new Subject<HostedApplication[]>();
  private ListApp:HostedApplication[] = [];
  displayspinner = new Subject<boolean>();
  public editorChange = new Subject<string>();
 
  constructor(private httper:HttpClient,private config:ConfigService,private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { 
     this.urlBase = config.config.api;
     this.token = config.config.token;
  }
  getListApp(){
    return this.ListApp.slice();
  }

  FilterApp(name:string){
    var copy:HostedApplication[] ;
    copy = this.ListApp.filter((app:HostedApplication) => {    
      if(app.name.toLowerCase().search(name.toLowerCase()) != -1)  return true;
    return false;            
   })
   this.ListAppChange.next(copy.slice());
  }
  
  list(tenantId?:number|string): Observable<HostedApplication[]> {
		const url = !!tenantId ? `${this.urlBase}/tenants/${tenantId}/hosted-applications` : `${this.urlBase}/hosted-applications`;
  	return this.httper.get<HostedApplication[]>(url,
      {
        headers: new HttpHeaders({Authorization: `Bearer ${this.token}`})
      }
      ).pipe(map(req => {
        this.ListApp =[];
        req.sort((a:HostedApplication,b:HostedApplication) => +b.id - +a.id)
        return req.map(app =>{
          this.ListApp.push(HostedApplication.from(app));
          this.ListAppChange.next(this.ListApp.slice());
          return app;
        })
      }),
      catchError((err:HttpErrorResponse) => {
        return throwError(`Error loading configuration from ${err.url} (${err.status}): ${err.error}`);
      }));      
  }
  
  listblock(name:string):Observable<HostedApplication>{
  const url = `${this.urlBase}/hosted-applications/${name}`;
  return this.httper.get<HostedApplication>(url,
    {
      headers: new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }
    ).pipe(map(res => {
      return HostedApplication.from(res)}),
      catchError((err:HttpErrorResponse) => {
      return throwError(`Error loading configuration from ${err.url} (${err.status}): ${err.error}`);
      }));
  }

  create(newApp:HostedApplication):Observable<HostedApplication>{
    return this.httper.post<HostedApplication>(`${this.urlBase}/hosted-applications/${newApp.name}`,
    newApp,
    {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }).pipe(map( (data:HostedApplication) => {
      console.log(data);
      this.ListApp.push(data);
      this.ListApp.sort((a:HostedApplication,b:HostedApplication) => +b.id - +a.id);
      this.ListAppChange.next(this.ListApp.slice());
      return data;
    }))   
   }

   Delete(nameDeleted:string){
     this.httper.delete(`${this.urlBase}/hosted-applications/${nameDeleted}`,
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

   getTenant():Observable<Tenant>{
    return this.httper.get<Tenant>(`${this.urlBase}/tenants/self`,
    {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }).pipe(map(res => Tenant.from(res)));
   }

   postBlock(nameApp:string,block:HostedApplicationBlock){
     return this.httper.post<HostedApplicationBlock>(`${this.urlBase}/hosted-applications/${nameApp}/${block.name}`,block,
     {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    }).pipe(map(res => {
      this.ListApp.find(a => a.name === nameApp)?.blocks.push(block);
      this.ListAppChange.next(this.ListApp.slice());
    }));
   }

   listRunTime(){
     return this.httper.get<string[]>(`${this.urlBase}/apps/runtimes`,
     {
      headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
    })
   }

   EditBlockCode(nameApp:string|undefined,block:HostedApplicationBlock|undefined){
    return this.httper.put<HostedApplicationBlock>(`${this.urlBase}/hosted-applications/${nameApp}/${block?.name}`,{code:block?.code},
    {
     headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
   }).pipe(map(res => {
     this.ListApp.map(app => {
       if(app.name === nameApp){
         app.blocks.map(block => {
           if(block.name === res.name)
             block.code = res.code;
         })
       }
     });
     this.ListAppChange.next(this.ListApp.slice());
   })).subscribe(()=>{
     this.list().subscribe(()=>{
      this.displayspinner.next(false);
     });
   });
   }

   Deleteblock(nameApp:string,block:string){
    return this.httper.delete<HostedApplicationBlock>(`${this.urlBase}/hosted-applications/${nameApp}/${block}`,
    {
     headers:new HttpHeaders({Authorization: `Bearer ${this.token}`})
   }).pipe(map(() => {   
     let temp:HostedApplicationBlock[] = this.ListApp.find(app => app.name === nameApp)!.blocks.filter(blocks => blocks.name !== block);      
     if(temp.length === 0){
      this.Delete(nameApp);
      return;
    }
     this.ListApp.find(app => app.name === nameApp)!.blocks = temp;
     this.ListAppChange.next(this.ListApp.slice());
   })).subscribe(
    () => {
      this.displayspinner.next(false);            
    }
  );
  }

  getfile(datalink:any){
    return this.httper.get<string>(datalink,{
      headers:new HttpHeaders({'content-type': 'application/json'})
    })
  }

  createIcons(){
    this.matIconRegistry.addSvgIcon(
      "javascript",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/javascript_icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "ruby",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/ruby_PNG28.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "static",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/xml.icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "forward",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/forward_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "select",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/img/select_icon.svg")
    );
  }
  
	}
  




