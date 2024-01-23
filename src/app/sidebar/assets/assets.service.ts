import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx'; 

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private httpClient:HttpClient) { }

  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get('http://localhost:8081/assets/'+companyId);
  }
  addAssets(myFile:any,companyId:string):Observable<any>{
    return this.httpClient.post('http://localhost:8081/assets/import/'+companyId,myFile);
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/imageUpload",data);
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post("http://localhost:8081/assets/removeImage",id);
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/removeAsset",id);
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
  }
  getExtraFieldNameValue(companyId:string):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldNameValue/"+companyId);
  }

  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get("http://localhost:8081/assets/getMandatoryFields/"+name+"/"+companyId);
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getShowFields/"+name+"/"+companyId);
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getAllMandatoryFields/"+companyId);
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get("http://localhost:8081/assets/getAllShowFields/"+companyId);
  }
  addNewAsset(data:any):Observable<any>{
   
    return this.httpClient.post("http://localhost:8081/assets/addNewAssets",data);
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post("http://localhost:8081/assets/addfields",data);
  }
  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('asset-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb,  'AssetSheet.xlsx');
			
    }
  
}
