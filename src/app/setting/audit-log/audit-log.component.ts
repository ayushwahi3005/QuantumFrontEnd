import { Component, OnInit } from '@angular/core';
import { AuditLogService } from './audit-log.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  auditLogs: any[] = [];
  modules: string[] = [];
  companyId: any;
  filterForm!: FormGroup;
  
  currentPage: number = 0;
  pageSize: number = 20;
  totalRecords: number = 0;
  isLoading: boolean = false;
  selectedEntity: any = null;
  showEntityHistory: boolean = false;
  entityHistoryData: any[] = [];

  sortDirection: string = 'DESC';
  searchText: string = '';
  filteredLogs: any[] = [];

  actions: string[] = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'IMPORT', 'LOGIN', 'LOGOUT', 'ACTIVATE', 'DEACTIVATE'];

  constructor(private auditLogService: AuditLogService, private fb: FormBuilder) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    console.log('AuditLogComponent initialized', {companyId: this.companyId});
    this.initializeForm();
    this.loadModules();
    this.loadAuditLogs();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      module: [''],
      action: [''],
      performedByEmail: [''],
      entityId: [''],
      fromTimestamp: [''],
      toTimestamp: [''],
      sortDirection: [this.sortDirection]
    });
  }

  loadModules() {
    this.auditLogService.getAvailableModules().subscribe(
      (data: string[]) => {
        this.modules = data;
      },
      (error) => {
        console.error('Error loading modules:', error);
      }
    );
  }

  loadAuditLogs() {
    this.isLoading = true;
    const filters = {
      module: this.filterForm.get('module')?.value || null,
      action: this.filterForm.get('action')?.value || null,
      performedByEmail: this.filterForm.get('performedByEmail')?.value || null,
      entityId: this.filterForm.get('entityId')?.value || null,
      fromTimestamp: this.filterForm.get('fromTimestamp')?.value || null,
      toTimestamp: this.filterForm.get('toTimestamp')?.value || null,
      sortDirection: this.filterForm.get('sortDirection')?.value || 'DESC',
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.auditLogService.getAuditLogs(this.companyId, filters).subscribe(
      (response: any) => {
        this.auditLogs = response.data || [];
        this.totalRecords = response.totalRecords || 0;
        this.applySearch();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading audit logs:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadAuditLogs();
  }

  resetFilters() {
    this.filterForm.reset({
      sortDirection: 'DESC'
    });
    this.sortDirection = 'DESC';
    this.searchText = '';
    this.currentPage = 0;
    this.loadAuditLogs();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'DESC' ? 'ASC' : 'DESC';
    this.filterForm.patchValue({ sortDirection: this.sortDirection });
    this.applyFilters();
  }

  applySearch() {
    if (!this.searchText.trim()) {
      this.filteredLogs = this.auditLogs;
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredLogs = this.auditLogs.filter(log =>
        log.entityName?.toLowerCase().includes(searchLower) ||
        log.performedByEmail?.toLowerCase().includes(searchLower) ||
        log.performedByName?.toLowerCase().includes(searchLower) ||
        log.description?.toLowerCase().includes(searchLower)
      );
    }
  }

  viewEntityHistory(log: any) {
    this.isLoading = true;
    this.auditLogService.getEntityHistory(this.companyId, log.entityId).subscribe(
      (data: any[]) => {
        this.entityHistoryData = data;
        this.selectedEntity = log;
        this.showEntityHistory = true;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading entity history:', error);
        this.isLoading = false;
      }
    );
  }

  closeEntityHistory() {
    this.showEntityHistory = false;
    this.selectedEntity = null;
    this.entityHistoryData = [];
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalRecords) {
      this.currentPage++;
      this.loadAuditLogs();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAuditLogs();
    }
  }

  getChangesBadgeClass(action: string): string {
    switch (action) {
      case 'CREATE':
        return 'badge-success';
      case 'UPDATE':
        return 'badge-info';
      case 'DELETE':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getChangesIcon(action: string): string {
    switch (action) {
      case 'CREATE':
        return 'bi bi-plus-circle';
      case 'UPDATE':
        return 'bi bi-pencil-square';
      case 'DELETE':
        return 'bi bi-trash';
      default:
        return 'bi bi-info-circle';
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPaginationInfo(): string {
    const startRecord = this.currentPage * this.pageSize + 1;
    const endRecord = Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
    return `${startRecord} - ${endRecord} of ${this.totalRecords}`;
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}
