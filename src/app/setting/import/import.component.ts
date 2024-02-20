import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportService } from './import.service';
import { AssetsService } from 'src/app/sidebar/assets/assets.service';
import { ExtraFieldName } from './extraFieldName';
import * as XLSX from 'xlsx';
import { ColumnMapping } from './columnMapping';


@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {
  email!:any;
  importForm!:FormGroup;
  myFile!:any;
  selectedModule="asset";
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  companyId!:any;
  excelColumns: string[] = [];
  databaseColumns: string[] = [];
  databaseColumnsToAdd: string[] = [];
  databaseColumnsToUpdate: string[] = [];
  col=new ColumnMapping();
  // columnMappings: { excel: string, database: string }[] = [];
  columnMappings!:Map<String,String>;
  extraFieldsColumns!:ExtraFieldName[];
  convertedFile!:any;
  impType:string='add';
  constructor(private formBuilder:FormBuilder,private importService:ImportService,private assetService:AssetsService){

  }
  

  ngOnInit(){
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    
    this.importForm=this.formBuilder.group({
      module:['asset',Validators.required],
      importType:['',Validators.required],
      file:['',Validators.required]
    })
    this.databaseColumnsToUpdate.push("AssetId","Category","Name","SerialNumber","Customer","Location","Status");
    this.databaseColumnsToAdd.push("Category","Name","SerialNumber","Customer","Location","Status");
    this.importService.getExtraFields(this.companyId).subscribe((data)=>{
      this.extraFieldsColumns=data;
      this.extraFieldsColumns.forEach((x)=>{
        this.databaseColumnsToUpdate.push(x.name);
        this.databaseColumnsToAdd.push(x.name);
      })
      console.log(this.databaseColumns)
    })
    // this.columnMappings=new Array(this.databaseColumns.length).fill({excel:"",database:""});
    this.columnMappings=new Map<String,String>();
    console.log(this.columnMappings)

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
  onSubmit(){
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
    
    formData.append('columnMappings', jsonString);
    this.myFile=formData;
    if(this.importForm.controls['module'].value=="asset"){
      console.log("Asset")
      if(this.importForm.controls['importType'].value=="add"){
        this.impType="add";
        console.log()
        this.importService.addAssets(this.myFile,this.companyId).subscribe((data)=>{
          console.log("Successfully Uploaded");
          
          this.triggerAlert("Asset File Successfully Uploaded","success");
        },
        (err)=>{
          console.log(err);
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
        })
      }
      else{
        this.impType="update";
        this.importService.updateAssets(this.myFile,this.companyId).subscribe((data)=>{
          console.log("Successfully Updated");
          this.triggerAlert("Asset File Successfully Updated","success");
        },
        (err)=>{
          console.log(err);
          this.triggerAlert("Failed!! Please check file again and map all fields correctly ","danger");
        })
      }
      

    }
    
  }
  dropDown(event:any){
    this.selectedModule=event.value;
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
    console.log(this.columnMappings)
  }
  update(key:String,value:any){
    this.columnMappings.set(key,value.target.value)
  }
  updateType(data:string){
    this.impType=data;
    if(data=="add"){
      this.databaseColumns=this.databaseColumnsToAdd
    }
    else{
      this.databaseColumns=this.databaseColumnsToUpdate
    }
  }
}
