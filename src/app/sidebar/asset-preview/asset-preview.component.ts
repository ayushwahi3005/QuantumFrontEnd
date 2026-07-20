import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ExtraFields } from './extraFields';
import { CheckInOut } from './checkInOut';
import { ExtraFieldName } from './extraFieldName';
import { WorkOrder } from './workorder';
import { AssetFile } from './assetFile';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { AssetDetailsService } from '../asset-details/asset-details.service';
import { AssetsComponent } from '../assets/assets.component';
import * as saveAs from 'file-saver';
import { DatePipe } from '@angular/common';
import { Assets } from './assets';
import { AssetPreviewService } from './asset-preview.service';
import { CompanyCustomer } from '../assets/company-cutomer';
import { AuthService } from 'src/app/shared/auth.service';
import { AssetsService } from '../assets/assets.service';
import { QR } from './qr';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { User } from './user';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { NotificationService } from 'src/app/notification/notification.service';
import { InspectionInstance } from '../asset-details/inspectionInstance';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IpInfo } from '../asset-details/asset-details.component';

@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.css']
})
export class AssetPreviewComponent {
  @ViewChild('notes') notesRef!: ElementRef;
  @ViewChild('location') locationRef!: ElementRef;
  @ViewChild('exportCloseBox') exportCloseBox!: ElementRef;
  @ViewChild('closeBox5') closeBox5!: ElementRef;
  qr!: QR;
  qrData!: string;
  hoverOverSidebar = true;
  assetId: any = '';
  img: string = ''
  newObjName: string = '';
  newObjVal: string = '';
  currOption: number = 1;
  extraFields!: ExtraFields[];
  checkInOut: CheckInOut[] = [];
  loading = true;
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
  assetDetails!: Assets;
  companyId!: any;
  customer!: CompanyCustomer
  username: any;
  sideBarCurr = 2
  current = 2
  qrSize!: number;
  showAlert: boolean = false; // Flag to toggle alert visibility
  alertMessage: string = ''; // Alert message
  alertType: string = 'success';
  deleteFileId!: string; // Alert type: success, warning, error, etc.
  private readonly maxFileSizeBytes = 10 * 1024 * 1024;
  technicalUserList!: User[];
  userRole: any;
  userRoleDetails: any;
  selectEmployeeName: any
  selectedEmpName: any;

  unReadCount: number = 0;
  private notificationSubject = new Subject<string>();
  notificationList: Notification[] = [];

  allInspection: any = []
  allInspectionInstance: any = []

  // Pagination properties for inspection instances
  pageIndex: number = 0;
  pageSize: number = 10;
  totalLength: number = 0;
  pageEvent!: PageEvent;

  currentInspection: any;
  checkBoxColor = "primary"
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
    selectedItemList: []
  };
  inspectionMap: Map<string, Object> = new Map<string, Object>();
  inspectionExportType:string='inspection-overview';

  dropdownList: any[] = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',        // adjust to match your data property
    textField: 'name',    // adjust to match your data property
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  selectedItems: any[] = [];

  stepObject: any[] = [];
  notedData!: string;
  dueDateInput: string = '';
  qrDownloading = false;

  sideBarOption = [{
    number: 1,
    name: 'Customers',
    icon: 'bi bi-person'
  },
  {
    number: 2,
    name: 'Assets',
    icon: 'bi bi-boxes'
  },
  {
    number:4,
    name:'Inspections',
    icon:'bi bi-boxes'
  },
   {
    number:6,
    name:'Analytics',
    icon:'bi bi-bar-chart'
  }
    // {
    //   number:3,
    //   name:'Inventory',
    //   icon:'bi bi-journal-text'
    // },
    // {
    //   number:4,
    //   name:'Preventive Maintainance',
    //   icon:'bi bi-speedometer2'
    // },
    // {
    //   number:5,
    //    name:'Work Order',
    //   icon:'bi bi-bookshelf'
    // }
    // {
    //   number:6,
    //   name:'People',
    //   icon:'bi bi-people-fill'
    // }

  ];

  constructor(private activatedRoute: ActivatedRoute, private assetPreviewService: AssetPreviewService, private datePipe: DatePipe, private auth: AuthService, private router: Router, private assetService: AssetsService, private notificationService: NotificationService) {
  }
  ngOnInit() {
    this.inspectionExportType='inspection-overview';

    this.loading = true;
    this.username = localStorage.getItem('name')
    this.selectedEmpName = this.username;
    this.extraFieldString = [];
    this.qrSize = 3;
    this.extraFieldNameString = [];
    this.mandatoryFieldsMap = new Map<string, boolean>();
    this.extraFieldMap = new Map<string, boolean>();
    this.showFieldsMap = new Map<string, boolean>();
    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.pageIndex = parseInt(localStorage.getItem('assetPreviewInspectionPageInd') || '0', 10);
    this.pageSize = parseInt(localStorage.getItem('assetPreviewInspectionPageSize') || '10', 10);
    this.currentInspection = null;
    // console.log("--------preview",this.assetComponent.previewAsset)
    this.activatedRoute.paramMap.subscribe(params => {
      this.assetId = params.get('id'); // Replace 'id' with the parameter name in your route
      // Use 'id' or other parameter data as needed

    });
    console.log(this.assetId)
    this.assetPreviewService.getAsset(this.assetId).subscribe((data) => {
      this.loading = true;
      console.log("details" + data)
      console.log(data)
      this.assetDetails = data;
      
        if (this.assetDetails.location && this.assetDetails.location.trim() !== '') {
    this.assetPreviewService.getLocationBinDetails(this.companyId, this.assetDetails.location).subscribe((data) => {
      console.log("location bin details", data);
      this.assetDetails.location = data;
    },
    (err) => {
      console.log(err);
    },
    () => {
      this.loading = false;
    });
  } else {
    // location is empty — fall through to locationName, no API call needed
    this.loading = false;
  }

      console.log("preview:-" + this.assetDetails.customerId)
      if (this.assetDetails.customerId != null && this.assetDetails.customerId != '') {
        this.assetPreviewService.getCompanyCustomer(this.assetDetails.customerId).subscribe((data) => {
          this.customer = data;

          console.log(this.customer)
        },
          (err) => {
            console.log(err);
          })
      }

      console.log("--------asset image", this.assetDetails.image);

      let category;
      if(this.assetDetails?.category==null || this.assetDetails?.category==undefined||this.assetDetails?.category==''){
        category='';
      }
      else{
        category=this.assetDetails?.category;
      }
      console.log(category)
      console.log(this.assetDetails)
    this.assetPreviewService.getAllAssetInspection(this.companyId, category).subscribe((data) => {
      this.allInspection = data;
      console.log("Inspectionssss", this.allInspection)
      this.dropdownList = this.allInspection;
       console.log("Inspectionssss", this.dropdownList)
      this.allInspection?.forEach((x: any) => {
        const obj = {
          "name": x.name,
          "stepsList": x.steps
        }
        this.inspectionMap.set(x.id, obj);


      })
      console.log(this.inspectionMap)
    })
    }, (err) => {
      console.log(err);
      this.loading = false;
    },
      () => {
        this.loading = false;
      })



    this.userRole = localStorage.getItem('role');
    if (this.userRole == 'ADMIN') {
      this.assetPreviewService.getTechnicalUsers(this.companyId).subscribe((data) => {
        console.log("Userss=====>")
        this.technicalUserList = data;

        console.log(this.technicalUserList);
      }
        , (err) => {
          console.log(err);
        })
    }
    else {
      this.assetPreviewService.getUserDetail(this.companyId, this.email).subscribe((data) => {
        console.log("Userss=====>")
        console.log(data)
        let user = data as User
        console.log(user)
        let arr = [] as User[];
        arr.push(user);
        this.technicalUserList = arr;

        console.log(this.technicalUserList);
      }
        , (err) => {
          console.log(err);
        })
    }



    console.log(this.assetDetails)
    this.assetPreviewService.getRoleAndPermission(this.companyId, this.userRole).subscribe((data) => {
      console.log("ROLE")
      console.log(this.userRole)
      this.userRoleDetails = data;
      console.log(this.userRoleDetails);
    },
      err => {
        console.log(err);
      });
    this.assetPreviewService.getCheckInOutList(this.assetId).subscribe((data) => {
      this.loading = true;
      this.checkInOut = data;

      console.log(this.checkInOut[0]?.detailsList)
      if (this.checkInOut.length > 0) {
        this.checkInOut[0].detailsList.forEach((ele) => {
          console.log("checkinout->" + ele)
        })
      }
      else {
        console.log("No Check In/Out Details")
      }

    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      })
      
    this.loadInspectionInstances();
    this.assetPreviewService.getAssetFile(this.assetId).subscribe((data) => {
      //console.log("total",data);
      this.loading = true;
      this.fileInfos = data;
      console.log("total", this.fileInfos);
    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      })

    // this.assetPreviewService.getWorkOrders(this.assetId).subscribe((data)=>{
    //   this.loading=true;
    //   this.workOrderList=data;
    //   console.log("workorders",this.workOrderList)
    // },(err)=>{
    //   console.log(err);
    //   this.loading=false;
    // },
    // ()=>{
    //   this.loading=false;
    // });


    this.assetPreviewService.getExtraFields(this.assetId).subscribe((data) => {
      this.loading = true;
      this.extraFields = data as ExtraFields[];
      console.log("extra fieldsss" + this.extraFields)
      console.log("extra fieldsss data" + data)
      this.extraFields?.sort((a, b) => (a.name < b.name) ? -1 : 1)
      if (this.extraFields != null) {
        this.extraFields.forEach((x) => {
          this.extraFieldString.push(x.name);
          this.extraFieldMap.set(x.name, true);

        })
      }
      else {
        console.log("empty ExtraField", data)
      }
      // if()
      // console.log("extra field->"+this.extraFields[0]?.name);
    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      })

    this.assetPreviewService.getExtraFieldName(this.companyId).subscribe((data) => {
      this.loading = true;
      this.extraFieldName = data as [];
      this.extraFieldName.sort((a, b) => (a.name < b.name) ? -1 : 1)
      console.log("extra->", this.extraFieldName);
      if (this.extraFieldName != null) {
        this.extraFieldName.forEach((x) => {
          this.extraFieldNameString.push(x.name);

        })
        console.log(this.extraFieldNameString)
      }
      else {
        console.log("empty extraFieldName")
      }

    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      })

    this.assetPreviewService.getAllShowFields(this.companyId).subscribe((data) => {
      this.showFieldsList = data;
      this.loading = true;
      this.showFieldsList.forEach((x) => {
        console.log("showFirelds" + x.name)
        this.showFieldsMap.set(x.name, x.show);
      })
    },
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      })
    this.assetPreviewService.getQR(this.companyId).subscribe((data) => {
      this.qr = data;
      this.qrData = "assets/id?" + this.assetDetails.id;

    },
      (err) => {
        console.log(err);
      })
  }



  toCamelCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  onClick(option: number) {
    console.log(option)
    this.currOption = option;
  }


  onHover() {
    this.hoverOverSidebar = false;

    // console.log(this.hoverOverSidebar);
  }
  offHover() {
    this.hoverOverSidebar = true;

    // console.log(this.hoverOverSidebar);
  }
  onBack() {
    // this.assetComponent.ngOnInit();
    // this.backStatus.emit({show:false})
    this.router.navigate(['/dashboard'])

  }
  edit() {
    localStorage.setItem("assetIdDetail", this.assetId);
    this.router.navigate(['/dashboard']).then(() => {
      // Code executed after successful navigation
      this.assetService.detailAsset(this.assetDetails);
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }
  update(id: string) {
    console.log("companyCustomerComponent" + id)
    // this.sideBarCurr=id
    // this.dashboardService.callComponentMethod(id)
    if (id != '3') {
      localStorage.setItem('currOption', id);
      this.router.navigate(['/dashboard']);
    }
    // this.dashboardComponent.current=id;
  }
  onTechnicianChange(data: any) {
    console.log(data.target.value)
    this.selectedEmpName = data.target.value;
  }

  /**
   * Parse location hierarchy path and return array of location levels
   * Example: "Building A -> Floor 2 -> Office" → ["Building A", "Floor 2", "Office"]
   * Falls back to locationName if location is empty
   */
  getLocationHierarchy(): string[] {
    // Use location if it has data, otherwise fall back to locationName
    const locationPath = this.assetDetails?.location || this.assetDetails?.locationName;
    
    if (!locationPath || locationPath.trim() === '') {
      return [];
    }
    
    return locationPath
      .split(' -> ')
      .map(level => level.trim())
      .filter(level => level.length > 0);
  }

  /**
   * Get the full location path for display
   * Returns location if available, otherwise locationName
   */
  getFullLocationPath(): string {
    return this.assetDetails?.location && this.assetDetails.location.trim() !== '' 
      ? this.assetDetails.location 
      : this.assetDetails?.locationName || '';
  }

  /**
   * Check if the location hierarchy is long (more than 3 levels)
   * This determines if we should show the full path tooltip
   */
  isLongHierarchy(): boolean {
    const hierarchy = this.getLocationHierarchy();
    return hierarchy.length > 3;
  }
  // handleSubmit(employee: any, notes: string, location: string) {
  //   console.log("emp=> " + this.selectedEmpName)
  //   console.log("emp=> " + employee)
  //   if (this.selectedEmpName == null || this.selectedEmpName == '') {
  //     this.CheckInOutSubmit(employee, notes, location);
  //   }
  //   else {
  //     this.CheckInOutSubmit(this.selectedEmpName, notes, location);
  //   }


  //   if (employee) employee = '';
  //   this.selectedEmpName = this.username;
  //   if (notes) notes = '';
  //   if (location) location = '';
  //   this.notesRef.nativeElement.value = '';
  //   this.locationRef.nativeElement.value = '';
  // }
  // CheckInOutSubmit(employee: string, notes: string, location: string) {
  //   let obj = {};
  //   var today = new Date();
  //   console.log("today--->" + today)
  //   if (employee == null || employee == '' || notes == null || notes == '') {
  //     // alert("Fields are Empty");
  //     this.triggerAlert("Check In/Out Fields are Empty", "warning");
  //   }
  //   else {
  //     if (this.checkInOut.length == 0) {
  //       obj = {
  //         "assetId": this.assetId,
  //         "status": "Checked Out",
  //        "date": this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
  //         "employee": employee,
  //         "notes": notes,
  //         "location": location,
  //         "companyId": this.companyId
  //       }
  //     }
  //     else if (this.checkInOut[0].status == 'Checked In') {
  //       obj = {
  //         "assetId": this.assetId,
  //         "status": "Checked Out",
  //        "date": this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
  //         "employee": employee,
  //         "notes": notes,
  //         "location": location,
  //         "companyId": this.companyId
  //       }
  //     }
  //     else {
  //       obj = {
  //         "assetId": this.assetId,
  //         "status": "Checked In",
  //        "date": this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
  //         "employee": employee,
  //         "notes": notes,
  //         "location": location,
  //         "companyId": this.companyId
  //       }
  //     }
  //     console.log(obj)
  //     this.assetPreviewService.addCheckInOut(obj).subscribe((data) => {
  //       console.log(data);
  //     },
  //       (err) => {
  //         console.log(err);
  //         // if (err.error.error === "TRIAL_EXPIRED"||err.error.error==="SUBSCRIPTION_REQUIRED") {
  //          if(err.error.error==="TRIAL_EXPIRED"){
  //           this.triggerAlert(err.error.message, "danger");
  //         }
  //         else {
  //           this.triggerAlert(err.error.errorMessage, "danger");
  //         }
  //       },
  //       () => {
  //         this.ngOnInit()
  //       })

  //   }



  // }
   handleSubmit(employee: any, notes: string, location: string) {
      this.assetPreviewService.getIpFromIpInfo().subscribe(
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
      this.assetPreviewService.addCheckInOut(obj).subscribe(
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
     this.qrDownloading = true;
      setTimeout(() => {
    this.generatePdf('myqr', this.assetDetails.name + "_" + this.assetDetails.serialNumber + "_QR");
    }, 0);
  }

  download(id: string, name: string) {
    this.assetPreviewService.download(id).subscribe((data: any) => {

      console.log(name);
      const blob: any = new Blob([data], { type: 'text/json; charset=utf-8' });
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      // link.download=name;
      // link.click();
      // window.URL.revokeObjectURL(link.href);
      // link.remove();
      saveAs(blob, name);

    },
      (err) => {
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        }
        else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      })
  }
  itemDeleteDetails(id: string) {
    this.deleteFileId = id;

  }
  deleteFile() {
    this.assetPreviewService.deleteFile(this.deleteFileId).subscribe((data) => {
      console.log(data);
      this.triggerAlert('File deleted successfully', 'success');
    },
      (err) => {
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        }
        else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
      },
      () => {
        this.reloadAssetFiles();
        this.deleteFileId = '';
      })
  }

  fileUpload(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > this.maxFileSizeBytes);
    if (oversizedFiles.length) {
      this.triggerAlert(
        `File size exceeds maximum limit (10MB per file): ${oversizedFiles.map((file) => file.name).join(', ')}`,
        'danger',
      );
      event.target.value = '';
      return;
    }

    this.uploadFilesSequentially(files, 0, event.target);
  }

  private uploadFilesSequentially(files: File[], index: number, inputEl: HTMLInputElement) {
    if (index >= files.length) {
      this.currentFile = null;
      this.progress = 0;
      inputEl.value = '';
      this.reloadAssetFiles();
      return;
    }

    const uploadingFile = files[index];
    this.currentFile = uploadingFile;
    this.progress = 0;

    this.assetPreviewService.addAssetFile(uploadingFile, this.assetId, this.username).subscribe({
      next: (uploadEvent) => {
        if (uploadEvent.type === HttpEventType.UploadProgress && uploadEvent.total) {
          this.progress = Math.round((100 * uploadEvent.loaded) / uploadEvent.total);
        } else if (uploadEvent instanceof HttpResponse) {
          this.progress = 100;
          this.triggerAlert(`Uploaded ${uploadingFile.name} successfully`, 'success');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.currentFile = null;
        this.progress = 0;

        let errorMessage = `Could not upload ${uploadingFile.name}.`;
        if (err?.status === 413) {
          errorMessage = `File size exceeds server limit for ${uploadingFile.name}.`;
        } else if (err?.error?.error === 'TRIAL_EXPIRED') {
          errorMessage = err.error.message;
        } else if (err?.error?.errorMessage) {
          errorMessage = err.error.errorMessage;
        }

        this.triggerAlert(errorMessage, 'danger');
        this.uploadFilesSequentially(files, index + 1, inputEl);
      },
      complete: () => {
        this.uploadFilesSequentially(files, index + 1, inputEl);
      },
    });
  }

  private reloadAssetFiles() {
    this.assetPreviewService.getAssetFile(this.assetId).subscribe(
      (data) => {
        this.fileInfos = data || [];
      },
      (err) => console.log(err),
    );
  }

  formatFileSize(bytes: number): string {
    if (!bytes) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = bytes / Math.pow(1024, index);
    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  }

  updateStepList() {
    //  console.log(this.currentInspection)
    //   console.log(this.assetId)

    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    // this.inspectionInstance.assetCategoryInspectionId = this.currentInspection.id;
    this.inspectionInstance.assetCategoryInspectionName = "";
    this.selectedItems.forEach((item: any) => {
      this.inspectionInstance.assetCategoryInspectionName += item.name + " ";
    })

    console.log(this.inspectionInstance.assetCategoryInspectionName)

    let steps: any[] = [];
    let stepObj: any[] = []
    // this.selectedItems
    console.log("updateStepListCalled")
    console.log("selectedItems", this.selectedItems)
    this.selectedItems.forEach((item: any) => {
      let inspectionMapValue = this.inspectionMap.get(item.id);
      console.log("inspectionMapValue", inspectionMapValue)
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
            type: step['type']
          };

          steps.push(obj);
          myCurrStep.push(obj);
        })
        let myObj = {
          "inspectionName": item.name,
          "stepValues": myCurrStep
        }
        stepObj.push(myObj);

        // You may want to push obj to steps or handle it as needed.
      }
    })
    console.log("stepObj", stepObj)
    console.log(steps)
    this.stepObject = stepObj;
    this.inspectionInstance.stepValues = steps;
    this.inspectionInstance.inspectionTemplates = this.stepObject;
    console.log(this.inspectionInstance.stepValues)


  }
  updateStepListFromLocalStorage() {

    this.inspectionInstance.assetId = this.assetId;
    this.inspectionInstance.companyId = this.companyId;
    this.inspectionInstance.assetCategoryInspectionName = "";
    this.selectedItems.forEach((item: any) => {
      this.inspectionInstance.assetCategoryInspectionName += item.name + " ";
    })

    let steps: any[] = [];
    let stepObj: any[] = []
    // this.selectedItems
    console.log("updateStepListCalled")
    console.log("selectedItems", this.selectedItems)
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
          type: step['type']
        };

        steps.push(obj);
        myCurrStep.push(obj);
      })
      let myObj = {
        "inspectionName": item.inspectionName,
        "stepValues": myCurrStep
      }
      stepObj.push(myObj);

      // You may want to push obj to steps or handle it as needed.

    })
    console.log("stepObj", stepObj)
    console.log(steps)
    this.stepObject = stepObj;
    this.inspectionInstance.stepValues = steps;
    this.inspectionInstance.inspectionTemplates = this.stepObject;
    console.log(this.inspectionInstance.notes)
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
    this.inspectionInstance.actionPerformedBy = this.username;
    const currDateTime = new Date();

    if (this.inspectionInstance.createdAt == null ) {
      this.inspectionInstance.createdBy = this.username;
      this.inspectionInstance.createdAt = currDateTime;
    }
    this.inspectionInstance.updatedAt = currDateTime;
    this.inspectionInstance.status = 'PENDING';
    this.inspectionInstance.selectedItemList = this.selectedItems;
    console.log(this.inspectionInstance)
    this.assetPreviewService.addAssetInspection(this.inspectionInstance).subscribe((data) => {
      console.log("Inspection Saved" + data);
      this.triggerAlert("Inspection saved sucessfully", "success");
      this.selectedItems = []
    },
      (err) => {
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
          this.triggerAlert(err.error.message, "danger");
        }
        else {
          this.triggerAlert(err.error.errorMessage, "danger");
        }
        this.selectedItems = []
      },
      () => {
        this.selectedItems = []
        this.clearSavedData();
        this.loadInspectionInstances();
      })
    console.log(this.inspectionInstance)
    console.log(this.selectedItems)
    // localStorage.setItem(this.assetId+'tempInspection', JSON.stringify(this.inspectionInstance));
    // localStorage.setItem(this.assetId+'selectedItems', JSON.stringify(this.selectedItems));
    this.triggerAlert("Inspection Instance Saved", "success");
  }
  clearSavedData() {
    localStorage.removeItem(this.assetId + 'tempInspection');
    localStorage.removeItem(this.assetId + 'selectedItems');
    this.inspectionInstance = new InspectionInstance();

    this.selectedItems = [];
    this.notedData = "";
    this.dueDateInput = '';
  }
  updateNotedData(data: any) {
    this.notedData = data;
  }

  mySelectedInspectionInstanceFunc(instance: any) {
    console.log("mySelectedInspectionInstanceFunc called")
    console.log(instance)
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
  inspectionChanged() {
      console.log(this.currentInspection)
      console.log(this.assetId)
  
      this.inspectionInstance.assetId = this.assetId;
      this.inspectionInstance.companyId = this.companyId;
      this.inspectionInstance.assetCategoryInspectionId = this.currentInspection.id;
      this.inspectionInstance.assetCategoryInspectionName = this.currentInspection.name;
  
      let steps: any[] = [];
      let stepObj: any[] = []
      // this.selectedItems
      this.selectedItems.forEach((item: any) => {
        let inspectionMapValue = this.inspectionMap.get(item.id);
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
              type: step['type']
            };
  
            steps.push(obj);
            myCurrStep.push(obj);
          })
          let myObj = {
            "inspectionName": item.name,
            "stepValues": myCurrStep
          }
          stepObj.push(myObj);
  
          // You may want to push obj to steps or handle it as needed.
        }
      })
      console.log("stepObj", stepObj)
      console.log(steps)
      this.stepObject = stepObj;
      this.inspectionInstance.stepValues = steps;
      this.inspectionInstance.inspectionTemplates = this.stepObject;
      console.log(this.inspectionInstance.stepValues)
    }
    saveInpectionValue() {
      this.applyDueDateToInstance();
      console.log(this.inspectionInstance)
      console.log(this.stepObject)
      this.inspectionInstance.actionPerformedBy = this.username;
      const currDateTime = new Date();
      if (this.inspectionInstance.createdAt == null ) {
        this.inspectionInstance.createdBy = this.username;
        this.inspectionInstance.createdAt = currDateTime;
      }
      this.inspectionInstance.updatedAt = currDateTime;
      this.inspectionInstance.status = 'COMPLETED';
      this.inspectionInstance.selectedItemList = this.selectedItems;
      console.log(this.inspectionInstance)
      this.assetPreviewService.addAssetInspection(this.inspectionInstance).subscribe((data) => {
        console.log("Inspection Saved" + data);
        this.triggerAlert("Inspection saved sucessfully", "success");
        this.selectedItems = []
      },
        (err) => {
          console.log(err);
          if (err.error.error === "TRIAL_EXPIRED") {
            this.triggerAlert(err.error.message, "danger");
          }
          else {
            this.triggerAlert(err.error.errorMessage, "danger");
          }
          this.selectedItems = []
        },
        () => {
          this.selectedItems = []
          this.clearSavedData();
          this.loadInspectionInstances();
        })
    }
    handleStepChange(event: any, index: number, type: string): void {
      if (!this.inspectionInstance.stepValues[index]) return;
      console.log(type)
      if (type === 'checkbox') {
        // For checkbox, use `event.target.checked`
        console.log(event.target.checked)
        this.inspectionInstance.stepValues[index].value = event.target.checked ? 'checked' : '';
      } else {
        // For text, number, etc., use `event.target.value`
        this.inspectionInstance.stepValues[index].value = event.target.value;
      }
    }
    handleStepCheckox(isChecked: any, index: number, type: string) {
  
      this.inspectionInstance.stepValues[index].value = isChecked
  
    }
    addNote(event: any) {
     
      this.inspectionInstance.notes = event.target.value;
       console.log(this.inspectionInstance.notes)
    }
    selectedInspectionInstanceFunc(data: InspectionInstance) {
      console.log(data)
  
  
      data.stepValues
        ?.forEach((step: { type: string; value: string | boolean; }) => {
  
          if (typeof step.value === 'string') {
            step.value = step.value === 'true';
          }
  
        });
  
  
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
      console.log(this.selectedInspectionInstance)
      this.selectedInspectionInstance.notes = this.notedData;
      this.inspectionInstance.selectedItemList = this.selectedItems;
      this.assetPreviewService.updateAssetInspection(this.selectedInspectionInstance).subscribe((data) => {
        console.log("Updated Inspection" + data);
        this.triggerAlert("Inspection updated sucessfully", "success");
      },
        (err) => {
          console.log(err);
          if (err.error.error === "TRIAL_EXPIRED") {
            this.triggerAlert(err.error.message, "danger");
          }
          else {
            this.triggerAlert(err.error.errorMessage, "danger");
          }
        },
        () => {
          this.inspectionInstance.stepValues = [];
          this.inspectionInstance.notes = '';
          this.loadInspectionInstances();
        })
    }
    cancelInspection() {
    console.log(this.inspectionInstance)
    console.log(this.stepObject)
    this.inspectionInstance.actionPerformedBy = this.username;
    const currDateTime = new Date();
    if (this.inspectionInstance.createdAt == null) {
        this.inspectionInstance.createdBy = this.username;
        this.inspectionInstance.createdAt = currDateTime;
    }
    this.inspectionInstance.updatedAt = currDateTime;
    this.inspectionInstance.status = 'CANCELLED';
    this.inspectionInstance.selectedItemList = this.selectedItems;
    console.log(this.inspectionInstance)
    this.assetPreviewService.addAssetInspection(this.inspectionInstance).subscribe((data) => {
        console.log("Inspection Saved" + data);
        this.triggerAlert("Inspection Cancelled sucessfully", "success");
        this.selectedItems = []
    },
    (err) => {
        console.log(err);
        if (err.error.error === "TRIAL_EXPIRED") {
            this.triggerAlert(err.error.message, "danger");
        } else {
            this.triggerAlert(err.error.errorMessage, "danger");
        }
        this.selectedItems = []
    },
    () => {
        this.selectedItems = []
        this.clearSavedData();
        this.closeBox5.nativeElement.click();
        this.loadInspectionInstances();
    })
}

     clearData(){
    this.selectedItems=[]
    this.inspectionInstance=new InspectionInstance();
    this.dueDateInput = '';
    // this.inspectionInstance.notes='';
    // this.notedData="";
  }
  
  exportInspectionData(){
    if(this.inspectionExportType=='inspection-overview'){
      console.log("Export inspection-overview")
      this.assetPreviewService.getInspectionOverviewExport(this.companyId,this.assetId).subscribe((data:Blob)=>{
      
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
      this.assetPreviewService.getInspectionDetailedExport(this.companyId,this.assetId).subscribe((data:Blob)=>{
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

  // downloadInspectionPDF(instance: any) {
  //   const doc = new jspdf.jsPDF();
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   let yPosition = 10;
  //   const lineHeight = 7;
  //   const margin = 10;
  //   const contentWidth = pageWidth - 2 * margin;

  //   doc.setFillColor(25, 40, 82);
  //   doc.rect(0, 0, pageWidth, 25, 'F');
  //   doc.setTextColor(255, 255, 255);
  //   doc.setFontSize(16);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Asset Inspection Report', margin, 18);
  //   yPosition = 30;

  //   doc.setTextColor(0, 0, 0);
  //   doc.setFontSize(10);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Asset Name:', margin, yPosition);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(this.assetDetails?.name || 'N/A', margin + 35, yPosition);
  //   yPosition += lineHeight;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Asset ID:', margin, yPosition);
  //   doc.setFont('helvetica', 'normal');
  //   doc.text(this.assetDetails?.id?.toString() || this.assetId?.toString() || 'N/A', margin + 35, yPosition);
  //   yPosition += lineHeight;

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Inspection Date:', margin, yPosition);
  //   doc.setFont('helvetica', 'normal');
  //   const inspectionDate = instance.createdAt
  //     ? new Date(instance.createdAt).toLocaleDateString('en-US', {
  //         year: 'numeric',
  //         month: 'long',
  //         day: 'numeric',
  //       })
  //     : 'N/A';
  //   doc.text(inspectionDate, margin + 35, yPosition);
  //   yPosition += lineHeight + 5;

  //   doc.setFillColor(25, 40, 82);
  //   doc.rect(margin, yPosition - 3, contentWidth, 7, 'F');
  //   doc.setTextColor(255, 255, 255);
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(12);
  //   doc.text('Inspection Template: ' + (instance.assetCategoryInspectionName || 'N/A'), margin + 5, yPosition + 2);
  //   yPosition += 10;

  //   doc.setTextColor(0, 0, 0);
  //   doc.setFontSize(10);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('#Step', margin + 5, yPosition);
  //   doc.text('Name', margin + 20, yPosition);
  //   doc.text('Value', margin + 100, yPosition);
  //   yPosition += lineHeight + 2;
  //   doc.setDrawColor(200, 200, 200);
  //   doc.line(margin, yPosition - 2, margin + contentWidth, yPosition - 2);

  //   doc.setFont('helvetica', 'normal');
  //   doc.setFontSize(9);

  //   let allSteps: any[] = [];
  //   if (instance.inspectionTemplates?.length) {
  //     instance.inspectionTemplates.forEach((template: any) => {
  //       if (template.stepValues?.length) {
  //         allSteps = allSteps.concat(template.stepValues);
  //       }
  //     });
  //   } else if (instance.stepValues?.length) {
  //     allSteps = instance.stepValues;
  //   }

  //   if (allSteps.length > 0) {
  //     allSteps.forEach((step: any, index: number) => {
  //       if (yPosition > pageHeight - 20) {
  //         doc.addPage();
  //         yPosition = 10;
  //       }
  //       doc.text((index + 1).toString(), margin + 5, yPosition + 5);
  //       doc.text(step.name || 'N/A', margin + 20, yPosition + 5);
  //       let valueText = 'N/A';
  //       if (step.type === 'CHECKBOX') {
  //         valueText = step.value === true || step.value === 'true' ? 'Yes' : 'No';
  //       } else {
  //         valueText = step.value || 'N/A';
  //       }
  //       doc.text(valueText, margin + 100, yPosition + 5);
  //       yPosition += lineHeight;
  //     });
  //   } else {
  //     doc.text('No inspection steps recorded', margin + 20, yPosition);
  //     yPosition += lineHeight;
  //   }

  //   yPosition += 5;
  //   doc.line(margin, yPosition, margin + contentWidth, yPosition);
  //   yPosition += 5;

  //   if (instance.notes) {
  //     doc.setFont('helvetica', 'bold');
  //     doc.text('Notes:', margin, yPosition);
  //     yPosition += lineHeight;
  //     doc.setFont('helvetica', 'normal');
  //     const noteText = doc.splitTextToSize(instance.notes, contentWidth - 10);
  //     doc.text(noteText, margin + 5, yPosition);
  //     yPosition += noteText.length * lineHeight + 5;
  //   }

  //   yPosition += 5;
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(9);
  //   doc.text('Performed By: ' + (instance.actionPerformedBy || 'N/A'), margin, yPosition);
  //   yPosition += lineHeight;
  //   doc.text('Status: ' + (instance.status || 'N/A'), margin, yPosition);

  //   doc.setFontSize(8);
  //   doc.setTextColor(150, 150, 150);
  //   doc.text('Powered by Asset Yug', pageWidth / 2, pageHeight - 5, { align: 'center' });

  //   const fileName = `Inspection_${this.assetDetails?.name || 'Asset'}_${instance.assetCategoryInspectionInstanceId}.pdf`;
  //   doc.save(fileName);
  // }

  downloadInspectionPDF(instance: any) {
    const instances = [instance];
    const doc = new jspdf.jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    const stepColX = margin + 25;
    const valueColX = margin + contentWidth - 30;
    const nameColWidth = valueColX - stepColX - 5;
    const valueColWidth = margin + contentWidth - valueColX - 2;
    let yPosition = 0;
  
    const navy: [number, number, number] = [25, 40, 82];
    const blue: [number, number, number] = [59, 91, 179];
    const lightGray: [number, number, number] = [245, 246, 248];
    const green: [number, number, number] = [34, 139, 60];
    const red: [number, number, number] = [180, 60, 60];
  
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
    doc.text(this.assetDetails?.id?.toString() || 'N/A', col2, yPosition + 5);
  
    const latestDate = instances?.[0]?.createdAt
      ? new Date(instances[0].createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })
      : 'N/A';
    doc.text(latestDate, col3, yPosition + 5);
  
    yPosition += 22;
  
    // ---------- LOOP THROUGH EACH INSPECTION ----------
    (instances || []).forEach((instance: any, instanceIndex: number) => {
      checkPageBreak(20);
  
      // Section header bar
      doc.setFillColor(...navy);
      doc.rect(margin, yPosition, contentWidth, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Inspection ${instanceIndex + 1}`, margin + 4, yPosition + 6);
  
      const idLabel = `ID: ${instance.assetCategoryInspectionInstanceId || 'N/A'}`;
      const idWidth = doc.getTextWidth(idLabel) + 6;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + contentWidth - idWidth - 4, yPosition + 1.5, idWidth, 6, 3, 3, 'F');
      doc.setTextColor(...navy);
      doc.setFontSize(8);
      doc.text(idLabel, margin + contentWidth - idWidth - 1, yPosition + 5.5);
  
      yPosition += 9;
  
      // Table header row
      doc.setFillColor(...blue);
      doc.rect(margin, yPosition, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('#Step', margin + 5, yPosition + 5.5);
      doc.text('Name', margin + 25, yPosition + 5.5);
      doc.text('Value', margin + contentWidth - 30, yPosition + 5.5);
      yPosition += 8;
  
      // Gather steps
      let allSteps: any[] = [];
      if (instance.inspectionTemplates?.length) {
        instance.inspectionTemplates.forEach((template: any) => {
          if (template.stepValues?.length) allSteps = allSteps.concat(template.stepValues);
        });
      } else if (instance.stepValues?.length) {
        allSteps = instance.stepValues;
      }
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
  
      // if (allSteps.length > 0) {
      //   allSteps.forEach((step: any, index: number) => {
      //     checkPageBreak(9);
  
      //     const rowHeight = 8;
      //     if (index % 2 === 1) {
      //       doc.setFillColor(...lightGray);
      //       doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');
      //     }
  
      //     doc.setTextColor(0, 0, 0);
      //     doc.text((index + 1).toString(), margin + 5, yPosition + 5.5);
      //     doc.text(step.name || 'N/A', margin + 25, yPosition + 5.5);
  
      //     if (step.type === 'CHECKBOX') {
      //       const isYes = step.value === true || step.value === 'true';
      //       doc.setTextColor(...(isYes ? green : red));
      //       doc.setFont('helvetica', 'bold');
      //       doc.text(isYes ? 'Yes' : 'No', margin + contentWidth - 30, yPosition + 5.5);
      //       doc.setFont('helvetica', 'normal');
      //     } else {
      //       doc.setTextColor(80, 80, 80);
      //       const valueText = (step.value !== undefined && step.value !== null && step.value !== '')
      //         ? `# ${step.value}`
      //         : 'N/A';
      //       doc.text(valueText, margin + contentWidth - 30, yPosition + 5.5);
      //     }
  
      //     yPosition += rowHeight;
      //   });
      // }
      // if (allSteps.length > 0) {
      //   allSteps.forEach((step: any, index: number) => {
      //     const nameLines = doc.splitTextToSize(step.name || 'N/A', nameColWidth);
      //     const rowHeight = Math.max(8, nameLines.length * 5 + 3); // grow row if wrapped
      
      //     checkPageBreak(rowHeight);
      
      //     if (index % 2 === 1) {
      //       doc.setFillColor(...lightGray);
      //       doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');
      //     }
      
      //     doc.setTextColor(0, 0, 0);
      //     doc.text((index + 1).toString(), margin + 5, yPosition + 5.5);
      //     doc.text(nameLines, stepColX, yPosition + 5.5);
      
      //     if (step.type === 'CHECKBOX') {
      //       const isYes = step.value === true || step.value === 'true';
      //       doc.setTextColor(...(isYes ? green : red));
      //       doc.setFont('helvetica', 'bold');
      //       doc.text(isYes ? 'Yes' : 'No', valueColX, yPosition + 5.5);
      //       doc.setFont('helvetica', 'normal');
      //     } else {
      //       doc.setTextColor(80, 80, 80);
      //       const valueText = (step.value !== undefined && step.value !== null && step.value !== '')
      //         ? `# ${step.value}`
      //         : 'N/A';
      //       doc.text(valueText, valueColX, yPosition + 5.5);
      //     }
      
      //     yPosition += rowHeight;
      //   });
      // }
      if (allSteps.length > 0) {
        allSteps.forEach((step: any, index: number) => {
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
              ? `# ${step.value}`
              : 'N/A';
            valueLines = doc.splitTextToSize(valueText.toString(), valueColWidth);
          }
      
          const lineCount = Math.max(nameLines.length, valueLines.length);
          const rowHeight = Math.max(8, lineCount * 5 + 3);
      
          checkPageBreak(rowHeight);
      
          if (index % 2 === 1) {
            doc.setFillColor(...lightGray);
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
      }
      else {
        doc.setTextColor(120, 120, 120);
        doc.text('No inspection steps recorded', margin + 25, yPosition + 5.5);
        yPosition += 8;
      }
  
      // Notes box
      if (instance.notes) {
        checkPageBreak(20);
        doc.setDrawColor(225, 225, 225);
        doc.setFillColor(255, 255, 255);
        const noteText = doc.splitTextToSize(instance.notes, contentWidth - 12);
        const boxHeight = noteText.length * 5 + 10;
        doc.roundedRect(margin, yPosition + 2, contentWidth, boxHeight, 2, 2, 'S');
  
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes', margin + 4, yPosition + 8);
  
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(noteText, margin + 4, yPosition + 14);
  
        yPosition += boxHeight + 6;
      }
  
      yPosition += 4; // gap before next inspection card
    });
  
    // ---------- FOOTER on every page ----------
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Powered by Asset Yug', margin, pageHeight - 6, { align: 'left' });
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }
  
    const fileName = `Inspection_${this.assetDetails?.name || 'Asset'}_${this.assetId || ''}.pdf`;
    doc.save(fileName);
  }

  loadInspectionInstances() {
    this.assetPreviewService
      .getAllAssetInspectionInstanceByAssetId(this.assetId, this.pageIndex, this.pageSize)
      .subscribe(
        (data) => {
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
    localStorage.setItem('assetPreviewInspectionPageInd', this.pageIndex.toString());
    localStorage.setItem('assetPreviewInspectionPageSize', this.pageSize.toString());
    this.loadInspectionInstances();
  }

}
