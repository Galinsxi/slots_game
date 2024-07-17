import Wallet, { walletInstance as wallet } from '../src/wallet';

describe('Wallet Tests', () => {
    beforeEach(() => {
        wallet['balance'] = 0; // Reset wallet balance before each test
        wallet.deposit(1000); // Start each test with a balance of 1000
    });

    test('Initial balance is 500', () => {
        const newWallet = new Wallet();
        expect(newWallet.getBalance()).toBe(500);
    });

    test('Deposit money', () => {
        wallet.deposit(100);
        expect(wallet.getBalance()).toBe(1100);
    });

    test('Withdraw money', () => {
        wallet.withdraw(100);
        expect(wallet.getBalance()).toBe(900);
    });

    test('Insufficient balance throws error', () => {
        expect(() => wallet.withdraw(2000)).toThrow('Insufficient balance');
    });

    test('Invalid deposit amount throws error', () => {
        expect(() => wallet.deposit(-100)).toThrow('Invalid deposit amount');
    });

    test('Invalid withdraw amount throws error', () => {
        expect(() => wallet.withdraw(-100)).toThrow('Insufficient balance');
    });
});
