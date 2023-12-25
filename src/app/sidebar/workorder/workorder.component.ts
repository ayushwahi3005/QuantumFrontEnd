import { Component } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrderService } from './workorder.service';
import { WorkOrder } from './workorder';
import { Assets } from './assets';


@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})
export class WorkorderComponent {
  assetArr!:string[];
  selectedAsset!:string;
  workorderform!:FormGroup;
  workorderlist!:WorkOrder[];
  assetList!:Assets[];
  email:any;
  priority!:string;
  todayDate!:Date;
  editVisibility:boolean=false;
  editButtonId:number=-1;
  detailedWorkOrder=false;
  selectedWorkOrder!:string;
  loadingScreen=false;
  constructor(private formBuilder:FormBuilder,private workOrderService:WorkOrderService){}

  ngOnInit():void{
    this.email=localStorage.getItem('user');
    console.log(this.email);
    this.workorderform=this.formBuilder.group({
      description:['',Validators.required],
      customer:['',Validators.required],
      dueDate:['',Validators.required],
      assignedTechnician:['',Validators.required],
      assetDetails:['',Validators.required],
      assetId:[''],
      priority:['None'],
      lastUpdate:[''],
      email:[this.email],
      status:['open'],
      



    })
    this.getAllWorkOrderList(this.email);
    this.getAllAssets(this.email);
    this.todayDate=new Date();
    console.log(this.todayDate);
    console.log("inside"+this.workorderlist)
  }
  addWorkOrder(){
    this.selectedAsset=this.workorderform.controls['assetDetails'].value;
    this.assetArr=this.selectedAsset.split(',');
    this.workorderform.controls['assetDetails'].setValue(this.assetArr[0]);
    this.workorderform.controls['assetId'].setValue(this.assetArr[1]);
    this.workOrderService.addWorkOrder(this.workorderform.value).subscribe((data)=>{
      console.log(data+" WorkOrderInserted");
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
    this.ngOnInit();
    }
    )
  }
  getAllWorkOrderList(email:string){
    this.workOrderService.getWorkOrder(email).subscribe((data)=>{
      this.workorderlist=data;
    },(err)=>{
      console.log(err);
    })
  }
  getAllAssets(email:string){
    this.workOrderService.getAssets(email).subscribe((data)=>{
      this.assetList=data;
    },(err)=>{
      console.log(err);
    })
  }
  checkDueDate(date:string):boolean{
   
    const dueDate=new Date(date);
   
    if(dueDate.getTime()<this.todayDate.getTime()){
     
      return true;
      
    }
  

    return false;
    
  }
  editButtonVisibile(id:number){
   
    this.editButtonId=id;
    this.editVisibility=true;
 
  }
  editButtonNotVisible(){
    
    this.editVisibility=false;
    this.editButtonId=-1;
  }
  workOrderDetail(id:string){
    this.detailedWorkOrder=true;

  this.selectedWorkOrder=id;
  }
  onBackClicked(eventData:{show:boolean}){
    this.ngOnInit();
   
    this.detailedWorkOrder=eventData.show;
  }
  deleteloading(){
    this.loadingScreen=true;
    setInterval(()=>{
      this.loadingScreen=false;
      
    },3000);
    
  }
  deleteAsset(id:string){
    this.deleteloading();
   setTimeout(()=>{
    this.workOrderService.deleteWorkOrder(id).subscribe((data)=>{
      console.log('Asset Deleted');
     
    },
    (err)=>{
      console.log(err);
    },()=>{
      this.ngOnInit();
    })
   },3000);
    
  }
  assetSelected(data:any){
    console.log(data)
  }
}
