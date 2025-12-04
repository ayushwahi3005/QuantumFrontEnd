import { SubscriptionEnum } from "./SubscriptionEnum";
import { SubscriptionPlan } from "./SubscriptionPlan";

export class Subscription{
    id!: string;
    companyId!: string;
    status!: SubscriptionEnum;
    plan!: string;
    person!: number;
    subscriptionDate!: any;
    expiryDate!:any;
    subscriptionPlan!:SubscriptionPlan
    amount!:number;
    subscriptionName!:string;
 


}