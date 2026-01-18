interface AssetRecord {
  assetId: string;
  assetName: string;
  customerId: string;
  customerName: string;
  // action: 'Check In' | 'Check Out' | 'Maintenance';
    action: 'Checked In' | 'Checked Out';
  date: string;
  time: string;
  location: string;
  username: string;
}
export class PaginationResult{
    totalRecords!:number;
    data!:AssetRecord[];
    totalCheckIn!:number;
    totalCheckOut!:number;
    

    


}