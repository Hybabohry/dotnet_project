
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { ApplicationResponseDto } from '../../models/application-response-dto';


export function apiApplicationGetForCandidate(
  http: HttpClient,
  rootUrl: string,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<ApplicationResponseDto>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicationGetForCandidate.PATH, 'get');
  rb.header('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ApplicationResponseDto>>;
    })
  );
}

apiApplicationGetForCandidate.PATH = '/api/Application/my-applications';