import { Component, ElementRef, inject, ViewChild, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { AssetsService } from './assets.service';
import { AuthService } from 'src/app/shared/auth.service';
import * as XLSX from 'xlsx';
import { Assets } from './assets';
import { ExtraFieldName } from './extraFieldName';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { CompanyCustomer } from './company-cutomer';
import { RoleAndPermission } from './RoleAndPermission';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryName } from './categoryName';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssetsComponent implements OnDestroy{
  private _snackBar = inject(MatSnackBar);
  @ViewChild('closeBox2') closeBox2!: ElementRef;
  
  loading: boolean = true;
  tempId: any;
  paginationResult!: PaginationResult;
  assets!: any[];
  searchedAssets!: any[];
  email: any;
  excelFile: any;
  fileName = 'AssetSheet.xlsx';
  sortoption: string = '';
  searchText: string = '';
  imgId: string = '';
  assetName: string = '';
  detailedAsset: boolean = false;
  previewAsset: boolean = false;
  mainAsset: boolean = true;
  currDetails!: Assets;
  hoverOverSidebar = true;
  extraFieldName!: ExtraFieldName[];
  extraFieldNameList!: string[];
  selectedExtraColums: string[] = [];
  selectedExtraColumsNameValue: any[] = [];
  fieldNameValueMap!: object;
  selectedCompanyCustomer!: string;
  assetCategoryList!: CategoryName[];
  selectedItems = [];





  showFieldsList!: ShowFieldsData[];
  mandatoryFieldsList!: MandatoryFields[];
  mandatoryFieldsMap!: Map<string, boolean>;
  showFieldsMap!: Map<string, boolean>;
  extraFieldNameMap!: Map<String, ExtraFieldName>;

  dropdownSettings: any;
  assetForm!: FormGroup;
  filterForm!: FormGroup;
  myImage: any;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.

  editVisibility: boolean = false;
  editButtonId: number = -1;
  assetList!: Assets[];
  companyId!: any;
  userRole: any;

  assetListWithExtraFields: any = [];
  searchData!: any;
  searchDataBy!: string;
  sortedBy!: string;

  loadingScreen = false;

  companyCustomerList!: CompanyCustomer[];
  companyCustomerArr!: string[];

  customerIdNameMap!: Map<String, String>;

  userRoleDetails!: RoleAndPermission;

  filterShow: boolean = false;

  panelOpenState = false;

  extraFieldFilterList!: Map<String, String>;
  extraFieldFilterListValue!: Map<String, String>;
  filterList: any = [];
  selectedFilterList: any = [];
  selectFilter!: string;
  savedExtraColumn!: any
  pageSize: number = 50;
  totalLength: number = 0;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  assetListWithExtraFieldsWithoutFilter = []
  myList: string[] = [];
  mandatoryFieldFilterList!: Map<string, Boolean>;

  appliedFilterList!: Set<string>;
  appliedFilterListMap!: Map<string, string>;
  selectedExtraColumsMap!: Map<string, Boolean>;
  showMandatoryBasicFields!: Map<string, Boolean>;
  checkBoxColor = "primary"
  myArray = []
  asc: Boolean = true;
  filteredCustomerList: any = [];
  locationWithBins: any = [];
  dropdownOptions: any = [];
  selectedLocationOrBin: string | null = null;
  filteredLocationOrBinList: any = [];
  binLocationIdNameMap: Map<String, String> = new Map<String, String>();
   private routerSubscription!: Subscription;
  constructor(private assetService: AssetsService, private authService: AuthService, private formBuilder: FormBuilder,private router: Router) {
      this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
              // Run only when navigating to /setting-home
              if (event.url === '/setting-home') {
                console.log('destroy');
                localStorage.removeItem('selectedExtraColumsCustomer');
                 localStorage.removeItem('selectedExtraColumsAssets');
                this.savedExtraColumn = null;
              }
            }
          });
  }
  ngOnDestroy(): void {
    console.log("destory")
     if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.savedExtraColumn=null;
  }
  @ViewChild('dropdownContainerAsset', { static: false }) dropdownContainerAsset!: ElementRef;
  ngOnInit() {

    if (localStorage.getItem("assetIdDetail") != null) {
      this.tempId = localStorage.getItem("assetIdDetail")
      this.assetService.getAssetDetails(this.tempId).subscribe((data: Assets) => {

        this.changeAssetDetails(data)
        console.log(data)
      })
      localStorage.removeItem("assetIdDetail")

    }
    this.pageIndex = parseInt(localStorage.getItem('assetPageInd') || '0')
    this.pageSize = parseInt(localStorage.getItem('assetPageSize') || '50')
    // this.assetService.componentMethodCalled$.subscribe((data:any) => {
    //   console.log("--------------------called "+ data)
    //   this.mainAsset=true;
    //   this.detailedAsset=true;
    //   this.currDetails=data;
    // });
    // this.loading=true;
    this.selectedExtraColumsMap = new Map<string, Boolean>;
    console.log("Loading->" + this.loading)


    console.log("extra selected columns--->" + localStorage.getItem("selectedExtraColumsAssets") + " " + localStorage.getItem("showMandatoryBasicFieldsAssets"))
  const rawExtraCols = localStorage.getItem("selectedExtraColumsAssets");

    if (rawExtraCols && rawExtraCols !== "undefined" && rawExtraCols !== "null") {
      try {
        this.selectedExtraColums = JSON.parse(rawExtraCols);
        this.selectedExtraColumsMap = new Map();
        this.selectedExtraColums.forEach((data) => {
          this.selectedExtraColumsMap.set(data, true);
        });
      } catch (e) {
        console.error("Failed to parse selectedExtraColumsAssets:", e);
        this.selectedExtraColums = [];
        this.selectedExtraColumsMap = new Map();
      }
    } else {
      this.selectedExtraColums = [];
      this.selectedExtraColumsMap = new Map();
    }

    this.selectedExtraColumsMap.forEach((ele, val) => {
      console.log(ele + "----" + val)
    })

    this.sortedBy = "";
    this.searchData = "";
    this.filterList = [];
    this.appliedFilterList = new Set<string>();
    this.showMandatoryBasicFields = new Map<string, Boolean>();
    this.appliedFilterListMap = new Map<string, string>;
    // this.selectFilter="";
    this.mandatoryFieldFilterList = new Map<string, Boolean>();
    this.savedExtraColumn = localStorage.getItem("showMandatoryBasicFieldsAssets")
    this.myArray = JSON.parse(this.savedExtraColumn)
    console.log("MYARRAY" + this.myArray)

    this.myList = ['image', 'assetId', 'name', 'serialNumber', 'category', 'customer', 'location', 'status'];
    this.showMandatoryBasicFields.set('image', true);
    this.showMandatoryBasicFields.set('assetId', true);
    this.showMandatoryBasicFields.set('name', true);
    this.myList.forEach((x) => {
      if (this.myArray != null) {
        this.myArray.forEach((ele: any) => {
          if (x === ele) {
            this.showMandatoryBasicFields.set(x, true);
          }
        })
      }
      else {
        this.showMandatoryBasicFields.set(x, true);
      }
      // if()

      this.mandatoryFieldFilterList.set(x, true);
    });


    console.log(this.showMandatoryBasicFields)
    this.panelOpenState = false;
    this.customerIdNameMap = new Map<String, String>();
    this.extraFieldFilterList = new Map<String, String>();
    this.filterShow = false;
    this.userRole = localStorage.getItem('role');
    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    console.log(this.email);


    this.assetForm = this.formBuilder.group({
      name: ['', Validators.required],
      customer: [''],
      customerId: [''],
      serialNumber: [''],
      category: [''],
      location: [''],
      status: ['active'],
      image: [''],
      email: [this.email],
      companyId: [this.companyId]


    });

    this.filterForm = this.formBuilder.group({
      assetId: ['', Validators.required],
      name: ['', Validators.required],
      customer: ['', Validators.required],
      serialNumber: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required],
      email: [],
      companyId: [this.companyId]
      // extraFields: this.formBuilder.array([])


    });
    this.advanceFilterFunc();
    this.assetService.getRoleAndPermission(this.companyId, this.userRole).subscribe((data) => {
      this.userRoleDetails = data;
      console.log(this.userRoleDetails);
    },
      err => {
        console.log(err);
      });
    this.assetService.getCompanyCustomerList(this.companyId).subscribe((data) => {
      this.companyCustomerList = data;
      this.filteredCustomerList = this.companyCustomerList;
      this.companyCustomerList.forEach((x) => {
        this.customerIdNameMap.set(x.id, x.name);
      })
      console.log("companyCustomer" + this.companyCustomerList)
    },
      (err) => {
        console.log(err);
      })
    console.log("Companyid-Category->" + this.companyId)
    this.assetService.getAssetCategory(this.companyId).subscribe((data) => {
      this.assetCategoryList = data;
      console.log("Asset-Category->" + data)
    },
      (err) => {
        console.log(err);
      })

    this.assetService.getAllMandatoryFields(this.companyId).subscribe((data) => {
      this.mandatoryFieldsList = data;
      console.log("mandatory----------------------->", this.mandatoryFieldsList)
      if (this.mandatoryFieldsList.length > 0) {
        this.mandatoryFieldsList?.forEach((x) => {
          this.mandatoryFieldsMap.set(x.name, x.mandatory);
        })
      }
    },
      (err) => {
        console.log(err);
      })
    this.assetService.getAllLocationWithBin(this.companyId).subscribe((data) => {
      this.locationWithBins = data;
      this.filteredLocationOrBinList = this.locationWithBins;


      // Populate binLocationIdNameMap
      this.binLocationIdNameMap.clear();
      this.filteredLocationOrBinList.forEach((loc: any) => {
        // Add location
        this.binLocationIdNameMap.set(`location:${loc.id}`, loc.name);
        // Add bins if present
        if (loc.bins && Array.isArray(loc.bins)) {
          loc.bins.forEach((bin: any) => {
            this.binLocationIdNameMap.set(`bin:${bin.id}`, bin.binNumber);
          });
        }
      });

      console.log(data)
      console.log(this.binLocationIdNameMap)

      this.locationWithBins.forEach((loc: any) => {
        if (loc.bins && loc.bins.length > 0) {
          loc.bins.forEach((bin: any) => {
            this.dropdownOptions.push({
              label: `${loc.name} → ${bin.binNumber}`,
              value: `bin:${bin.id}`
            });
          });
        } else {
          this.dropdownOptions.push({
            label: loc.name,
            value: `location:${loc.id}`
          });
        }
      });
      console.log(this.dropdownOptions)
    },
      (err) => {
        console.log(err);
      });


    this.assetService.getAllShowFields(this.companyId).subscribe((data) => {
      this.showFieldsList = data;
      console.log("show----------------------->", this.showFieldsList)
      this.selectedFilterList = []
      if (this.showFieldsList.length > 0) {
        this.showFieldsList?.forEach((x) => {
          this.filterList.push(x.name);
          this.selectedFilterList.push(x.name);
          this.filterForm.addControl(x.name, this.formBuilder.control('', Validators.required));
          this.showFieldsMap.set(x.name, x.show);
          if (x.show == true) {
            this.extraFieldFilterList.set(x.name, x.type);
          }
        })
      }

      if (this.showFieldsList != null) {
        if (this.showFieldsList.length > 0) {
          this.showFieldsList.forEach((x) => {
            if (x.show == true)
              this.assetForm.addControl(x.name, this.formBuilder.control(''));
          })
        }
      }

    },
      (err) => {
        console.log(err);
      },
      () => {
        this.assetService.getExtraFieldName(this.companyId).subscribe((data) => {


          this.extraFieldName = data;
          let arr: string[] = [];
          this.extraFieldName.forEach((x) => {

            console.log(x.name + " " + this.showFieldsMap.get(x.name))
            this.extraFieldNameMap?.set(x.name, x);
            if (this.showFieldsMap.get(x.name) == true) {
              arr.push(x.name);
            }
          })

          this.extraFieldNameList = arr;
          console.log(this.extraFieldNameList)





        },
          (err) => {
            console.log(err);
          })
      })








    this.selectedItems = [

    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };





    // this.loading=false;
    // console.log("Loading->"+this.loading)
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.dropdownContainerAsset && !this.dropdownContainerAsset.nativeElement.contains(target)) {
      if (this.dropdownOpenLocation) {
        this.dropdownOpenLocation = false;

      }
    }
  }

  get appliedFilterListSize(): number {
    return this.appliedFilterList.size;
  }




  dropdownOpen = false;
  selectedCustomer: any = null;
  selectedCustomerId: any = null;
  toggleDropdown() {
    console.log(this.filteredCustomerList)
    this.dropdownOpen = !this.dropdownOpen;
  }
  filterCustomers(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCustomerList = this.companyCustomerList.filter(customer =>
      customer.name.toLowerCase().includes(searchValue)
    );
  }

  selectCustomer(customer: any) {
    console.log(customer)
    this.selectedCustomer = customer;
    this.selectedCustomerId = customer.companyCustomerId;
    this.dropdownOpen = false;
  }

  dropdownOpenLocation = false;
  dropdownOpenLocationFilter = false;
  selectedLocation: any = null;
  selectedLocationId: any = null;

  toggleDropdownLocation() {
    console.log(this.filteredLocationOrBinList)
    this.dropdownOpenLocation = !this.dropdownOpenLocation;
  }
  toggleDropdownLocationForFilter() {
    console.log(this.filteredLocationOrBinList)
    this.dropdownOpenLocationFilter = !this.dropdownOpenLocationFilter;
  }

  selectLocationOrBin(locationOrBinId: any, locationOrBin: any) {
    console.log(locationOrBin)
    this.selectedLocation = locationOrBin;
    this.selectedLocationId = locationOrBinId;
    console.log(this.selectedLocationId)
    // this.selectedCustomerId=customer.companyCustomerId;
    this.dropdownOpenLocationFilter = false;
    this.dropdownOpenLocation = false;
  }
  // selectLocationOrBinId(locationOrBinId: any) {
  //   // console.log(locationOrBinId)
  //   this.selectedLocationId = locationOrBinId;
  //   // this.selectedCustomerId=customer.companyCustomerId;
  //   this.dropdownOpenLocation = false;
  // }
  filterLocations(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    console.log("searchValue" + searchValue)
    this.filteredLocationOrBinList = this.locationWithBins.filter((loc: any) => {
      const locationMatch = loc.name?.toLowerCase().includes(searchValue);

      const binMatch = loc.bins?.some((bin: any) =>
        bin.binNumber?.toLowerCase().includes(searchValue)
      );

      return locationMatch || binMatch;
    });

  }
  clearAddFormData() {
    this.selectedLocationId = '';
    this.selectedLocation = '';
    this.selectedCustomerId = null;
    this.selectedCustomer = null;
    this.assetForm.reset();
  }
  clearSearchData() {
    console.log("clear search data")
    this.searchData = null;
    this.advanceFilterFunc();
  }

  advanceFilterFunc() {
    this.loading = true;

    console.log(this.filterForm.value)
    this.assetService.advanceFilter(this.filterForm.value, this.pageIndex, this.pageSize, this.sortedBy, this.searchData, this.asc).subscribe((data) => {
      console.log("this.searchData" + this.searchData)
      console.log("Loading->" + this.loading)
      console.log(data);
      this.assetListWithExtraFields = [];
      this.paginationResult = data;
      if (this.paginationResult.data.length == 0 && this.pageIndex != 0) {
        this.pageIndex = 0;
        localStorage.setItem('assetPageInd', this.pageIndex.toString());
        this.advanceFilterFunc();
      }
      this.totalLength = this.paginationResult.totalRecords;
      this.assets = this.paginationResult.data;
      const jsonList: string[] = this.paginationResult.data;
      jsonList.forEach((workorder) => {
        const jsonObject: any = JSON.parse(workorder);
        console.log(typeof (jsonObject))
        this.assetListWithExtraFields.push(jsonObject)
      });
      this.assetListWithExtraFieldsWithoutFilter = this.assetListWithExtraFields;
      console.log(this.assetListWithExtraFields);
      // this.loading=false;
      // console.log("Loading->"+this.loading)
    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        // this.selectedCustomer=null
        // this.selectedLocation=null;
        this.searchedAssets = this.assets;
        // console.log("Loading->"+this.loading)
        this.loading = false;
        console.log("Loading->" + this.loading)
      })
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    localStorage.setItem('assetPageInd', this.pageIndex.toString())
    localStorage.setItem('assetPageSize', this.pageSize.toString())

    this.advanceFilterFunc();


  }

  onChange(value: string): void {
    if (this.selectedExtraColums.includes(value)) {
      this.selectedExtraColums = this.selectedExtraColums.filter((item) => item !== value);
    } else {
      this.selectedExtraColums.push(value);
    }
    console.log(this.selectedExtraColums)
    this.selectedExtraColums.sort();

  }

  onSubmit(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);


    this.assetService.addAssets(formData, this.companyId).subscribe((data) => {
      console.log("Successfully uploaded");
    },
      (err) => {
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
      })
  }
  onAdd() {
    alert("Successfully Uploaded File");
    this.ngOnInit();
  }
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('asset-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  removeFilter() {
    this.searchedAssets = this.assets;
    this.sortoption = '';
    this.ngOnInit();
  }

  imageUpload(event: any) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {



      this.myImage = reader.result;


    };




  }
  //added new
  editButtonVisibile(id: number) {
    //  console.log(id);
    this.editButtonId = id;
    this.editVisibility = true;

  }
  editButtonNotVisible() {

    this.editVisibility = false;
    this.editButtonId = -1;
  }

  addAsset() {

    // addAsset(event: Event){
    //   event.preventDefault();
    let myAsset: Assets;
    let extraFieldValueMap = new Map<String, string>();
    let extraFieldTypeMap = new Map<String, string>();
    this.assetForm.controls['customer'].setValue(this.selectedCustomer);
    this.showFieldsList?.forEach((x) => {
      if (x.show == true) {
        extraFieldValueMap.set(x.name, this.assetForm.get(x.name)?.value);
        extraFieldTypeMap.set(x.name, this.assetForm.get(x.type)?.value);
      }
    })
    this.assetForm.controls['image'].setValue(this.myImage);
    let name = this.assetForm.controls['name'].value;
    if (name == null || name == '') {
      this.triggerAlert("Fill Mandatory Field '" + this.toCamelCase("name") + "'", "warning");
      return
    }
    console.log(this.assetForm.value);
    let valid = 1;
    console.log(this.mandatoryFieldsList)
    this.mandatoryFieldsList?.forEach((val) => {
      console.log("-======mandatory=====>", val.mandatory + " " + this.assetForm.get(val.name)?.value);
      if (this.showFieldsMap.get(val.name) == false) {
        valid = 1;
      }
      else if ((val.mandatory == true) && (this.assetForm.get(val.name)?.value == null || this.assetForm.get(val.name)?.value == '')) {

        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '" + this.toCamelCase(val.name) + "'", "warning");
        // alert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        // this.openSnackBar("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","Close")
        valid = 0;

      }
      else if ((val.mandatory == true) && (this.showFieldsMap.get(val.name) == true) && (this.assetForm.get(val.name)?.value == null || this.assetForm.get(val.name)?.value == '')) {

        // console.log("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        this.triggerAlert("Fill Mandatory Field '" + this.toCamelCase(val.name) + "'", "warning");
        // alert("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'")
        // this.openSnackBar("Fill Mandatory Field '"+this.toCamelCase(val.name)+"'","Close")
        valid = 0;

      }


    })
    if (valid == 0) {
      return;
    }
    // this.selectedCompanyCustomer=this.assetForm.controls['customer'].value;
    if (this.selectedCustomer != null) {
      // this.companyCustomerArr=this.selectedCompanyCustomer.split(',');
      this.assetForm.controls['customer'].setValue(this.selectedCustomer.name);
      this.assetForm.controls['customerId'].setValue(this.selectedCustomer.id);
    }
    this.assetForm.controls['location'].setValue(this.selectedLocationId);
    console.log("assetFormData - " + this.assetForm.value)
    this.assetService.addNewAsset(this.assetForm.value).subscribe((data) => {

      myAsset = data;
      console.log("Asset Uploaded" + data);
      this.closeAddAssetModal()
    },
      (err) => {
        console.log(err);
         if(err.error.error==="TRIAL_EXPIRED"){
        this.triggerAlert(err.error.message,"danger");
      }
      else{
      this.triggerAlert(err.error.errorMessage,"danger");
      }
      },
      () => {
        this.selectedLocationId = '';
        this.selectedLocation = '';
        if (this.closeBox2) {
          this.closeBox2.nativeElement.click();
        }
        this.ngOnInit();
        this.showFieldsList?.forEach((x) => {
          const obj = {
            "email": this.email,
            "companyId": this.companyId,
            "name": x.name,
            "value": extraFieldValueMap.get(x.name),
            "assetId": myAsset.id,
            "type": extraFieldTypeMap.get(x.name)
          }
          console.log("extra fields obj" + obj.companyId + " " + obj.name + " " + obj.value + " assetId " + obj.assetId)
          this.assetService.addExtraFields(obj).subscribe((data) => {
            console.log("added extra fields");
          },
            (err) => {
              console.log(err);
              this.triggerAlert(err.error.errorMessage, "danger");
            })
        })
      })
  }
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   // console.log("clicked")
  //   // this.dropdownOpen = !this.dropdownOpen;
  //   // Check if the click is outside the dropdown and input element
  //   // const dropdownElement = document.querySelector('.dropdown');
  //   // console.log(dropdownElement?.contains(event.target as Node))
  //   // if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
  //   //   this.dropdownOpen = false; // Close the dropdown
  //   // }
  //   const clickedInsideDropdown = this.dropdownContainer?.nativeElement.contains(event.target);

  // console.log('Clicked inside dropdown:', clickedInsideDropdown);

  // }
  changeAssetDetails(item: Assets) {
    this.mainAsset = !this.mainAsset;
    this.detailedAsset = !this.detailedAsset;
    this.currDetails = item;

  }
  changeAssetPreview(item: Assets) {
    this.mainAsset = !this.mainAsset;
    this.previewAsset = !this.previewAsset;
    this.currDetails = item;

  }
  onBackClicked(eventData: { show: boolean }) {
    this.detailedAsset = false;
    this.mainAsset = true;
    console.log(this.previewAsset);
  }
  onBackClicked2(eventData: { show: boolean }) {
    this.previewAsset = false;
    this.mainAsset = true;
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  triggerAlert(message: string, type: string) {
    console.log("triiger")
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 5000); // Hide the alert after 5 seconds (adjust as needed)
  }
  Echo() {
    console.log("ecgo")
  }
  getAllAssetData() {
    this.assetService.getAssetsAllDetails(this.companyId).subscribe((data) => {
      this.assetListWithExtraFields = []
      this.assets = data;
      const jsonList: string[] = data;
      jsonList.forEach((workorder) => {
        const jsonObject: any = JSON.parse(workorder);
        console.log(typeof (jsonObject))
        this.assetListWithExtraFields.push(jsonObject)
      })
      console.log(this.assetListWithExtraFields)
    },
      (err) => {
        console.log(err);
      },
      () => {

      })
  }

  onSearch() {
    this.loading = true;
    console.log(this.searchData);
    let mySearch = this.searchData;
    mySearch = mySearch?.trim();

    if (mySearch == "") {
      this.searchData = null;
    }
    // this.searchData = data.toLowerCase();
    // this.filterAssets();
    this.advanceFilterFunc();
  }

  // filterAssets() {
  //   this.assetListWithExtraFields=this.assetListWithExtraFieldsWithoutFilter;

  //   if (this.searchData==''||this.searchData==null) {

  // this.assetListWithExtraFields=this.assetListWithExtraFieldsWithoutFilter;
  //     return;
  //   }
  //   this.assetListWithExtraFields=this.assetListWithExtraFields.filter((mydata: any)=>{
  //     //  console.log(mydata)
  //         let filterData:any;
  //         if(mydata.name.toLowerCase().includes(this.searchData.toLowerCase())||mydata.assetId==this.searchData||mydata.serialNumber.toLowerCase().includes(this.searchData.toLowerCase())||mydata.category.toLowerCase().includes(this.searchData.toLowerCase())||mydata.customer.toLowerCase().includes(this.searchData.toLowerCase())||mydata.location.toLowerCase().includes(this.searchData.toLowerCase())||mydata.status.toLowerCase().includes(this.searchData.toLowerCase())){
  //           filterData=mydata;
  //         }
  //         else{
  //           let flag=0;
  //           this.selectedExtraColums.forEach((x)=>{

  //            if(isNaN(mydata[x])&&mydata[x].toLowerCase().includes(this.searchData.toLowerCase())){
  //               filterData=mydata;
  //               flag=1;
  //             }
  //             else if((mydata[x]==this.searchData)){
  //               filterData=mydata;
  //               flag=1;
  //             }

  //           })
  //           if(flag==0){
  //           filterData=false;
  //           }
  //         }
  //         return filterData;

  //         // keys.forEach((key)=>{
  //         //   const myString:String =data[key];
  //         //   if(myString!=null&&myString.toLowerCase().includes(value.toLowerCase())){
  //         //     filterData=data;
  //         //   }



  //         // })
  //         // return filterData;
  //       });

  // }
  // searchClick(){
  //   this.loadingScreen=true;
  //   if(this.searchData?.trim()==null||this.searchData?.trim()==''||this.searchDataBy==''){

  //     this.getAllAssetData();

  //     return;
  //   }
  //   if(this.searchDataBy==''||this.searchDataBy==null){
  //     alert("Please select the category from drop down");
  //     return;
  //   }
  //   // this.loadingScreen=true;

  //     this.assetService.getSearchedAssetList(this.companyId,this.searchData?.trim(),this.searchDataBy).subscribe((data)=>{
  //       this.assetListWithExtraFields=[];

  //     this.assetList=data;
  //     const jsonList:string[]=data;
  //     jsonList.forEach((workorder)=>{
  //       const jsonObject:any = JSON.parse(workorder);

  //       this.assetListWithExtraFields.push(jsonObject)
  //     })


  //     },
  //     (err)=>{
  //       console.log(err);
  //     },()=>{
  //       this.loadingScreen=false;
  //     })


  // }
  // searchBy(data:string){
  //   this.searchDataBy=data;
  //   console.log(data)
  //   this.sortedBy='';
  // }
  // removeSearchDataBy(){
  //   this.searchDataBy='';
  //   this.getAllAssetData();
  // }
  sortBy(data: string) {
    this.searchDataBy = '';
    this.sortedBy = data;
    console.log("Sorted By:" + data)
    console.log(this.extraFieldName);
    console.log(this.selectedExtraColumsNameValue);
    const type = this.extraFieldNameMap?.get(data)?.type;
    //   this.assetService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize,this.sortedBy).subscribe((data)=>{
    //     console.log(data);
    //     this.assetListWithExtraFields=[]
    //   this.paginationResult=data;
    //   this.totalLength=this.paginationResult.totalRecords;
    //   this.assets=this.paginationResult.data;
    //   const jsonList:string[]=this.paginationResult.data;
    //   jsonList.forEach((workorder)=>{
    //     const jsonObject:any = JSON.parse(workorder);
    //     console.log(typeof(jsonObject))
    //     this.assetListWithExtraFields.push(jsonObject)
    //   });
    //   this.assetListWithExtraFieldsWithoutFilter=this.assetListWithExtraFields;
    //   console.log(this.assetListWithExtraFields);
    //   this.loading=false;
    //   },
    // (err)=>{
    //   console.log(err);
    //   this.loading=false;
    // })
    this.advanceFilterFunc();
  }
  removeSort() {
    this.sortedBy = '';
    //    this.assetService.advanceFilter(this.filterForm.value,this.pageIndex,this.pageSize,this.sortedBy).subscribe((data)=>{
    //     console.log(data);
    //     this.assetListWithExtraFields=[]
    //   this.paginationResult=data;
    //   this.totalLength=this.paginationResult.totalRecords;
    //   this.assets=this.paginationResult.data;
    //   const jsonList:string[]=this.paginationResult.data;
    //   jsonList.forEach((workorder)=>{
    //     const jsonObject:any = JSON.parse(workorder);
    //     console.log(typeof(jsonObject))
    //     this.assetListWithExtraFields.push(jsonObject)
    //   });
    //   this.assetListWithExtraFieldsWithoutFilter=this.assetListWithExtraFields;
    //   console.log(this.assetListWithExtraFields);
    //   this.loading=false;
    //   },
    // (err)=>{
    //   console.log(err);
    //   this.loading=false;
    // })

    this.advanceFilterFunc();

  }

  showFilter() {

    this.filterShow = !this.filterShow;
  }

  // addFilter(){

  //   this.filterForm.addControl(this.selectFilter,this.formBuilder.control(''));
  //   console.log(this.selectFilter);
  //     if(this.selectFilter!=""){
  //     this.selectedFilterList.push(this.selectFilter);
  //     console.log(this.selectedFilterList);
  //     const index=this.filterList.indexOf(this.selectFilter);
  //     this.filterList = this.filterList.filter((item: string) => item !== this.selectFilter);




  //   }
  //   this.selectFilter="";

  // }


  removeInputField(name: any) {

    console.log("remover" + name)
    this.filterForm.removeControl(name);
    // this.filterList.push(name);
    this.selectedFilterList = this.selectedFilterList.filter((item: string) => item !== name);
    console.log("selectedFilterList-" + this.selectedFilterList)

    console.log(this.filterForm.value);
  }
  removeMandatoryFieldFilter(name: any) {
    this.filterForm.removeControl(name);
    this.mandatoryFieldFilterList.set(name, false);
  }
  addFilterForm() {
    this.loading = true;
    this.filterForm.controls['customer'].setValue(this.selectedCustomer?.name);
    this.filterForm.controls['location'].setValue(this.selectedLocationId);
    console.log(this.filterForm.value);
    this.mandatoryFieldFilterList.forEach((value, data) => {
      if (value == true && this.filterForm.controls[data]?.value != null && this.filterForm.controls[data]?.value != "") {

        this.appliedFilterListMap.set(data, this.filterForm.get(data)?.value);
        this.appliedFilterList.add(data);
      }
    })

    this.selectedFilterList.forEach((name: string) => {
      if (this.filterForm.controls[name].value != null && this.filterForm.controls[name].value != "") {
        this.appliedFilterListMap.set(name, this.filterForm.get(name)?.value);
        this.appliedFilterList.add(name);
      }
    })
    console.log("applied filter" + this.appliedFilterList);
    this.advanceFilterFunc();

  }

  removeSingleFilter(name: string) {
    console.log("single: " + name)
    this.appliedFilterList.delete(name);

    this.filterForm.get(name)?.setValue(null);


    this.advanceFilterFunc();

  }
  reset() {
    this.loading = true;
    this.selectedLocationId = '';
    this.selectedLocation = '';
    this.selectedCustomerId = null;
    this.selectedCustomer = null;
    this.filterForm.reset();
    this.sortedBy = "";
    this.searchData = null;
    this.appliedFilterList = new Set<string>();
    this.appliedFilterListMap = new Map<string, string>;
    this.filterForm.controls['email'].setValue(this.email);
    this.filterForm.controls['companyId'].setValue(this.companyId);
    this.myList.forEach((field) => {
      this.mandatoryFieldFilterList.set(field, true);
      this.filterForm.addControl(field, this.formBuilder.control('', Validators.required));
    });
    this.selectedFilterList = [];
    this.showFieldsList.forEach((x) => {

      this.selectedFilterList.push(x.name);
      this.filterForm.addControl(x.name, this.formBuilder.control('', Validators.required));
      this.showFieldsMap.set(x.name, x.show);

    })
    this.advanceFilterFunc();
  }
  mandatoryFieldCheckBox(isChecked: any, item: string) {

    if (isChecked) {
      this.showMandatoryBasicFields.set(item, true);
    }
    else {
      this.showMandatoryBasicFields.set(item, false);
    }
    const myArry: any = [];
    this.showMandatoryBasicFields.forEach((val, ele) => {
      if (val == true) {
        myArry.push(ele)
      }
    })
    // console.log(JSON.stringify(Object.fromEntries(this.showMandatoryBasicFields)));
    localStorage.setItem("showMandatoryBasicFieldsAssets", JSON.stringify(myArry));
    console.log(item + " mandatory-" + localStorage.getItem("showMandatoryBasicFieldsAssets"));
  }



  customCheckBox(isChecked: any, item: string) {
    console.log(isChecked);

    if (isChecked) {
      this.selectedExtraColums.push(item);
      this.selectedExtraColumsMap.set(item, true);
    }
    else {
      this.selectedExtraColums = this.selectedExtraColums.filter((data) => data != item);
      this.selectedExtraColumsMap?.set(item, false);
    }
    localStorage.setItem("selectedExtraColumsAssets", JSON.stringify(this.selectedExtraColums));
    console.log(this.selectedExtraColums);
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  getFilterDisplayValue(key: string): any {
  const value = this.appliedFilterListMap?.get(key);
  if (!value) return '';
  if (value.startsWith('bin:') || value.startsWith('location:')) {
    return this.binLocationIdNameMap?.get(value) || value;
  }
  return value;
}
closeAddAssetModal(): void {
  this.closeBox2.nativeElement.click();
}

}
