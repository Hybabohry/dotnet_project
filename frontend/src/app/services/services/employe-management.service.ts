import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceReview } from '../models/performance-review.model';

interface Employee {
  Id: string;
  Lastname: string;
  Firstname: string;
  Telephone: string;
  Email: string;
  Poste: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5096/api/EmployeManagement';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.get<Employee[]>(this.apiUrl, { headers });
  }
  getPerformanceReviews(employeeId: string): Observable<PerformanceReview[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.get<PerformanceReview[]>(
      `http://localhost:5096/api/EmployeePerformance/${employeeId}`,{ headers }
    );
  }

  getEmployee(id: string): Observable<Employee> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, { headers });
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.post<Employee>(this.apiUrl, employee, { headers });
  }

  updateEmployee(id: string, employee: Employee): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee, { headers });
  }

  deleteEmployee(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}