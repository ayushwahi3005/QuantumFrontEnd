import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetInsightsService } from './asset-insights.service';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResult } from './paginationResult';
interface AssetRecord {
  assetId: string;
  assetName: string;
  customerId: string;
  customerName: string;
  // action: 'Check In' | 'Check Out' | 'Maintenance';
    action: 'Checked In' | 'Checked Out';
  date: string;
  time: string;
  location: string;
  username: string;
}

@Component({
  selector: 'app-asset-insights',
  templateUrl: './asset-insights.component.html',
  styleUrl: './asset-insights.component.css'
})
export class AssetInsightsComponent {

   records!: AssetRecord[]
  companyId!: string;

  constructor(private assetInsightsService:AssetInsightsService) {}

  filteredRecords: AssetRecord[] = [];
  searchTerm: string = '';
  selectedAction: string = '';
  lastUpdated: string = '11/16/2025 at 6:08:00 PM';
    pageSize: number = 50;
  totalLength: number = 0;
  pageEvent!: PageEvent;
  pageIndex: number = 0;
  paginationResult!: PaginationResult;
  checkInCount!: number;
  checkOutCount!: number
  distinctAssetsCount!:number;
  // get totalRecords(): number {
  //   return this.records?.length;
  // }

  // get checkInCount(): number {
  //   return this.records?.filter(r => r.action === 'Checked In').length;
  // }

  // get checkOutCount(): number {
  //   return this.records?.filter(r => r.action === 'Checked Out').length;
  // }

  // get maintenanceCount(): number {
  //   return this.records.filter(r => r.action === 'Maintenance').length;
  // }

  ngOnInit() {
    // this.filteredRecords = [...this.records];
    this.companyId = localStorage.getItem('companyId') || '';
    this.advanceFilterFunc();
    
  }

  filterRecords() {
    this.filteredRecords = this.records.filter(record => {
      const matchesSearch = !this.searchTerm || 
        // record.assetId?.includes(this.searchTerm) ||
        record.assetName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.location?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.username?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesAction = !this.selectedAction || record.action === this.selectedAction;
     
      return matchesSearch && matchesAction;
    });
    //  console.log('Filtering Record:', this.filteredRecords);
  }

  sortByDate() {
    this.filteredRecords.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getActionClass(action: string): string {
    console.log('Action:', action);
    return action.toLowerCase().replace(' ', '-');
  }

  exportToExcel() {
    // Create CSV content
    const headers = ['ASSET ID', 'ASSET NAME', 'CUSTOMER ID', 'CUSTOMER NAME', 'ACTION', 'DATE', 'TIME', 'LOCATION', 'USERNAME'];
    const csvContent = [
      headers.join(','),
      ...this.filteredRecords.map(record => 
        [record.assetId, record.assetName, record.customerId, record.customerName, 
         record.action, record.date, record.time, record.location, record.username].join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'asset-reports.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
   advanceFilterFunc() {
    // this.loading = true;

    // console.log(this.filterForm.value)
    // this.assetService.advanceFilter(this.filterForm.value, this.pageIndex, this.pageSize, this.sortedBy, this.searchData, this.asc).subscribe((data) => {
    //   console.log("this.searchData" + this.searchData)
    //   console.log("Loading->" + this.loading)
    //   console.log(data);
    //   this.assetListWithExtraFields = [];
    //   this.paginationResult = data;
    //   if (this.paginationResult.data.length == 0 && this.pageIndex != 0) {
    //     this.pageIndex = 0;
    //     localStorage.setItem('assetPageInd', this.pageIndex.toString());
    //     this.advanceFilterFunc();
    //   }
    //   this.totalLength = this.paginationResult.totalRecords;
    //   this.assets = this.paginationResult.data;
    //   const jsonList: string[] = this.paginationResult.data;
    //   jsonList.forEach((workorder) => {
    //     const jsonObject: any = JSON.parse(workorder);
    //     console.log(typeof (jsonObject))
    //     this.assetListWithExtraFields.push(jsonObject)
    //   });
    //   this.assetListWithExtraFieldsWithoutFilter = this.assetListWithExtraFields;
    //   console.log(this.assetListWithExtraFields);
    //   // this.loading=false;
    //   // console.log("Loading->"+this.loading)
    // },
    //   (err) => {
    //     console.log(err);
    //     this.loading = false;
    //   },
    //   () => {
    //     // this.selectedCustomer=null
    //     // this.selectedLocation=null;
    //     this.searchedAssets = this.assets;
    //     // console.log("Loading->"+this.loading)
    //     this.loading = false;
    //     console.log("Loading->" + this.loading)
    //   })
    this.assetInsightsService.getCheckinOutData(this.companyId,this.pageIndex, this.pageSize).subscribe(data => {
      console.log('Check-in/out data:', data);
      
      this.paginationResult = data as PaginationResult;
      if (this.paginationResult.data.length == 0 && this.pageIndex != 0) {
        this.pageIndex = 0;
        this.advanceFilterFunc();
      }
      this.totalLength = this.paginationResult.totalRecords;
      this.checkInCount = this.paginationResult.totalCheckIn;
      this.checkOutCount = this.paginationResult.totalCheckOut;
      this.records = this.paginationResult.data  as AssetRecord[];
      this.filteredRecords = this.paginationResult.data as AssetRecord[];

      this.distinctAssetsCount = new Set(
  this.filteredRecords.map(r => r.assetId)
).size;

      //  this.records = this.paginationResult.data.map((record: string) => JSON.parse(record) as AssetRecord);
      // this.filteredRecords = this.paginationResult.data.map((record: string) => JSON.parse(record) as AssetRecord);

      console.log(this.records);
      // You can process and assign the data to this.records here
    });
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

}
