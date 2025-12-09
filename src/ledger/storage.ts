export class Storage {
    private data: Record<string, any>;

    constructor() {
        this.data = {};
    }

    save(key: string, value: any): void {
        this.data[key] = value;
    }

    // If no key provided, return entire storage object
    load(key?: string): any {
        if (typeof key === 'undefined') {
            return this.data;
        }
        return this.data[key];
    }

    clear(): void {
        this.data = {};
    }
}