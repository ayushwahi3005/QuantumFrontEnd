import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ImportHistoryService } from './import-history.service';
import { PageEvent } from '@angular/material/paginator';

interface ImportRecord {
  id: number;
  fileName:string;
  date: Date;
  status: string;
  complete:string;
  message:string;
  recordType:string;
  executedBy:string;
}
@Component({
  selector: 'app-import-history',
  templateUrl: './import-history.component.html',
  styleUrls: ['./import-history.component.css']
})
export class ImportHistoryComponent {
  importHistory: MatTableDataSource<ImportRecord>;
  importHistoryWithoutFilter: MatTableDataSource<ImportRecord>;
  displayedColumns: string[] = ['fileName','date','recordType', 'status', 'complete','message','executedBy'];
  selectedRecord: ImportRecord | null = null;
  selectedRecordTitle: string = '';
  selectedRecordDetails: string = '';
  companyId!:any;

  pageSize:number=10;
  totalLength:number=0;
  pageEvent!: PageEvent;
  pageIndex:number=0;
  dateFilterStartDate!:Date|null;
  dateFilterEndDate!:Date|null;

  loading:boolean=true;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private importHistoryService:ImportHistoryService) {
    this.importHistory = new MatTableDataSource<ImportRecord>([]);
    this.importHistoryWithoutFilter = new MatTableDataSource<ImportRecord>([]);
    this.companyId=localStorage.getItem('companyId');
  }

  ngOnInit(): void {
    this.dateFilterEndDate=null;
    this.dateFilterStartDate=null;
    this.loadImportHistory();
  }

  ngAfterViewInit() {
    this.importHistory.sort = this.sort;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    // localStorage.setItem('assetPageInd',this.pageIndex.toString())
    // localStorage.setItem('assetPageSize',this.pageSize.toString())
    console.log(this.pageIndex,this.pageSize)
    this.loadImportHistory();
   
    
  }

  loadImportHistory(): void {
    this.loading=true;
    this.importHistoryService.getAllImportHistory(this.companyId,this.pageIndex,this.pageSize,this.dateFilterStartDate,this.dateFilterEndDate).subscribe(data=>{
      console.log(data)
      this.importHistory.data = data.content;
      this.importHistoryWithoutFilter.data = data.content;
      this.totalLength=data.totalElements;
      this.loading=false;
      console.log(this.loading)
 
    },
    (err)=>{
      console.log(err);
      this.loading=false;
      console.log(this.loading)
    },
    ()=>{
      this.loading=false;
      console.log(this.loading)
    })
    // const data = [
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File',recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File',recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File',recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File',recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File',recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' },
    //   { id: 2,  date: new Date(), status: 'In-Progress',complete:'54%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 3,  date: new Date(), status: 'Failed',complete:'55%',message:'Customer File' ,recordType:'Customer',executedBy:'Ayush'},
    //   { id: 1, date: new Date(), status: 'Completed',complete:'90%',message:'Asset File',recordType:'Asset',executedBy:'Ayush' }



     
    // ];

  
    // this.importHistory.data = data;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }


  refresh(){
    this.ngOnInit()
  }
  find(data: any): void {
  const searchTerm = data.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    // If search is cleared, reload all data
    // this.pageIndex = 0;
    this.loadImportHistory();
  } else {
    // Filter the current data source by fileName
    this.importHistory.data = this.importHistoryWithoutFilter.data.filter(record =>
      record.fileName.toLowerCase().includes(searchTerm)||record.recordType.toLowerCase().includes(searchTerm)||record.status.toLowerCase().includes(searchTerm)||record.date.toString().toLowerCase().includes(searchTerm)||(record.complete==searchTerm)||record.message.toLowerCase().includes(searchTerm)||record.executedBy.toLowerCase().includes(searchTerm)
    );
  }
}
  setStartDate(event:any){
    console.log(event.target.value)
    this.dateFilterStartDate=event.target.value;
  }
  setEndDate(event:any){
     console.log(event.target.value)
    this.dateFilterEndDate=event.target.value;
  }
  applyDateFilter(){
    console.log(this.dateFilterStartDate,this.dateFilterEndDate)
    this.loadImportHistory();

  }
  clearDateFilter(){
    this.dateFilterStartDate=null;
    this.dateFilterEndDate=null;
    this.loadImportHistory();

  }
}
