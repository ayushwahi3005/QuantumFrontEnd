import { ExtraField } from "./extraField";

export class WorkOrder{
    id!:string;
	description!:string;
    customer!:string;
	status!:string;
	priority!:string;
    dueDate!:string;
	assignedTechnician!:string;
	assetDetails!:string;
	assetId!:string;
    lastUpdate!:string;
	email!:string;
	companyId!:string;
	extraFields!:Map<String,ExtraField>;
}