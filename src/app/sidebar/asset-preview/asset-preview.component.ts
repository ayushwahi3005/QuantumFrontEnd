import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ExtraFields } from './extraFields';
import { CheckInOut } from './checkInOut';
import { ExtraFieldName } from './extraFieldName';
import { WorkOrder } from './workorder';
import { AssetFile } from './assetFile';
import { ShowFieldsData } from './showFieldsData';
import { MandatoryFields } from './mandatoryFields';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
import { NotificationService } from 'src/app/notification/notification.service';
import { InspectionInstance } from '../asset-details/inspectionInstance';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.css']
})
export class AssetPreviewComponent {
  @ViewChild('notes') notesRef!: ElementRef;
  @ViewChild('location') locationRef!: ElementRef;
  @ViewChild('exportCloseBox') exportCloseBox!: ElementRef;
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
  currentInspection: any;
  checkBoxColor = "primary"
  selectedInspectionInstance: any;
  inspectionInstance: InspectionInstance = {
    assetId: '',
    companyId: '',
    assetCategoryInspectionId: '',
    assetCategoryInspectionName: '',
    actionPerformedBy: '',
    notes: '',
    createdAt: null,
    updatedAt: null,
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
      
    this.assetPreviewService.getAllAssetInspectionInstanceByAssetId(this.assetId).subscribe((data) => {
      this.allInspectionInstance = data;

      console.log(this.allInspectionInstance)
    },
      (err) => {
        console.log(err);
      })
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
  handleSubmit(employee: any, notes: string, location: string) {
    console.log("emp=> " + this.selectedEmpName)
    console.log("emp=> " + employee)
    if (this.selectedEmpName == null || this.selectedEmpName == '') {
      this.CheckInOutSubmit(employee, notes, location);
    }
    else {
      this.CheckInOutSubmit(this.selectedEmpName, notes, location);
    }


    if (employee) employee = '';
    this.selectedEmpName = this.username;
    if (notes) notes = '';
    if (location) location = '';
    this.notesRef.nativeElement.value = '';
    this.locationRef.nativeElement.value = '';
  }
  CheckInOutSubmit(employee: string, notes: string, location: string) {
    let obj = {};
    var today = new Date();
    console.log("today--->" + today)
    if (employee == null || employee == '' || notes == null || notes == '') {
      // alert("Fields are Empty");
      this.triggerAlert("Check In/Out Fields are Empty", "warning");
    }
    else {
      if (this.checkInOut.length == 0) {
        obj = {
          "assetId": this.assetId,
          "status": "Checked Out",
          "date": this.datePipe.transform(today, 'yyyy-MM-dd'),
          "employee": employee,
          "notes": notes,
          "location": location,
          "companyId": this.companyId
        }
      }
      else if (this.checkInOut[0].status == 'Checked In') {
        obj = {
          "assetId": this.assetId,
          "status": "Checked Out",
          "date": this.datePipe.transform(today, 'yyyy-MM-dd'),
          "employee": employee,
          "notes": notes,
          "location": location,
          "companyId": this.companyId
        }
      }
      else {
        obj = {
          "assetId": this.assetId,
          "status": "Checked In",
          "date": this.datePipe.transform(today, 'yyyy-MM-dd'),
          "employee": employee,
          "notes": notes,
          "location": location,
          "companyId": this.companyId
        }
      }
      console.log(obj)
      this.assetPreviewService.addCheckInOut(obj).subscribe((data) => {
        console.log(data);
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
          this.ngOnInit()
        })

    }



  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    // You can set a timeout to automatically hide the alert after a certain time
    setTimeout(() => {
      this.showAlert = false;
    }, 50000); // Hide the alert after 5 seconds (adjust as needed)
  }

  generatePdf(elementId: string, fileName: string) {
    const element: any = document.getElementById(elementId);

    html2canvas(element, {
      scale: 2,  // Increase scale to improve quality
      backgroundColor: null,  // Ensures no background color is added
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = this.qrSize * 100;
      const pdfHeight = this.qrSize * 100;
      const pdf = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName + '.pdf');
    });

  }
  downloadQR() {
    this.generatePdf('myqr', this.assetDetails.name + "_" + this.assetDetails.serialNumber + "_QR");
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
        this.ngOnInit();
        this.deleteFileId = '';
      })
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
    this.inspectionInstance.actionPerformedBy = this.username;
    const currDateTime = new Date();

    if (this.inspectionInstance.createdAt == null ) {
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
        this.ngOnInit();
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
    this.updateStepListFromLocalStorage();
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
      console.log(this.inspectionInstance)
      console.log(this.stepObject)
      this.inspectionInstance.actionPerformedBy = this.username;
      const currDateTime = new Date();
      if (this.inspectionInstance.createdAt == null ) {
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
          this.ngOnInit();
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
          this.ngOnInit();
        })
    }

     clearData(){
    this.selectedItems=[]
    this.inspectionInstance=new InspectionInstance();
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
}

