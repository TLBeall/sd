import { Returns } from "./Returns";
import { MailReturns } from "./MailReturns";

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
    DoublingDays: number;
    ListOwnerName: string;
    ListManagerName: string;
    ExchangeFlag: string;
    Measure:Returns;
}