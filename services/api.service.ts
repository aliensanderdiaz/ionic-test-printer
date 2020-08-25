import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlApi = environment.urlApi;

  constructor(
    private http: HttpClient
  ) { }

  peticionGet(url) {
    return this.http.get(`${this.urlApi}${url}`);
  }
}
