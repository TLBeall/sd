import { ListGross } from "./ListGross.model";
import { MailcodeGross } from "./MailcodeGross.model";

export class PhaseGross {
    ClientAcronym: string;
    ClientName: string;
    PackageName: string;
    PackageTitle: string;
    dateGrossList: ListGross[];
    mailCodeList: MailcodeGross[];
}