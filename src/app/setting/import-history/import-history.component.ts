import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ImportHistoryService } from './import-history.service';
import { PageEvent } from '@angular/material/paginator';
import * as saveAs from 'file-saver';

interface ImportRecord {
  id: string;
  fileName: string;
  date: Date;
  status: string;
  complete: number;
  message: string;
  recordType: string;
  executedBy: string;
  hasErrorReport?: boolean;
  errorReportFileName?: string;
}

@Component({
  selector: 'app-import-history',
  templateUrl: './import-history.component.html',
  styleUrls: ['./import-history.component.css']
})
export class ImportHistoryComponent implements OnDestroy {
  importHistory: MatTableDataSource<ImportRecord>;
  importHistoryWithoutFilter: MatTableDataSource<ImportRecord>;
  displayedColumns: string[] = ['fileName', 'date', 'recordType', 'status', 'complete', 'message', 'executedBy', 'actions'];
  selectedRecord: ImportRecord | null = null;
  selectedRecordTitle: string = '';
  selectedRecordDetails: string = '';
  companyId!: any;

  pageSize: number = 10;
  totalLength: number = 0;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  dateFilterStartDate!: Date | null;
  dateFilterEndDate!: Date | null;

  loading: boolean = true;
  downloadingId: string | null = null;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private importHistoryService: ImportHistoryService) {
    this.importHistory = new MatTableDataSource<ImportRecord>([]);
    this.importHistoryWithoutFilter = new MatTableDataSource<ImportRecord>([]);
    this.companyId = localStorage.getItem('companyId');
  }

  ngOnInit(): void {
    this.dateFilterEndDate = null;
    this.dateFilterStartDate = null;
    this.loadImportHistory();
  }

  ngOnDestroy(): void {
    this.clearPollTimer();
  }

  ngAfterViewInit() {
    this.importHistory.sort = this.sort;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadImportHistory();
  }

  loadImportHistory(): void {
    this.loading = true;
    this.importHistoryService.getAllImportHistory(
      this.companyId, this.pageIndex, this.pageSize, this.dateFilterStartDate, this.dateFilterEndDate
    ).subscribe({
      next: (data) => {
        this.importHistory.data = data.content;
        this.importHistoryWithoutFilter.data = data.content;
        this.totalLength = data.totalElements;
        this.loading = false;
        this.schedulePollIfNeeded(data.content);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  schedulePollIfNeeded(records: ImportRecord[]): void {
    this.clearPollTimer();
    const hasInProgress = records?.some(r => r.status === 'In-Progress');
    if (hasInProgress) {
      this.pollTimer = setTimeout(() => this.loadImportHistory(), 4000);
    }
  }

  clearPollTimer(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  downloadErrorReport(record: ImportRecord): void {
    if (!record.hasErrorReport || !record.id) {
      return;
    }
    this.downloadingId = record.id;
    this.importHistoryService.downloadImportErrorReport(this.companyId, record.id).subscribe({
      next: (blob) => {
        const fileName = record.errorReportFileName || 'CustomerImportErrors.xlsx';
        saveAs(blob, fileName);
        this.downloadingId = null;
      },
      error: () => {
        this.downloadingId = null;
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getCompletePercent(record: ImportRecord): number {
    const value = Number(record.complete);
    return isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
  }

  refresh() {
    this.ngOnInit();
  }

  find(data: any): void {
    const searchTerm = data.target.value.toLowerCase().trim();

    if (searchTerm === '') {
      this.loadImportHistory();
    } else {
      this.importHistory.data = this.importHistoryWithoutFilter.data.filter(record =>
        record.fileName.toLowerCase().includes(searchTerm) ||
        record.recordType.toLowerCase().includes(searchTerm) ||
        record.status.toLowerCase().includes(searchTerm) ||
        record.date.toString().toLowerCase().includes(searchTerm) ||
        (record.complete == searchTerm) ||
        record.message.toLowerCase().includes(searchTerm) ||
        record.executedBy.toLowerCase().includes(searchTerm)
      );
    }
  }

  setStartDate(event: any) {
    this.dateFilterStartDate = event.target.value;
  }

  setEndDate(event: any) {
    this.dateFilterEndDate = event.target.value;
  }

  applyDateFilter() {
    this.loadImportHistory();
  }

  clearDateFilter() {
    this.dateFilterStartDate = null;
    this.dateFilterEndDate = null;
    this.loadImportHistory();
  }
}
