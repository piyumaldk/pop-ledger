import { Transaction } from "../models/transaction";

export class Ledger {
    private transactions: Transaction[];

    constructor(initialData?: Transaction[]) {
        this.transactions = initialData ? [...initialData] : [];
    }

    addTransaction(transaction: Transaction): void {
        // Prevent adding duplicate transactions by id
        const exists = this.transactions.some(t => t.id === transaction.id);
        if (!exists) {
            this.transactions.push(transaction);
        }
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getTransactionById(id: string): Transaction | undefined {
        return this.transactions.find(transaction => transaction.id === id);
    }
}