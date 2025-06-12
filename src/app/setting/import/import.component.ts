import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportService } from './import.service';
import { AssetsService } from 'src/app/sidebar/assets/assets.service';
import { ExtraFieldName } from './extraFieldName';
import * as XLSX from 'xlsx';
import { ColumnMapping } from './columnMapping';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { MatDialog } from '@angular/material/dialog';

declare var bootstrap: any;
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})

export class ImportComponent {
  
  @ViewChild('infoNotice') myModal!: ElementRef;
  
  loading:boolean=false;
  email!:any;
  importForm!:FormGroup;
  myFile!:any;
  selectedModule="asset";
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  companyId!:any;
  excelColumns: string[] = [];
  assetDatabaseColumns: string[] = [];
  assetDatabaseColumnsToAdd: string[] = [];
  assetDatabaseColumnsToUpdate: string[] = [];

  workorderDatabaseColumns: string[] = [];
  workorderDatabaseColumnsToAdd: string[] = [];
  workorderDatabaseColumnsToUpdate: string[] = [];

  inventoryDatabaseColumns: string[] = [];
  inventoryDatabaseColumnsToAdd: string[] = [];
  inventoryDatabaseColumnsToUpdate: string[] = [];

  customerDatabaseColumns: string[] = [];
  customerDatabaseColumnsToAdd: string[] = [];
  customerDatabaseColumnsToUpdate: string[] = [];

  currImport:string='asset';
  
  col=new ColumnMapping();
  // columnMappings: { excel: string, database: string }[] = [];
  columnMappings!:Map<String,String>;
  assetExtraFieldsColumns!:ExtraFieldName[];
  inventoryExtraFieldsColumns!:ExtraFieldName[];
  workorderExtraFieldsColumns!:ExtraFieldName[];
  customerExtraFieldsColumns!:ExtraFieldName[];
  convertedFile!:any;
  impType:string='add';

  progress: number = 0;
  uploadInProgress: boolean = false;
  currExportModuel:any;
  constructor(private formBuilder:FormBuilder,private importService:ImportService,private assetService:AssetsService,private dialog: MatDialog){

  }
   



  ngOnInit(){
    this.loading=false;
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');

   
    
    this.importForm=this.formBuilder.group({
      module:['asset',Validators.required],
      importType:['',Validators.required],
      file:['',Validators.required]
    })
    localStorage.removeItem('uploadProgress');
    localStorage.removeItem('uploadInProgress');
    const savedProgress = localStorage.getItem('uploadProgress');
    const savedLoading = localStorage.getItem('uploadInProgress');
    
    console.log("savedLoading"+savedLoading)
    if (savedProgress) {
      this.progress = parseInt(savedProgress, 10);
    }
    if (savedLoading === 'true') {
      this.loading = true;
    }
    this.assetDatabaseColumnsToUpdate=[];
    this.assetDatabaseColumnsToAdd=[];
    this.workorderDatabaseColumnsToUpdate=[]
    this.workorderDatabaseColumnsToAdd=[]
    this.inventoryDatabaseColumnsToUpdate=[]
    this.inventoryDatabaseColumnsToAdd=[]
    this.customerDatabaseColumnsToUpdate=[]
    this.customerDatabaseColumnsToAdd=[]

    this.assetDatabaseColumnsToUpdate.push("AssetId","Category","Name","SerialNumber","Customer","Location","Status");
    this.assetDatabaseColumnsToAdd.push("Category","Name","SerialNumber","Customer","Location","Status");

    this.workorderDatabaseColumnsToUpdate.push("AssetId","Category","Name","SerialNumber","Customer","Location","Status");
    this.workorderDatabaseColumnsToAdd.push("Category","Name","SerialNumber","Customer","Location","Status");

    this.inventoryDatabaseColumnsToUpdate.push("InventoryId","PartId","PartName","Price","Cost","Category","Quantity");
    this.inventoryDatabaseColumnsToAdd.push("PartId","PartName","Price","Cost","Category","Quantity");

    this.customerDatabaseColumnsToUpdate.push("CompanyCustomerId","Name","Category","Phone","Email","Address","Apartment","City","State","Status","Zipcode");
    this.customerDatabaseColumnsToAdd.push("Name","Category","Phone","Email","Address","Apartment","City","State","Status","Zipcode");

    this.importService.getAssetExtraFields(this.companyId).subscribe((data)=>{
      this.assetExtraFieldsColumns=data;
      this.assetExtraFieldsColumns.forEach((x)=>{
        this.assetDatabaseColumnsToUpdate.push(x.name);
        this.assetDatabaseColumnsToAdd.push(x.name);
      })
      console.log(this.assetDatabaseColumns)
    })

    // this.importService.getInventoryExtraFields(this.companyId).subscribe((data)=>{
    //   this.inventoryExtraFieldsColumns=data;
    //   this.inventoryExtraFieldsColumns.forEach((x)=>{
    //     this.inventoryDatabaseColumnsToUpdate.push(x.name);
    //     this.inventoryDatabaseColumnsToAdd.push(x.name);
    //   })
    //   console.log(this.inventoryDatabaseColumns)
    // })

    this.importService.getCustomerExtraFields(this.companyId).subscribe((data)=>{
      this.customerExtraFieldsColumns=data;
      this.customerExtraFieldsColumns.forEach((x)=>{
        this.customerDatabaseColumnsToUpdate.push(x.name);
        this.customerDatabaseColumnsToAdd.push(x.name);
      })
      console.log(this.customerDatabaseColumns)
    })
    // this.columnMappings=new Array(this.assetDatabaseColumns.length).fill({excel:"",database:""});
    this.columnMappings=new Map<String,String>();
    console.log(this.columnMappings)
  }
  ngAfterViewInit() {
  this.openModal(); // Now safe, ViewChild is initialized
}
  openModal() {
    const modalElement = this.myModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement); // bootstrap must be globally available
    modal.show();
  }
  
  convertCSVToXlsx(csvData:any): void {
    // Replace this with your CSV data
    // const csvData = 'Name, Age\nJohn, 25\nJane, 30';

    // Specify a file name without extension
    // const fileName = 'converted_data';

    this.importService.csvToXlsx(csvData, this.convertedFile);
  }

  FileUpload(event:any){
    const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
 
  this.myFile=formData;
  const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      // Read the contents of the file as a string
      const content: string = e.target.result;

      // Split the content into lines
      const lines: string[] = content.split('\n');

      // Get the first line
      const firstLine: string = lines[0].substring(0,lines[0].length-1);
      this.excelColumns=firstLine.split(',');

      // Log or use the first line as needed
      console.log('First Line:', this.excelColumns);
    };

    // Read the file as text
    reader.readAsText(file);
    
  }
  fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  onSubmit(){
    
    this.loading=true;
    this.uploadInProgress = true;
    localStorage.setItem('uploadInProgress', 'true');
    console.log("loading",this.loading);
    console.log(this.importForm.value)
    const formData=this.myFile
    const objArray:any={

    }
    this.columnMappings.forEach((v,k)=>{
      console.log(v+" "+k)
      let myString:string=k.toString();
      // 
      objArray[myString]=v;
    // this.col.databaseColumn=v;
    // this.col.excelColumn=k;
    
      
      // objArray.push(obj);
      
     
      
    })
    const jsonString = JSON.stringify(objArray);
    console.log(jsonString)
    
    formData.append('column', jsonString);
    this.myFile=formData;
    if(this.importForm.controls['module'].value=="asset"){
      this.currImport="asset"
      console.log("Asset")
      if(this.importForm.controls['importType'].value=="add"){
        this.impType="add";
        console.log("-------------add called-------------")
        formData.append('columnMappings', jsonString);

        let file=formData.get('file');
 
        formData.append('file', file);

        this.myFile=formData;


        this.progress=0;
        this.importService.addAssets(this.myFile,this.companyId,this.email,this.columnMappings).subscribe((event)=>{
          // console.log(event)
          // console.log(event.type)
          // if (event.type === HttpEventType.UploadProgress) {
          
          //   this.progress = Math.round(100 * event.loaded / event.total);
          //   console.log("progress->"+this.progress)
          // } else if (event instanceof HttpResponse) {
            
          //   // this.message = event.body.message;
           
          //   // this.currentFile
          //   // this.fileInfos = this.assetDetailService.getAssetFile(this.assetId);
            
          // }
          // if (event.type === HttpEventType.UploadProgress && event.total) {
          //   this.progress = Math.round((100 * event.loaded) / event.total);
          //   localStorage.setItem('uploadProgress', this.progress.toString());
          // } else if (event.type === HttpEventType.Response) {
          //   // Upload complete
          //   this.loading = false;
          //   this.uploadInProgress = false;
          //   this.progress = 100;
          //   localStorage.removeItem('uploadProgress');
          //   localStorage.removeItem('uploadInProgress');
          //   this.triggerAlert('File Successfully Uploaded', 'success');
          // }
          this.loading=false;
          console.log("Successfully Uploaded");
          
          this.triggerAlert("Asset File Successfully Uploaded","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
          this.loading = false;
          this.uploadInProgress = false;
          this.progress = 0;
          localStorage.removeItem('uploadProgress');
          localStorage.removeItem('uploadInProgress');
          this.triggerAlert('Failed to Upload File', 'danger');
          this.ngOnInit();
        })
      }
      else{
        formData.append('columnMappings', jsonString);
        // formData.append('email',this.email);
        let file=formData.get('file');
        // const newFileName=file.name+'_'+jsonString+'_'+this.email+'_'+this.companyId;
        //  const newFile = new File([file], newFileName, { type: file.type });
        formData.append('file', file);

        this.myFile=formData;
     
        this.importService.updateAssets(this.myFile,this.companyId,this.email,this.columnMappings).subscribe((data)=>{
          console.log("Successfully Updated");
          this.loading=false;
          this.triggerAlert("Asset File Successfully Updated","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          this.ngOnInit();
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
          
        })
       


       
      }
      

    }
    

    else if(this.importForm.controls['module'].value=="inventory"){
      this.currImport="inventory"
      console.log("inventory")
      if(this.importForm.controls['importType'].value=="add"){
        this.impType="add";
        console.log("-------------add called-------------");
        // formData.append('columnMappings', jsonString);
        // formData.append('email',this.email);
        let file=formData.get('file');
        const newFileName=file.name+'_'+jsonString+'_'+this.email+'_'+this.companyId;
         const newFile = new File([file], newFileName, { type: file.type });
        formData.append('file', newFile);

        this.myFile=formData;

        this.importService.addInventory(this.myFile,this.companyId,this.email).subscribe((data)=>{
          console.log("Successfully Uploaded");
          this.loading=false;
          this.triggerAlert("Inventory File Successfully Uploaded","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          if(err.error.errorMessage=="Import File cannot import more than 5000 rows"){
            this.triggerAlert("Failed!! "+err.error.errorMessage,"danger");
          }
          else{
            this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
          }
          this.ngOnInit();
          
          
        })
      }
      else{
        this.impType="update";
        this.importService.updateInventory(this.myFile,this.companyId,this.email).subscribe((data)=>{
          console.log("Successfully Updated");
          this.loading=false;
          this.triggerAlert("Inventory File Successfully Updated","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          this.ngOnInit();
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
   
        })
      }
      

    }
    else if(this.importForm.controls['module'].value=="customer"){
      this.currImport="customer"
      console.log("customer")



      if(this.importForm.controls['importType'].value=="add"){
        this.impType="add";
        console.log("-------------add called-------------");
        formData.append('columnMappings', jsonString);

        let file=formData.get('file');
      
        formData.append('file', file);

        this.myFile=formData;

        this.importService.addCustomer(this.myFile,this.companyId,this.email,this.columnMappings).subscribe((data)=>{
          console.log("Successfully Uploaded");
          this.loading=false;
          this.triggerAlert("Inventory File Successfully Uploaded","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          if(err.error.errorMessage=="Import File cannot import more than 5000 rows"){
            this.triggerAlert("Failed!! "+err.error.errorMessage,"danger");
          }
          else{
            this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
          }
          this.ngOnInit();
          
          
        })
      }
      else{
        formData.append('columnMappings', jsonString);

        let file=formData.get('file');
        
        formData.append('file', file);

        this.myFile=formData;

        this.impType="update";
        this.importService.updateCustomer(this.myFile,this.companyId,this.email).subscribe((data)=>{
          console.log("Successfully Updated");
          this.loading=false;
          this.triggerAlert("Inventory File Successfully Updated","success");
        },
        (err)=>{
          this.loading=false;
          console.log(err);
          this.ngOnInit();
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
   
        })
      }
      

    }
   
    
  }
  dropDown(event:any){
    this.selectedModule=event.value;
    this.currImport=event.value
    console.log(this.currImport)
  }
  exportData(){
    console.log(this.selectedModule);
    if(this.selectedModule=="asset"){
      this.assetService.exportexcel();
    }
  }
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  saveMappings(){
    this.triggerAlert("Mapping Saved Successfully!!","success")
    console.log(this.columnMappings)
  }
  update(key:String,value:any){
    this.columnMappings.set(key,value.target.value)
  }
  updateType(data:string){
    this.impType=data;
    if(data=="add"){
      this.assetDatabaseColumns=this.assetDatabaseColumnsToAdd;
      this.inventoryDatabaseColumns=this.inventoryDatabaseColumnsToAdd;
      this.customerDatabaseColumns=this.customerDatabaseColumnsToAdd;
      this.workorderDatabaseColumns=this.workorderDatabaseColumnsToAdd;
    }
    else{
      this.assetDatabaseColumns=this.assetDatabaseColumnsToUpdate;
      this.inventoryDatabaseColumns=this.inventoryDatabaseColumnsToUpdate;
      this.customerDatabaseColumns=this.customerDatabaseColumnsToUpdate;
      this.workorderDatabaseColumns=this.workorderDatabaseColumnsToUpdate;
    }
  }
  exportModule(event:any){
    this.currExportModuel=event.value;

    console.log(this.currExportModuel)
  }
  exportModuleData(){
    if(this.currExportModuel=="asset"){
      this.importService.downloadAllAssets(this.companyId).subscribe((data:Blob)=>{
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = `assets_${this.companyId}.xlsx`;
        saveAs(blob, fileName);
      },
      (err)=>{
        console.log(err)
      })
    }
  }
}
