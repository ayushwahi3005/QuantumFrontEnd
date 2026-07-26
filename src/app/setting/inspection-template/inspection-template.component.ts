import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selectedCategory = new FormControl<string[]>([]);
  isEditMode: boolean = false;
  currentEditingId!: string;
  
  constructor(
    private inspectionTemplateService: InspectionTemplateService
  ) {}

  compareCategoryObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

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
  // addInspection() {
  //   console.log(this.inspectionSteps.toString)
  //   console.log(this.selectedCategory.value);
  //   this.inspectionForm.status='active';
  //   this.inspectionForm.companyId=this.companyId;
  //   this.inspectionForm.steps=this.inspectionSteps;
  //   const selectedCategory = this.assetCategoryList.find(
  //     (category) => {
  //       return category.name === this.inspectionForm.categoryName}
  //   );
 
  //   if (selectedCategory) {
  //     this.inspectionForm.categoryId = selectedCategory.id;
      
  //   } else {
  //     this.inspectionForm.categoryId = ''; // if 'None' is selected or no match found
  //   }
  //   console.log(this.inspectionForm);
  //   if(this.inspectionForm.name==''||this.inspectionForm.name==null||this.inspectionForm.name==undefined){
  //     this.triggerAlert("Please Enter Name","warning");
  //     return;
  //   }
  //   if(this.inspectionForm.categoryName==''||this.inspectionForm.categoryName==null||this.inspectionForm.categoryName==undefined){
  //     this.triggerAlert("Please Enter Asset Category","warning");
  //     return;
  //   }

  //   this.inspectionTemplateService
  //     .addAssetInspection(this.inspectionForm)
  //     .subscribe((data) => {
  //       console.log('Successfully Added Inspection');
  //       this.triggerAlert("Successfully Added Inspection","success");
  //     },
  //     (err)=>{
  //       console.log(err);
  //     }, 
  //     ()=>{
  //       this.inspectionForm=new Inspection();
  //       // this.inspectionSteps=Anew InspectionStep();
  //       this.ngOnInit();
  //     });
  // }
  addInspection() {
    console.log(this.inspectionSteps.toString)
    console.log(this.selectedCategory.value);
    this.inspectionForm.status='active';
    this.inspectionForm.companyId=this.companyId;
    this.inspectionForm.steps=this.inspectionSteps;
    if(this.selectedCategory.value && this.selectedCategory.value.length > 0) {
      this.inspectionForm.categoryName = this.selectedCategory.value; // Assuming single selection for now
    }
    // const selectedCategory = this.assetCategoryList.find(
    //   (category) => {
    //     return category.name === this.inspectionForm.categoryName}
    // );
 
    // if (selectedCategory) {
    //   this.inspectionForm.categoryId = selectedCategory.id;
      
    // } else {
    //   this.inspectionForm.categoryId = ''; // if 'None' is selected or no match found
    // }
    console.log(this.inspectionForm);
    if(this.inspectionForm.name==''||this.inspectionForm.name==null||this.inspectionForm.name==undefined){
      this.triggerAlert("Please Enter Name","warning");
      return;
    }
    // if(this.inspectionForm.categoryName.length===0||this.inspectionForm.categoryName==null||this.inspectionForm.categoryName==undefined){
    //   this.triggerAlert("Please Enter Asset Category","warning");
    //   return;
    // }

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
        this.selectedCategory.reset();
        this.isEditMode = false;
        this.ngOnInit();
      });
  }
  deleteInspection(){
    this.inspectionTemplateService.deleteAssetInspection(this.deleteInspectionId).subscribe((data)=>{
      console.log(data);
      this.ngOnInit();
      this.triggerAlert("Successfully Deleted Inspection","success");
    }, (err)=>{
        console.log('Error:', err);
    })
  }
  setDeleteInspectionId(id:string){
    this.deleteInspectionId=id;
  }
  changeAssetDetails(item: Inspection) {
    this.isEditMode = true;
    this.currentEditingId = item.id!;
    this.inspectionForm = JSON.parse(JSON.stringify(item)); // Deep copy
    this.inspectionSteps = JSON.parse(JSON.stringify(item.steps || []));
    
    // Populate selectedCategory with the inspection's categories
    if (item.categoryName && Array.isArray(item.categoryName)) {
      this.selectedCategory.setValue(item.categoryName);
    }
    
    // Trigger modal opening using jQuery
    (window as any).$('#edit-inspection').modal('show');
  }
  updateInspection() {
  console.log(this.inspectionSteps.toString)
  console.log(this.selectedCategory.value);
  this.inspectionForm.companyId = this.companyId;
  this.inspectionForm.steps = this.inspectionSteps;

  // Always sync — don't gate on length > 0
  this.inspectionForm.categoryName = this.selectedCategory.value || [];

  console.log(this.inspectionForm);
  if (this.inspectionForm.name == '' || this.inspectionForm.name == null || this.inspectionForm.name == undefined) {
    this.triggerAlert("Please Enter Name", "warning");
    return;
  }
  // if (this.inspectionForm.categoryName.length === 0 || this.inspectionForm.categoryName == null || this.inspectionForm.categoryName == undefined) {
  //   this.triggerAlert("Please Enter Asset Category", "warning");
  //   return;
  // }

  this.inspectionTemplateService
    .updateAssetInspection(this.inspectionForm)
    .subscribe((data) => {
      console.log('Successfully Updated Inspection');
      this.triggerAlert("Successfully Updated Inspection", "success");
    },
    (err) => {
      console.log(err);
    },
    () => {
      this.inspectionForm = new Inspection();
      this.inspectionSteps = [new InspectionStep()];
      this.selectedCategory.reset();
      this.isEditMode = false;
      (window as any).$('#edit-inspection').modal('hide');
      this.ngOnInit();
    });
}
  removeStep(i: number) {
    this.inspectionSteps.splice(i, 1);
  }
  resetFormForNewInspection() {
    this.isEditMode = false;
    this.inspectionForm = new Inspection();
    this.inspectionSteps = [new InspectionStep()];
    this.selectedCategory.reset();
  }
  closeEditModal() {
    (window as any).$('#edit-inspection').modal('hide');
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
 getCategoryNames(categoryName: Array<{id: number, categoryName: string}>): string {
  if (!categoryName || categoryName.length === 0) return '';
  return categoryName.map(c => c.categoryName).join(', ');
}
}
