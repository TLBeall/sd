import { IncidentalMonthData } from './ReturnsIncidentalMonthData.model';

export class ReturnsClientInc {
     Amount: number;
     Client: string;
     Incidentals: IncidentalMonthData[];
     Expanded: boolean;
}