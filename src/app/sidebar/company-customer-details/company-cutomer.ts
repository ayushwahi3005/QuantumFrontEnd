import { ExtraField } from "./extraField";

export class CompanyCustomer{
    id!:string;
    name!:string;
    companyId!:string;
    category!:string;
    status!:string;
    phone!:string;
    email!:string;
    address!:string;
    apartment!:string;
    city!:string;
    state!:string;
    country!:string;
    zipCode!:number;
    extraFields!:Map<String,ExtraField>;
 


}