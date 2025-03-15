import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ITokenData} from '../models/api/ITokenData';
import {IApiResponse} from "../models/api/IApiResponse";

@Injectable({
  providedIn: 'root'
})
export class StreamLabsService {
  constructor(private readonly http: HttpClient) { }

  getTokenFromCode(code: string): Observable<IApiResponse<ITokenData>> {
    return this.http.post<IApiResponse<ITokenData>>(`${environment.api_url}/streamlabs?code=${code}`, {});
  }
}
