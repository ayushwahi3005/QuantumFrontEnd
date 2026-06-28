import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AssetDetailsService } from '../asset-details/asset-details.service';
import { InspectionInstance } from '../asset-details/inspectionInstance';
import { AssetsService } from '../assets/assets.service';
import { InspectionResponse, InspectionsService } from './inspections.service';

interface StatusCount {
  status: string;
  count: number;
}
interface LocationBinOption {
  label: string;
  value: string;
  type: 'location' | 'bin';
  id: string;
}

interface PerformerCount {
  performedBy: string;
  count: number;
}

interface InspectionDetail {
  inspectionInstance: any;
  customerId: string;
  assetName: string;
  assetCategory: string;
  customerName: string;
}

interface FilterCriteria {
  customerId?: string;
  customerCategory?: string;
  assetId?: string;
  assetName?: string;
  assetCustomer?: string;
  serialNumber?: string;
  assetCategory?: string;
  assetLocation?: string;
  inspectionName?: string;
  status?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  performedBy?: string;
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortDirection: string;
}

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.component.html',
  styleUrl: './inspections.component.css'
})
export class InspectionsComponent implements OnInit {
  @ViewChild('addInspectionCloseBtn') addInspectionCloseBtn?: ElementRef;

  

  Math = Math;
  companyId!: any;
  username = '';

  statusCounts: StatusCount[] = [];
  totalInspections: number = 0;
  selectedTab: string = 'ALL';

  performerCounts: PerformerCount[] = [];

  inspections: InspectionDetail[] = [];
  totalRecords: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  sortField: string = 'createdAt';
  sortDirection: string = 'DESC';

  showFilters: boolean = false;
  searchText: string = '';

    createdRangeStart: Date | null = null;
  createdRangeEnd: Date | null = null;
  dueRangeStart: Date | null = null;
  dueRangeEnd: Date | null = null;
  showCreatedRangePicker = false;
  showDueRangePicker = false;

  filterCriteria: FilterCriteria = {
    pageNumber: 0,
    pageSize: 10,
    sortField: 'createdAt',
    sortDirection: 'DESC'
  };

  templates: string[] = [''];
  performers: string[] = [''];
  assetCategories: any[] = [];
  assetLocations: any[] = [];
   locationBinOptions: LocationBinOption[] = []; 
  customerCategories: string[] = [''];
  customers: string[] = [''];

  // Add inspection modal
  assetList: any[] = [];
  selectedAsset: any = null;
  selectedAssetCategory = '';
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  inspectionMap = new Map<string, any>();
  dropdownSettings: IDropdownSettings = {};
  inspectionInstance: InspectionInstance = this.createEmptyInspectionInstance();
  stepObject: any[] = [];
  isCreatingInspection = false;
  isLoadingTemplates = false;
  showAlert = false;
  alertMessage = '';
  alertType = 'success';
  currUserRole: string = localStorage.getItem('role') || '';
  constructor(
    private inspectionsService: InspectionsService,
    private assetDetailsService: AssetDetailsService,
    private assetsService: AssetsService,
  ) {}

  ngOnInit(): void {
    this.companyId = localStorage.getItem('companyId');
    this.username = localStorage.getItem('name') || '';
    this.selectedTab = 'ALL';
    this.currUserRole= localStorage.getItem('role') || '';

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.loadStatusCounts();
    this.loadPerformerCounts();
    this.loadDetailedInspections();
    this.getAllInspectionTemplates();
    this.getAssetCategory();
    this.fetchAllCompanyCustomerCategories();
    this.fetchAllCompanyCustomers();
    this.fetchAllLocationWithBins();
  }
  private flattenLocationBinData(locations: any[]): LocationBinOption[] {
    const options: LocationBinOption[] = [];

    locations.forEach((location) => {
      // Add location as an option
      options.push({
        label: location.name,
        value: `location:${location.id}`,
        type: 'location',
        id: location.id
      });

      // Add bins under this location as options
      if (location.bins && location.bins.length > 0) {
        location.bins.forEach((bin: any) => {
          options.push({
            label: `  → ${location.name} / ${bin.binNumber}`, // Indent bins
            value: `bin:${bin.id}`,
            type: 'bin',
            id: bin.id
          });
        });
      }
    });

    return options;
  }

  // Add this method to your InspectionsComponent class

private getLocationBinDisplayName(value: string): string {
  if (!value) return '';
  
  // Check if it's a location or bin format
  if (value.startsWith('location:')) {
    const locationId = value.replace('location:', '');
    const location = this.assetLocations.find(loc => loc.id === locationId);
    return location ? location.name : value;
  } else if (value.startsWith('bin:')) {
    const binId = value.replace('bin:', '');
    // Search through all locations to find the bin
    for (const location of this.assetLocations) {
      if (location.bins) {
        const bin = location.bins.find((b: any) => b.id === binId);
        if (bin) {
          return `${location.name} / ${bin.binNumber}`;
        }
      }
    }
    return value;
  }
  
  return value;
}

 fetchAllLocationWithBins(): void {
    this.inspectionsService.getAllLocationWithBin(this.companyId).subscribe({
      next: (data) => {
        this.assetLocations = data || [];
        this.locationBinOptions = this.flattenLocationBinData(data);
        console.log('Loaded asset locations with bins:', this.assetLocations);
        console.log('Flattened options:', this.locationBinOptions);
      },
      error: (error) => {
        console.error('Error loading asset locations with bins:', error);
        this.triggerAlert('Failed to load asset locations with bins', 'danger');
      },
    });
  }
  
  fetchAllCompanyCustomers(): void {
    this.inspectionsService.getCompanyCustomerList(this.companyId).subscribe({
      next: (data) => {
        this.customers = data || [];
        console.log('Loaded customers:', this.customers);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.triggerAlert('Failed to load customers', 'danger');
      },
    });
  }
  fetchAllCompanyCustomerCategories(): void {
    this.inspectionsService.getCustomerCategory(this.companyId).subscribe({
      next: (data) => {
        this.customerCategories = data || [];
        console.log('Loaded customer categories:', this.customerCategories);
      },
      error: (error) => {
        console.error('Error loading customer categories:', error);
        this.triggerAlert('Failed to load customer categories', 'danger');
      },
    });
  }
  getAllInspectionTemplates():void{
    this.inspectionsService.getAllAssetInspection(this.companyId).subscribe({
      next: (data) => {
        this.templates = data || [];
        console.log('Loaded inspection templates:', this.templates);
      },
      error: (error) => {
        console.error('Error loading inspection templates:', error);
        this.triggerAlert('Failed to load inspection templates', 'danger');
      },
    });
  }
   getAssetCategory():void{
    this.inspectionsService.getAssetCategory(this.companyId).subscribe({
      next: (data) => {
        this.assetCategories = data || [];
        console.log('Loaded asset categories:', this.assetCategories);
      },
      error: (error) => {
        console.error('Error loading asset categories:', error);
        this.triggerAlert('Failed to load asset categories', 'danger');
      },
    });
  }

  createEmptyInspectionInstance(): InspectionInstance {
    return {
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
  }

  assetSearchFn = (term: string, item: any): boolean => {
    const search = term.toLowerCase();
    return (
      item.name?.toLowerCase().includes(search) ||
      item.serialNumber?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search)
    );
  };

  openAddInspectionModal(): void {
    this.resetAddInspectionForm();
    if (this.assetList.length === 0) {
      this.loadAssets();
    }
  }

  loadAssets(): void {
    this.inspectionsService.getActiveAssetList(this.companyId).subscribe({
      next: (data) => {
        this.assetList = data || [];
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.triggerAlert('Failed to load assets', 'danger');
      },
    });
  }

  onAssetSelected(): void {
    this.selectedItems = [];
    this.stepObject = [];
    this.dropdownList = [];
    this.inspectionMap.clear();

    if (!this.selectedAsset) {
      this.selectedAssetCategory = '';
      return;
    }

    this.selectedAssetCategory = this.selectedAsset.category || '';
    console.log('Selected asset category:', this.selectedAssetCategory);
    this.inspectionInstance.assetId = this.selectedAsset.id;
    this.inspectionInstance.companyId = this.companyId;
    this.loadTemplatesForCategory(this.selectedAssetCategory);
  }

  loadTemplatesForCategory(category: string): void {
    if (!category) {
      this.triggerAlert('Selected asset has no category', 'warning');
      return;
    }

    this.isLoadingTemplates = true;
    this.assetDetailsService.getAllAssetInspection(this.companyId, category).subscribe({
      next: (data) => {
        this.dropdownList = data || [];
        this.dropdownList.forEach((template: any) => {
          this.inspectionMap.set(template.id, {
            name: template.name,
            stepsList: template.steps,
          });
        });
        this.isLoadingTemplates = false;
      },
      error: (error) => {
        console.error('Error loading inspection templates:', error);
        this.dropdownList = [];
        this.isLoadingTemplates = false;
        this.triggerAlert('Failed to load inspection templates for this category', 'danger');
      },
    });
  }

  onItemSelect(): void {
    this.updateStepList();
  }

  onSelectAll(items: any[]): void {
    this.selectedItems = items;
    this.updateStepList();
  }

  onItemDeSelect(): void {
    this.updateStepList();
  }

  updateStepList(): void {
    if (!this.selectedAsset) {
      return;
    }

    this.inspectionInstance.assetId = this.selectedAsset.id;
    this.inspectionInstance.companyId = this.companyId;
    this.inspectionInstance.assetCategoryInspectionName = '';
    this.selectedItems.forEach((item: any) => {
      this.inspectionInstance.assetCategoryInspectionName += item.name + ' ';
    });

    const steps: any[] = [];
    const stepObj: any[] = [];

    this.selectedItems.forEach((item: any) => {
      const inspectionMapValue = this.inspectionMap.get(item.id);
      if (inspectionMapValue) {
        const stepList = inspectionMapValue.stepsList;
        const myCurrStep: any[] = [];

        stepList.forEach((step: any) => {
          const obj = {
            name: step.name,
            inspectionStepId: null,
            value: step.type === 'CHECKBOX' ? false : '',
            type: step.type,
          };
          steps.push(obj);
          myCurrStep.push(obj);
        });

        stepObj.push({
          inspectionName: item.name,
          stepValues: myCurrStep,
        });
      }
    });

    this.stepObject = stepObj;
    this.inspectionInstance.stepValues = steps;
    this.inspectionInstance.inspectionTemplates = stepObj;
  }

  resetAddInspectionForm(): void {
    this.selectedAsset = null;
    this.selectedAssetCategory = '';
    this.selectedItems = [];
    this.dropdownList = [];
    this.stepObject = [];
    this.inspectionMap.clear();
    this.isCreatingInspection = false;
    this.isLoadingTemplates = false;
    this.inspectionInstance = this.createEmptyInspectionInstance();
    this.inspectionInstance.actionPerformedBy = this.username;
    this.inspectionInstance.companyId = this.companyId;
  }

 createInspection(): void {
  if (!this.selectedAsset) {
    this.triggerAlert('Please select an asset', 'warning');
    return;
  }

  if (this.selectedItems.length === 0) {
    this.triggerAlert('Please select at least one inspection template', 'warning');
    return;
  }

  // ❌ REMOVE: this.updateStepList();  ← This was wiping all user-entered values!

  // Only refresh metadata, not the step values
  this.inspectionInstance.assetId = this.selectedAsset.id;
  this.inspectionInstance.companyId = this.companyId;
  this.inspectionInstance.assetCategoryInspectionName = this.selectedItems
    .map((item: any) => item.name)
    .join(' ');
  this.inspectionInstance.selectedItemList = this.selectedItems;
  this.inspectionInstance.inspectionTemplates = this.stepObject; // already has user values

  const currDateTime = new Date();
  this.inspectionInstance.createdBy = this.username;
  this.inspectionInstance.createdAt = currDateTime;
  this.inspectionInstance.updatedAt = currDateTime;
  this.inspectionInstance.status = 'PENDING';

  if (!this.inspectionInstance.actionPerformedBy) {
    this.inspectionInstance.actionPerformedBy = this.username;
  }

  this.isCreatingInspection = true;
  console.log('Creating inspection:', this.inspectionInstance);

  this.assetDetailsService.addAssetInspection(this.inspectionInstance).subscribe({
    next: () => {
      this.triggerAlert('Inspection created successfully', 'success');
      this.closeAddInspectionModal();
      this.loadStatusCounts();
      this.loadPerformerCounts();
      this.loadDetailedInspections();
    },
    error: (err) => {
      const message =
        err.error?.error === 'TRIAL_EXPIRED'
          ? err.error.message
          : err.error?.errorMessage || 'Failed to create inspection';
      this.triggerAlert(message, 'danger');
      this.isCreatingInspection = false;
    },
    complete: () => {
      this.isCreatingInspection = false;
    },
  });
}

  closeAddInspectionModal(): void {
    this.addInspectionCloseBtn?.nativeElement?.click();
    this.resetAddInspectionForm();
  }

  triggerAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

  loadStatusCounts(): void {
    this.inspectionsService.loadStatusCounts(this.companyId).subscribe({
      next: (response) => {
        this.statusCounts = response.statusCounts || [];
        this.totalInspections = response.totalInspections || 0;
      },
      error: (error) => {
        console.error('Error loading status counts:', error);
        this.statusCounts = [];
      }
    });
  }

  loadPerformerCounts(): void {
    this.inspectionsService.loadPerformerCounts(this.companyId).subscribe({
      next: (response) => {
        this.performerCounts = response.performerCounts || [];
        this.populatePerformerFilter();
      },
      error: (error) => {
        console.error('Error loading performer counts:', error);
        this.performerCounts = [];
      }
    });
  }

  loadDetailedInspections(): void {
    const payload = this.buildFilterPayload();
    console.log('Loading detailed inspections with payload:', payload);

    this.inspectionsService.loadDetailedInspections(this.companyId, payload).subscribe({
      next: (response: InspectionResponse) => {
        this.inspections = response.data || [];
        console.log('Loaded detailed inspections:', this.inspections);
        this.totalRecords = response.totalRecords || 0;
        this.currentPage = response.currentPage || 0;
        this.totalPages = response.totalPages || 0;
      },
      error: (error) => {
        console.error('Error loading detailed inspections:', error);
        this.inspections = [];
        this.totalRecords = 0;
      }
    });
  }

  appliedFilters: { key: string, label: string, value: string }[] = [];

  openFilters(): void {
    this.syncDateRangesFromCriteria();
    this.showFilters = true;
  }

  closeFilters(): void {
    this.showFilters = false;
  }

  applyFilters(): void {
    this.syncDateRangesToCriteria();
    this.currentPage = 0;
    this.appliedFilters = this.activeFilters;
    this.closeDateRangePickers();
    this.loadDetailedInspections();
    this.closeFilters();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.currentPage = 0;
    this.loadDetailedInspections();
  }

  clearFilters(): void {
    this.filterCriteria = {
      pageNumber: 0,
      pageSize: 10,
      sortField: 'createdAt',
      sortDirection: 'DESC'
    };
    this.searchText = '';
    this.resetDateRangeUi();
    this.appliedFilters = [];
    this.currentPage = 0;
    this.closeDateRangePickers();
    this.loadDetailedInspections();
    this.closeFilters();
  }

  onSearch(): void {
    this.currentPage = 0;
    if (this.searchText.trim()) {
      this.filterCriteria.assetId = this.searchText;
    } else {
      delete this.filterCriteria.assetId;
    }
    this.appliedFilters = this.activeFilters; // Update chips on search
    this.loadDetailedInspections();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDetailedInspections();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadDetailedInspections();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadDetailedInspections();
    }
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortField = field;
      this.sortDirection = 'DESC';
    }
    this.currentPage = 0;
    this.loadDetailedInspections();
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'PENDING': '#FF9800',
      'COMPLETED': '#4CAF50',
      'ONGOING': '#2196F3',
      'CANCELLED': '#9E9E9E',
      'IN_PROGRESS': '#2196F3',
      'FAILED': '#F44336'
    };
    return colorMap[status?.toUpperCase()] || '#9E9E9E';
  }

  getStatusBadgeClass(status: string): string {
    const classMap: Record<string, string> = {
      'PENDING': 'status-pending',
      'COMPLETED': 'status-completed',
      'ONGOING': 'status-ongoing',
      'IN_PROGRESS': 'status-ongoing',
      'CANCELLED': 'status-default',
      'FAILED': 'status-failed'
    };
    return classMap[status?.toUpperCase()] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const iconMap: Record<string, string> = {
      'PENDING': '⏱️',
      'COMPLETED': '✓',
      'ONGOING': '◉',
      'IN_PROGRESS': '◉',
      'CANCELLED': '✗',
      'FAILED': '⚠️'
    };
    return iconMap[status?.toUpperCase()] || '●';
  }

  getStatusCardIcon(status: string): string {
    const svgMap: Record<string, string> = {
      'PENDING': 'clock',
      'COMPLETED': 'check',
      'ONGOING': 'refresh',
      'IN_PROGRESS': 'refresh',
      'CANCELLED': 'x',
      'FAILED': 'alert'
    };
    return svgMap[status?.toUpperCase()] || 'default';
  }

  getCardSubtitle(status: string): string {
    const subtitleMap: Record<string, string> = {
      'PENDING': 'Awaiting action',
      'COMPLETED': 'Finished inspections',
      'ONGOING': 'In progress now',
      'IN_PROGRESS': 'In progress now',
      'CANCELLED': 'Cancelled inspections',
      'FAILED': 'Failed inspections'
    };
    return subtitleMap[status?.toUpperCase()] || status?.toLowerCase();
  }

  populatePerformerFilter(): void {
    this.performers = [...this.performerCounts.map(p => p.performedBy)];
  }

  getDisplayStatus(status: string): string {
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getBarGradient(index: number): string {
    const gradients = [
      'linear-gradient(90deg, #FF9800, #FFC107)',
      'linear-gradient(90deg, #2196F3, #03A9F4)',
      'linear-gradient(90deg, #4CAF50, #8BC34A)',
      'linear-gradient(90deg, #9C27B0, #E91E63)',
      'linear-gradient(90deg, #F44336, #FF5722)',
      'linear-gradient(90deg, #009688, #4DB6AC)',
      'linear-gradient(90deg, #3F51B5, #7986CB)',
      'linear-gradient(90deg, #795548, #A1887F)'
    ];
    return gradients[index % gradients.length];
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.filterCriteria.status = tab === 'ALL' ? undefined : tab;
    this.applyFilters();
  }

 get activeFilters(): { key: string, label: string, value: string }[] {
    const filters: { key: string, label: string, value: string }[] = [];
    if (this.filterCriteria.inspectionName) filters.push({ key: 'inspectionName', label: 'Template', value: this.filterCriteria.inspectionName });
    if (this.filterCriteria.performedBy) filters.push({ key: 'performedBy', label: 'Performed By', value: this.filterCriteria.performedBy });
    if (this.filterCriteria.status) filters.push({ key: 'status', label: 'Status', value: this.filterCriteria.status });
    if (this.filterCriteria.assetCategory) filters.push({ key: 'assetCategory', label: 'Asset Category', value: this.filterCriteria.assetCategory });
    if (this.filterCriteria.assetName) filters.push({ key: 'assetName', label: 'Asset Name', value: this.filterCriteria.assetName });
    if (this.filterCriteria.assetCustomer) filters.push({ key: 'assetCustomer', label: 'Asset Customer', value: this.filterCriteria.assetCustomer });
    if (this.filterCriteria.serialNumber) filters.push({ key: 'serialNumber', label: 'Serial Number', value: this.filterCriteria.serialNumber });
    if (this.filterCriteria.assetId) filters.push({ key: 'assetId', label: 'Asset ID', value: this.filterCriteria.assetId });

    if (this.filterCriteria.assetLocation) {
      const displayName = this.getLocationBinDisplayName(this.filterCriteria.assetLocation);
      filters.push({ key: 'assetLocation', label: 'Location', value: displayName });
    }

    if (this.filterCriteria.customerCategory) filters.push({ key: 'customerCategory', label: 'Customer Category', value: this.filterCriteria.customerCategory });
    if (this.filterCriteria.customerId) {
      filters.push({
        key: 'customerId',
        label: 'Customer',
        value: this.getCustomerDisplayName(this.filterCriteria.customerId)
      });
    }

    // ✅ FIX: Convert string dates to Date objects for display
    if (this.filterCriteria.createdDateFrom || this.filterCriteria.createdDateTo) {
      const fromDate = this.filterCriteria.createdDateFrom ? new Date(this.filterCriteria.createdDateFrom) : null;
      const toDate = this.filterCriteria.createdDateTo ? new Date(this.filterCriteria.createdDateTo) : null;
      filters.push({
        key: 'createdDateRange',
        label: 'Created',
        value: this.formatDateRangeLabel(fromDate, toDate)
      });
    }

    // ✅ FIX: Convert string dates to Date objects for display
    if (this.filterCriteria.dueDateFrom || this.filterCriteria.dueDateTo) {
      const fromDate = this.filterCriteria.dueDateFrom ? new Date(this.filterCriteria.dueDateFrom) : null;
      const toDate = this.filterCriteria.dueDateTo ? new Date(this.filterCriteria.dueDateTo) : null;
      filters.push({
        key: 'dueDateRange',
        label: 'Due',
        value: this.formatDateRangeLabel(fromDate, toDate)
      });
    }

    return filters;
  }
  removeFilter(key: string): void {
    if (key === 'searchText') {
      this.searchText = '';
    } else if (key === 'createdDateRange') {
      delete this.filterCriteria.createdDateFrom;
      delete this.filterCriteria.createdDateTo;
      this.createdRangeStart = null;
      this.createdRangeEnd = null;
    } else if (key === 'dueDateRange') {
      delete this.filterCriteria.dueDateFrom;
      delete this.filterCriteria.dueDateTo;
      this.dueRangeStart = null;
      this.dueRangeEnd = null;
    } else {
      (this.filterCriteria as any)[key] = '';
      if (key === 'assetId') {
        this.searchText = '';
      }
    }

    this.appliedFilters = this.appliedFilters.filter(f => f.key !== key);
    this.currentPage = 0;
    this.loadDetailedInspections();
  }

  buildFilterPayload(): FilterCriteria {
    this.syncDateRangesToCriteria();

    const payload: FilterCriteria = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortDirection: this.sortDirection
    };

    const optionalFields: (keyof FilterCriteria)[] = [
      'customerId',
      'customerCategory',
      'assetId',
      'assetName',
      'assetCustomer',
      'serialNumber',
      'assetCategory',
      'assetLocation',
      'inspectionName',
      'status',
      'createdDateFrom',
      'createdDateTo',
      'dueDateFrom',
      'dueDateTo',
      'performedBy'
    ];

    optionalFields.forEach((field) => {
      const value = this.filterCriteria[field];
      if (value !== undefined && value !== null && value !== '') {
        (payload as any)[field] = value;
      }
    });

    return payload;
  }

  syncDateRangesToCriteria(): void {
    // ✅ Convert Date objects to ISO string format
    this.filterCriteria.createdDateFrom = this.createdRangeStart 
      ? this.formatDateToString(this.createdRangeStart) 
      : undefined;
    this.filterCriteria.createdDateTo = this.createdRangeEnd 
      ? this.formatDateToString(this.createdRangeEnd) 
      : undefined;
    this.filterCriteria.dueDateFrom = this.dueRangeStart 
      ? this.formatDateToString(this.dueRangeStart) 
      : undefined;
    this.filterCriteria.dueDateTo = this.dueRangeEnd 
      ? this.formatDateToString(this.dueRangeEnd) 
      : undefined;
  }

  syncDateRangesFromCriteria(): void {
    // ✅ Convert string dates back to Date objects
    this.createdRangeStart = this.filterCriteria.createdDateFrom 
      ? new Date(this.filterCriteria.createdDateFrom) 
      : null;
    this.createdRangeEnd = this.filterCriteria.createdDateTo 
      ? new Date(this.filterCriteria.createdDateTo) 
      : null;
    this.dueRangeStart = this.filterCriteria.dueDateFrom 
      ? new Date(this.filterCriteria.dueDateFrom) 
      : null;
    this.dueRangeEnd = this.filterCriteria.dueDateTo 
      ? new Date(this.filterCriteria.dueDateTo) 
      : null;
  }

  resetDateRangeUi(): void {
    this.createdRangeStart = null;
    this.createdRangeEnd = null;
    this.dueRangeStart = null;
    this.dueRangeEnd = null;
  }

  closeDateRangePickers(): void {
    this.showCreatedRangePicker = false;
    this.showDueRangePicker = false;
  }

  // ✅ NEW: Helper method to format Date to string
  private formatDateToString(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCreatedRangeLabel(): string {
    return this.formatDateRangeLabel(this.createdRangeStart, this.createdRangeEnd);
  }

  getDueRangeLabel(): string {
    return this.formatDateRangeLabel(this.dueRangeStart, this.dueRangeEnd);
  }

  // ✅ Updated to handle Date objects
  formatDateRangeLabel(from?: Date | null, to?: Date | null): string {
    if (!from && !to) {
      return '';
    }
    const start = from ? this.formatDisplayDate(from) : 'Any';
    const end = to ? this.formatDisplayDate(to) : 'Any';
    return `${start} – ${end}`;
  }

  // ✅ Updated to handle Date objects
  formatDisplayDate(value: Date | string): string {
    if (!value) {
      return '';
    }
    const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  clearCreatedRangePicker(event?: Event): void {
    event?.stopPropagation();
    this.createdRangeStart = null;
    this.createdRangeEnd = null;
    delete this.filterCriteria.createdDateFrom;
    delete this.filterCriteria.createdDateTo;
    this.showCreatedRangePicker = false;
  }

  clearDueRangePicker(event?: Event): void {
    event?.stopPropagation();
    this.dueRangeStart = null;
    this.dueRangeEnd = null;
    delete this.filterCriteria.dueDateFrom;
    delete this.filterCriteria.dueDateTo;
    this.showDueRangePicker = false;
  }

  applyCreatedRangePicker(): void {
    this.syncDateRangesToCriteria();
    this.showCreatedRangePicker = false;
  }

  applyDueRangePicker(): void {
    this.syncDateRangesToCriteria();
    this.showDueRangePicker = false;
  }
   private getCustomerDisplayName(customerId: string): string {
    const customer = (this.customers as any[]).find((item) => item?.id === customerId);
    return customer?.name || customerId;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDateRangePickers();
  }
}
