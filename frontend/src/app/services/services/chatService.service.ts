import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:11434/api/generate';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const requestBody = {
      model: "llama2",
      prompt: message,
      stream: false // Force single response
    };

    return this.http.post(this.apiUrl, requestBody, { responseType: 'text' }).pipe(
      map((response: string) => {
        try {
          // Handle both single response and last chunk of stream
          const lastNewline = response.lastIndexOf('\n');
          const jsonStr = lastNewline >= 0 ? response.substring(lastNewline) : response;
          return JSON.parse(jsonStr).response;
        } catch (e) {
          console.error('Parsing error:', e);
          return "Sorry, I couldn't process that response.";
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return throwError(() => 'Failed to get response from chatbot');
      })
    );
  }
}