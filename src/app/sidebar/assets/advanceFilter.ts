export interface AssetAdvanceFilterRequest {
  assetId?: string;
  name?: string;
  customer?: string;
  serialNumber?: string;
  category?: string;
  location?: string;
  status?: string;
  email?: string;
  companyId: number;

  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortDirection: 'ASC' | 'DESC';

  customFields?: Record<string, string>;
}
