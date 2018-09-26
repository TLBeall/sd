import { Returns } from "./Returns.model";
import { PackageDetails } from "./PackageDetails.model";

export class ListPerformance {
    Client: string;
    Phase: string;
    MailCode: string;
    Description: string;
    ExchangeFlag: string;
    ListOwnerName: string;
    ListManagerName: string;
    Recency: string;
    Measure: Returns;
    Package: PackageDetails;
}