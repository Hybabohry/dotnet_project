import { HttpClient, HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { ApplicationDtoPost } from '../../models/application-dto-post';

export interface ApiApplicationApplyPost$Params {
  body: ApplicationDtoPost;
}

export function apiApplicationApplyPost(
  http: HttpClient,
  rootUrl: string,
  params: ApiApplicationApplyPost$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<{ Message: string; ApplicationId: string }>> {
  const url = `${rootUrl}/api/Application/apply`;

  // Validate required fields
  if (!params.body.CandidatId || !params.body.JobOfferId) {
    throw new Error('CandidatId and JobOfferId are required');
  }

  // Create JSON payload
  const body: ApplicationDtoPost = {
    CandidatId: params.body.CandidatId,
    JobOfferId: params.body.JobOfferId
  };

  // Log payload for debugging
  console.log('Request payload:', body);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  return http.post(url, body, {
    headers,
    context,
    observe: 'response',
    responseType: 'json'
  }).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<{ Message: string; ApplicationId: string }>;
    })
  );
}
apiApplicationApplyPost.PATH = '/api/Application/apply';