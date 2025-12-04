import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface AssetRecord {
  assetId: string;
  assetName: string;
  customerId: string;
  customerName: string;
  action: string;
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

  searchTerm: string = '';
  actionFilter: string = 'All Actions';
  
  assetData: AssetRecord[] = [
    {
      assetId: 'Asset1',
      assetName: 'Asset1',
      customerId: '6358',
      customerName: 'Harsh Nisar',
      action: 'Check In',
      date: '11/15/2025',
      time: '14:52',
      location: 'Ohio',
      username: '@harshnisar'
    },
    {
      assetId: 'Asset2',
      assetName: 'Asset2',
      customerId: '6359',
      customerName: 'John Smith',
      action: 'Check Out',
      date: '11/14/2025',
      time: '10:30',
      location: 'California',
      username: '@johnsmith'
    },
    {
      assetId: 'Asset3',
      assetName: 'Asset3',
      customerId: '6360',
      customerName: 'Sarah Johnson',
      action: 'Maintenance',
      date: '11/13/2025',
      time: '09:15',
      location: 'Texas',
      username: '@sarahjohnson'
    },
    {
      assetId: 'Asset4',
      assetName: 'Asset4',
      customerId: '6361',
      customerName: 'Mike Davis',
      action: 'Check In',
      date: '11/12/2025',
      time: '16:20',
      location: 'New York',
      username: '@mikedavis'
    }
  ];

  filteredData: AssetRecord[] = [];
  stats = {
    total: 0,
    checkIn: 0,
    checkOut: 0,
    maintenance: 0
  };

  ngOnInit(): void {
    this.calculateStats();
    this.filteredData = [...this.assetData];
  }

  calculateStats(): void {
    this.stats.total = this.assetData.length;
    this.stats.checkIn = this.assetData.filter(item => item.action === 'Check In').length;
    this.stats.checkOut = this.assetData.filter(item => item.action === 'Check Out').length;
    this.stats.maintenance = this.assetData.filter(item => item.action === 'Maintenance').length;
  }

  filterData(): void {
    this.filteredData = this.assetData.filter(item => {
      const matchesSearch = this.searchTerm === '' || 
        Object.values(item).some(val => 
          val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      const matchesAction = this.actionFilter === 'All Actions' || item.action === this.actionFilter;
      return matchesSearch && matchesAction;
    });
  }

  getActionClass(action: string): string {
    switch(action) {
      case 'Check In':
        return 'bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium';
      case 'Check Out':
        return 'bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-700 px-3 py-1 rounded text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium';
    }
  }

  exportToExcel(): void {
    console.log('Exporting to Excel...');
    alert('Export functionality would be implemented here');
  }

}
