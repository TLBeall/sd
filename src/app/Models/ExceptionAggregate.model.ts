import { ExceptionElement } from './ExceptionElement.model';

export class ExceptionAggregate {
    NonDonors: number;
    CardAmount: number;
    CardDonors: number;
    CashAmount: number;
    CashDonors: number;
    CheckAmount: number;
    CheckDonors: number;
    MailCode: string;
    ExceptionList: ExceptionElement[];

    Expanded: boolean;
    showControl: boolean;
    // editing: boolean;
}