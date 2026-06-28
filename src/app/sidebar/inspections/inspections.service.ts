import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface FilterCriteria {
  pageNumber?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: string;
  [key: string]: any;
}

export interface InspectionResponse {
  data: any[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InspectionsService {

  private headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });

  constructor(private httpClient: HttpClient) {}

  inspectionEndpoint = environment.endpoint + 'inspection/';
  companyCustomerEndpoint = environment.endpoint + 'companycustomer/';
  customerEndpoint = environment.endpoint + 'customer/';
  assetEndpoint = environment.endpoint + 'assets/';


  // Feature 1: Load status counts
  loadStatusCounts(companyId: string): Observable<{ statusCounts: any[]; totalInspections: number }> {
    const url = `${this.inspectionEndpoint}status-count/${companyId}`;
    return this.httpClient.get<{ statusCounts: any[]; totalInspections: number }>(url, { headers: this.headers });
  }

  // Feature 2: Load incomplete inspections by performer
  loadPerformerCounts(companyId: string): Observable<{ performerCounts: any[] }> {
    const url = `${this.inspectionEndpoint}incomplete-by-performer/${companyId}`;
    return this.httpClient.get<{ performerCounts: any[] }>(url, { headers: this.headers });
  }

  // Feature 3: Load detailed inspections with filters and pagination
  loadDetailedInspections(companyId: string, payload: FilterCriteria): Observable<InspectionResponse> {
    const url = `${this.inspectionEndpoint}detailed/${companyId}`;
    return this.httpClient.post<InspectionResponse>(url, payload, { headers: this.headers });
  }
  getAllAssetInspection(id:string):Observable<any>{
        return this.httpClient.get(environment.endpoint+'assets/getAllAssetInspection/'+id,{headers:this.headers});
      }

       getAssetCategory(companyId:any):Observable<any>{
        return this.httpClient.get(environment.endpoint+"assets/getCategoryActiveList/"+companyId,{headers:this.headers});
      }
      getCustomerCategory(companyId:any):Observable<any>{
    return this.httpClient.get(this.companyCustomerEndpoint+"getCategoryActiveList/"+companyId,{headers:this.headers});
  }
   getCompanyCustomerList(companyId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.companyCustomerEndpoint + 'allCompanyCustomer/' + companyId,
      { headers },
    );
  }

    getAllLocationWithBin(companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.customerEndpoint + 'locations-with-bins/' + companyId,
      { headers },
    );
  }

  getActiveAssetList(companyId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getActiveAssets/' + companyId,
      { headers },
    );
  }
}