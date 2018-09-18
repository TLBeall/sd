import { Returns } from "./Returns.model";
import { MailReturns } from "./MailReturns.model";

export class PhaseReturns {
    PhaseName: string;
    Title: string;
    Format: string;
    CarrierSize: string;
    CarrierColor: string;
    Resize: string;
    ReColor: string;
    Attributes: string[];
    Topics:string[];
    AppealType:string;
    Signer:string;
    PostageOutClass:string;
    PostageInClass:string;
    PostageOutType:string;
    PostageInType:string;
    MailList:MailReturns[];
    MailDataSource: any[];
    DoublingDays: number;
    ListOwnerName: string;
    ListManagerName: string;
    Measure:Returns;
}