import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../admin-home/admin-home.component';
import { MatPaginator } from '@angular/material/paginator';
import { CustomersService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  @Output() messageEvent = new EventEmitter<String[]>();
  allCustomers: any = [];
  displayedColumns: string[] = [
    'rowNumber',
    'firstName',
    'lastName',
    'email',
    'title',
    'mobileNumber',
    'role',
    'companyId',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  constructor(private customerService: CustomersService) {}
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.customerService.getAllCustomers().subscribe(
      (data) => {
        this.allCustomers = data;
        this.dataSource = new MatTableDataSource<PeriodicElement>(
          this.allCustomers
        );
        console.log('All Customers:', this.allCustomers);
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
  resendEmailVerificationLink(email: any, companyId: any) {
    this.customerService
      .resendFirebaseVerificationEmail(companyId, email)
      .subscribe(
        (data) => {
          console.log(data);
          // this.triggerAlert(data.message,data.status);
          this.sendMessage(data.message, data.status);
        },
        (err) => {
          console.log(err);
          // this.triggerAlert(err.error.errorMessage,"danger");
          this.sendMessage(err.error.errorMessage, 'danger');
        }
      );
  }
  sendMessage(message: String,type:String) {
    // console.log("emitting")
    this.messageEvent.emit([message,type]);
  }
}
