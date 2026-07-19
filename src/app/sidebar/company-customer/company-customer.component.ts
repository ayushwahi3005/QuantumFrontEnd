import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyCustomerService } from './company-customer.service';
import { CompanyCustomer } from './company-cutomer';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ExtraFieldName } from './extraFieldName';
import { RoleAndPermission } from './RoleAndPermission';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { CategoryName } from './categoryName';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { countryList } from 'src/app/setting/subscription/country';
import * as XLSX from 'xlsx';
import { CountryService } from 'src/app/shared/country/country.service';

@Component({
  selector: 'app-company-customer',
  templateUrl: './company-customer.component.html',
  styleUrls: ['./company-customer.component.css']
})
export class CompanyCustomerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('closeBox') closeBox: ElementRef | undefined;
  @ViewChild('exportCloseBox') exportCloseBox!: ElementRef;

  companyCustomerForm!: FormGroup;
  filterForm!: FormGroup;
  formReady: boolean = false; // ✅ guard flag

  companyCustomerlist!: CompanyCustomer[];
  companyCustomerCategoryList!: CategoryName[];
  detailModule!: Boolean;
  detailId!: String;
  email: any;
  companyId: any;
  priority!: string;
  todayDate!: Date;
  editVisibility: boolean = false;
  editButtonId: number = -1;
  detailedWorkOrder = false;
  selectedWorkOrder!: string;
  loadingScreen = false;
  searchData!: string;
  searchDataBy!: string;
  sortedBy!: string;
  sortDirection: string = 'ASC'; // Add sort direction property
  showFieldsList!: ShowFieldsData[];
  mandatoryFieldsList!: MandatoryFields[];
  mandatoryFieldsMap!: Map<string, boolean>;
  showFieldsMap!: Map<string, boolean>;
  extraFieldName!: ExtraFieldName[];
  extraFieldNameMap!: Map<String, ExtraFieldName>;
  extraFieldNameList!: string[];
  selectedFilterList: any = [];
  selectedExtraColums: string[] = [];
  selectedExtraColumsNameValue: any[] = [];
  fieldNameValueMap!: object;
  searchedCompanyCustomer!: any[];
  loading: boolean = true;
  selectedItems = [];
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';
  emailInvalid: boolean = false;
  userRole: any;
  checkBoxColor = "primary";
  showMandatoryBasicFields!: Map<string, Boolean>;
  companyCustomerListWithExtraFields: any = [];
  userRoleDetails!: RoleAndPermission;
  myList: string[] = [];
  pageSize: number = 15;
  totalLength!: number;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  paginationResult!: PaginationResult;
  companyCustomer!: any[];
  companyCustomerListWithExtraFieldsWithoutFilter = [];
  mandatoryFieldFilterList!: Map<string, Boolean>;
  appliedFilterListMap!: Map<string, string>;
  appliedFilterList!: Set<string>;
  extraFieldFilterList!: Map<String, String>;
  savedExtraColumn!: any;
  selectedExtraColumsMap!: Map<string, Boolean>;
  myArray = [];
  stateList = [];
  asc: Boolean = true;
  exportType: string = 'export-current-page';
  fileName = 'CustomerSheet.xlsx';
  private routerSubscription!: Subscription;
  private countrySubscription!: Subscription; // ✅ track subscription for cleanup

  selectedCountryCode: string = 'United States of America';
  // countryCodeList = countryList;
  currentSelectedCountryCode = 'US';

  countryList = [
    "Canada",
    "Mexico",
    "United States of America",
    "Antigua and Barbuda",
    "The Bahamas",
    "Barbados",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Trinidad and Tobago",
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panama"
  ];

  constructor(
    private formBuilder: FormBuilder,
    private companyCustomerService: CompanyCustomerService,
    private dashboard: DashboardComponent,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/setting-home') {
          localStorage.removeItem('selectedExtraColumsCustomer');
          localStorage.removeItem('selectedExtraColumsAssets');
          this.savedExtraColumn = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.countrySubscription) {
      this.countrySubscription.unsubscribe();
    }
    this.savedExtraColumn = null;
  }

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyId');
    this.exportType = 'export-current-page';

    // ─────────────────────────────────────────
    // STEP 1: Init all state variables
    // ─────────────────────────────────────────
    this.loading = true;
    this.sortedBy = '';
    this.searchData = '';
    this.detailModule = false;
    this.appliedFilterList = new Set<string>();
    this.appliedFilterListMap = new Map<string, string>();
    this.extraFieldFilterList = new Map<String, String>();
    this.selectedExtraColumsMap = new Map<string, Boolean>();
    this.showMandatoryBasicFields = new Map<string, Boolean>();
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email = localStorage.getItem('user');
    this.userRole = localStorage.getItem('role');

    // ─────────────────────────────────────────
    // STEP 2: Get default country synchronously
    // ─────────────────────────────────────────
    this.selectedCountryCode = this.countryService.getCountryCode() || 'United States of America';

    

    // ─────────────────────────────────────────
    // STEP 3: Initialize BOTH forms with default country
    // ─────────────────────────────────────────
    this.companyCustomerForm = this.formBuilder.group({
      name: ['', Validators.required],
      companyId: [this.companyId],
      category: [''],
      status: ['active'],
      phone: ['', Validators.pattern('^[ 0-9\(\)\-]{14}$')],
      email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      address: [''],
      apartment: [''],
      city: [''],
      state: [''],
      country: [this.selectedCountryCode], // ✅ set synchronously
      zipCode: ['', Validators.pattern('^[a-z0-9]{6}$')]
    });

    this.filterForm = this.formBuilder.group({
      companyCustomerId: [''],
      name: [''],
      customer: [''],
      phone: [''],
      address: [''],
      category: [''],
      status: [''],
      email: [''],
      city: [''],
      state: [''],
      country: [''], // ✅ set synchronously
      zipCode: [''],
      companyId: [this.companyId]
    });

    // ✅ Mark forms as ready so HTML can render
    this.formReady = true;

    // ─────────────────────────────────────────
    // STEP 4: Subscribe to country changes (for future updates)
    // ─────────────────────────────────────────
    this.countrySubscription = this.countryService.countryCode$.subscribe(code => {
      if (code && code !== this.selectedCountryCode) {
        // only update if value actually changed to avoid loop
        this.selectedCountryCode = code;
        console.log(code)
        if (this.companyCustomerForm) {
          this.companyCustomerForm.patchValue({ country: code }, { emitEvent: false });
        }
        // Update state list when country changes
        this.getStateListSilent(code);
      }
    });

    // ─────────────────────────────────────────
    // STEP 5: Load state list for default country
    // ─────────────────────────────────────────
    this.getStateListSilent(this.selectedCountryCode);

    // ─────────────────────────────────────────
    // STEP 6: Pagination & page setup
    // ─────────────────────────────────────────
    this.pageIndex = parseInt(localStorage.getItem('customerPageInd') || '0');
    this.pageSize = parseInt(localStorage.getItem('customerPageSize') || '15');

    this.savedExtraColumn = localStorage.getItem('showMandatoryBasicFieldsCustomers');
    this.myArray = JSON.parse(this.savedExtraColumn);
    this.mandatoryFieldFilterList = new Map<string, Boolean>();
    this.myList = ['companyCustomerId', 'name', 'category', 'status', 'phone', 'email', 'address', 'phone', 'status'];

    this.showMandatoryBasicFields.set('email', true);
    this.showMandatoryBasicFields.set('name', true);

    this.myList.forEach((x) => {
      if (this.myArray != null) {
        this.myArray?.forEach((ele: any) => {
          if (x === ele) {
            this.showMandatoryBasicFields.set(x, true);
          }
        });
      } else {
        this.showMandatoryBasicFields.set(x, true);
      }
      this.mandatoryFieldFilterList.set(x, true);
    });

    this.companyCustomerService.getCompanyCustomerCategory(this.companyId).subscribe(
      (data) => { this.companyCustomerCategoryList = data; },
      (err) => { console.log(err); }
    );

    this.savedExtraColumn = localStorage.getItem('selectedExtraColumsCustomer');
    this.selectedExtraColums = JSON.parse(this.savedExtraColumn);
    if (this.savedExtraColumn != null) {
      this.selectedExtraColums = JSON.parse(this.savedExtraColumn);
      this.selectedExtraColums.forEach((data) => {
        this.selectedExtraColumsMap.set(data, true);
      });
    }

    // ─────────────────────────────────────────
    // STEP 7: Trigger pagination (uses filterForm)
    // ─────────────────────────────────────────
    let myPageEvent = new PageEvent();
    myPageEvent.length = this.totalLength;
    myPageEvent.pageIndex = this.pageIndex;
    myPageEvent.pageSize = this.pageSize;
    this.handlePageEvent(myPageEvent);

    this.companyCustomerService.getRoleAndPermission(this.companyId, this.userRole).subscribe(
      (data) => { this.userRoleDetails = data; },
      (err) => { console.log(err); }
    );

    this.companyCustomerService.getAllMandatoryFields(this.companyId).subscribe(
      (data) => {
        this.mandatoryFieldsList = data;
        this.mandatoryFieldsList.forEach((x) => {
          this.mandatoryFieldsMap.set(x.name, x.mandatory);
        });
      },
      (err) => { console.log(err); }
    );

    this.companyCustomerService.getAllShowFields(this.companyId).subscribe(
      (data) => {
        this.showFieldsList = data;
        this.selectedFilterList = [];
        this.showFieldsList.forEach((x) => {
          this.filterForm.addControl(x.name, this.formBuilder.control('', Validators.required));
          this.selectedFilterList.push(x.name);
          this.showFieldsMap.set(x.name, x.show);
        });

        if (this.showFieldsList != null) {
          this.showFieldsList.forEach((x) => {
            if (x.show == true) {
              this.companyCustomerForm.addControl(x.name, this.formBuilder.control(''));
              this.extraFieldFilterList.set(x.name, x.type);
            }
          });
        }

        // ✅ re-patch after addControl calls to restore country & status
        this.companyCustomerForm.patchValue({
          country: this.selectedCountryCode,
          status: 'active'
        }, { emitEvent: false });
        this.cdr.detectChanges();
      },
      (err) => { console.log(err); },
      () => {
        this.companyCustomerService.getExtraFieldName(this.companyId).subscribe(
          (data) => {
            this.extraFieldName = data;
            var arr: string[] = [];
            this.extraFieldName.forEach((x) => {
              this.extraFieldNameMap?.set(x.name, x);
              if (this.showFieldsMap.get(x.name) == true) {
                arr.push(x.name);
              }
            });
            this.extraFieldNameList = arr;
          },
          (err) => { console.log(err); }
        );
      }
    );

    this.companyCustomerService.working().subscribe(
      (data) => { console.log(data); },
      (err) => { console.log(err); }
    );
  }

  // ✅ Silent version - does NOT reset state fields, used for initial load
  getStateListSilent(country: any) {
    console.log('Fetching states for country:', country); // check what country value is
    this.currentSelectedCountryCode = countryList[country] || '';
    this.companyCustomerService.countryStateList(country).subscribe(
      (data) => {
        this.stateList = data;
        console.log('State list loaded for country:', country, this.stateList); // check loaded state list
        this.cdr.detectChanges();
      },
      (err) => { console.log(err); }
    );
  }

  // ✅ Normal version - resets state fields, used when user changes country
  getStateList(country: any) {
    // this.currentSelectedCountryCode = countryList[country] || '';
    this.currentSelectedCountryCode = country;
    console.log('Fetching states for country:', country, 'code:', this.currentSelectedCountryCode); // check what country value is
    this.companyCustomerService.countryStateList(this.currentSelectedCountryCode).subscribe(
      (data) => {
        this.stateList = data;
        console.log('State list updated for country:', this.currentSelectedCountryCode, this.stateList); // check updated state list
        this.filterForm?.get('state')?.setValue('');
        this.companyCustomerForm?.get('state')?.setValue('');
        this.cdr.detectChanges();
      },
      (err) => { console.log(err); }
    );
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('add-order');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
      });
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    localStorage.setItem('customerPageInd', this.pageIndex.toString());
    localStorage.setItem('customerPageSize', this.pageSize.toString());
    this.advanceFilterFunc();
  }

  
  formatPhoneNumber(event: Event) {
    let input = (event.target as HTMLInputElement).value;
    input = input.replace(/\D/g, '');
    if (input.length > 6) {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
    } else if (input.length > 3) {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}`;
    } else if (input.length > 0) {
      input = `(${input.substring(0, 3)}`;
    }
    (event.target as HTMLInputElement).value = input;
    this.companyCustomerForm.controls['phone'].setValue(input);
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.advanceFilterFunc();
  }

  advanceFilterFunc() {
  this.loadingScreen = true;
  console.log('filterForm value:', this.filterForm.value);
  console.log('pageIndex:', this.pageIndex, 'pageSize:', this.pageSize);

  this.companyCustomerService.advanceFilter(
    this.filterForm.value,
    this.pageIndex,
    this.pageSize,
    this.sortedBy,
    this.searchData,
    this.sortDirection === 'ASC' ? true : false
  ).subscribe(
    (data) => {
      console.log('raw API response:', data); // check what API returns
      this.companyCustomerListWithExtraFields = [];
      this.paginationResult = data;

      console.log('totalRecords:', this.paginationResult.totalRecords);
      console.log('data length:', this.paginationResult.data.length);

      if (this.paginationResult.data.length == 0 && this.pageIndex != 0) {
        this.pageIndex = 0;
        localStorage.setItem('customerPageInd', this.pageIndex.toString());
        this.advanceFilterFunc();
        return; // ✅ add return to stop processing empty result
      }

      this.totalLength = this.paginationResult.totalRecords;
      this.companyCustomer = this.paginationResult.data;

      const jsonList: string[] = this.paginationResult.data;
      jsonList.forEach((workorder) => {
        const jsonObject: any = JSON.parse(workorder);
        this.companyCustomerListWithExtraFields.push(jsonObject);
      });

      console.log('final list:', this.companyCustomerListWithExtraFields); // check final result
      this.companyCustomerListWithExtraFieldsWithoutFilter = this.companyCustomerListWithExtraFields;
    },
    (err) => {
      console.log("advanceSearch failed--->", err); // check if API is failing
      this.loadingScreen = false;
    },
    () => {
      this.searchedCompanyCustomer = this.companyCustomer;
      this.loadingScreen = false;
    }
  );
}

  mandatoryFieldCheckBox(isChecked: any, item: string) {
    if (isChecked) {
      this.showMandatoryBasicFields.set(item, true);
    } else {
      this.showMandatoryBasicFields.set(item, false);
    }
    const myArry: any = [];
    this.showMandatoryBasicFields.forEach((val, ele) => {
      if (val == true) { myArry.push(ele); }
    });
    localStorage.setItem("showMandatoryBasicFieldsCustomers", JSON.stringify(myArry));
  }

  customCheckBox(isChecked: any, item: string) {
    if (!this.selectedExtraColums) { this.selectedExtraColums = []; }
    if (isChecked) {
      this.selectedExtraColums.push(item);
      this.selectedExtraColumsMap.set(item, true);
    } else {
      this.selectedExtraColums = this.selectedExtraColums.filter((data) => data != item);
      this.selectedExtraColumsMap?.set(item, false);
    }
    localStorage.setItem("selectedExtraColumsCustomer", JSON.stringify(this.selectedExtraColums));
  }

  get appliedFilterListSize(): number {
    return this.appliedFilterList?.size;
  }

  addCompanyCustomer() {
    let myCompanyCustomer: CompanyCustomer;
    this.companyCustomerForm.controls['companyId'].setValue(this.companyId);
    let extraFieldValueMap = new Map<String, string>();
    let extraFieldTypeMap = new Map<String, string>();

    this.showFieldsList?.forEach((x) => {
      if (x.show == true) {
        extraFieldValueMap.set(x.name, this.companyCustomerForm.get(x.name)?.value);
        extraFieldTypeMap.set(x.name, x.type);
      }
    });

    let valid = 1;

    if (this.companyCustomerForm.get("name")?.value == null || this.companyCustomerForm.get("name")?.value == '') {
      this.triggerAlert("Fill Mandatory Field 'Name'", "warning");
      this.loadingScreen = false;
      return;
    }

    this.mandatoryFieldsList?.forEach((val) => {
      if (this.showFieldsMap.get(val.name) == false) {
        valid = 1;
      } else if ((val.mandatory == true) && (this.companyCustomerForm.get(val.name)?.value == null || this.companyCustomerForm.get(val.name)?.value == '')) {
        this.triggerAlert("Fill Mandatory Field '" + this.toCamelCase(val.name) + "'", "warning");
        valid = 0;
      }
    });

    if (valid == 0) {
      this.loadingScreen = false;
      return;
    }

    this.myList.forEach((col) => {
      if (this.companyCustomerForm.get(col)?.value == null) {
        this.companyCustomerForm.controls[col]?.setValue("");
      }
    });

    this.loadingScreen = true;

    this.companyCustomerService.addCompanyCustomer(this.companyCustomerForm.value).subscribe(
      (data) => {
        myCompanyCustomer = data;
        const extraFieldsToSave = this.showFieldsList?.filter(x => x.show) || [];

        if (extraFieldsToSave.length === 0) {
          this.loadingScreen = false;
          this.closeModalAndRefresh();
          return;
        }

        let completedRequests = 0;
        const totalRequests = extraFieldsToSave.length;
        let hasError = false;

        extraFieldsToSave.forEach((x) => {
          const obj = {
            "email": this.email,
            "companyId": this.companyId,
            "name": x.name,
            "value": (extraFieldValueMap.get(x.name) == null) ? "" : extraFieldValueMap.get(x.name),
            "companyCustomerId": myCompanyCustomer.id,
            "type": extraFieldTypeMap.get(x.name)
          };

          this.companyCustomerService.addExtraFields(obj).subscribe(
            (data) => {
              completedRequests++;
              if (completedRequests === totalRequests && !hasError) {
                this.loadingScreen = false;
                this.closeModalAndRefresh();
              }
            },
            (err) => {
              hasError = true;
              this.loadingScreen = false;
              // if (err.error.error === "TRIAL_EXPIRED"||err.error.error==="SUBSCRIPTION_REQUIRED") {
               if(err.error.error==="TRIAL_EXPIRED"){
                this.triggerAlert(err.error.message, "danger");
              } else {
                this.triggerAlert(err.error.errorMessage, "danger");
              }
            }
          );
        });
      },
      (err) => {
        this.loadingScreen = false;
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        } else {
          const msg: string = err.error?.errorMessage || err.error?.message || 'Error adding customer';
          if (err.status === 400 && msg.includes('Email Already Exists')) {
            this.emailInvalid = true;
            this.triggerAlert(msg, "danger");
            return;
          }
          if (err.status === 400 && (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already exist'))) {
            this.emailInvalid = true;
            this.triggerAlert(msg, "danger");
            return;
          }
          this.triggerAlert(msg, "danger");
        }
      }
    );
  }

  closeModalAndRefresh() {
    const modalElement = document.getElementById('add-order');
    if (modalElement) {
      const modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else if (this.closeBox) {
        this.closeBox.nativeElement.click();
      }
    }

    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      this.advanceFilterFunc();
      this.clearForm();
    }, 100);
  }

  clearForm() {
    if (this.companyCustomerForm) {
      Object.keys(this.companyCustomerForm.controls).forEach(key => {
        const control = this.companyCustomerForm.get(key);
        if (control) {
          if (key === 'companyId') {
            control.setValue(this.companyId);
          } else if (key === 'status') {
            control.setValue('active');
          } else if (key === 'country') {
            control.setValue(this.countryService.getCountryCode()); // ✅ from service
          } else {
            control.setValue('');
          }
          control.markAsUntouched();
          control.markAsPristine();
        }
      });
    }
  }

  getAllCompanyCustomerList(companyId: string) {
    this.companyCustomerService.getAllCompanyCustomerWithExtraColumn(companyId).subscribe(
      (data) => {
        this.companyCustomerListWithExtraFields = [];
        this.companyCustomerlist = data;
        const jsonList: string[] = data;
        jsonList.forEach((workorder) => {
          const jsonObject: any = JSON.parse(workorder);
          this.companyCustomerListWithExtraFields.push(jsonObject);
        });
      },
      (err) => { console.log(err); }
    );
  }

  editButtonVisibile(id: number) {
    this.editButtonId = id;
    this.editVisibility = true;
  }

  editButtonNotVisible() {
    this.editVisibility = false;
    this.editButtonId = -1;
  }

  companyCustomerDetail(id: string) {
    this.detailedWorkOrder = true;
    this.detailModule = true;
    this.detailId = id;
    this.selectedWorkOrder = id;
  }

  onBackClicked(eventData: { show: boolean }) {
    this.ngOnInit();
    this.detailedWorkOrder = eventData.show;
  }

  deleteCompanyCustomer(id: string) {
    this.loadingScreen = true;
    this.companyCustomerService.deleteCompanyCustomer(id).subscribe(
      (data) => {
        this.companyCustomerForm.reset();
        this.companyCustomerService.deleteWorkorderExtraField(id).subscribe(
          (data) => { console.log("ExtraFields Deleted"); },
          (err) => {
            this.loadingScreen = false;
            // if (err.error.error === "TRIAL_EXPIRED"||err.error.error==="SUBSCRIPTION_REQUIRED") {
             if(err.error.error==="TRIAL_EXPIRED"){
              this.triggerAlert(err.error.message, "danger");
            } else {
              this.triggerAlert(err.error.errorMessage, "danger");
            }
          },
          () => {
            this.ngOnInit();
            this.loadingScreen = false;
          }
        );
      },
      (err) => {
        this.companyCustomerForm.reset();
        this.loadingScreen = false;
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        } else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      }
    );
  }

  assetSelected(data: any) { console.log(data); }

  onSearch(data: any) {
    this.searchData = data;
  }

  searchClick() {
    this.advanceFilterFunc();
  }

  searchBy(data: string) {
    this.searchDataBy = data;
    this.sortedBy = '';
  }

  removeSearchDataBy() {
    this.searchDataBy = '';
    this.getAllCompanyCustomerList(this.companyId);
  }

  sortBy(data: string) {
    this.sortedBy = data;
    this.advanceFilterFunc();
  }

  removeSort() {
    this.sortedBy = '';
  }

  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => { this.dismissAlert(); }, 5000);
  }

  dismissAlert() {
    this.showAlert = false;
    // Remove any lingering modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  }

  Echo() { console.log("echo"); }

  resetForm() {
    this.companyCustomerForm.reset({
      status: 'active',
      companyId: this.companyId,
      country: this.countryService.getCountryCode() // ✅ restore country on reset
    });
  }

  addFilterForm() {
    this.mandatoryFieldFilterList.forEach((value, data) => {
      if (value == true && this.filterForm.controls[data]?.value != null && this.filterForm.controls[data]?.value != "") {
        this.appliedFilterListMap.set(data, this.filterForm.get(data)?.value);
        this.appliedFilterList.add(data);
      }
    });

    this.selectedFilterList.forEach((name: string) => {
      if (this.filterForm.controls[name].value != null && this.filterForm.controls[name].value != "") {
        this.appliedFilterListMap.set(name, this.filterForm.get(name)?.value);
        this.appliedFilterList.add(name);
      }
    });

    this.advanceFilterFunc();
  }

  reset() {
    this.filterForm.reset();
    this.sortedBy = "";
    this.appliedFilterList = new Set<string>();
    this.appliedFilterListMap = new Map<string, string>();
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
    });

    this.advanceFilterFunc();
  }

  removeSingleFilter(name: string) {
    this.appliedFilterList.delete(name);
    this.filterForm.get(name)?.setValue(null);
    this.advanceFilterFunc();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchClick();
    }
  }

  exportData() {
    if (this.exportType === 'export-current-page') {
      this.exportexcel();
      this.triggerAlert("Exported Current Page Successfully", "success");
      this.exportCloseBox?.nativeElement.click();
    } else {
      this.companyCustomerService.exportCompanyCustomer(this.companyId).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Customers_' + this.companyId + '.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (err) => { console.log(err); },
        () => {
          this.triggerAlert("Exported All Data Successfully", "success");
          this.exportCloseBox?.nativeElement.click();
        }
      );
    }
  }

  exportexcel(): void {
    const element = document.getElementById('companycustomer-table');
    if (!element) { console.error('Table element not found'); return; }

    const rows = element.querySelectorAll('tr');
    const data: any[] = [];
    rows.forEach(row => {
      const rowData: any[] = [];
      row.querySelectorAll('td, th').forEach(cell => {
        rowData.push({ v: cell.textContent?.trim(), t: 's', z: '@' });
      });
      data.push(rowData);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}