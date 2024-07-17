class Wallet {
    private balance: number;

    constructor() {
        this.balance = 500; // Starting balance set to 500
    }

    deposit(amount: number): void {
        if (amount <= 0) throw new Error('Invalid deposit amount');
        this.balance += amount;
        console.log(`Deposited ${amount}. New balance: ${this.balance}`);
    }

    withdraw(amount: number): void {
        if (amount <= 0 || amount > this.balance) throw new Error('Insufficient balance');
        this.balance -= amount;
        console.log(`Withdrew ${amount}. New balance: ${this.balance}`);
    }

    getBalance(): number {
        return this.balance;
    }
}

export default Wallet;
export const walletInstance = new Wallet();
