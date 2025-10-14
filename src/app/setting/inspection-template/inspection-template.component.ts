import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InspectionTemplateService } from './inspection-template.service';
import { InspectionStep } from './InspectionStep';
import { Inspection } from './Inspection';

@Component({
  selector: 'app-inspection-template',
  templateUrl: './inspection-template.component.html',
  styleUrl: './inspection-template.component.css',
})
export class InspectionTemplateComponent {
  inspectionForm!: Inspection;
  companyId!: any;
  displayedColumns: string[] = ['id', 'name', 'asset'];
  searchedInspection!: any[];
  inspectionList!:Inspection[];
  assetCategoryList!: any[];
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  inspectionSteps!: Array<InspectionStep>;
  // currStep: number = 1;
  newInspectionStepObj:any;
  editVisibility:boolean=false;
  editButtonId:number=-1;
  deleteInspectionId!:string;
  deleteInspectionName!:string;
  constructor(
    private inspectionTemplateService: InspectionTemplateService
  ) {}

  ngOnInit() {
    this.searchedInspection = [];
    this.inspectionForm=new Inspection();
    const inspection = new InspectionStep();
    inspection.type = 'CHECKBOX';
    this.inspectionSteps = new Array<InspectionStep>(inspection);
    
    console.log("size"+this.inspectionSteps.length);
    this.companyId = localStorage.getItem('companyId');
   
    this.inspectionTemplateService.getAllAssetInspection(this.companyId).subscribe(
      (data) => {
        this.inspectionList=data;
         this.searchedInspection = data;
        console.log(this.searchedInspection);
      },
      (err) => {
       console.log(err)
      }
    );
    this.inspectionTemplateService.getAssetCategory(this.companyId).subscribe(
      (data) => {
        this.assetCategoryList = data;
        console.log(this.assetCategoryList);
      },
      (err)=>{
        console.log(err)
      }
    );
  }
  find(data: any) {
    const value = data.target.value;
    this.searchedInspection = this.inspectionList;
    this.searchedInspection = this.searchedInspection.filter((mydata) => {
      let filterData: any;
      if (
        mydata.name?.toLowerCase().includes(value.toLowerCase()) ||
        mydata.categoryName?.toLowerCase().includes(value.toLowerCase()) ||
        mydata.status?.toLowerCase().includes(value.toLowerCase())
      ) {
        filterData = mydata;
      } else {
        filterData = false;
      }
      return filterData;
    });
  }
  addInspectionStep(){
 
    const inspection = new InspectionStep();
    inspection.type = 'CHECKBOX';
    // inspection.stepNumber=this.currStep;
    this.inspectionSteps.push(inspection);
  }
  addInspection() {
    console.log(this.inspectionSteps.toString)
    this.inspectionForm.status='active';
    this.inspectionForm.companyId=this.companyId;
    this.inspectionForm.steps=this.inspectionSteps;
    const selectedCategory = this.assetCategoryList.find(
      (category) => {
        return category.name === this.inspectionForm.categoryName}
    );
 
    if (selectedCategory) {
      this.inspectionForm.categoryId = selectedCategory.id;
      
    } else {
      this.inspectionForm.categoryId = ''; // if 'None' is selected or no match found
    }
    console.log(this.inspectionForm);
    if(this.inspectionForm.name==''||this.inspectionForm.name==null||this.inspectionForm.name==undefined){
      this.triggerAlert("Please Enter Name","warning");
      return;
    }
    if(this.inspectionForm.categoryName==''||this.inspectionForm.categoryName==null||this.inspectionForm.categoryName==undefined){
      this.triggerAlert("Please Enter Asset Category","warning");
      return;
    }

    this.inspectionTemplateService
      .addAssetInspection(this.inspectionForm)
      .subscribe((data) => {
        console.log('Successfully Added Inspection');
        this.triggerAlert("Successfully Added Inspection","success");
      },
      (err)=>{
        console.log(err);
      }, 
      ()=>{
        this.inspectionForm=new Inspection();
        // this.inspectionSteps=Anew InspectionStep();
        this.ngOnInit();
      });
  }
  deleteInspection(){
    this.inspectionTemplateService.deleteAssetInspection(this.deleteInspectionId).subscribe((data)=>{
      console.log(data);
      this.deleteInspectionName='';
      this.deleteInspectionId='';
      this.ngOnInit();
      this.triggerAlert("Successfully Deleted Inspection","success");
    }, (err)=>{
        console.log('Error:', err);
    })
  }
  setDeleteInspectionId(id:string, name:string){
    this.deleteInspectionId=id;
    this.deleteInspectionName=name;
  }
  removeStep(i: number) {
    this.inspectionSteps.splice(i, 1);
  }
  editButtonVisibile(id:number){
    
        this.editButtonId=id;
        this.editVisibility=true;
     
      }
      editButtonNotVisible(){
        
        this.editVisibility=false;
        this.editButtonId=-1;
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
}
