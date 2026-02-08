import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`,
  });
  constructor(private httpClient: HttpClient) {}
  // customerEndpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/customer/";
  customerEndpoint = environment.endpoint + 'customer/';
  // assetEndpoint="http://asset-lb2-430416467.us-east-1.elb.amazonaws.com:8080/assets/"
  assetEndpoint = environment.endpoint + 'assets/';
  companyCustomerEndpoint = environment.endpoint + 'companycustomer/';
  //  companyCustomerEndpoint="http://localhost:8081/companycustomer/"
  getAssets(companyId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    console.log('companyId->', companyId);
    return this.httpClient.get(this.assetEndpoint + companyId, { headers });
  }
  addAssets(myFile: any, companyId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.post(
      this.assetEndpoint + 'import/' + companyId,
      myFile,
      { headers },
    );
  }
  uploadImage(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.post(this.assetEndpoint + 'imageUpload', data, {
      headers,
    });
  }
  removeImage(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.post(this.assetEndpoint + 'removeImage', id, {
      headers,
    });
  }
  removeAsset(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.post(this.assetEndpoint + 'removeAsset', id, {
      headers,
    });
  }
  getExtraFieldName(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(this.assetEndpoint + 'getExtraFieldName/' + id, {
      headers,
    });
  }
  getExtraFieldNameValue(companyId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getExtraFieldNameValue/' + companyId,
      { headers },
    );
  }

  getMandatoryFields(name: any, companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    console.log('name', name);
    return this.httpClient.get(
      this.assetEndpoint + 'getMandatoryFields/' + name + '/' + companyId,
      { headers },
    );
  }
  getShowFields(name: any, companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getShowFields/' + name + '/' + companyId,
      { headers },
    );
  }
  getAllMandatoryFields(companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getAllMandatoryFields/' + companyId,
      { headers },
    );
  }
  getAllShowFields(companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getAllShowFields/' + companyId,
      { headers },
    );
  }
  addNewAsset(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });

    return this.httpClient.post(this.assetEndpoint + 'addNewAssets', data, {
      headers,
    });
  }
  addExtraFields(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.post(this.assetEndpoint + 'addfields', data, {
      headers,
    });
  }
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('asset-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'AssetSheet.xlsx');
  }
  getAssetsAllDetails(companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getAllAssetData/' + companyId,
      { headers },
    );
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
  getRoleAndPermission(id: string, name: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.customerEndpoint + 'roleAndPermissionByName/get/' + id + '/' + name,
      { headers },
    );
  }

  advanceFilter(
    data: any,
    pageIndex: number,
    pageSize: number,
    category: any,
    searchData: any,
    asc: any,
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    console.log(
      this.assetEndpoint +
        'advanceFilter/' +
        pageIndex +
        '/' +
        pageSize +
        '/' +
        searchData +
        '?category=' +
        category,
    );
    return this.httpClient.post(
      this.assetEndpoint +
        'advanceFilter/' +
        pageIndex +
        '/' +
        pageSize +
        '?category=' +
        category +
        '&search=' +
        searchData +
        '&asc=' +
        asc,
      data,
      { headers },
    );
  }

  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  detailAsset(data: any) {
    this.componentMethodCallSource.next(data);
  }
  getAssetDetails(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });

    return this.httpClient.get(this.assetEndpoint + 'getAsset/' + id, {
      headers,
    });
  }
  getAssetCategory(companyId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });
    return this.httpClient.get(
      this.assetEndpoint + 'getCategoryActiveList/' + companyId,
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

  exportAsset(companyId: any): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
      'device-id': `${localStorage.getItem('deviceId')}`,
    });

    return this.httpClient.get(
      this.assetEndpoint + 'export-asset/' + companyId,
      {
        headers,
        responseType: 'blob', // ✅ CRITICAL FIX
      },
    );
  }

  advanceFilteroptimized(
  data: any
): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'device-id': `${localStorage.getItem('deviceId')}`,
  });


  return this.httpClient.post<any>(
    `${this.assetEndpoint}advancedFilter/optimized`,
    data,
    { headers }
  );
}
}
