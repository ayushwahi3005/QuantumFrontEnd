import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportService } from './import.service';
import { AssetsService } from 'src/app/sidebar/assets/assets.service';
import { ExtraFieldName } from './extraFieldName';
import * as XLSX from 'xlsx';
import { ColumnMapping } from './columnMapping';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { MatDialog } from '@angular/material/dialog';

declare var bootstrap: any;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {

  @ViewChild('infoNotice') myModal!: ElementRef;

  loading: boolean = false;
  email!: any;
  importForm!: FormGroup;
  myFile!: any;
  selectedModule = "asset";
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';
  companyId!: any;
  excelColumns: string[] = [];
  assetDatabaseColumns: string[] = [];
  assetDatabaseColumnsToAdd: string[] = [];
  assetDatabaseColumnsToUpdate: string[] = [];

  workorderDatabaseColumns: string[] = [];
  workorderDatabaseColumnsToAdd: string[] = [];
  workorderDatabaseColumnsToUpdate: string[] = [];

  inventoryDatabaseColumns: string[] = [];
  inventoryDatabaseColumnsToAdd: string[] = [];
  inventoryDatabaseColumnsToUpdate: string[] = [];

  customerDatabaseColumns: string[] = [];
  customerDatabaseColumnsToAdd: string[] = [];
  customerDatabaseColumnsToUpdate: string[] = [];

  currImport: string = 'asset';

  col = new ColumnMapping();
  columnMappings!: Map<String, String>;
  assetExtraFieldsColumns!: ExtraFieldName[];
  inventoryExtraFieldsColumns!: ExtraFieldName[];
  workorderExtraFieldsColumns!: ExtraFieldName[];
  customerExtraFieldsColumns!: ExtraFieldName[];
  convertedFile!: any;
  impType: string = 'add';

  progress: number = 0;
  uploadInProgress: boolean = false;
  currExportModuel: any;
  currExportTemplate: any;
  selectedFileName!: string;
  useSavedMapping: boolean = false;

  // Named mapping lists
  customerAddMappings: any[] = [];
  assetAddMappings: any[] = [];
  customerUpdateMappings: any[] = [];
  assetUpdateMappings: any[] = [];
  selectedMappingName: string = '';
  previewMapping: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private importService: ImportService,
    private assetService: AssetsService,
    private dialog: MatDialog
  ) { }

  get currentMappingList(): any[] {
    if (this.currImport === 'asset' && this.impType === 'add') return this.assetAddMappings;
    if (this.currImport === 'asset' && this.impType === 'update') return this.assetUpdateMappings;
    if (this.currImport === 'customer' && this.impType === 'add') return this.customerAddMappings;
    if (this.currImport === 'customer' && this.impType === 'update') return this.customerUpdateMappings;
    return [];
  }

  ngOnInit() {
    this.fetchDataFromLocalStorage();
    this.loading = false;
    this.email = localStorage.getItem('user');
    this.companyId = localStorage.getItem('companyId');
    this.selectedFileName = 'No file chosen';
    this.useSavedMapping = false;
    this.selectedMappingName = '';

    this.importForm = this.formBuilder.group({
      module: ['asset', Validators.required],
      importType: ['add', Validators.required],
      file: ['', Validators.required]
    });

    localStorage.removeItem('uploadProgress');
    localStorage.removeItem('uploadInProgress');
    const savedProgress = localStorage.getItem('uploadProgress');
    const savedLoading = localStorage.getItem('uploadInProgress');

    if (savedProgress) this.progress = parseInt(savedProgress, 10);
    if (savedLoading === 'true') this.loading = true;

    this.assetDatabaseColumnsToUpdate = [];
    this.assetDatabaseColumnsToAdd = [];
    this.workorderDatabaseColumnsToUpdate = [];
    this.workorderDatabaseColumnsToAdd = [];
    this.inventoryDatabaseColumnsToUpdate = [];
    this.inventoryDatabaseColumnsToAdd = [];
    this.customerDatabaseColumnsToUpdate = [];
    this.customerDatabaseColumnsToAdd = [];

    this.assetDatabaseColumnsToUpdate.push("AssetId", "Category", "Name", "SerialNumber", "Customer", "Location", "Status");
    this.assetDatabaseColumnsToAdd.push("Category", "Name", "SerialNumber", "Customer", "Location", "Status");

    this.workorderDatabaseColumnsToUpdate.push("AssetId", "Category", "Name", "SerialNumber", "Customer", "Location", "Status");
    this.workorderDatabaseColumnsToAdd.push("Category", "Name", "SerialNumber", "Customer", "Location", "Status");

    this.inventoryDatabaseColumnsToUpdate.push("InventoryId", "PartId", "PartName", "Price", "Cost", "Category", "Quantity");
    this.inventoryDatabaseColumnsToAdd.push("PartId", "PartName", "Price", "Cost", "Category", "Quantity");

    this.customerDatabaseColumnsToUpdate.push("CompanyCustomerId", "Name", "Category", "Phone", "Email", "Address", "City", "State", "Status", "Zip code");
    this.customerDatabaseColumnsToAdd.push("Name", "Category", "Phone", "Email", "Address", "City", "State", "Status", "Zip Code");

    this.importService.getAssetExtraFields(this.companyId).subscribe((data) => {
      this.assetExtraFieldsColumns = data;
      this.assetExtraFieldsColumns.forEach((x) => {
        this.assetDatabaseColumnsToUpdate.push(x.name);
        this.assetDatabaseColumnsToAdd.push(x.name);
      });
    });

    this.importService.getCustomerExtraFields(this.companyId).subscribe((data) => {
      this.customerExtraFieldsColumns = data;
      this.customerExtraFieldsColumns.forEach((x) => {
        this.customerDatabaseColumnsToUpdate.push(x.name);
        this.customerDatabaseColumnsToAdd.push(x.name);
      });
      this.updateType("add");
    });

    this.columnMappings = new Map<String, String>();
  }

  // ─── Named Mapping Helpers ───────────────────────────────────────────────────

  getNamedMappings(key: string): any[] {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  }

  fetchDataFromLocalStorage(): void {
    this.customerAddMappings    = this.getNamedMappings("customer_add_mappings");
    this.assetAddMappings       = this.getNamedMappings("asset_add_mappings");
    this.customerUpdateMappings = this.getNamedMappings("customer_update_mappings");
    this.assetUpdateMappings    = this.getNamedMappings("asset_update_mappings");
  }

  saveMappings(): void {
    const mappingName = prompt("Enter a name for this mapping:");
    if (!mappingName || mappingName.trim() === '') {
      this.triggerAlert("Mapping name cannot be empty", "warning");
      return;
    }

    const key = this.currImport + "_" + this.impType + "_mappings";
    const existing = this.getNamedMappings(key);
    const idx = existing.findIndex((m: any) => m.name === mappingName.trim());
    const newEntry = {
      name: mappingName.trim(),
      mapping: Array.from(this.columnMappings.entries())
    };

    if (idx >= 0) {
      existing[idx] = newEntry;
    } else {
      existing.push(newEntry);
    }

    localStorage.setItem(key, JSON.stringify(existing));
    this.fetchDataFromLocalStorage();
    this.triggerAlert("Mapping '" + mappingName + "' saved successfully!", "success");
  }

  applyNamedMapping(mappingName: string): void {
    this.selectedMappingName = mappingName;
    const found = this.currentMappingList.find(m => m.name === mappingName);
    if (found) {
      this.columnMappings = new Map(found.mapping);
      this.previewMapping = found.mapping;
      this.useSavedMapping = true;
      this.triggerAlert("Mapping '" + mappingName + "' applied!", "success");
    }
  }

  selectPreview(mappingName: string): void {
    this.selectedMappingName = mappingName;
    const found = this.currentMappingList.find(m => m.name === mappingName);
    this.previewMapping = found ? found.mapping : [];
  }

  deleteNamedMapping(mappingName: string): void {
    const key = this.currImport + "_" + this.impType + "_mappings";
    const updated = this.currentMappingList.filter(m => m.name !== mappingName);
    localStorage.setItem(key, JSON.stringify(updated));
    this.fetchDataFromLocalStorage();
    if (this.selectedMappingName === mappingName) {
      this.columnMappings = new Map();
      this.selectedMappingName = '';
      this.previewMapping = [];
      this.useSavedMapping = false;
    }
    this.triggerAlert("Mapping '" + mappingName + "' deleted", "warning");
  }

  clearAppliedMapping(): void {
    this.columnMappings = new Map();
    this.selectedMappingName = '';
    this.previewMapping = [];
    this.useSavedMapping = false;
  }

  // ─── File & Form ─────────────────────────────────────────────────────────────

  ngAfterViewInit() {
    this.openModal();
  }

  openModal() {
    const modalElement = this.myModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  convertCSVToXlsx(csvData: any): void {
    this.importService.csvToXlsx(csvData, this.convertedFile);
  }

  FileUpload(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.myFile = formData;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const content: string = e.target.result;
      const lines: string[] = content.split('\n');
      const firstLine: string = lines[0].substring(0, lines[0].length - 1);
      this.excelColumns = firstLine.split(',');
    };
    reader.readAsText(file);
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFileName = file ? file.name : 'No file chosen';
  }

  onSubmit() {
    this.loading = true;
    this.uploadInProgress = true;
    this.showAlert = false;
    localStorage.setItem('uploadInProgress', 'true');

    const formData = this.myFile;
    const objArray: any = {};
    this.columnMappings.forEach((v, k) => {
      objArray[k.toString()] = v;
    });
    const jsonString = JSON.stringify(objArray);
    formData.append('column', jsonString);
    this.myFile = formData;

    if (this.importForm.controls['module'].value === "asset") {
      this.currImport = "asset";
      if (this.importForm.controls['importType'].value === "add") {
        this.impType = "add";
        formData.append('columnMappings', jsonString);
        formData.append('file', formData.get('file'));
        this.myFile = formData;

        this.importService.addAssets(this.myFile, this.companyId, this.email, this.columnMappings).subscribe(
          () => {
            this.loading = false;
            this.triggerAlert("Asset File Successfully Uploaded", "success");
          },
          (err) => {
            this.loading = false;
            this.uploadInProgress = false;
            this.progress = 0;
            localStorage.removeItem('uploadProgress');
            localStorage.removeItem('uploadInProgress');
            if (err.status === '409') {
              this.triggerAlert(err.error.message, "danger");
            } else if (err.error.errorMessage?.startsWith("Upload Limit Exceeded")) {
              this.triggerAlert(err.error.errorMessage, "danger");
            } else if (err.error.errorMessage === "Mandatory Column Name Is Missing in Mapping") {
              this.triggerAlert("Failed!! " + err.error.errorMessage, "danger");
            } else {
              this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger");
            }
            this.ngOnInit();
          }
        );
      } else {
        formData.append('columnMappings', jsonString);
        formData.append('file', formData.get('file'));
        this.myFile = formData;
        this.importService.updateAssets(this.myFile, this.companyId, this.email, this.columnMappings).subscribe(
          () => {
            this.loading = false;
            this.triggerAlert("Asset File Successfully Updated", "success");
          },
          (err) => {
            this.loading = false;
            this.ngOnInit();
            this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger");
          }
        );
      }
    } else if (this.importForm.controls['module'].value === "inventory") {
      this.currImport = "inventory";
      if (this.importForm.controls['importType'].value === "add") {
        this.impType = "add";
        const file = formData.get('file');
        const newFileName = file.name + '_' + jsonString + '_' + this.email + '_' + this.companyId;
        const newFile = new File([file], newFileName, { type: file.type });
        formData.append('file', newFile);
        this.myFile = formData;
        this.importService.addInventory(this.myFile, this.companyId, this.email).subscribe(
          () => { this.loading = false; this.triggerAlert("Inventory File Successfully Uploaded", "success"); },
          (err) => {
            this.loading = false;
            if (err.error.errorMessage?.startsWith("Upload Limit Exceeded")) {
              this.triggerAlert(err.error.errorMessage, "danger");
            } else {
              this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger");
            }
            this.ngOnInit();
          }
        );
      } else {
        this.impType = "update";
        this.importService.updateInventory(this.myFile, this.companyId, this.email).subscribe(
          () => { this.loading = false; this.triggerAlert("Inventory File Successfully Updated", "success"); },
          (err) => { this.loading = false; this.ngOnInit(); this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger"); }
        );
      }
    } else if (this.importForm.controls['module'].value === "customer") {
      this.currImport = "customer";
      if (this.importForm.controls['importType'].value === "add") {
        this.impType = "add";
        formData.append('columnMappings', jsonString);
        formData.append('file', formData.get('file'));
        this.myFile = formData;
        this.importService.addCustomer(this.myFile, this.companyId, this.email, this.columnMappings).subscribe(
          () => { this.loading = false; this.triggerAlert("Customer File Successfully Uploaded", "success"); },
          (err) => {
            this.loading = false;
            if (err.error.errorMessage?.startsWith("Upload Limit Exceeded")) {
              this.triggerAlert(err.error.errorMessage, "danger");
            } else if (err.error.errorMessage === "Mandatory Column Name Is Missing in Mapping") {
              this.triggerAlert("Failed!! " + err.error.errorMessage, "danger");
            } else {
              this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger");
            }
            this.ngOnInit();
          }
        );
      } else {
        this.impType = "update";
        formData.append('columnMappings', jsonString);
        formData.append('file', formData.get('file'));
        this.myFile = formData;
        this.importService.updateCustomer(this.myFile, this.companyId, this.email).subscribe(
          () => { this.loading = false; this.triggerAlert("Customer File Successfully Updated", "success"); },
          (err) => { this.loading = false; this.ngOnInit(); this.triggerAlert("Failed!! Please check file again and map all fields correctly", "danger"); }
        );
      }
    }
  }

  // ─── Misc ─────────────────────────────────────────────────────────────────────

  dropDown(event: any) {
    this.selectedModule = event.value;
    this.currImport = event.value;
    this.selectedMappingName = '';
    this.previewMapping = [];
    this.useSavedMapping = false;
    this.columnMappings = new Map();
  }

  exportData() {
    if (this.selectedModule === "asset") this.assetService.exportexcel();
  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => { this.showAlert = false; }, 5000);
  }

  update(key: String, value: any) {
    this.columnMappings.set(key, value.target.value);
  }

  updateType(data: string) {
    this.impType = data;
    this.selectedMappingName = '';
    this.previewMapping = [];
    this.useSavedMapping = false;
    this.columnMappings = new Map();
    if (data === "add") {
      this.assetDatabaseColumns = this.assetDatabaseColumnsToAdd;
      this.inventoryDatabaseColumns = this.inventoryDatabaseColumnsToAdd;
      this.customerDatabaseColumns = this.customerDatabaseColumnsToAdd;
      this.workorderDatabaseColumns = this.workorderDatabaseColumnsToAdd;
    } else {
      this.assetDatabaseColumns = this.assetDatabaseColumnsToUpdate;
      this.inventoryDatabaseColumns = this.inventoryDatabaseColumnsToUpdate;
      this.customerDatabaseColumns = this.customerDatabaseColumnsToUpdate;
      this.workorderDatabaseColumns = this.workorderDatabaseColumnsToUpdate;
    }
  }

  exportModule(event: any) { this.currExportModuel = event.value; }

  exportModuleData() {
    if (this.currExportModuel === "asset") {
      this.importService.downloadAllAssets(this.companyId).subscribe((data: Blob) => {
        saveAs(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `assets_${this.companyId}.xlsx`);
      });
    } else if (this.currExportModuel === "customer") {
      this.importService.downloadAllCustomer(this.companyId).subscribe((data: Blob) => {
        saveAs(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `customer_${this.companyId}.xlsx`);
      });
    }
  }

  exportTemplate(event: any) { this.currExportTemplate = event.value; }

  exportTemplateData() {
    if (this.currExportTemplate === "asset") {
      this.importService.downloadAssetTemplate(this.companyId).subscribe((data: Blob) => {
        saveAs(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `asset_template_${this.companyId}.xlsx`);
      });
    }
    if (this.currExportTemplate === "customer") {
      this.importService.downloadCustomerTemplate(this.companyId).subscribe((data: Blob) => {
        saveAs(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `customer_template_${this.companyId}.csv`);
      });
    }
  }
}