import { CagingElement } from './CagingElement.model';

export class CagingDayElement {
    NonDonors: number;
    CardAmount: number;
    CardCount: number;
    CashAmount: number;
    CashCount: number;
    CheckAmount: number;
    CheckCount: number;
    Client: string;
    MailCodeList: CagingElement[];

    Expanded: boolean;
    TotalDonationAmount: number;
    TotalDonorCount: number;
}