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

    // Convenience API used by CLI
    addTransaction(amount: number | string): Transaction {
        const num = typeof amount === 'string' ? Number(amount) : amount;
        const tx = new Transaction(String(Date.now()), num, new Date());
        this.processTransaction(tx);
        return tx;
    }

    listTransactions(): Transaction[] {
        if (!this.ledger) return [];
        return this.ledger.getTransactions();
    }
}