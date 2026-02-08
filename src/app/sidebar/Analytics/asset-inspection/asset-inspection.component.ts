import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AssetInspectionService } from './asset-inspection.service';

interface InspectionData {
  date: string;
  count: number;
}
interface StatusDistributionData {
  name: string;
  count: number;
}

interface InspectionType {
  name: string;
  count: number;
}

interface userInspectionAnalytics {
  userId: string;
  userName: string;
  totalCompletedInspections: number;
}

@Component({
  selector: 'app-asset-inspection',
  templateUrl: './asset-inspection.component.html',
  styleUrl: './asset-inspection.component.css'
})
export class AssetInspectionComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
    @ViewChild('badgeRef') badgeRef!: ElementRef;
  chart: Chart | null = null;

  userInspectionAnalyticsData: userInspectionAnalytics[] = [];
  userInspectionAnalyticsDataNames: string[] = [];
  userInspectionAnalyticsDataValues: number[] = [];
  statusDistributionData: { [key: string]: number } = {};
  inspectionTypeCompletionData: any[][2] = [];
  leadInspector: any = '';
  startDate: string = '';
  endDate: string = '';
  extraInspectorNames: string[] = [];
  extraInspectorNamesVisible: boolean = false;
  inspectionDetails: any;
  totalAssets = 0;
  totalInspections = 0;
  totalRecords = 0;

  constructor(private assetInspectionService: AssetInspectionService) {}

  ngOnInit() {
    this.assetInspectionService.getUserInspection(localStorage.getItem('companyId')).subscribe((data: any) => {
      // console.log("Inspection Data", data);
      this.userInspectionAnalyticsData = data;
      this.userInspectionAnalyticsDataNames = this.userInspectionAnalyticsData.map(user => user.userName);
      this.userInspectionAnalyticsDataValues = this.userInspectionAnalyticsData.map(user => user.totalCompletedInspections);
      // console.log("Names:", this.userInspectionAnalyticsDataNames);
      // console.log("Values:", this.userInspectionAnalyticsDataValues);
      
      // Create chart after data is loaded
      if (this.chartCanvas) {
        this.createChart();
      }
    }, error => {
      console.log("Error in Inspection Data", error);
    });

     this.assetInspectionService.getStatusDistribution(localStorage.getItem('companyId')).subscribe((data: any) => {
      
      this.statusDistributionData = data;
      // console.log("Status Data", this.statusDistributionData);
      
      // Create chart after data is loaded
      if (this.chartCanvas) {
        this.createChart();
      }
    }, error => {
      console.log("Error in Inspection Data", error);
    });

    this.assetInspectionService.getInspectionTypeCompletion(localStorage.getItem('companyId')).subscribe((data: any) => {
      
      
      console.log("getInspectionTypeCompletion Data", data,typeof(data));
    Object.entries(data).forEach(([inspectionType, completionCount]) => {
      this.inspectionTypeCompletionData.push([inspectionType, completionCount]);
    });

      // console.log("inspectionTypeCompletionData", this.inspectionTypeCompletionData);
      
     
    }, error => {
      console.log("Error in getInspectionTypeCompletion Data", error);
    });
    this.assetInspectionService.getLeadInspector(localStorage.getItem('companyId')).subscribe((data: any) => {
      this.leadInspector = data;
      if (this.leadInspector) {
        Object.keys(this.leadInspector).forEach(name => {
          if (name !== this.inspectorName) {
            this.extraInspectorNames.push(name);
          }
        });
      }
      // this.extraInspectorNames=['Test User','Demo User','Sample User','Admin User','Inspector Gadget','QA Tester','Test User','Demo User','Sample User','Admin User','Inspector Gadget','QA Tester','Test User','Demo User','Sample User','Admin User','Inspector Gadget','QA Tester'];
      console.log("Lead Inspector Data", this.leadInspector);
     }, error => {
      console.log("Error in Lead Inspector", error);
    });
    this.assetInspectionService.getInspectionDetails(localStorage.getItem('companyId')).subscribe((data: any) => {
      this.inspectionDetails = data;
      this.totalAssets = this.inspectionDetails.totalAssetsInspected;
      this.totalInspections = this.inspectionDetails. completedInspections;
      this.totalRecords = this.inspectionDetails.totalInspections;

      console.log("Inspection Details Data", this.inspectionDetails);
    }, error => {
      console.log("Error in Inspection Details", error);
    });
      // console.log("inspectionTypeCompletionData", this.inspectionTypeCompletionData);
      
     
   
    this.generateTrendData();
  }

  ngAfterViewInit(): void {
    // Only create chart if data is already loaded
    if (this.userInspectionAnalyticsDataNames.length > 0) {
      this.createChart();
    }
  }





  inspectionTrend: InspectionData[] = [];
  inspectionTypes: InspectionType[] = [
    { name: 'Check Cooling System', count: 8 },
    { name: 'Inspect Filters', count: 3 },
    { name: 'Test Voltage', count: 2 },
    { name: 'Check Battery', count: 1 },
    { name: 'Check Oil Level', count: 1 }
  ];

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
    return Math.max(...this.inspectionTypeCompletionData.map((t: number[]) => t[1] as number));
  }

  getBarWidth(count: number): number {
    return (count / this.getMaxCount()) * 100;
  }

  exportExcel() {
    console.log('Exporting to Excel...');
  }

  // getTotalStatus(): number {
  //   return this.statusData.normal + this.statusData.good + 
  //          this.statusData.z20x + this.statusData.clean;
  // }

  // getStatusPercentage(value: number): number {
  //   return (value / this.getTotalStatus()) * 100;
  // }

  // getStatusOffset(status: string): number {
  //   const total = this.getTotalStatus();
  //   let offset = 0;
    
  //   if (status === 'good') offset = this.statusData.normal;
  //   else if (status === 'z20x') offset = this.statusData.normal + this.statusData.good;
  //   else if (status === 'clean') offset = this.statusData.normal + this.statusData.good + this.statusData.z20x;
    
  //   return (offset / total) * 100;
  // }

  createChart(): void {
  if (this.chart) {
    this.chart.destroy();
    this.chart = null;
  }

  const BAR_MIN_WIDTH = 30;  // minimum width per bar
  const MIN_CANVAS_WIDTH = 400;

  const canvas = this.chartCanvas.nativeElement;
  const numBars = this.userInspectionAnalyticsDataNames.length;

  // Calculate canvas width based on number of bars
  const calculatedWidth = Math.max(numBars * BAR_MIN_WIDTH, MIN_CANVAS_WIDTH);
  canvas.width = calculatedWidth;
  canvas.style.width = `${calculatedWidth}px`;
  canvas.height = 300;
  canvas.style.height = `300px`;

  const ctx = canvas.getContext('2d')!;

  this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:this.userInspectionAnalyticsDataNames,
      // labels: [
      //   'Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Evans', 
      //   'Ethan Brown', 'Fiona Clark', 'George Harris', 'Hannah Lee', 
      //   'Ian Martinez', 'Julia Nelson', 'Kevin Owens', 'Laura Perez', 
      //   'Michael Quinn', 'Nina Roberts', 'Oliver Scott', 'Paula Turner', 
      //   'Quentin Underwood', 'Rachel Vasquez', 'Steven White', 'Tina Xu'
      // ],
      
      datasets: [{
        label: 'Inspections Completed',
        // data: [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
        data: this.userInspectionAnalyticsDataValues,
        backgroundColor: this.generateColors(numBars),
        borderColor: this.generateColors(numBars),
        borderWidth: 1,
        // Let Chart.js automatically handle bar thickness
        // barThickness: 'flex', // optional
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'User Inspection Analytics'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Inspectors',
            font: { size: 14, weight: 'bold' }
          },
          ticks: { autoSkip: false }
          // categoryPercentage: 0.8, // reduces bar width per category
          // barPercentage: 0.9
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Inspections',
            font: { size: 14, weight: 'bold' }
          },
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}


  
  
  getCompletedCount(): number {
  return this.statusDistributionData['COMPLETED'] ?? 0;
}

getPendingCount(): number {
  return this.statusDistributionData['PENDING'] ?? 0;
}
getTotalCount(): number {
  return this.getPendingCount() + this.getCompletedCount();
}

getPendingPercentage(): number {
  return (this.getPendingCount() / this.getTotalCount()) * 100;
}

getCompletedPercentage(): number {
  return (this.getCompletedCount() / this.getTotalCount()) * 100;
}
get inspectorName(): string {
  return Object.keys(this.leadInspector)[0];
}
get extraInspectorCount(): number {
 return this.leadInspector
    ? Object.keys(this.leadInspector).length
    : 0;

}

get inspectorCount(): number {
  return Object.values(this.leadInspector)[0] as number;
}
get inspectorInitials(): string {
  if (!this.inspectorName) return '';
  return this.inspectorName
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase();
}
applyFilter(){}

private generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 55%)`);
  }
  return colors;
}
 @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.badgeRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.extraInspectorNamesVisible = false;
    }
  }
clickExtraInspectorNames() {
  // console.log("Clicked Extra Inspector Names");
  this.extraInspectorNamesVisible = !this.extraInspectorNamesVisible;
}

  // ngOnDestroy(): void {
  //   if (this.chart) {
  //     this.chart.destroy();
  //     this.chart = null;
  //   }
  // }
}