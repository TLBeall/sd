import { FormControl } from "@angular/forms";

export class CagingDailies {
    Agency: string;
    Client: string;
    MailCodeId: number;
    DateCaged: Date;
    EnteredDate: Date;
    ModifiedDate: Date;
    MailCode: string;
    NonDonors: number;
    CashDonors: number;
    CardDonors: number;
    CheckDonors: number;
    CashAmount: number;
    CardAmount: number;
    CheckAmount: number;
    EnteredBy: string
    ModifiedBy: string;
    // Source: string;
    
    //Not in the API call - totals are added up in the component
    ClientControl : FormControl;
    isLast: boolean;
    beenModified: boolean;

    TotalGross: number;
    TotalDonors: number;
}