export class InspectionInstance{
    assetId!:string;
    companyId!:string;
    assetCategoryInspectionId!:string;
    assetCategoryInspectionName!:string;
    actionPerformedBy!:string;
    notes!:string;
    createdAt!:string;
    updatedAt!:string;
    status!:'PENDING' | 'COMPLETED';
    stepValues!:any[];
    inspectionTemplates!:any[]
    selectedItemList!:any[];
  
}