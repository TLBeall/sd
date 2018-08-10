import { Returns } from "./Returns";
import { PhaseReturns } from "./PhaseReturns";

export class CampaignReturns {
    CampaignName: string;
    Measure:Returns;
    PhaseList: PhaseReturns[];
}