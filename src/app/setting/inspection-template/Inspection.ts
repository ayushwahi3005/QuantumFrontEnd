import { InspectionStep } from "./InspectionStep";

export class Inspection{
    id!:string;
    name!:string;
    categoryId!:string;
    categoryName!:string;
    companyId!:string;
    steps!:Array<InspectionStep>;
    status!:string;
    

}