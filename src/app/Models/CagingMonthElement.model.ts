export class CagingMonthElement {
    // Day: number;
    Day: number;
    Donors: number;
    NonDonors: number;
    DonationAmount: number;
    PieceCount: number;
    selected: boolean;
    isActive: boolean;

    constructor(d: number, active: boolean = false) {
        //Need the parameters in the constructor so that when you create the 
        //date object you can set the value of the Day and whether a day is active
        this.Day = d;
        this.isActive = active;
        this.selected = false;
        this.Donors = getRandomInt(15, 75);
        this.NonDonors = getRandomInt(10, 50);
        this.PieceCount = this.Donors + this.NonDonors;
        this.DonationAmount = getRandomArbitrary(40, 1000);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}