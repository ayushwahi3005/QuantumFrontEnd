import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetInsightsService } from './asset-insights.service';
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

  get totalRecords(): number {
    return this.records.length;
  }

  get checkInCount(): number {
    return this.records.filter(r => r.action === 'Checked In').length;
  }

  get checkOutCount(): number {
    return this.records.filter(r => r.action === 'Checked Out').length;
  }

  // get maintenanceCount(): number {
  //   return this.records.filter(r => r.action === 'Maintenance').length;
  // }

  ngOnInit() {
    // this.filteredRecords = [...this.records];
    this.companyId = localStorage.getItem('companyId') || '';
    this.assetInsightsService.getCheckinOutData(this.companyId).subscribe(data => {
      console.log('Check-in/out data:', data);
      this.records = data as AssetRecord[];
      this.filteredRecords = data as AssetRecord[];
      // You can process and assign the data to this.records here
    });
  }

  filterRecords() {
    this.filteredRecords = this.records.filter(record => {
      const matchesSearch = !this.searchTerm || 
        record.assetId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.assetName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.username.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesAction = !this.selectedAction || record.action === this.selectedAction;

      return matchesSearch && matchesAction;
    });
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

}
