import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Info } from "../models/info";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TimeService {
  constructor(private http: HttpClient) {}

  public approxServerTimeDifference(): Observable<number> {
    return this.http.get<Info>(`${environment.url}/api/info/`).pipe(
      map((data: Info) => {
        return Date.now() - new Date(data.datetime).getTime();
      })
    );
  }
}
