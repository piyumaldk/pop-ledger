// This file serves as the entry point for the application. It initializes the application and sets up any necessary configurations or services.

import { PopService } from './services/popService';
import { Ledger } from './ledger/ledger';
import { Storage } from './ledger/storage';

import { Transaction } from './models/transaction';

// Initialize storage
const storage = new Storage();

// Load existing ledger data (stored under key 'ledger')
const loaded = storage.load('ledger');
const ledgerData: Transaction[] = Array.isArray(loaded) ? loaded : [];

// Initialize ledger with loaded data (if any)
const ledger = new Ledger(ledgerData);

// Initialize pop service
const popService = new PopService(ledger);

// Start the application
const startApp = () => {
    console.log('Application started');
    // Additional setup or service initialization can go here
};

startApp();