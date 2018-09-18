import { Returns } from "./Returns.model";
import { PhaseReturns } from "./PhaseReturns.model";

export class CampaignReturns {
    CampaignName: string;
    Measure:Returns;
    PhaseList: PhaseReturns[];
    PhaseDataSource: any[];
}