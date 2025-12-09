// This file handles command-line interface interactions, allowing users to interact with the application via terminal commands.

import { Command } from 'commander';
import { PopService } from './services/popService';

const program = new Command();
const popService = new PopService();

program
  .version('1.0.0')
  .description('CLI for Space Pop Ledger');

program
  .command('add <amount>')
  .description('Add a transaction')
  .action((amount: string) => {
    const transaction = popService.addTransaction(amount);
    console.log(`Transaction added: ${transaction}`);
  });

program
  .command('list')
  .description('List all transactions')
  .action(() => {
    const transactions = popService.listTransactions();
    console.log('Transactions:', transactions);
  });

program.parse(process.argv);