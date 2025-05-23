import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private baseUrl = 'http://localhost:5096'; // Hardcode the backend URL

  constructor(private http: HttpClient) {}

  apiApplicationInterviewsPost({ body }: { body: any }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Application/interviews`, body);
  }

  apiApplicationInterviewsApplicationIdGet({ applicationId }: { applicationId: string }): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Application/interviews/${applicationId}`);
  }

  // New method to accept (shortlist) an application
  apiApplicationAcceptApplicationIdPut({ applicationId }: { applicationId: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/Application/${applicationId}/accept`, {});
  }

  // New method to reject an application
  apiApplicationRejectApplicationIdPut({ applicationId }: { applicationId: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/Application/${applicationId}/reject`, {});
  }
}