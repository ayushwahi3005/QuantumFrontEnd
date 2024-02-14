import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private httpClient:HttpClient) { }

  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get('http://localhost:8081/assets/'+companyId);
  }
  addAssets(myFile:any,companyId:string):Observable<any>{
    return this.httpClient.post('http://localhost:8081/assets/import/'+companyId,myFile);
  }
  updateAssets(file:any,companyId:string):Observable<any>{
    // const params = new HttpParams()
    // .set('excel', file)
    // .set('columnMappings', columnMappings);
    // console.log("Update is working");
    // return this.httpClient.post('http://localhost:8081/assets/importUpdation/'+companyId,{params});
    // const formData = new FormData();
  // formData.append('file', file);
  // formData.append('columnMappings', "abcd");
  // const headers = new HttpHeaders();
  // headers.set('Content-Type', 'multipart/form-data');

  console.log("Update is working");

  return this.httpClient.post(`http://localhost:8081/assets/importUpdation/${companyId}`,  file);
  }
  getExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
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
