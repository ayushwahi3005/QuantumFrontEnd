export class InspectionInstance {
    
    assetId!:string;
    companyId!:string;
    assetCategoryInspectionId!:string;
    assetCategoryInspectionName!:string;
    createdBy!:string;
    actionPerformedBy!:string;
    notes!:string;
    createdAt!:Date|null;
    updatedAt!:Date|null;
    status!:'PENDING' | 'COMPLETED' | 'CANCELLED';
    stepValues!:any[];
    inspectionTemplates!:any[]
    selectedItemList!:any[];
  
}