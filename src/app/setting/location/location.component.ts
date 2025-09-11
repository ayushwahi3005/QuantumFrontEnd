import { Component } from '@angular/core';
import { LocationService } from './location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {
  currOption = 1;
  editVisibility: boolean = false;
  editButtonId: number = -1;
  locationForm!: FormGroup;
  binForm!: FormGroup;
  userRole: any;
  email: any;
  companyId: any;
  locationList: any = [];
  searchedLocationList: any = [];

  binList: any = [];
  searchData: any;
  searchedBinList: any = [];
  deleteLocationName:string='';
  deleteLocationId:string='';
  deleteBinName:string='';
  deleteBinId:string='';
   showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  constructor(
    private locationService: LocationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.deleteLocationName='';
    this.deleteLocationId='';
    this.deleteBinName='';
    this.deleteBinId='';
    this.userRole = localStorage.getItem('role');
    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.locationList = [];
    this.searchedLocationList = [];
    this.locationForm = this.formBuilder.group({
      id: [null],
      name: [''],
      parentLocation: [''],
      address: [''],
      apartment: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      status: ['active'],
      companyId: [this.companyId],
    });

    this.binForm = this.formBuilder.group({
      id: [null],
      locationId: ['', Validators.required],
      binNumber: ['', Validators.required],
      status: ['active'],
      companyId: [this.companyId],
    });

    this.locationService.getLocation(this.companyId).subscribe(
      (data) => {
        this.locationList = data;
        this.searchedLocationList = this.locationList;
        console.log(this.locationList);
      },
      (err) => {
        console.log(err);
      }
    );

    this.locationService.getBin(this.companyId).subscribe(
      (data) => {
        this.binList = data;
          console.log(data);
        this.searchedBinList = this.binList;
        console.log(this.binList);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onClick(data: any) {
    console.log(data);
    this.currOption = data;
  }

  clearSearch(): void {
    this.searchData = '';
    this.locationSearch(null); // Explicitly trigger the locationSearch method to update the table
  }

  editButtonVisibile(id: number) {
    this.editButtonId = id;
    this.editVisibility = true;
  }
  editButtonNotVisible() {
    this.editVisibility = false;
    this.editButtonId = -1;
  }

  saveLocation() {
    console.log(this.locationForm.value);
    this.locationService.saveLocation(this.locationForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        this.triggerAlert(err.error.errorMessage,"danger")
      },
      () => {
        this.ngOnInit();
         this.triggerAlert("Successfully Added Location","success")
      }
    );
  }
   updateLocation() {
    console.log(this.locationForm.value);
    this.locationService.updateLocation(this.locationForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
         this.triggerAlert(err.error.errorMessage,"danger")
      },
      () => {
        this.ngOnInit();
          this.triggerAlert("Successfully Updated Location","success")
      }
    );
  }
  saveBin() {
    console.log(this.binForm.value);
    this.locationService.saveBin(this.binForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.ngOnInit();
      }
    );
  }
  updateBin() {
    console.log(this.binForm.value);
    this.locationService.updateBin(this.binForm.value).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.ngOnInit();
      }
    );
  }
  deleteBin(id: string,name:string) {

    this.deleteBinId=id;
    this.deleteBinName=name;
    console.log(this.deleteBinId)
    console.log(this.deleteBinName)
  }
  confirmDeleteBin(){
    this.locationService.deleteBin(this.deleteBinId).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.ngOnInit();
        this.deleteBinName=''
        this.deleteBinId=''
      }
    );
  }
  deleteLocation(id: string,name:string) {
    this.deleteLocationId=id;
    this.deleteLocationName=name;
    console.log(this.deleteLocationId);
    
  }
  deleteConfirmLocation(){
    console.log(this.deleteLocationId);
  this.locationService.deleteLocation(this.deleteLocationId).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.deleteLocationName=''
        this.deleteLocationId=''
        this.ngOnInit();
      }
    );
  }

  editLocation(item: any) {
    console.log(item);
    this.locationForm.patchValue({
      id: item.id ?? '',
      name: item.name ?? '',
      parentLocation: item.parentLocation ?? '',
      address: item.address ?? '',
      apartment: item.apartment ?? '',
      city: item.city ?? '',
      state: item.state ?? '',
      zipCode: item.zipCode ?? '',
      status: item.status ?? 'active',
      companyId: item.companyId ?? this.companyId,
    });
    this.editVisibility = true;
    this.editButtonId = item.id ?? -1;
    console.log(this.locationForm.value);
  }
  clearEditLocation() {
    this.locationForm.patchValue({
      id: '',
      name: '',
      parentLocation: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      status: 'active',
      companyId: this.companyId,
    });
    this.editVisibility = false;
    this.editButtonId = -1;
  }

 editBin(item: any) {
  console.log(item);
  this.binForm.patchValue({
    id: item.id ?? '',
    locationId: item.locationId ?? '',
    binNumber: item.binNumber ?? '',
    status: item.status ?? 'active',
    companyId: item.companyId ?? this.companyId
  });
  this.editVisibility = true;
  this.editButtonId = item.id ?? -1;
  console.log(this.binForm.value);
}
    
  locationSearch(data: any) {
    console.log(data.target.value);
    const searchData = data.target.value;
    if (searchData == '' || searchData == null) {
      this.searchedLocationList = this.locationList;
    }
    this.searchedLocationList = this.locationList.filter((item: any) => {
      let filterData: any;
      if (
        item.address?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.parentLocation
          ?.toLowerCase()
          .includes(searchData?.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.apartment?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.state?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.zipCode == searchData
      ) {
        filterData = item;
      } else {
        filterData = false;
      }
      return filterData;
    });
  }
  binSearch(data: any) {
    console.log(data.target.value);
    const searchData = data.target.value;
    if (searchData == '' || searchData == null) {
      this.searchedBinList = this.binList;
    }
    this.searchedBinList = this.binList.filter((item: any) => {
      let filterData: any;
      if (
        item.binNumber?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchData?.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchData?.toLowerCase())
      ) {
        filterData = item;
      } else {
        filterData = false;
      }
      return filterData;
    });
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
