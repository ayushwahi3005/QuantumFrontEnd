import { SubscriptionEnum } from "./SubscriptionEnum";
import { SubscriptionPlan } from "./SubscriptionPlan";

export class Subscription{
    id!: string;
    companyId!: string;
    status!: SubscriptionEnum;
    plan!: string;
    person!: number;
    subscriptionDate!: Date;
    expiryDate!:Date;
    subscriptionPlan!:SubscriptionPlan
 


}