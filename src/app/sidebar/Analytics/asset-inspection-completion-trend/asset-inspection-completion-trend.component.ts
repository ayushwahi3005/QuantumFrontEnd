import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AssetInspectionCompletionTrendService } from './asset-inspection-completion-trend.service';
import { Chart, ChartConfiguration } from 'chart.js';

interface InspectionData {
  date: string;
  count: number;
}

interface ChartDataPoint {
  date: string;
  count: number;
}

interface AggregatedData {
  label: string;
  count: number;
  period: string;
}

@Component({
  selector: 'app-asset-inspection-completion-trend',
  templateUrl: './asset-inspection-completion-trend.component.html',
  styleUrl: './asset-inspection-completion-trend.component.css',
})
export class AssetInspectionCompletionTrendComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  loading = true;
  error: string | null = null;
  trendData: AggregatedData[] = [];
  dateRange = { start: '', end: '' };
  maxValue = 0;
  companyId = localStorage.getItem('companyId');
  startDateFilter: string | null = null;
  endDateFilter: string | null = null;

  // Aggregation strategy
  aggregationStrategy: 'daily' | 'weekly' | 'monthly' = 'weekly';
  dataPointCount = 0;
  fetchedData:any;

  constructor(
    private inspectionService: AssetInspectionCompletionTrendService,
  ) {}

  ngAfterViewInit(): void {
    this.companyId = localStorage.getItem('companyId');
    const start = new Date();
    start.setDate(start.getDate() - 600);
    const end = new Date();

    this.startDateFilter = this.startEndformatDate(start);
    this.endDateFilter = this.startEndformatDate(end);
    this.loadChartData();
  }

  // myMock(): InspectionData[] {
  //   const startDate = new Date('2026-02-08');
  //   const daysBack = 600;

  //   const data: InspectionData[] = Array.from(
  //     { length: daysBack },
  //     (_, i): InspectionData => {
  //       const d = new Date(startDate);
  //       d.setDate(startDate.getDate() - i);

  //       return {
  //         date: d.toISOString().slice(0, 10),
  //         count: Math.floor(Math.random() * 30) + 10,
  //       };
  //     },
  //   );
  //   return data;
  // }

  loadChartData(): void {
    this.loading = true;
    this.error = null;

    this.inspectionService
      .getInspectionCompletionTrendByDateRange(
        this.companyId,
        this.startDateFilter,
        this.endDateFilter,
      )
      .subscribe({
        next: (data: InspectionData[]) => {
          console.log('Raw data points:', data.length);
          // Determine aggregation strategy based on data volume
          this.determineAggregationStrategy(data.length);
          this.fetchedData=data;
          this.processData(data);
          // this.processData(this.Mock());
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load inspection data';
          console.error('Error loading data:', err);
          this.loading = false;
        },
      });
  }

  /**
   * Determines the best aggregation strategy based on data volume
   * This prevents overcrowding the chart with too many data points
   */
  private determineAggregationStrategy(dataLength: number): void {
    if (dataLength <= 60) {
      this.aggregationStrategy = 'daily';
    } else if (dataLength <= 365) {
      this.aggregationStrategy = 'weekly';
    } else {
      this.aggregationStrategy = 'monthly';
    }
    console.log(`Using ${this.aggregationStrategy} aggregation for ${dataLength} data points`);
  }

  /**
   * Aggregates data by week - sums inspection counts for each week
   */
  private aggregateByWeek(rawData: InspectionData[]): AggregatedData[] {
    const weekMap = new Map<string, { count: number; dates: Date[] }>();

    rawData.forEach((item) => {
      const date = new Date(item.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

      const weekKey = weekStart.toISOString().slice(0, 10);

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { count: 0, dates: [] });
      }

      const week = weekMap.get(weekKey)!;
      week.count += item.count;
      week.dates.push(date);
    });

    return Array.from(weekMap.entries())
      .map(([weekStartString, data]) => {
        const startDate = new Date(weekStartString);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        return {
          label: `${this.formatDate(startDate.toDateString())} - ${this.formatDate(endDate.toDateString())}`,
          count: data.count,
          period: weekStartString,
        };
      })
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
  }

  /**
   * Aggregates data by month - sums inspection counts for each month
   */
  private aggregateByMonth(rawData: InspectionData[]): AggregatedData[] {
    const monthMap = new Map<string, number>();

    rawData.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const count = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, count + item.count);
    });

    return Array.from(monthMap.entries())
      .map(([monthKey, count]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);

        return {
          label: date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          count,
          period: monthKey,
        };
      })
      .sort((a, b) => new Date(a.period + '-01').getTime() - new Date(b.period + '-01').getTime());
  }

  /**
   * Aggregates data by day - no aggregation, just groups by date
   */
  private aggregateByDay(rawData: InspectionData[]): AggregatedData[] {
    const dayMap = new Map<string, number>();

    rawData.forEach((item) => {
      const count = dayMap.get(item.date) || 0;
      dayMap.set(item.date, count + item.count);
    });

    return Array.from(dayMap.entries())
      .map(([date, count]) => ({
        label: this.formatDate(date),
        count,
        period: date,
      }))
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
  }

  private processData(rawData: InspectionData[]): void {
    // Choose aggregation method based on data volume
    let aggregatedData: AggregatedData[];

    switch (this.aggregationStrategy) {
      case 'weekly':
        aggregatedData = this.aggregateByWeek(rawData);
        break;
      case 'monthly':
        aggregatedData = this.aggregateByMonth(rawData);
        break;
      case 'daily':
      default:
        aggregatedData = this.aggregateByDay(rawData);
        break;
    }

    this.trendData = aggregatedData;
    this.dataPointCount = aggregatedData.length;

    if (this.trendData.length > 0) {
      this.dateRange.start = this.trendData[0].label;
      this.dateRange.end = this.trendData[this.trendData.length - 1].label;
      this.maxValue = Math.max(...this.trendData.map((d) => d.count));
    }

    this.loading = false;
    // Initialize chart after view is rendered
    setTimeout(() => this.initializeChart(), 100);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
  }

  private initializeChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    // Optimize point radius based on data point count
    const pointRadius = this.dataPointCount > 100 ? 3 : this.dataPointCount > 50 ? 4 : 5;
    const tension = this.dataPointCount > 200 ? 0.2 : 0.4;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.trendData.map((d) => d.label),
        datasets: [
          {
            label: `Inspection Records (${this.aggregationStrategy})`,
            data: this.trendData.map((d) => d.count),
            borderColor: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.08)',
            borderWidth: 2,
            fill: true,
            tension: tension,
            pointRadius: pointRadius,
            pointBackgroundColor: '#ff4444',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: pointRadius + 2,
            // Performance optimization: skip points when zoomed out
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 13,
              weight: 'bold',
            },
            bodyFont: {
              size: 12,
            },
            displayColors: true,
            borderColor: '#ff4444',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 10,
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.05)',
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              // Reduce label density for large datasets
              maxTicksLimit: this.dataPointCount > 100 ? 10 : 15,
            },
          },
          y: {
            beginAtZero: true,
            max: Math.ceil(this.maxValue * 1.15),
            title: {
              display: true,
              text: 'Inspection Count',
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 10,
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.1)',
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  startEndformatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Allows user to switch between aggregation strategies
   */
  setAggregation(strategy: 'daily' | 'weekly' | 'monthly'): void {
    if (this.aggregationStrategy === strategy) return;

    this.aggregationStrategy = strategy;
    this.loading = true;

    // Re-process data with new aggregation strategy
    setTimeout(() => {
      const rawData = this.fetchedData;
      // const rawData=this.myMock();
      this.processData(rawData);
    }, 100);
  }
}