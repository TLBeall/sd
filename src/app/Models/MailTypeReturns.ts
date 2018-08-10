import { CampaignReturns } from "./CampaignReturns";
import { Returns } from "./Returns";

export class MailTypeReturns {
    MailType: string;
    CampaignList: CampaignReturns[];
    Measure:Returns;
}