import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx'; 

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  });
  constructor(private httpClient:HttpClient) { }
  // customerEndpoint="http://customer-lb2-1979550990.us-east-1.elb.amazonaws.com:8080/customer/";
  customerEndpoint=environment.endpoint+"customer/";
  // assetEndpoint="http://asset-lb2-430416467.us-east-1.elb.amazonaws.com:8080/assets/"
   assetEndpoint=environment.endpoint+"assets/"
  companyCustomerEndpoint=environment.endpoint+"companycustomer/"
  //  companyCustomerEndpoint="http://localhost:8081/companycustomer/"
  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get(this.assetEndpoint+companyId,{headers:this.headers});
  }
  addAssets(myFile:any,companyId:string):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"import/"+companyId,myFile,{headers:this.headers});
  }
  uploadImage(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"imageUpload",data,{headers:this.headers});
  }
  removeImage(id:string):Observable<any>{
   
    return this.httpClient.post(this.assetEndpoint+"removeImage",id,{headers:this.headers});
  }
  removeAsset(id:string):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"removeAsset",id,{headers:this.headers});
  }
  getExtraFieldName(id:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFieldName/"+id,{headers:this.headers});
  }
  getExtraFieldNameValue(companyId:string):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getExtraFieldNameValue/"+companyId,{headers:this.headers});
  }

  getMandatoryFields(name:any,companyId:any):Observable<any>{
    console.log("name",name)
    return this.httpClient.get(this.assetEndpoint+"getMandatoryFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getShowFields(name:any,companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getShowFields/"+name+"/"+companyId,{headers:this.headers});
  }
  getAllMandatoryFields(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getAllMandatoryFields/"+companyId,{headers:this.headers});
  }
  getAllShowFields(companyId:any):Observable<any>{
    return this.httpClient.get(this.assetEndpoint+"getAllShowFields/"+companyId,{headers:this.headers});
  }
  addNewAsset(data:any):Observable<any>{
   
    return this.httpClient.post(this.assetEndpoint+"addNewAssets",data,{headers:this.headers});
  }
  addExtraFields(data:any):Observable<any>{
    return this.httpClient.post(this.assetEndpoint+"addfields",data,{headers:this.headers});
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
    getAssetsAllDetails(companyId:any):Observable<any>{
      return this.httpClient.get(this.assetEndpoint+"getAllAssetData/"+companyId,{headers:this.headers});
    }
    // getSearchedAssetList(companyId:string,data:any,category:any):Observable<any>{
     
    //   return this.httpClient.get(this.assetEndpoint+"searchAssetlist/"+companyId+"?data="+data+"&category="+category,{headers:this.headers});
    // }
    // getSortedAssetList(companyId:string,category:any,type:any,pageIndex:number,pageSize:number):Observable<any>{
      
    //   return this.httpClient.get(this.assetEndpoint+"sortAssetlist/"+companyId+'/'+pageIndex+'/'+pageSize+"?category="+category,{headers:this.headers});
    // }
    getCompanyCustomerList(companyId:string):Observable<any>{
      // const headers = new HttpHeaders({
      //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   'Content-Type': 'application/json'
      // });
      return this.httpClient.get(this.companyCustomerEndpoint+"allCompanyCustomer/"+companyId,{headers:this.headers});
    }
    getRoleAndPermission(id:string,name:string):Observable<any>{
      return this.httpClient.get(this.customerEndpoint+'roleAndPermissionByName/get/'+id+'/'+name,{headers:this.headers});
    }

    advanceFilter(data:any,pageIndex:number,pageSize:number,category:any,searchData:any,asc:any):Observable<any>{
      console.log(this.assetEndpoint+"advanceFilter/"+pageIndex+'/'+pageSize+'/'+searchData+"?category="+category)
      return this.httpClient.post(this.assetEndpoint+"advanceFilter/"+pageIndex+'/'+pageSize+"?category="+category+"&search="+searchData+"&asc="+asc,data,{headers:this.headers});
     
    }

    private componentMethodCallSource = new Subject<any>();
    componentMethodCalled$ = this.componentMethodCallSource.asObservable();
    detailAsset(data:any){
      this.componentMethodCallSource.next(data);
    }
    getAssetDetails(id:string):Observable<any>{
   
      return this.httpClient.get(this.assetEndpoint+"getAsset/"+id,{headers:this.headers});
    }
    getAssetCategory(companyId:any):Observable<any>{
      return this.httpClient.get(this.assetEndpoint+"getCategoryActiveList/"+companyId,{headers:this.headers});
    }
  
}
