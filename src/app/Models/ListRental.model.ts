import { FormControl } from "@angular/forms";

export class ListRental {
    Amount: number;
    Client: string;
    CreatedBy: string;
    CreatedDate: Date;
    Description: string;
    ID: number;
    LRIDate: Date;
    ListID: number;
    ModifiedBy: string;
    ModifiedDate: Date;

    ClientControl: FormControl;
    isLast: boolean;
}
