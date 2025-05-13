import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {IApiResponse} from "../models/api/IApiResponse";
import {ISocketToken} from "../models/api/ISocketToken";

@Injectable({
  providedIn: 'root'
})
export class StreamLabsService {
  constructor(private readonly http: HttpClient) { }

  public getSocketTokenFromCode(code: string): Observable<IApiResponse<ISocketToken>> {
    return this.http.post<IApiResponse<ISocketToken>>(`${environment.api_url}/streamlabs?code=${code}`, {});
  }
}
