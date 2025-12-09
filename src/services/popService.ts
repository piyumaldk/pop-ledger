import { Ledger } from '../ledger/ledger';
import { Transaction } from '../models/transaction';

export class PopService {
    private ledger?: Ledger;

    constructor(ledger?: Ledger) {
        this.ledger = ledger;
    }

    // Method to process a transaction
    processTransaction(transaction: Transaction): void {
        if (!this.ledger) return;
        this.ledger.addTransaction(transaction);
    }

    // Method to validate a transaction
    validateTransaction(transaction: Transaction): boolean {
        // Basic validation example
        return !!transaction && typeof transaction.amount === 'number' && transaction.amount !== 0;
    }
}