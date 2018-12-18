import { FormControl } from "@angular/forms";

export class Incidental {
    Amount: number;
    AuditDate: Date;
    Audited: Boolean;
    AuditedBy: string;
    Client: string;
    CreatedBy: string;
    CreatedDate: Date;
    Description: string;
    ID: number;
    IncidenceDate: Date;
    ListID: number;
    ModifiedDate: Date;
    ModifiedBy: string;
    
    //Not in the API call - totals are added up in the component
    ClientControl : FormControl;
    isLast: boolean;
    beenModified: boolean;
}