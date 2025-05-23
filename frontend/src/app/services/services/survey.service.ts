import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { SurveyCreateDto, SurveyQuestionDto } from '../models/survey-create-dto';
import { SurveyDto, SurveyResponseViewDto } from '../models/survey-dto';
import { SubmitSurveyResponseDto } from '../models/submit-survey-response-dto';

@Injectable({ providedIn: 'root' })
export class SurveyService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiSurveyPost()` */
  static readonly ApiSurveyPostPath = '/api/Survey';

  apiSurveyPost$Response(params: { body: SurveyCreateDto }, context?: HttpContext): Observable<StrictHttpResponse<SurveyDto>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyPostPath, 'post');
    rb.body(params.body, 'application/json');
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<SurveyDto>)
    );
  }

  /** Path part for operation `apiSurveyGetTotalEmployeesGet()` */
static readonly ApiSurveyGetTotalEmployeesGetPath = '/api/Survey/GetTotalEmployees';

apiSurveyGetTotalEmployeesGet$Response(params?: {}, context?: HttpContext): Observable<StrictHttpResponse<{ totalEmployees: number }>> {
  const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyGetTotalEmployeesGetPath, 'get');
  return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<{ totalEmployees: number }>)
  );
}

apiSurveyGetTotalEmployeesGet$Json(params?: {}, context?: HttpContext): Observable<{ totalEmployees: number }> {
  return this.apiSurveyGetTotalEmployeesGet$Response(params, context).pipe(
    map((r: StrictHttpResponse<{ totalEmployees: number }>): { totalEmployees: number } => r.body)
  );
}

  apiSurveyPost$Json(params: { body: SurveyCreateDto }, context?: HttpContext): Observable<SurveyDto> {
    return this.apiSurveyPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<SurveyDto>): SurveyDto => r.body)
    );
  }

  /** Path part for operation `apiSurveyGetSurveysByRHGet()` */
  static readonly ApiSurveyGetSurveysByRHGetPath = '/api/Survey/GetSurveysByRH';

  apiSurveyGetSurveysByRHGet$Response(params?: {}, context?: HttpContext): Observable<StrictHttpResponse<Array<SurveyDto>>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyGetSurveysByRHGetPath, 'get');
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<SurveyDto>>)
    );
  }

  apiSurveyGetSurveysByRHGet$Json(params?: {}, context?: HttpContext): Observable<Array<SurveyDto>> {
    return this.apiSurveyGetSurveysByRHGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SurveyDto>>): Array<SurveyDto> => r.body)
    );
  }

  /** Path part for operation `apiSurveyGetById()` */
  static readonly ApiSurveyGetByIdPath = '/api/Survey/{id}';

  apiSurveyGetById$Response(params: { id: string }, context?: HttpContext): Observable<StrictHttpResponse<SurveyDto>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyGetByIdPath, 'get');
    rb.path('id', params.id);
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<SurveyDto>)
    );
  }

  apiSurveyGetById$Json(params: { id: string }, context?: HttpContext): Observable<SurveyDto> {
    return this.apiSurveyGetById$Response(params, context).pipe(
      map((r: StrictHttpResponse<SurveyDto>): SurveyDto => r.body)
    );
  }

  /** Path part for operation `apiSurveyUpdate()` */
  static readonly ApiSurveyUpdatePath = '/api/Survey/{id}';

  apiSurveyUpdate$Response(params: { id: string, body: SurveyCreateDto }, context?: HttpContext): Observable<StrictHttpResponse<SurveyDto>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyUpdatePath, 'put');
    rb.path('id', params.id);
    rb.body(params.body, 'application/json');
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<SurveyDto>)
    );
  }

  apiSurveyUpdate$Json(params: { id: string, body: SurveyCreateDto }, context?: HttpContext): Observable<SurveyDto> {
    return this.apiSurveyUpdate$Response(params, context).pipe(
      map((r: StrictHttpResponse<SurveyDto>): SurveyDto => r.body)
    );
  }

  /** Path part for operation `apiSurveyDelete()` */
  static readonly ApiSurveyDeletePath = '/api/Survey/{id}';

  apiSurveyDelete$Response(params: { id: string }, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyDeletePath, 'delete');
    rb.path('id', params.id);
    return this.http.request(rb.build({ responseType: 'text', accept: 'text/plain', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<void>)
    );
  }

  apiSurveyDelete$Json(params: { id: string }, context?: HttpContext): Observable<void> {
    return this.apiSurveyDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `apiSurveyRespondPost()` */
  static readonly ApiSurveyRespondPostPath = '/api/Survey/respond';

  apiSurveyRespondPost$Response(params: { body: Array<SubmitSurveyResponseDto> }, context?: HttpContext): Observable<StrictHttpResponse<{ message: string }>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyRespondPostPath, 'post');
    rb.body(params.body, 'application/json');
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<{ message: string }>)
    );
  }

  apiSurveyRespondPost$Json(params: { body: Array<SubmitSurveyResponseDto> }, context?: HttpContext): Observable<{ message: string }> {
    return this.apiSurveyRespondPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<{ message: string }>): { message: string } => r.body)
    );
  }

  /** Path part for operation `apiSurveyGetSurveysForEmployeeGet()` */
  static readonly ApiSurveyGetSurveysForEmployeeGetPath = '/api/Survey/GetSurveysForEmployee';

  apiSurveyGetSurveysForEmployeeGet$Response(params?: {}, context?: HttpContext): Observable<StrictHttpResponse<Array<SurveyDto>>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyGetSurveysForEmployeeGetPath, 'get');
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<SurveyDto>>)
    );
  }

  apiSurveyGetSurveysForEmployeeGet$Json(params?: {}, context?: HttpContext): Observable<Array<SurveyDto>> {
    return this.apiSurveyGetSurveysForEmployeeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SurveyDto>>): Array<SurveyDto> => r.body)
    );
  }

  /** Path part for operation `apiSurveyGetResponsesGet()` */
  static readonly ApiSurveyGetResponsesGetPath = '/api/Survey/GetResponses/{surveyId}';

  apiSurveyGetResponsesGet$Response(params: { surveyId: string }, context?: HttpContext): Observable<StrictHttpResponse<Array<SurveyResponseViewDto>>> {
    const rb = new RequestBuilder(this.rootUrl, SurveyService.ApiSurveyGetResponsesGetPath, 'get');
    rb.path('surveyId', params.surveyId);
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<Array<SurveyResponseViewDto>>)
    );
  }

  apiSurveyGetResponsesGet$Json(params: { surveyId: string }, context?: HttpContext): Observable<Array<SurveyResponseViewDto>> {
    return this.apiSurveyGetResponsesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SurveyResponseViewDto>>): Array<SurveyResponseViewDto> => r.body)
    );
  }
}