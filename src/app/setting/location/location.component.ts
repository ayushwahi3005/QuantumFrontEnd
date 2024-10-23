import { Component } from '@angular/core';
import { LocationService } from './location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {

  currOption=1;
  editVisibility:boolean=false;
  editButtonId:number=-1;
  locationForm!:FormGroup;
  binForm!:FormGroup;
  userRole:any;
  email:any;
  companyId:any;
  locationList:any=[];
  searchedLocationList:any=[];

  binList:any=[];
  searchedBinList:any=[];
  constructor(private locationService:LocationService,private formBuilder:FormBuilder){}
  ngOnInit(){

    this.userRole=localStorage.getItem('role');
    this.email=localStorage.getItem('user');
    this.companyId=localStorage.getItem('companyId');
    this.locationList=[];
    this.searchedLocationList=[];
    this.locationForm=this.formBuilder.group({
      parentLocation:[''],
      address:[''],
      apartment:[''],
      city:[''],
      state:[''],
      zipCode:[''],
      status:['active'],
      companyId:[this.companyId]
     

    });

    this.binForm=this.formBuilder.group({
      location:['',Validators.required],
      binNumber:['',Validators.required],
      status:['active'],
      companyId:[this.companyId]
     

    });

    this.locationService.getLocation(this.companyId).subscribe((data)=>{
      this.locationList=data;
      this.searchedLocationList=this.locationList
      console.log(this.locationList)
    },
    (err)=>{
      console.log(err);
    })

    this.locationService.getBin(this.companyId).subscribe((data)=>{
      this.binList=data;
      this.searchedBinList=this.binList
      console.log(this.binList)
    },
    (err)=>{
      console.log(err);
    })

   
  }

  onClick(data:any){
    console.log(data);
    this.currOption=data;
  }
  editButtonVisibile(id:number){
  
        this.editButtonId=id;
        this.editVisibility=true;
     
      }
  editButtonNotVisible(){
        
        this.editVisibility=false;
        this.editButtonId=-1;
      }

  saveLocation(){
    console.log(this.locationForm.value)
    this.locationService.saveLocation(this.locationForm.value).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
  }
  saveBin(){
    console.log(this.locationForm.value)
    this.locationService.saveBin(this.binForm.value).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
  }
  deleteBin(id:string){
    this.locationService.deleteBin(id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
  }
  deleteLocation(id:string){
    this.locationService.deleteLocation(id).subscribe((data)=>{
      console.log(data);
    },
    (err)=>{
      console.log(err);
    },
    ()=>{
      this.ngOnInit();
    })
  }
  locationSearch(data:any){
    console.log(data.target.value);
    const searchData=data.target.value;
    if(searchData==''||searchData==null){
      this.searchedLocationList=this.locationList
    }
    this.searchedLocationList=this.locationList.filter((item:any)=>{
      let filterData:any;
      if(item.address?.toLowerCase().includes(searchData?.toLowerCase())||item.parentLocation?.toLowerCase().includes(searchData?.toLowerCase())||item.location?.toLowerCase().includes(searchData?.toLowerCase())||item.apartment?.toLowerCase().includes(searchData?.toLowerCase())||item.city?.toLowerCase().includes(searchData?.toLowerCase())||item.state?.toLowerCase().includes(searchData?.toLowerCase())||item.zipCode==searchData){
        filterData=item;
      }
      else{
        filterData=false;
      }
      return filterData;
    })
  }
  binSearch(data:any){
    console.log(data.target.value);
    const searchData=data.target.value;
    if(searchData==''||searchData==null){
      this.searchedBinList=this.binList
    }
    this.searchedBinList=this.binList.filter((item:any)=>{
      let filterData:any;
      if(item.binNumber?.toLowerCase().includes(searchData?.toLowerCase())||item.location?.toLowerCase().includes(searchData?.toLowerCase())||item.status?.toLowerCase().includes(searchData?.toLowerCase())){
        filterData=item;
      }
      else{
        filterData=false;
      }
      return filterData;
    })
  }



}
