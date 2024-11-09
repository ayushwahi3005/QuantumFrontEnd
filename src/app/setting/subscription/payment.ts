import { PaymentStatus } from "./PaymentStatus";
import { PaymentType } from "./PaymentType";


export class Payment{
    id!: string;
  amount!: number;  // Assuming BigDecimal maps to number in TypeScript
  currency!: string;
  paymentStatus!: PaymentStatus;
  cardholderName!: string;
  transactionDate!: Date; // LocalDateTime can be represented as an ISO string in Angular
  paymentType!: PaymentType;
  description?: string; // Optional field
  companyId!: string;
 


}