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
  displayedColumns: string[] = ['fileName','date','recordType', 'status', 'complete','message','executedBy'];
  selectedRecord: ImportRecord | null = null;
  selectedRecordTitle: string = '';
  selectedRecordDetails: string = '';
  companyId!:any;

  pageSize:number=10;
  totalLength:number=0;
  pageEvent!: PageEvent;
  pageIndex:number=0;

  loading:boolean=true;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private importHistoryService:ImportHistoryService) {
    this.importHistory = new MatTableDataSource<ImportRecord>([]);
    this.companyId=localStorage.getItem('companyId');
  }

  ngOnInit(): void {
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
    this.importHistoryService.getAllImportHistory(this.companyId,this.pageIndex,this.pageSize).subscribe(data=>{
      console.log(data)
      this.importHistory.data = data.content;
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
  find(data:any){

  }
}
