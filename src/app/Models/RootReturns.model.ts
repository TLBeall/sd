import { MailTypeReturns } from "./MailTypeReturns.model";
import { Returns } from "./Returns.model";

export class RootReturns {
    Client: string;
    MailTypeList:MailTypeReturns[];
    Measure:Returns;
    Index: number;
}