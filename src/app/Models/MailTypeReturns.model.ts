import { CampaignReturns } from "./CampaignReturns.model";
import { Returns } from "./Returns.model";

export class MailTypeReturns {
    MailType: string;
    CampaignList: CampaignReturns[];
    CampaignDataSource: any[];
    Measure:Returns;
}