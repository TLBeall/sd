import { FormControl } from "@angular/forms";

export class CagingDailies {
    Agency: string;
    Client: string;
    MailCodeId: number;
    DonationDate: Date;
    DateCaged: Date;
    EnteredDate: Date;
    ModifiedDate: Date;
    MailCode: string;
    NonDonors: number;
    CashDonors: number;
    CardDonors: number;
    CheckDonors: number;
    UnspecifiedDonors: number;
    CashAmount: number;
    CardAmount: number;
    CheckAmount: number;
    UnspecifiedAmount: number;
    EnteredBy: string
    ModifiedBy: string;
    Control : FormControl;
    isLast: boolean;
    //Not in the API call - totals are added up in the component
    TotalGross: number;
    TotalDonors: number;
}