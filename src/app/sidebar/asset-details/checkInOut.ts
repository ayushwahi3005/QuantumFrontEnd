import { CheckInOutDetails } from "./checkInOutDetails";

export class CheckInOut{
    id!:string;
    
	assetId!:string;
	status!:string;
	detailsList!:CheckInOutDetails[];

  
}