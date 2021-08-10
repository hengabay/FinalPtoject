import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';



export interface AppConfig {
	api: string;
	token:string;
}

@Injectable({
  providedIn: 'root',
})

export class ConfigService {
  private configData:AppConfig|undefined;
  private readonly configURL: string = '/appconfig.json';
  constructor(private http:HttpClient) { }

  get factory(): () => Promise<any> {
    return () => this.loadConfiguration();
  }

  loadConfiguration(): Promise<AppConfig> {
		return this.http
			.get<AppConfig>(this.configURL + '?' + Math.floor(Math.random()*10000),
			
			) 
			.pipe(
				map(config =>  this.configData = config),
				catchError((err:HttpErrorResponse) => {
					return throwError(`Error loading configuration from ${err.url} (${err.status}): ${err.error}`);
				})).toPromise();
	}
  

  get config():AppConfig{
     return this.configData!;
  }


  
}


