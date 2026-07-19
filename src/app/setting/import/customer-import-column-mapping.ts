export interface CustomerImportColumnMapping {
  id?: string;
  companyId?: number;
  name: string;
  recordType: 'ADDCUSTOMER' | 'UPDATECUSTOMER' | 'ADDASSET' | 'UPDATEASSET';
  columnMappings: Record<string, string>;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerTemplateFields {
  standardFields: string[];
  extraFields: string[];
  categories: string[];
}
