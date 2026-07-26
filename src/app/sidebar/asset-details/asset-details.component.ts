import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Assets } from './assets';
import { AssetDetailsService } from './asset-details.service';
import { AssetsService } from '../assets/assets.service';
import { AssetsComponent } from '../assets/assets.component';
import { ExtraFields } from './extraFields';
import { ExtraFieldName } from './extraFieldName';
import { CheckInOut } from './checkInOut';
import { DatePipe } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { AssetFile } from './assetFile';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import * as fileSaver from 'file-saver';
import * as saveAs from 'file-saver';
import { WorkOrder } from './workorder';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { User } from './user';
import { QR } from './qr';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { CompanyCustomer } from './company-cutomer';
import { CategoryName } from 'src/app/setting/asset-category/categoryName';
import { InspectionInstance } from './inspectionInstance';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface IpInfo {
  city: string;
  country: string;
  hostname: string;
  ip: string;
  loc: string;
  org: string;
  postal: string;
  readme: string;
  region: string;
  timezone: string;
}

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css'],
})
export class AssetDetailsComponent {
  @ViewChild('dropdownContainer', { static: false })
  dropdownContainer!: ElementRef;
  @Input() assetDetails!: Assets;
  @Output() backStatus = new EventEmitter<{ show: boolean }>();
  @ViewChild('notes') notesRef!: ElementRef;
  @ViewChild('location') locationRef!: ElementRef;
    @ViewChild('exportCloseBox') exportCloseBox!: ElementRef;
  username: any;
  assetId: any = '';
  img: string = '';
  newObjName: string = '';
  newObjVal: string = '';
  currOption: number = 1;
  extraFields!: ExtraFields[];
  checkInOut: CheckInOut[] = [];
  assetCategoryList!: CategoryName[];
  extraFieldOption!: string;
  email: any;
  extraFieldName!: ExtraFieldName[];
  extraFieldValue: string[] = [];
  extraFieldNameString: string[] = [];
  extraFieldString: string[] = [];
  progress!: number;
  workOrderList: WorkOrder[] = [];
  fileInfos!: AssetFile[];
  message!: string;
  currentFile!: any;
  assetFileList: AssetFile[] = [];
  showFieldsList!: ShowFieldsData[];
  mandatoryFieldsList!: MandatoryFields[];
  mandatoryFieldsMap!: Map<string, boolean>;
  extraFieldMap!: Map<string, boolean>;
  showFieldsMap!: Map<string, boolean>;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success'; // Alert type: success, warning, error, etc.
  deleteFileId!: string;
  companyId!: any;

  technicalUserList!: User[];
  qr!: QR;
  qrData!: string;
  qrSize!: number;

  companyCustomerList!: CompanyCustomer[];
  companyCustomerArr!: string[];
  selectedCompanyCustomer!: string;
  selectedCustomerId!: string;

  changedCustomerName!: string;
  changedCustomerId!: string;
  loading = false;
  userRole: any;
  userRoleDetails: any;
  selectedEmpName: any;
  allInspection: any = [];
  allInspectionInstance: any = [];
  currentInspection: any;
  checkBoxColor = 'primary';
  selectedInspectionInstance: any;
  inspectionInstance: InspectionInstance = {
    assetId: '',
    companyId: '',
    assetCategoryInspectionId: '',
    assetCategoryInspectionName: '',
    actionPerformedBy: '',
    createdBy: '',
    notes: '',
    createdAt: null,
    updatedAt: null,
    dueDate: null,
    status: 'PENDING',
    stepValues: [],
    inspectionTemplates: [],
    selectedItemList: [],
  };
  inspectionMap: Map<string, Object> = new Map<string, Object>();
  filteredLocationOrBinList: any = [];
  locationWithBins: any = [];
  dropdownOptions: any = [];
  dropdownOpenLocation = false;
  selectedLocation: any = null;
  selectedLocationId: any = null;
  loggedUser!: User;
  // username:any;
  inspectionExportType: string = 'inspection-overview';

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};

  stepObject: any[] = [];
  notedData!: string;
  dueDateInput: string = '';

  // Pagination properties for inspection instances
  pageIndex: number = 0;
  pageSize: number = 10;
  totalLength: number = 0;
  pageEvent!: PageEvent;
qrDownloading: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private assetDetailService: AssetDetailsService,
    private assetComponent: AssetsComponent,
    private datePipe: DatePipe,
    private router: Router,
  ) {}
  ngOnInit() {
    this.inspectionExportType = 'inspection-overview';
    this.inspectionMap = new Map<string, Object>();
    this.selectedItems = [];
    this.fileInfos=[];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.loggedUser = new User();
    this.selectedCustomerId = this.assetDetails.customerId;
    this.selectedLocation = this.assetDetails.location;

    
    console.log(
      '----//////------------>>>>>>>>' + this.assetDetails.customerId,
    );
    console.log(this.assetDetails);

    this.currentInspection = null;
    this.username = localStorage.getItem('name');
    this.selectedEmpName = this.username;
    console.log(this.selectedEmpName);
    this.message = '';
    this.progress = 20;
    this.extraFieldString = [];
    this.extraFieldNameString = [];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.qrSize = 3;
    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.pageIndex = parseInt(localStorage.getItem('assetDetailsInspectionPageInd') || '0', 10);
    this.pageSize = parseInt(localStorage.getItem('assetDetailsInspectionPageSize') || '10', 10);
    this.activatedRoute.paramMap.subscribe((data) => {
      console.log(this.assetDetails);
      this.assetId = data.get('id');
      this.assetId = this.assetDetails.id;
      console.log('assetid', this.assetDetails.id);

      this.img = this.assetDetails.image;
    });
    this.userRole = localStorage.getItem('role');
    console.log(this.userRole);
    this.assetDetailService
      .getRoleAndPermission(this.companyId, this.userRole)
      .subscribe(
        (data) => {
          console.log('ROLE');
          console.log(this.userRole);
          this.userRoleDetails = data;
          console.log(this.userRoleDetails);
        },
        (err) => {
          console.log(err);
        },
      );
    this.loadInspectionInstances();
    this.assetDetailService.getActiveCompanyCustomerList(this.companyId).subscribe(
      (data) => {
        this.companyCustomerList = data;
        // this.companyCustomerList.forEach((x) => {
        //   console.log(x.name + ' ' + (x.id === this.assetDetails.customerId));
        // });
        // console.log(this.companyCustomerList);
      },
      (err) => {
        console.log(err);
      },
    );

    //inspection
    console.log(this.assetDetails.category);
    this.assetDetailService
      .getAllAssetInspection(this.companyId, this.assetDetails.category)
      .subscribe((data) => {
        this.allInspection = data;
        console.log(this.allInspection);
        this.dropdownList = this.allInspection;
        this.allInspection.forEach((x: any) => {
          const obj = {
            name: x.name,
            stepsList: x.steps,
          };
          this.inspectionMap.set(x.id, obj);
        });
        console.log(this.inspectionMap);

        //   this.inspectionInstance=localStorage.getItem(this.assetId+'tempInspection') ? JSON.parse(localStorage.getItem(this.assetId+'tempInspection') || '{}') : {
        //   assetId: '',
        //   companyId: '',
        //   assetCategoryInspectionId: '',
        //   assetCategoryInspectionName: '',
        //   actionPerformedBy:'',
        //   notes:'',
        //   date:'',
        //   stepValues: [],
        //   inspectionTemplates: []
        // };
        // if(localStorage.getItem(this.assetId+'tempInspection')!=null){
        // this.inspectionInstance=JSON.parse(localStorage.getItem(this.assetId+'tempInspection') || '{}')
        // }

        // console.log("saved Inspection Instances1",localStorage.getItem(this.assetId+'tempInspection'))
        // console.log("saved Inspection Instance", this.inspectionInstance)
        // this.selectedItems= localStorage.getItem(this.assetId+'selectedItems') ? JSON.parse(localStorage.getItem(this.assetId+'selectedItems') || '[]') : [];
        // console.log("selectedItems",this.selectedItems)
        // if(this.selectedItems.length>0){
        //   this.updateStepListFromLocalStorage()
        // }
      });

    this.assetDetailService.getAssetCategory(this.companyId).subscribe(
      (data) => {
        this.assetCategoryList = data;
      },
      (err) => {
        console.log(err);
      },
    );
    // this.assetDetailService.getWorkOrders(this.assetId).subscribe((data)=>{
    //   this.workOrderList=data;
    //   console.log("workorders",this.workOrderList)
    // },(err)=>{
    //   console.log(err);
    // });
    this.assetDetailService.getAssetFile(this.assetId).subscribe(
      (data) => {
        //console.log("total",data);
        this.fileInfos = data as [];
        console.log('total', this.fileInfos);
      },
      (err) => {
        console.log(err);
      },
    );
    this.assetDetailService.getExtraFields(this.assetDetails.id).subscribe(
      (data) => {
        this.extraFields = data;
        this.extraFields?.sort((a, b) => (a.name < b.name ? -1 : 1));
        if (this.extraFields != null) {
          this.extraFields.forEach((x) => {
            this.extraFieldString.push(x.name);
            this.extraFieldMap.set(x.name, true);
          });
        } else {
          console.log('empty ExtraField', data);
        }
        console.log(this.extraFields);
      },
      (err) => {
        console.log(err);
      },
    );

    this.assetDetailService.getExtraFieldName(this.companyId).subscribe(
      (data) => {
        this.extraFieldName = data;
        this.extraFieldName.sort((a, b) => (a.name < b.name ? -1 : 1));
        console.log(data);
        if (this.extraFieldName != null) {
          this.extraFieldName.forEach((x) => {
            this.extraFieldNameString.push(x.name);
          });
          console.log(this.extraFieldNameString);
        } else {
          console.log('empty extraFieldName');
        }
      },
      (err) => {
        console.log(err);
      },
    );

    this.assetDetailService.getCheckInOutList(this.assetDetails.id).subscribe(
      (data) => {
        this.checkInOut = data;
        console.log(this.checkInOut);
        console.log(this.checkInOut[0]);
      },
      (err) => {
        console.log(err);
      },
    );
    this.assetDetailService.getAllMandatoryFields(this.companyId).subscribe(
      (data) => {
        this.mandatoryFieldsList = data;
        //console.log("mandatory----------------------->",this.mandatoryFieldsList)
        this.mandatoryFieldsList.forEach((x) => {
          this.mandatoryFieldsMap.set(x.name, x.mandatory);
        });
      },
      (err) => {
        console.log(err);
      },
    );
    this.assetDetailService.getAllShowFields(this.companyId).subscribe(
      (data) => {
        this.showFieldsList = data;
        // console.log("show----------------------->",this.showFieldsList)
        this.showFieldsList.forEach((x) => {
          this.showFieldsMap.set(x.name, x.show);
        });
      },
      (err) => {
        console.log(err);
      },
    );

    if (this.userRole == 'ADMIN') {
      this.assetDetailService.getTechnicalUsers(this.companyId).subscribe(
        (data) => {
          console.log('Userss=====>');
          this.technicalUserList = data;
          console.log(this.technicalUserList);
        },
        (err) => {
          console.log(err);
        },
      );
    } else {
      this.assetDetailService.getUserDetail(this.companyId, this.email).subscribe(
        (data) => {
          const user = data as User;
          this.technicalUserList = [user];
          console.log(this.technicalUserList);
        },
        (err) => {
          console.log(err);
        },
      );
    }

    this.assetDetailService.getQR(this.companyId).subscribe(
      (data) => {
        this.qr = data;
      },
      (err) => {
        console.log(err);
      },
    );

    this.qrData = 'assets/id?' + this.assetDetails.id;

    this.assetDetailService.getAllLocationWithBin(this.companyId).subscribe(
      (data) => {
        this.locationWithBins = data;
        this.filteredLocationOrBinList = this.locationWithBins;

        this.locationWithBins.forEach((loc: any) => {
          if (loc.bins && loc.bins.length > 0) {
            loc.bins.forEach((bin: any) => {
              this.dropdownOptions.push({
                label: `${loc.name} → ${bin.binNumber}`,
                value: `bin:${bin.id}`,
              });
            });
          } else {
            this.dropdownOptions.push({
              label: loc.name,
              value: `location:${loc.id}`,
            });
          }
        });
        console.log(this.dropdownOptions);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    // console.log("clicked outside")
    const clickedInside = this.dropdownContainer.nativeElement.contains(
      event.target,
    );
    if (!clickedInside) {
      // this.dropdownOpenLocation = false; // ✅ Close the dropdown
      this.dropdownOpenLocation = false;
    }
  }
  show() {
    console.log(this.extraFieldString);
  }
  onBack() {
    this.assetComponent.ngOnInit();
    this.backStatus.emit({ show: false });
  }
  onDelete() {
    console.log('removed id is' + this.assetDetails.id);
    this.assetDetailService.removeAsset(this.assetDetails.id).subscribe(
      (data) => {
        console.log(data + this.assetDetails.id + ' removed');
      },
      (err) => {
        console.log(err);
        if (err.error.error === 'TRIAL_EXPIRED') {
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
      () => {
        this.assetComponent.ngOnInit();
        this.backStatus.emit({ show: false });
      },
    );
  }
  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  onCheck() {
    console.log('OnCheck clicked');
    console.log(typeof this.assetDetails);
    console.log(this.assetDetails);
    // this.mandatoryFieldsMap.forEach((val,key)=>{
    //   if(this.assetDetails.get(key))
    // })
    if (this.mandatoryFieldsMap.get('customer') == true) {
      if (
        this.assetDetails.customer == '' ||
        this.assetDetails.customer == null
      ) {
        this.triggerAlert("Fill Mandatory field 'Customer'", 'danger');
        return;
      }
    }
    if (this.mandatoryFieldsMap.get('category') == true) {
      if (
        this.assetDetails.category == '' ||
        this.assetDetails.category == null
      ) {
        this.triggerAlert("Fill Mandatory field 'Category'", 'danger');
        return;
      }
    }
    if (this.mandatoryFieldsMap.get('serial') == true) {
      if (
        this.assetDetails.serialNumber == '' ||
        this.assetDetails.serialNumber == null
      ) {
        this.triggerAlert("Fill Mandatory field 'Serial Number'", 'danger');
        return;
      }
    }
    if (this.mandatoryFieldsMap.get('name') == true) {
      if (this.assetDetails.name == '' || this.assetDetails.name == null) {
        this.triggerAlert("Fill Mandatory field 'Name'", 'danger');
        return;
      }
    }
    if (this.mandatoryFieldsMap.get('location') == true) {
      if (
        this.assetDetails.location == '' ||
        this.assetDetails.location == null
      ) {
        this.triggerAlert("Fill Mandatory field 'Location'", 'danger');
        return;
      }
    }
    if (this.mandatoryFieldsMap.get('status') == true) {
      if (this.assetDetails.status == '' || this.assetDetails.status == null) {
        this.triggerAlert("Fill Mandatory field 'Status'", 'danger');
        return;
      }
    }
    let mandatoryFlag = 1;
    console.log('extraField', this.extraFields);

    this.extraFields?.forEach((x) => {
      if (
        (x.value == '' || x.value == null) &&
        this.showFieldsMap.get(x.name) == true &&
        this.mandatoryFieldsMap.get(x.name) == true
      ) {
        this.triggerAlert(
          "Fill Mandatory field '" + this.toCamelCase(x.name) + "' in Custom",
          'danger',
        );
        mandatoryFlag = 0;
      }
    });
    if (mandatoryFlag == 0) {
      return;
    }
    this.extraFieldName?.forEach((x, ind) => {
      console.log(
        ind +
          ' ' +
          x.name +
          ' ' +
          this.mandatoryFieldsMap.get(x.name) +
          ' ' +
          this.extraFieldValue,
      );
      if (
        this.extraFieldMap.get(x.name) != true &&
        this.showFieldsMap.get(x.name) == true &&
        (this.extraFieldValue[this.extraFieldName.indexOf(x)] == '' ||
          this.extraFieldValue[this.extraFieldName.indexOf(x)] == null) &&
        this.mandatoryFieldsMap.get(x.name) == true
      ) {
        this.triggerAlert(
          "Fill Mandatory field '" + this.toCamelCase(x.name) + "' in Custom",
          'danger',
        );
        mandatoryFlag = 0;
      }
    });

    if (mandatoryFlag == 0) {
      return;
    }
    this.onSave();
    // if(this.userRoleDetails?.customer=='full'||this.userRoleDetails?.customer=="edit"||this.userRole=="ADMIN"){
    //   this.onSave();

    //   }
  }
  onSave() {
    console.log('onSave clicked');

    this.extraFieldName.forEach((x, ind) => {
      let obj = {};
      if (this.extraFieldString.includes(x.name)) {
        const index = this.extraFields.findIndex((ele) => ele.name === x.name);
        obj = {
          id: this.extraFields[index].id,
          email: this.email,
          name: x.name,
          value: this.extraFields[index].value,
          assetId: this.assetId,
          type: x.type,
          companyId: x.companyId,
        };
      } else {
        obj = {
          email: this.email,
          name: x.name,
          value: this.extraFieldValue[ind],
          assetId: this.assetId,
          type: x.type,
          companyId: x.companyId,
        };
      }

      if (x.type == 'checkbox') {
        console.log(this.extraFieldValue[ind]);
      }
      this.assetDetailService.addExtraFields(obj).subscribe(
        (data) => {
          console.log('added extra fields');
        },
        (err) => {
          console.log(err);
           if(err.status===409){
          this.triggerAlert(err.error.validationDetails.message,"warning");
          }
          else if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
        },
      );
    });

    console.log(this.assetDetails);
    this.selectedCompanyCustomer = this.assetDetails.customer;
    console.log(this.selectedCompanyCustomer);
    if (this.changedCustomerName != null && this.changedCustomerId != null) {
      this.assetDetails.customer = this.changedCustomerName;
      this.assetDetails.customerId = this.changedCustomerId;
    }

    console.log(this.assetDetails);
    this.assetDetails.location = this.selectedLocationId;
    this.assetDetailService.updateAsset(this.assetDetails).subscribe(
      (data) => {
        console.log(data);
        this.triggerAlert('Successfully Updated', 'success');
        this.router.navigate(['/assets/' + this.assetDetails.id]);
      },
      (err) => {
        console.log(err);
        // if (err.error.error === 'TRIAL_EXPIRED'||err.error.error==="SUBSCRIPTION_REQUIRED") {
         if(err.status===409){
          this.triggerAlert(err.error.validationDetails.message,"warning");
        }
         else if(err.error.error==="TRIAL_EXPIRED"){
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
    );
  }

  removeTheImage() {
    console.log('new click remove' + this.assetDetails.id);

    this.assetDetailService.removeImage(this.assetDetails.id).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        if (err.error.error === 'TRIAL_EXPIRED') {
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
      () => {
        console.log(this.img);
        this.getAsset(this.assetDetails.id);
        this.assetComponent.ngOnInit();
      },
    );
  }
  // fileUpload(event:any){
  //   this.currentFile= event.target.files[0];

  //   this.assetDetailService.addAssetFile(this.currentFile, this.assetId).subscribe(
  //     event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         // Progress event
  //         if (event.total) {
  //           this.progress = Math.round((100 * event.loaded) / event.total);
  //           console.log(`Progress: ${this.progress}%`);
  //         }
  //       } else if (event.type === HttpEventType.Response) {
  //         // Response event
  //         console.log('Upload Complete:', event.body);
  //         this.progress = 100;
  //         setTimeout(() => {
  //           alert('Successfully uploaded');
  //           this.currentFile = null;
  //           this.ngOnInit();
  //         }, 1500);
  //       }
  //     },
  //     err => {
  //       this.currentFile= null;
  //       this.progress = 0;
  //       this.message = 'Could not upload the file!';
  //       console.log(err);
  //       console.log(this.message);
  //        if(err.error.error==="TRIAL_EXPIRED"){
  //       this.triggerAlert(err.error.message,"danger");
  //     }
  //     else{
  //     this.triggerAlert(err.error.errorMessage,"danger");
  //     }
  //     }
  //   );

  //     // this.assetDetailService.addAssetFile(this.currentFile,this.assetId).subscribe(event => {
  //     //   console.log(event.status)
  //     //   if (event.status === 'progress') {
  //     //     this.progress = event.message;
  //     //     console.log(`Progress: ${this.progress}%`);
  //     //   } else if (event.status === 'done') {
  //     //     console.log('Upload Complete:', event.message);
  //     //     this.progress = 100;
  //     //     setTimeout(() => {
  //     //       alert('Successfully uploaded');
  //     //       this.currentFile = null;
  //     //       this.ngOnInit();
  //     //     }, 1500);
  //     //   }
  //     // },
  //     // err => {
  //     //   this.progress = 0;
  //     //   this.message = 'Could not upload the file!';
  //     //   console.log(this.message);

  //     // },()=>{
  //     //   if(this.progress==100){
  //     //     setTimeout(()=>{
  //     //       alert("successfully uploaded");
  //     //       this.currentFile=null;
  //     //     this.ngOnInit();
  //     //     },1500);

  //     //   }
  //     // })

  // }

  fileUpload(event: any) {
    this.currentFile = event.target.files[0];
    console.log('Current file upload', this.currentFile.size);
    if (this.currentFile.size > 5 * 1024 * 1024) {
      this.triggerAlert('File size exceeds maximum limit (5MB)', 'danger');
      this.currentFile = null;
      this.progress = 0;
      return;
    }
    this.assetDetailService
      .addAssetFile(this.currentFile, this.assetId, this.username)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            console.log('✅ Upload Complete:', event.body);
            this.progress = 100;

            setTimeout(() => {
              const message =
                event.body?.responseMessage || 'Successfully uploaded';
              this.triggerAlert(message, 'success');
              this.currentFile = null;
              this.progress = 0;
              this.ngOnInit();
            }, 1500);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('❌ Upload Error Details:', {
            status: err.status,
            statusText: err.statusText,
            error: err.error,
            message: err.message,
            url: err.url,
          });

          this.currentFile = null;
          this.progress = 0;

          let errorMessage =
            'Could not upload the file. Some issue occurred. Try again later.';

          // ✅ Handle different error scenarios
          if (err.status === 413) {
            errorMessage = 'File size exceeds maximum limit (5MB)';
          } else if (err.error && typeof err.error === 'object') {
            errorMessage =
              err.error.responseMessage ||
              err.error.errorMessage ||
              err.error.message ||
              errorMessage;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.status === 0) {
            errorMessage =
              'Connection lost. Please check your network or try again.';
          } else if (err.status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else if (err.status === 403) {
            errorMessage = 'Access denied. No active subscription.';
          } else if (err.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }

          this.triggerAlert(errorMessage, 'danger');
        },
      });
  }

  download(id: string, name: string) {
    this.assetDetailService.download(id).subscribe(
      (data: any) => {
        console.log(name);
        const blob: any = new Blob([data], {
          type: 'text/json; charset=utf-8',
        });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        // link.download=name;
        // link.click();
        // window.URL.revokeObjectURL(link.href);
        // link.remove();
        saveAs(blob, name);
      },
      (err) => {
        console.log(err);
        if (err.error.error === 'TRIAL_EXPIRED') {
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
    );
  }
  deleteFile() {
    this.assetDetailService.deleteFile(this.deleteFileId).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        if (err.error.error === 'TRIAL_EXPIRED') {
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
      () => {
        this.ngOnInit();
        this.triggerAlert('File Deleted Successfully', 'success');
        this.deleteFileId = '';
      },
    );
  }
  imageUpload(event: any) {
    console.log(this.assetId);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);

      const obj = {
        id: this.assetDetails.id,
        image: reader.result,
      };

      this.assetDetailService.uploadImage(obj).subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
        },
        () => {
          (this, this.getAsset(this.assetDetails.id));
          this.assetComponent.ngOnInit();
        },
      );
    };
  }
  getAsset(id: any) {
    this.assetDetailService.getAsset(id).subscribe(
      (data) => {
        this.assetDetails = data;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.ngOnInit();
      },
    );
  }
  onClick(option: number) {
    console.log(option);
    this.currOption = option;
  }
  onTechnicianChange(data: any) {
    console.log(data.target.value);
    this.selectedEmpName = data.target.value;
  }
  handleSubmit(employee: any, notes: string, location: string) {
    this.assetDetailService.getIpFromIpInfo().subscribe(
      (data: any) => {
        console.log('IP Info', data);
        let userLoc = data as IpInfo;
        // console.log('GeoLocation', mylocation);
        console.log('emp=> ' + this.selectedEmpName);
        console.log('emp=> ' + employee);
        let lat = userLoc.loc.split(',')[0];
        let lon = userLoc.loc.split(',')[1];

        if (this.selectedEmpName == null || this.selectedEmpName == '') {
          this.CheckInOutSubmit(
            employee,
            notes,
            location,
            lat,
            lon,
            userLoc.ip,
            userLoc.city +
              ', ' +
              userLoc.region +
              ', ' +
              userLoc.country +
              ' - ' +
              userLoc.postal,
          );
        } else {
          this.CheckInOutSubmit(
            this.selectedEmpName,
            notes,
            location,
            lat,
            lon,
            userLoc.ip,
            userLoc.city +
              ', ' +
              userLoc.region +
              ', ' +
              userLoc.country +
              ' - ' +
              userLoc.postal,
          );
        }

        if (employee) employee = '';
        this.selectedEmpName = this.username;
        if (notes) notes = '';
        if (location) location = '';
        this.notesRef.nativeElement.value = '';
        this.locationRef.nativeElement.value = '';
      },
      (err) => {
        console.log('Error fetching IP info', err);
      },
    );
    //  this.getGeolocation().then(mylocation => {

    //   });
  }

  CheckInOutSubmit(
    employee: any,
    notes: string,
    location: string,
    latitude: string,
    longitude: string,
    ip: string,
    userAddress: string,
  ) {
    console.log(employee + ' ' + notes);
    if (employee == null && this.userRole.toLowerCase() != 'admin') {
      employee = this.username;
    }
    let obj = {};
    var today = new Date();
    if (employee == null || employee == '' || notes == null || notes == '') {
      // alert("Fields are Empty");
      this.triggerAlert('Check In/Out Fields are Empty', 'warning');
    } else {
      if (this.userRole.toLowerCase() != 'admin') {
        if (localStorage.getItem('name') != null) {
          employee = localStorage.getItem('name');
        }
      }
      if (this.checkInOut.length == 0) {
        obj = {
          assetId: this.assetId,
          status: 'Checked Out',
          date: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
          employee: employee,
          notes: notes,
          location: location,
          companyId: this.companyId,
          userLatitude: latitude,
          userLongitude: longitude,
          ipAddress: ip,
          userLocation: userAddress,
        };
      } else if (this.checkInOut[0].status == 'Checked In') {
        obj = {
          assetId: this.assetId,
          status: 'Checked Out',
          date: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
          employee: employee,
          notes: notes,
          location: location,
          companyId: this.companyId,
          userLatitude: latitude,
          userLongitude: longitude,
          ipAddress: ip,
          userLocation: userAddress,
        };
      } else {
        obj = {
          assetId: this.assetId,
          status: 'Checked In',
          date: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
          employee: employee,
          notes: notes,
          location: location,
          companyId: this.companyId,
          userLatitude: latitude,
          userLongitude: longitude,
          ipAddress: ip,
          userLocation: userAddress,
        };
      }
      console.log(obj);
      this.assetDetailService.addCheckInOut(obj).subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
        },
        () => {
          this.ngOnInit();
        },
      );
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
  removeExtraField(id: string) {
    this.assetDetailService.removeExtraField(id).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
        if (err.error.error === 'TRIAL_EXPIRED') {
          this.triggerAlert(err.error.message, 'danger');
        } else {
          this.triggerAlert(err.error.errorMessage, 'danger');
        }
      },
      () => {
        this.ngOnInit();
      },
    );
  }
  addFieldOption(id: string) {
    this.extraFieldOption = id;
  }
  removeFieldOption() {
    this.extraFieldOption = 'none';
  }
  itemDeleteDetails(id: string) {
    this.deleteFileId = id;
  }

 generatePdf(elementId: string, fileName: string) {
  const element: any = document.getElementById(elementId);

  const actualWidth = Math.max(element.scrollWidth, element.getBoundingClientRect().width);
  const actualHeight = Math.max(element.scrollHeight, element.getBoundingClientRect().height);

  html2canvas(element, {
    scale: 3,
    backgroundColor: '#ffffff',
    logging: true,
    width: actualWidth,
    height: actualHeight,
    windowWidth: actualWidth,
    windowHeight: actualHeight,
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
  }).then((canvas) => {
    const capturedWidth = canvas.width;
    const capturedHeight = canvas.height;

    const squareCanvas = document.createElement('canvas');
    const squareSize = Math.max(capturedWidth, capturedHeight);
    squareCanvas.width = squareSize;
    squareCanvas.height = squareSize;

    const ctx = squareCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, squareSize, squareSize);

    const offsetX = (squareSize - capturedWidth) / 2;
    const offsetY = (squareSize - capturedHeight) / 2;
    ctx.drawImage(canvas, offsetX, offsetY);

    const imgData = squareCanvas.toDataURL('image/png');
    const sizePx = this.qrSize * 100;

    const pdf = new jspdf.jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [sizePx, sizePx],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, sizePx, sizePx);
    pdf.save(fileName + '.pdf');
  }).catch((err) => {
    console.log(err);
    this.triggerAlert('Could not generate QR PDF', 'danger');
  }).finally(() => {
    this.qrDownloading = false;   // <-- always reset, success or fail
  });
}
  downloadQR() {
    console.log('downloadQR clicked');
    this.qrDownloading = true;
    
    setTimeout(() => {
    this.generatePdf(
      'myqr',
      this.assetDetails.name + '_' + this.assetDetails.serialNumber + '_QR',
    );
  }, 0);
  }
  customerChange(event: any) {
    console.log('changed->' + event.target.value);
    let myData: string = event.target.value;
    if (myData != null) {
      this.companyCustomerArr = myData.split(',');
      this.changedCustomerName = this.companyCustomerArr[0];
      this.changedCustomerId = this.companyCustomerArr[1];
      this.assetDetails.customer = this.changedCustomerName;
      this.assetDetails.customerId = this.changedCustomerId;
    }
  }
  preview() {
    console.log('clicked');
    this.router.navigate(['/assets/' + this.assetId]);
  }

  // inspectionChanged(){
  //   console.log(this.currentInspection)
  //   console.log(this.assetId)

  //   this.inspectionInstance.assetId = this.assetId;
  //   this.inspectionInstance.companyId = this.companyId;
  //   this.inspectionInstance.assetCategoryInspectionId = this.currentInspection.id;
  //   this.inspectionInstance.assetCategoryInspectionName = this.currentInspection.name;

  //   let steps: any[] = [];

  //   this.currentInspection.steps.forEach((step: any,ind:any) => {
  //         let obj: any = {
  //           name: step.name,
  //           inspectionStepId: ind,
  //           value: step.type=='CHECKBOX'?false:'',
  //           type:step.type
  //         };
  //         steps.push(obj);
  //       });

  //   this.inspectionInstance.stepValues = steps;
  // }

  saveInpectionValue() {
    this.applyDueDateToInstance();
    console.log(this.inspectionInstance);
    console.log(this.stepObject);
    if (!this.inspectionInstance.actionPerformedBy) {
      this.inspectionInstance.actionPerformedBy = this.username;
    }
    const currDateTime = new Date();
    if (this.inspectionInstance.createdAt == null) {
      this.inspectionInstance.createdBy = this.username;
      this.inspectionInstance.createdAt = currDateTime;
    }
    this.inspectionInstance.updatedAt = currDateTime;
    this.inspectionInstance.status = 'COMPLETED';
    this.inspectionInstance.selectedItemList = this.selectedItems;
    console.log(this.inspectionInstance);
    this.assetDetailService
      .addAssetInspection(this.inspectionInstance)
      .subscribe(
        (data) => {
          console.log('Inspection Saved' + data);
          this.triggerAlert('Inspection saved sucessfully', 'success');
          this.selectedItems = [];
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
          this.selectedItems = [];
        },
        () => {
          this.selectedItems = [];
          this.clearSavedData();
          this.loadInspectionInstances();
        },
      );
    this.selectedItems = [];
  }
  handleStepChange(event: any, index: number, type: string): void {
    if (!this.inspectionInstance.stepValues[index]) return;
    console.log(type);
    if (type === 'checkbox') {
      // For checkbox, use `event.target.checked`
      console.log(event.target.checked);
      this.inspectionInstance.stepValues[index].value = event.target.checked
        ? 'checked'
        : '';
    } else {
      // For text, number, etc., use `event.target.value`
      this.inspectionInstance.stepValues[index].value = event.target.value;
    }
  }
  handleStepCheckox(isChecked: any, index: number, type: string) {
    this.inspectionInstance.stepValues[index].value = isChecked;
  }
  addNote(event: any) {
    this.inspectionInstance.notes = event.target.value;
  }
  selectedInspectionInstanceFunc(data: InspectionInstance) {
    console.log(data);

    data.stepValues?.forEach(
      (step: { type: string; value: string | boolean }) => {
        if (typeof step.value === 'string') {
          step.value = step.value === 'true';
        }
      },
    );

    this.selectedInspectionInstance = data;

    this.inspectionInstance = data;
    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    this.inspectionInstance.actionPerformedBy = this.username;
  }
  ParseInt(val: string): number {
    return parseInt(val);
  }
  updateInspectionInstance() {
    console.log(this.selectedInspectionInstance);
    this.selectedInspectionInstance.notes = this.notedData;
    this.inspectionInstance.selectedItemList = this.selectedItems;
    this.assetDetailService
      .updateAssetInspection(this.selectedInspectionInstance)
      .subscribe(
        (data) => {
          console.log('Updated Inspection' + data);
          this.triggerAlert('Inspection updated sucessfully', 'success');
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
        },
        () => {
          this.inspectionInstance.stepValues = [];
          this.inspectionInstance.notes = '';
          this.loadInspectionInstances();
        },
      );
  }

  toggleDropdownLocation() {
    console.log(this.filteredLocationOrBinList);
    this.dropdownOpenLocation = !this.dropdownOpenLocation;
  }

  selectLocationOrBin(locationOrBinId: any, locationOrBin: any) {
    console.log(locationOrBin);
    this.selectedLocation = locationOrBin;
    this.selectedLocationId = locationOrBinId;
    console.log(this.selectedLocationId);
    // this.selectedCustomerId=customer.companyCustomerId;
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
    console.log('searchValue' + searchValue);
    this.filteredLocationOrBinList = this.locationWithBins.filter(
      (loc: any) => {
        const locationMatch = loc.name?.toLowerCase().includes(searchValue);

        const binMatch = loc.bins?.some((bin: any) =>
          bin.binNumber?.toLowerCase().includes(searchValue),
        );

        return locationMatch || binMatch;
      },
    );
  }

  updateStepList() {
    //  console.log(this.currentInspection)
    //   console.log(this.assetId)

    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    if (!this.inspectionInstance.actionPerformedBy) {
      this.inspectionInstance.actionPerformedBy = this.username;
    }
    // this.inspectionInstance.assetCategoryInspectionId = this.currentInspection.id;
    this.inspectionInstance.assetCategoryInspectionName = '';
    this.selectedItems.forEach((item: any) => {
      this.inspectionInstance.assetCategoryInspectionName += item.name + ' ';
    });

    let steps: any[] = [];
    let stepObj: any[] = [];
    // this.selectedItems
    console.log('updateStepListCalled');
    console.log('selectedItems', this.selectedItems);
    this.selectedItems.forEach((item: any) => {
      let inspectionMapValue = this.inspectionMap.get(item.id);
      console.log('inspectionMapValue', inspectionMapValue);
      if (inspectionMapValue !== null && inspectionMapValue !== undefined) {
        const inspectionMap = inspectionMapValue as any;
        const stepList = inspectionMap['stepsList'];

        let myCurrStep: any[] = [];
        stepList.forEach((step: any) => {
          let obj: any = {
            name: step['name'],
            // The following variables (ind, step) are not defined in this context.
            // You may need to adjust this logic as per your requirements.
            inspectionStepId: null,
            value: step['type'] == 'CHECKBOX' ? false : '',
            type: step['type'],
          };

          steps.push(obj);
          myCurrStep.push(obj);
        });
        let myObj = {
          inspectionName: item.name,
          stepValues: myCurrStep,
        };
        stepObj.push(myObj);

        // You may want to push obj to steps or handle it as needed.
      }
    });
    console.log('stepObj', stepObj);
    console.log(steps);
    this.stepObject = stepObj;
    this.inspectionInstance.stepValues = steps;
    this.inspectionInstance.inspectionTemplates = this.stepObject;
    console.log(this.inspectionInstance.stepValues);
  }
  updateStepListFromLocalStorage() {
    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    this.inspectionInstance.assetCategoryInspectionName = '';
    this.selectedItems.forEach((item: any) => {
      this.inspectionInstance.assetCategoryInspectionName += item.name + ' ';
    });

    let steps: any[] = [];
    let stepObj: any[] = [];
    // this.selectedItems
    console.log('updateStepListCalled');
    console.log('selectedItems', this.selectedItems);
    this.inspectionInstance.inspectionTemplates.forEach((item: any) => {
      const stepList = item['stepValues'];

      let myCurrStep: any[] = [];
      stepList.forEach((step: any) => {
        let obj: any = {
          name: step['name'],
          // The following variables (ind, step) are not defined in this context.
          // You may need to adjust this logic as per your requirements.
          inspectionStepId: null,
          value: step['value'],
          type: step['type'],
        };

        steps.push(obj);
        myCurrStep.push(obj);
      });
      let myObj = {
        inspectionName: item.inspectionName,
        stepValues: myCurrStep,
      };
      stepObj.push(myObj);

      // You may want to push obj to steps or handle it as needed.
    });
    console.log('stepObj', stepObj);
    console.log(steps);
    this.stepObject = stepObj;
    this.inspectionInstance.stepValues = steps;
    this.inspectionInstance.inspectionTemplates = this.stepObject;
    console.log(this.inspectionInstance.notes);
    //  console.log(this.inspectionInstance.stepValues)
  }

  onItemSelect(item: any) {
    console.log(this.selectedItems);
    console.log(item);
    this.updateStepList();
  }
  onSelectAll(items: any) {
    console.log(this.selectedItems);
    console.log(items);
    this.selectedItems = items;
    this.updateStepList();
  }
  onItemDeSelect(items: any) {
    console.log(this.selectedItems);
    console.log(items);
    this.updateStepList();
  }
  clearSteps() {
    this.inspectionInstance.stepValues = [];
  }
  tempSave() {
    this.applyDueDateToInstance();
    if (!this.inspectionInstance.actionPerformedBy) {
      this.inspectionInstance.actionPerformedBy = this.username;
    }
    const currDateTime = new Date();

    if (this.inspectionInstance.createdAt == null) {
      this.inspectionInstance.createdBy=this.username;
      this.inspectionInstance.createdAt = currDateTime;
    }
    this.inspectionInstance.updatedAt = currDateTime;
    this.inspectionInstance.status = 'PENDING';
    this.inspectionInstance.selectedItemList = this.selectedItems;
    this.assetDetailService
      .addAssetInspection(this.inspectionInstance)
      .subscribe(
        (data) => {
          console.log('Inspection Saved' + data);
          this.triggerAlert('Inspection saved sucessfully', 'success');
          this.selectedItems = [];
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
          this.selectedItems = [];
        },
        () => {
          this.selectedItems = [];
          this.clearSavedData();
          this.loadInspectionInstances();
        },
      );
    console.log(this.inspectionInstance);
    this.selectedItems = [];
    console.log(this.selectedItems);
    // localStorage.setItem(this.assetId+'tempInspection', JSON.stringify(this.inspectionInstance));
    // localStorage.setItem(this.assetId+'selectedItems', JSON.stringify(this.selectedItems));
    this.triggerAlert('Inspection Instance Saved', 'success');
  }
  clearSavedData() {
    localStorage.removeItem(this.assetId + 'tempInspection');
    localStorage.removeItem(this.assetId + 'selectedItems');
    this.inspectionInstance = new InspectionInstance();

    this.selectedItems = [];
    this.notedData = '';
    this.dueDateInput = '';
  }
  cancelInspection(){
    this.inspectionInstance.actionPerformedBy = this.username;
    const currDateTime = new Date();

    if (this.inspectionInstance.createdAt == null) {
      this.inspectionInstance.createdBy=this.username;
      this.inspectionInstance.createdAt = currDateTime;
    }
    this.inspectionInstance.updatedAt = currDateTime;
    this.inspectionInstance.status = 'CANCELLED';
    this.inspectionInstance.selectedItemList = this.selectedItems;
    this.assetDetailService
      .addAssetInspection(this.inspectionInstance)
      .subscribe(
        (data) => {
          console.log('Inspection Saved' + data);
          this.triggerAlert('Inspection saved sucessfully', 'success');
          this.selectedItems = [];
        },
        (err) => {
          console.log(err);
          if (err.error.error === 'TRIAL_EXPIRED') {
            this.triggerAlert(err.error.message, 'danger');
          } else {
            this.triggerAlert(err.error.errorMessage, 'danger');
          }
          this.selectedItems = [];
        },
        () => {
          this.selectedItems = [];
          this.clearSavedData();
          this.loadInspectionInstances();
        },
      );
    console.log(this.inspectionInstance);
    this.selectedItems = [];
    console.log(this.selectedItems);
    // localStorage.setItem(this.assetId+'tempInspection', JSON.stringify(this.inspectionInstance));
    // localStorage.setItem(this.assetId+'selectedItems', JSON.stringify(this.selectedItems));
    this.triggerAlert('Inspection Instance Cancelled', 'success');
  }
  updateNotedData(data: any) {
    this.notedData = data;
  }

  mySelectedInspectionInstanceFunc(instance: any) {
    console.log('mySelectedInspectionInstanceFunc called');
    console.log(instance);
    this.selectedItems = instance.selectedItemList;
    this.selectedInspectionInstance = instance;
    this.inspectionInstance = instance;
    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    this.inspectionInstance.actionPerformedBy = this.username;
    this.notedData = instance.notes;
    this.syncDueDateInputFromInstance(instance);
    this.updateStepListFromLocalStorage();
  }
  clearData() {
    this.selectedItems = [];
    this.inspectionInstance = new InspectionInstance();
    this.dueDateInput = '';
  }

  applyDueDateToInstance(): void {
    this.inspectionInstance.dueDate = this.dueDateInput
      ? new Date(`${this.dueDateInput}T00:00:00`)
      : null;
  }

  syncDueDateInputFromInstance(instance?: any): void {
    const dueDate = instance?.dueDate ?? instance?.inspectionDueDate ?? this.inspectionInstance?.dueDate;
    if (!dueDate) {
      this.dueDateInput = '';
      return;
    }
    const parsed = new Date(dueDate);
    this.dueDateInput = Number.isNaN(parsed.getTime())
      ? ''
      : parsed.toISOString().split('T')[0];
  }
  exportExcel() {}
  downloadCheckInOut() {
    this.assetDetailService
      .downloadCheckInOut(this.companyId, this.assetId)
      .subscribe(
        (data: Blob) => {
          console.log(data);
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'CheckInOut_Report_' + this.assetId + '_' + 'xlsx';
          a.click();

          window.URL.revokeObjectURL(url);
        },
        (err: any) => {
          console.log(err);
        },
      );
  }

  getGeolocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          this.handleLocationError(error);
          reject(error);
        },
      );
    });
  }

  // submitWithLocation(latitude: number, longitude: number) {
  //   const employee = this.selectedEmpName || '';
  //   const notes = this.notesRef?.nativeElement.value || '';
  //   const location = `${latitude}, ${longitude}`; // or format as you need

  //   console.log("Submitting with location:", location);

  //   this.CheckInOutSubmit(employee, notes, location);

  //   // Clear form
  //   this.selectedEmpName = this.username;
  //   if (this.notesRef) this.notesRef.nativeElement.value = '';
  //   if (this.locationRef) this.locationRef.nativeElement.value = '';
  // }

  handleLocationError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied geolocation permission');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Geolocation position unavailable');
        break;
      case error.TIMEOUT:
        console.error('Geolocation request timed out');
        break;
    }
  }
   exportInspectionData(){
    if(this.inspectionExportType=='inspection-overview'){
      console.log("Export inspection-overview")
      this.assetDetailService.getInspectionOverviewExport(this.companyId,this.assetId).subscribe((data:Blob)=>{
      
         const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'AssetInspectionOverview_'+this.assetId+'.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
        // this.triggerAlert("Inspections exported sucessfully", "success");
      },(err)=>{
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        } else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      },
    ()=>{
      this.triggerAlert("Exported Assets Inspections Overview Successfully","success");
      this.exportCloseBox?.nativeElement.click();
    })
  }else{
      console.log("Export inspection-details")
      this.assetDetailService.getInspectionDetailedExport(this.companyId,this.assetId).subscribe((data:Blob)=>{
        console.log('export Inspection data',data)
         const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'AssetInspectionDetailed_'+this.assetId+'.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
        // this.triggerAlert("Inspections exported sucessfully", "success");
      },(err)=>{
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        } else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      },
    ()=>{
      this.triggerAlert("Exported Assets Inspections Details Successfully","success");
      this.exportCloseBox?.nativeElement.click();
    })
  }
  

}
downloadAllInspection(){
  this.assetDetailService.getInspectionExport(this.companyId,this.assetId).subscribe((data:Blob)=>{
        console.log('export Inspection data',data)
         const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'AssetInspectionDetailed_'+this.assetId+'.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
        // this.triggerAlert("Inspections exported sucessfully", "success");
      },(err)=>{
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        } else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      },
    ()=>{
      this.triggerAlert("Exported Assets Inspections Details Successfully","success");
      this.exportCloseBox?.nativeElement.click();
    })
  
}



downloadInspectionPDF(instance: any) {
    const instances = [instance]; // normalize single instance into array
  
    const doc = new jspdf.jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 0;
  
    const navy: [number, number, number] = [25, 40, 82];
    const blue: [number, number, number] = [59, 91, 179];
    const lightGray: [number, number, number] = [245, 246, 248];
    const altRowGray: [number, number, number] = [250, 250, 250];
    const green: [number, number, number] = [34, 139, 60];
    const red: [number, number, number] = [180, 60, 60];
  
    // Column layout (shared across all templates/instances)
    const stepColX = margin + 25;
    const valueColX = margin + contentWidth * 0.63;
    const nameColWidth = valueColX - stepColX - 5;
    const valueColWidth = margin + contentWidth - valueColX - 2;
  
    const checkPageBreak = (needed: number) => {
      if (yPosition + needed > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }
    };
  
    // ---------- HEADER ----------
    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 32, 'F');
  
    doc.setTextColor(150, 180, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text((localStorage.getItem('companyName') || 'COMPANY NAME').toUpperCase(), margin, 12);
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Asset Inspection Report', margin, 24);
  
    // QR placeholder box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 22, 6, 22, 22, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('QR Code', pageWidth - margin - 11, 24, { align: 'center' });
  
    yPosition = 42;
  
    // ---------- ASSET INFO CARD ----------
    doc.setDrawColor(225, 225, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPosition - 8, contentWidth, 20, 2, 2, 'S');
  
    const col1 = margin + 5;
    const col2 = margin + contentWidth / 3 + 5;
    const col3 = margin + (2 * contentWidth) / 3 + 5;
  
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Asset Name', col1, yPosition - 2);
    doc.text('Asset ID', col2, yPosition - 2);
    doc.text('Inspection Date', col3, yPosition - 2);
  
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(this.assetDetails?.name || 'N/A', col1, yPosition + 5);
    doc.text(this.assetDetails?.id?.toString() || this.assetId?.toString() || 'N/A', col2, yPosition + 5);
  
    const latestDate = instances?.[0]?.createdAt
      ? new Date(instances[0].createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })
      : 'N/A';
    doc.text(latestDate, col3, yPosition + 5);
  
    yPosition += 22;
  
    // ---------- LOOP THROUGH EACH INSPECTION INSTANCE ----------
    instances.forEach((inst: any, instanceIndex: number) => {
      checkPageBreak(20);
  
      const sectionStartY = yPosition; // top of card, for border later
  
      // Instance header bar
      doc.setFillColor(...navy);
      doc.rect(margin, yPosition, contentWidth, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Inspection Details', margin + 4, yPosition + 6);
  
      const idLabel = `ID: ${inst.assetCategoryInspectionInstanceId || 'N/A'}`;
      const idWidth = doc.getTextWidth(idLabel) + 6;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + contentWidth - idWidth - 4, yPosition + 1.5, idWidth, 6, 3, 3, 'F');
      doc.setTextColor(...navy);
      doc.setFontSize(8);
      doc.text(idLabel, margin + contentWidth - idWidth - 1, yPosition + 5.5);
  
      yPosition += 9;
  
      // ---------- RENDER EACH TEMPLATE SEPARATELY (prevents step mixing) ----------
      const renderStepsTable = (steps: any[]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
  
        if (steps.length > 0) {
          steps.forEach((step: any, index: number) => {
            const nameLines = doc.splitTextToSize(step.name || 'N/A', nameColWidth);
  
            let valueLines: string[];
            let isCheckbox = false;
            let isYes = false;
  
            if (step.type === 'CHECKBOX') {
              isCheckbox = true;
              isYes = step.value === true || step.value === 'true';
              valueLines = [isYes ? 'Yes' : 'No'];
            } else {
              const valueText = (step.value !== undefined && step.value !== null && step.value !== '')
                ? `${step.value}`
                : 'N/A';
              valueLines = doc.splitTextToSize(valueText.toString(), valueColWidth);
            }
  
            const lineCount = Math.max(nameLines.length, valueLines.length);
            const rowHeight = Math.max(8, lineCount * 5 + 3);
  
            checkPageBreak(rowHeight);
  
            if (index % 2 === 1) {
              doc.setFillColor(...altRowGray);
              doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');
            }
  
            doc.setTextColor(0, 0, 0);
            doc.text((index + 1).toString(), margin + 5, yPosition + 5.5);
            doc.text(nameLines, stepColX, yPosition + 5.5);
  
            if (isCheckbox) {
              doc.setTextColor(...(isYes ? green : red));
              doc.setFont('helvetica', 'bold');
              doc.text(valueLines, valueColX, yPosition + 5.5);
              doc.setFont('helvetica', 'normal');
            } else {
              doc.setTextColor(80, 80, 80);
              doc.text(valueLines, valueColX, yPosition + 5.5);
            }
  
            yPosition += rowHeight;
          });
        } else {
          doc.setTextColor(120, 120, 120);
          doc.text('No steps recorded', stepColX, yPosition + 5.5);
          yPosition += 8;
        }
      };
  
      if (inst.inspectionTemplates?.length) {
        inst.inspectionTemplates.forEach((template: any, templateIndex: number) => {
          console.log('individual template:', template);
          checkPageBreak(15);
  
          // Template sub-header
          doc.setFillColor(...blue);
          doc.rect(margin, yPosition, contentWidth, 7, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(
            template.inspectionName || `Section ${templateIndex + 1}`,
            // instance.assetCategoryInspectionName,
            margin + 4,
            yPosition + 5
          );
          yPosition += 7;
  
          // Column header row
          doc.setFillColor(...lightGray);
          doc.rect(margin, yPosition, contentWidth, 7, 'F');
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('#', margin + 5, yPosition + 5);
          doc.text('Inspection Item', stepColX, yPosition + 5);
          doc.text('Response', valueColX, yPosition + 5);
          yPosition += 7;
  
          renderStepsTable(template.stepValues || []);
  
          yPosition += 4; // gap between templates within same instance
        });
      } else if (inst.stepValues?.length) {
        // Fallback: flat step list, no template grouping
        doc.setFillColor(...lightGray);
        doc.rect(margin, yPosition, contentWidth, 7, 'F');
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('#Step', margin + 5, yPosition + 5);
        doc.text('Name', stepColX, yPosition + 5);
        doc.text('Value', valueColX, yPosition + 5);
        yPosition += 7;
  
        renderStepsTable(inst.stepValues);
      } else {
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(9);
        doc.text('No inspection steps recorded', stepColX, yPosition + 5.5);
        yPosition += 8;
      }

      // ---------- NOTES BOX ----------
      if (inst.notes) {
        yPosition += 4; // clear gap between last table row and notes box

        const noteText = doc.splitTextToSize(inst.notes, contentWidth - 12);
        const boxHeight = noteText.length * 5 + 12; // computed BEFORE checking page break

        checkPageBreak(boxHeight + 4); // use real height, not a flat guess

        doc.setDrawColor(225, 225, 225);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 2, 2, 'S');

        doc.setTextColor(120, 120, 120);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes', margin + 4, yPosition + 6);

        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(noteText, margin + 4, yPosition + 12);

        yPosition += boxHeight + 6;
      }
  
      yPosition += 8; // gap before next inspection card
    });
  
    // ---------- FOOTER on every page ----------
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
  
      doc.text('Powered by AssetYug', margin, pageHeight - 6, { align: 'left' });
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }
  
    const fileName = `Inspection_${this.assetDetails?.name || 'Asset'}_${instance.assetCategoryInspectionInstanceId || ''}.pdf`;
    doc.save(fileName);
  }
// Pagination methods for inspection instances




// Helper method to extract inspection data
private extractInspectionData(instance: any): any[] {
  const inspections: any[] = [];

  if (instance.inspectionTemplates && instance.inspectionTemplates.length > 0) {
    instance.inspectionTemplates.forEach((template: any) => {
      const steps = template.stepValues?.map((step: any) => ({
        name: step.name || 'N/A',
        value: this.formatStepValue(step)
      })) || [];

      if (steps.length > 0) {
        inspections.push({
          templateName: template.inspectionName || 'Inspection',
          steps: steps
        });
      }
    });
  }

  return inspections;
}

// Helper method to format step values
private formatStepValue(step: any): string {
  if (step.type === 'CHECKBOX') {
    return step.value === true ? 'Yes' : 'No';
  }
  return step.value || 'N/A';
}

// Helper method to build inspection HTML
private buildInspectionHTML(data: any): string {
  const STEPS_PER_PAGE = 12;
  
  // Flatten all content into a list of blocks to paginate
  const blocks: any[] = [];
  data.inspections.forEach((inspection: any) => {
    for (let i = 0; i < inspection.steps.length; i += STEPS_PER_PAGE) {
      blocks.push({
        templateName: inspection.templateName,
        steps: inspection.steps.slice(i, i + STEPS_PER_PAGE)
      });
    }
  });

  const totalPages = blocks.length || 1;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand:       #1B4FD8;
          --brand-light: #EEF2FF;
          --surface:     #F8F9FC;
          --border:      #E2E6F0;
          --text-primary:#111827;
          --text-muted:  #6B7280;
          --pass:        #16A34A;
          --pass-bg:     #DCFCE7;
          --na:          #6B7280;
          --na-bg:       #F3F4F6;
          --fail:        #DC2626;
          --fail-bg:     #FEE2E2;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--surface);
          color: var(--text-primary);
          padding: 40px 16px;
        }

        .page {
          max-width: 740px;
          margin: 0 auto 40px auto;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }
        .page:last-child { margin-bottom: 0; }

        .header {
          background: var(--brand);
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .header-title { color: #fff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
        .header-sub   { color: rgba(255,255,255,0.72); font-size: 13px; margin-top: 2px; }
        .badge-completed {
          background: rgba(255,255,255,0.18);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .cont-banner {
          background: var(--brand);
          padding: 14px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cont-title { color: #fff; font-size: 14px; font-weight: 600; }
        .cont-sub   { color: rgba(255,255,255,0.7); font-size: 12px; }

        .meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          border-bottom: 1px solid var(--border);
        }
        .meta-item { padding: 18px 36px; border-right: 1px solid var(--border); }
        .meta-item:last-child { border-right: none; }
        .meta-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 4px; }
        .meta-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }

        .inspection-block { border-bottom: 1px solid var(--border); }
        .inspection-block:last-of-type { border-bottom: none; }

        .inspection-header {
          padding: 14px 36px;
          background: var(--brand-light);
          border-bottom: 1px solid var(--border);
        }
        .inspection-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--brand);
          text-transform: uppercase;
          letter-spacing: 0.9px;
        }

        table { width: 100%; border-collapse: collapse; }
        thead th {
          padding: 11px 36px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--text-muted);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          text-align: left;
        }
        thead th:last-child { text-align: right; }
        tbody tr { border-bottom: 1px solid var(--border); }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #FAFBFF; }
        td { padding: 14px 36px; font-size: 14px; vertical-align: middle; }
        .step-num  { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); width: 36px; }
        .step-name { font-weight: 500; }
        .step-result { text-align: right; }

        .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .chip-pass { background: var(--pass-bg); color: var(--pass); }
        .chip-na   { background: var(--na-bg);   color: var(--na);   }
        .chip-fail { background: var(--fail-bg); color: var(--fail); }
        .chip::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

        .notes-section {
          padding: 18px 36px;
          background: var(--surface);
          border-top: 1px solid var(--border);
        }
        .notes-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .notes-text {
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.6;
          word-wrap: break-word;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 36px;
          border-top: 1px solid var(--border);
          background: #fff;
        }
        .performed-by { font-size: 13px; color: var(--text-muted); }
        .performed-by strong { color: var(--text-primary); font-weight: 600; }
        .footer-right { display: flex; align-items: center; gap: 20px; }
        .page-num { font-size: 12px; color: var(--text-muted); }
        .powered-by { font-size: 11px; color: var(--text-muted); }
        .powered-by span { font-weight: 700; color: var(--brand); }

        @media print {
          body { background: #fff; padding: 0; }
          .page { box-shadow: none; border: none; border-radius: 0; margin: 0; page-break-after: always; }
          .page:last-child { page-break-after: auto; }
        }
      </style>
    </head>
    <body>
  `;

  // Generate pages
  blocks.forEach((block, pageIdx) => {
    const isFirstPage = pageIdx === 0;
    const isLastPage = pageIdx === totalPages - 1;
    const pageNum = pageIdx + 1;

    html += `<div class="page">`;

    // Header
    if (isFirstPage) {
      html += `
        <div class="header">
          <div>
            <div class="header-title">Asset Inspection Report</div>
            <div class="header-sub">Inspection ID: #${data.assetId}</div>
          </div>
          <div class="badge-completed">${data.status}</div>
        </div>
        <div class="meta">
          <div class="meta-item"><div class="meta-label">Asset Name</div><div class="meta-value">${data.assetName}</div></div>
          <div class="meta-item"><div class="meta-label">Asset ID</div><div class="meta-value">#${data.assetId}</div></div>
          <div class="meta-item"><div class="meta-label">Inspection Date</div><div class="meta-value">${data.inspectionDate}</div></div>
        </div>
      `;
    } else {
      html += `
        <div class="cont-banner">
          <div class="cont-title">Asset Inspection Report — ${data.assetName}</div>
          <div class="cont-sub">Inspection ID: #${data.assetId} &nbsp;·&nbsp; ${data.inspectionDate}</div>
        </div>
      `;
    }

    // Inspection block with table
    html += `
      <div class="inspection-block">
        <div class="inspection-header">
          <div class="inspection-title">${block.templateName}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:48px">#</th>
              <th>Step</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
    `;

    block.steps.forEach((step: any, stepIdx: number) => {
      const { cls, label } = this.getChipInfo(step.value);
      html += `
        <tr>
          <td class="step-num">${String(stepIdx + 1).padStart(2, '0')}</td>
          <td class="step-name">${this.escapeHtml(step.name)}</td>
          <td class="step-result"><span class="chip ${cls}">${label}</span></td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    // Notes — only on last page
    if (isLastPage && data.notes) {
      html += `
        <div class="notes-section">
          <div class="notes-label">Notes</div>
          <div class="notes-text">${this.escapeHtml(data.notes)}</div>
        </div>
      `;
    }

    // Footer
    html += `<div class="footer">`;
    if (isLastPage) {
      html += `<div class="performed-by">Performed by <strong>${this.escapeHtml(data.performedBy)}</strong></div>`;
    } else {
      html += `<div></div>`;
    }
    html += `
      <div class="footer-right">
        <div class="page-num">Page ${pageNum} of ${totalPages}</div>
        <div class="powered-by">Powered by <span>Asset Yug</span></div>
      </div>
    </div>
    `;

    html += `</div>`;
  });

  html += `
    </body>
    </html>
  `;

  return html;
}

// Helper to determine chip style
private getChipInfo(value: string): { cls: string; label: string } {
  if (value === 'Yes') return { cls: 'chip-pass', label: 'Pass' };
  if (value === 'No') return { cls: 'chip-fail', label: 'Fail' };
  return { cls: 'chip-na', label: 'N/A' };
}

// Helper to escape HTML characters
private escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
loadInspectionInstances() {
  this.assetDetailService
    .getAllAssetInspectionInstanceByAssetId(this.assetId, this.pageIndex, this.pageSize)
    .subscribe(
      (data) => {
        console.log('inspection instance data', data);
        if (data && data.data && Array.isArray(data.data)) {
          this.allInspectionInstance = data.data;
          this.totalLength = data.totalRecords || 0;

          if (this.allInspectionInstance.length === 0 && this.pageIndex !== 0) {
            this.pageIndex = this.pageIndex - 1;
            this.loadInspectionInstances();
            return;
          }
        } else {
          this.allInspectionInstance = Array.isArray(data) ? data : [];
          this.totalLength = this.allInspectionInstance.length;
        }

        console.log(this.allInspectionInstance);
      },
      (err) => {
        console.log(err);
      },
    );
}

handleInspectionPageEvent(e: PageEvent) {
  this.pageEvent = e;
  this.totalLength = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  localStorage.setItem('assetDetailsInspectionPageInd', this.pageIndex.toString());
  localStorage.setItem('assetDetailsInspectionPageSize', this.pageSize.toString());
  this.loadInspectionInstances();
}
}
