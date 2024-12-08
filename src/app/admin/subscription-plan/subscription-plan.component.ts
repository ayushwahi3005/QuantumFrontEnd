import { Component } from '@angular/core';
import { SubscriptionPlanService } from './subscription-plan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.css'
})
export class SubscriptionPlanComponent {

  planAdded=false;
  subscriptionForm!:FormGroup;
  subscription = {
    id:'',
    name: '',
    monthly: null,
    monthlyDiscount:null,
    
    yearly: null,
    yearlyDiscount:null,
    cardColor: '#ffffff',
    descriptions: ['', '', '', '', '']
  };
  getsubscription = {
    name:null,
    monthly: null,
    monthlyDiscount:null,
    
    yearly: null,
    yearlyDiscount:null,
    cardColor: null,
    description1: null,
    description2: null,
    description3: null,
    description4: null,
    description5: null
  };
  descriptionFields = ['description1', 'description2', 'description3', 'description4', 'description5'];
  subscriptionList!:[];

  constructor(private subscriptionPlanService: SubscriptionPlanService,private formBuilder:FormBuilder,private router:Router) {}


  ngOnInit() { 
    this.planAdded = false;
    this.subscriptionForm=this.formBuilder.group({
      id: '',
      name: '',
      monthly:['',Validators.required],
      monthlyDiscount:[''],
      yearly:['',Validators.required],
      yearlyDiscount:[''],
      cardColor:['',Validators.required],
      description1:[''],
      description2:[''],
      description3:[''],
      description4:[''],
      description5:['']
  
  
      
  
  
  
    });

    this.subscriptionPlanService.getPlans().subscribe((data)=>{
         
        this.subscriptionList=data;
        console.log( this.subscriptionList);
    },
    (err)=>{
      if(err.status==403){
        alert('Session Expired');
        this.router.navigate(['admin']);
        this.ngOnInit();

      }
    
     console.error( err);
    })
  }
 
  preview(){
    this.planAdded = true;
  }
 
  onSubmit() {
   
    console.log(this.subscriptionForm.value);
    this.subscriptionPlanService.addPlans(this.subscriptionForm.value).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.error( err);
      if(err.status==403){
        alert('Session Expired');
        this.router.navigate(['admin']);
        this.ngOnInit();

      }
    },
    ()=>{
      this.ngOnInit()
    })
  }
}
