export class Notification{
    id!:string;
    userId!:string;
    companyId!:number;
    isRead!:boolean;
    readAt!:Date;
    deliveredAt!:Date;
    notification!:{
        id:string;
        title:string;
        message:string;
        notificationType:string;
        alertType:string;
        companyId:number;
    };
}