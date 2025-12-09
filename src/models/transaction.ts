export class Transaction {
    id: string;
    amount: number;
    date: Date;

    constructor(id: string, amount: number, date: Date) {
        this.id = id;
        this.amount = amount;
        this.date = date;
    }
}