import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }
   assetEndpoint=environment.endpoint+"assets/"
  // assetEndpoint="http://localhost:8080/assets/"
  companyCustomerEndpoint=environment.endpoint+"companycustomer/"

  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+companyId,{headers:this.headers});
   
  }
  addAssets(myFile:any,companyId:string,email:string,columnMapping:any):Observable<any>{

     const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    
 
    const formData: FormData = new FormData();

    formData.append('file', myFile);
    formData.append('columnMappings', columnMapping); 
    return this.httpClient.post(this.assetEndpoint+'import/'+companyId+'/'+email,myFile,{
      headers:myheaders,
      reportProgress: true});

  }
  updateAssets(myFile:any,companyId:string,email:string,columnMapping:any):Observable<any>{
   
    const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    
 
    const formData: FormData = new FormData();

    formData.append('file', myFile);
    formData.append('columnMappings', columnMapping); 
  return this.httpClient.post(this.assetEndpoint+'importUpdation/'+companyId+'/'+email,myFile,{headers:myheaders});
  // return this.httpClient.post(this.assetEndpoint+'importUpdation/',myFile,{headers});
  }
  getInventory(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get('http://localhost:8084/inventory/'+companyId,{headers:this.headers});
  }
  // addInventory(myFile:any,companyId:string,email:string):Observable<any>{
  //   const headers = new HttpHeaders()
  //     .set('email', email)
  //     .set('company', companyId);
  //   return this.httpClient.post('http://localhost:8084/inventory/import/'+companyId+'/'+email,myFile,{ headers: headers });
  // }
  addCustomer(myFile:any,companyId:string,email:string,columnMapping:any):Observable<any>{
    const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    
 
    const formData: FormData = new FormData();

    formData.append('file', myFile);
    formData.append('columnMappings', columnMapping); 
    return this.httpClient.post(this.companyCustomerEndpoint+'import/'+companyId+'/'+email, myFile,{headers:myheaders});
  }
  addInventory(myFile: any, companyId: string, email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    }).set('email', email)
        .set('company', companyId);
    return this.httpClient.post('http://localhost:8084/importFile', myFile,{headers:this.headers});
  }
  updateCustomer(file:any,companyId:string,email:string):Observable<any>{
    const myheaders = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.httpClient.post(this.companyCustomerEndpoint+`importUpdation/${companyId}/${email}`,  file,{headers:myheaders});
  }
  updateInventory(file:any,companyId:string,email:string):Observable<any>{
    console.log("Inventory Update is working");
    return this.httpClient.post(`http://localhost:8084/inventory/importUpdation/${companyId}/${email}`,  file,{headers:this.headers});
  }
  getAssetExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get(this.assetEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }
  getWorkOrderExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8083/workorder/getExtraFieldName/"+id,{headers:this.headers});
  }
  getInventoryExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8084/inventory/getExtraFieldName/"+id,{headers:this.headers});
  }
  getCustomerExtraFields(id:string):Observable<any>{
   
  
    return this.httpClient.get(this.companyCustomerEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }


  csvToXlsx(csv: string, fileName: string): void {
    const csvArray = csv.split('\n').map(row => row.split(','));

  // Create a worksheet from the array of objects
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(csvArray);

  // Create a new workbook and append the worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Save the workbook to a file
  XLSX.writeFile(wb, `${fileName}.xlsx`);

  }
}
