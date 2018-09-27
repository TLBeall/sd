import { Returns } from "./Returns.model";
import { PackageDetails } from "./PackageDetails.model";

export class ListPerformance {
    Client: string;
    Phase: string;
    MailCode: string;
    Description: string;
    ExchangeFlag: string;
    ListOwner:number;
    ListOwnerAbbrev:string;
    ListOwnerName: string;
    ListManager: number;
    ListManagerName: string;
    ListManagerAbbrev:string;
    Recency: number;
    RecencyString: string;
    RecencySort: number;
    Measure: Returns;
    Package: PackageDetails;
}