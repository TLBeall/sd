export class CagingMonthElement {
    Day: number;
    NonDonors: number;
    CardAmount: number;
    CardCount: number;
    CashAmount: number;
    CashCount: number;
    CheckAmount: number;
    CheckCount: number;
    selected: boolean;
    selectable: boolean;
    isActive: boolean;
    TotalDonationAmount: number;
    TotalDonorCount: number;

    constructor(
        day: number,
        active: boolean = false,
        selectable : boolean,
        nondonors: number,
        cardamount: number,
        cardcount: number,
        cashamount: number,
        cashcount: number,
        checkamount: number,
        checkcount: number,
        totaldonationamount: number,
        totaldonorcount: number
    ) {
        //Need the parameters in the constructor so that when you create the 
        //date object you can set the value of the Day and whether a day is active
        this.Day = day;
        this.isActive = active;
        this.selectable = selectable;
        this.NonDonors = nondonors;
        this.CardAmount = cardamount;
        this.CardCount = cardcount;
        this.CashAmount = cashamount;
        this.CashCount = cashcount;
        this.CheckAmount = checkamount;
        this.CheckCount = checkcount;
        this.TotalDonationAmount = totaldonationamount;
        this.TotalDonorCount = totaldonorcount;
        this.selected = false;
    }
}
