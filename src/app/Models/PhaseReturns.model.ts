import { Returns } from "./Returns.model";
import { MailReturns } from "./MailReturns.model";
import { SplitInterpolation } from '@angular/compiler';

export class PhaseReturns {
    ID: number;
    LegacyID: number;
    PDFExists: boolean;
    PhaseName: string;
    Title: string;
    Format: string; //Legacy string value
    CarrierSize: string;
    CarrierColor: string;
    Resize: string;
    ReColor: string;
    Attributes: string[];
    Topics:string[];
    AppealType:string;
    Signer:string;
    SplitDifference: string;
    MailEntry: string;
    Cager: string;
    PostageOutClass:string;
    PostageInClass:string;
    PostageOutType:string;
    PostageInType:string;
    PostageInRate: string;
    PostageOutRate: string; 
    MailList:MailReturns[];
    MailDataSource: any[];
    DoublingDays: number;
    ListOwnerName: string;
    ListManagerName: string;
    Measure:Returns;
    SplitList: Split[];
}

export class Split{
    Package: string;
    Percentage: number;
}