export interface TransactionData {
    id: string;
    amount: number;
    date: Date;
}

export interface LedgerData {
    transactions: TransactionData[];
    balance: number;
}