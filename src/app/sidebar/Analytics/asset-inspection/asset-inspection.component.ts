import { Component } from '@angular/core';
interface InspectionData {
  date: string;
  count: number;
}

interface InspectionType {
  name: string;
  count: number;
}
@Component({
  selector: 'app-asset-inspection',

  templateUrl: './asset-inspection.component.html',
  styleUrl: './asset-inspection.component.css'
})


export class AssetInspectionComponent {
 totalAssets = 1;
  totalInspections = 2;
  totalRecords = 8;
  leadInspector = 'John';
  inspectorCount = 5;

  statusData = {
    normal: 6,
    good: 2,
    z20x: 2,
    clean: 1
  };

  inspectionTrend: InspectionData[] = [];
  inspectionTypes: InspectionType[] = [
    { name: 'Check Cooling System', count: 8 },
    { name: 'Inspect Filters', count: 3 },
    { name: 'Test Voltage', count: 2 },
    { name: 'Check Battery', count: 1 },
    { name: 'Check Oil Level', count: 1 }
  ];

  ngOnInit() {
    this.generateTrendData();
  }

  generateTrendData() {
    const data = [
      { date: '11/16', count: 2 },
      { date: '11/17', count: 3 },
      { date: '11/18', count: 4 },
      { date: '11/19', count: 5 },
      { date: '11/20', count: 10 }
    ];
    this.inspectionTrend = data;
  }

  getMaxCount(): number {
    return Math.max(...this.inspectionTypes.map(t => t.count));
  }

  getBarWidth(count: number): number {
    return (count / this.getMaxCount()) * 100;
  }

  exportExcel() {
    console.log('Exporting to Excel...');
  }

  getTotalStatus(): number {
    return this.statusData.normal + this.statusData.good + 
           this.statusData.z20x + this.statusData.clean;
  }

  getStatusPercentage(value: number): number {
    return (value / this.getTotalStatus()) * 100;
  }

  getStatusOffset(status: string): number {
    const total = this.getTotalStatus();
    let offset = 0;
    
    if (status === 'good') offset = this.statusData.normal;
    else if (status === 'z20x') offset = this.statusData.normal + this.statusData.good;
    else if (status === 'clean') offset = this.statusData.normal + this.statusData.good + this.statusData.z20x;
    
    return (offset / total) * 100;
  }
}
