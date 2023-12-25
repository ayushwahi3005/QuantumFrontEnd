import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkorderDetailsService } from './workorder-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkOrder } from './workorder';
import { coerceStringArray } from '@angular/cdk/coercion';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workorder-details',
  templateUrl: './workorder-details.component.html',
  styleUrls: ['./workorder-details.component.css']
})
export class WorkorderDetailsComponent {

  @Input() id!:string;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  workOrder!: WorkOrder;
  workOrderUpdateForm!:FormGroup;
  currColor='open';
  loadingScreen=false;
  workOrderId!:any;
  constructor(private workOrderDetailService:WorkorderDetailsService,private formBuilder:FormBuilder,private activeRoute:ActivatedRoute,private router:Router){}

  ngOnInit(){
    this.activeRoute.paramMap.subscribe((data)=>{
      this.workOrderId=data.get('id');
      console.log(this.workOrderId)
    })
    this.workOrderDetailService.getWorkOrder(this.workOrderId).subscribe((data)=>{
      this.workOrder=data;
      // this.workOrder.dueDate=this.workOrder.dueDate.substring(1,10);
      console.log(this.workOrder)
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.currColor=this.workOrder.status;
      
    });
    this.workOrderUpdateForm=this.formBuilder.group({
      id:[''],
      description:['',Validators.required],
      customer:['',Validators.required],
      dueDate:['',Validators.required],
      assignedTechnician:['',Validators.required],
      assetDetails:['',Validators.required],
      assetId:[''],
      priority:['None'],
      lastUpdate:[''],
      email:[''],
      status:[''],
      



    });
  
   

    
  }

  onBack(){
    
    this.backStatus.emit({show:false});
  }
  onSubmit(){
    this.workOrderUpdateForm.controls['email'].setValue(this.workOrder.email)
    this.workOrderUpdateForm.controls['id'].setValue(this.workOrder.id)
    // this.workOrderUpdateForm.controls['dueDate'].setValue(this.workOrder.dueDate.substring(0,10))
    this.workOrderUpdateForm.controls['assetId'].setValue(this.workOrder.assetId)
    // console.log("mydate",this.workOrderUpdateForm.controls['dueDate'].value)

    this.workOrderDetailService.updateWorkOrder(this.workOrderUpdateForm.value).subscribe((data)=>{
      console.log("Data Updated");
      this.loading();
    },
    (err)=>{
      console.log(err);
    })
  
  }
  onDropDownChange(event:any){
  
  if(event.toLowerCase()=='open'){
    this.currColor='open';
  }
  else if(event.toLowerCase()=='inprogress'){
    this.currColor='inprogress';
  }
  else if(event.toLowerCase()=='onhold'){
    this.currColor='onhold';
  }
  else{
    this.currColor='closed';
  }
  }
  loading(){
    this.loadingScreen=true;
   
   
    setTimeout(()=>{
      this.loadingScreen=false;
      this.router.navigate(['/dashboard'])
    },2000)
    
  }
 

}
