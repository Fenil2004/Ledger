// Mock API with in-memory data

// In-memory mock data
let mockParties = [
  { id: 1, name: 'Rajesh Traders', phone: '9876543210', email: 'rajesh@example.com', address: 'Mumbai', notes: 'Regular customer', is_active: true, created_date: '2025-01-15' },
  { id: 2, name: 'Suresh & Co', phone: '9123456789', email: 'suresh@example.com', address: 'Delhi', notes: 'Premium client', is_active: true, created_date: '2025-02-10' },
  { id: 3, name: 'Priya Enterprises', phone: '9988776655', email: 'priya@example.com', address: 'Bangalore', notes: '', is_active: true, created_date: '2025-03-05' },
  { id: 4, name: 'Amit Materials', phone: '9111222333', email: 'amit@example.com', address: 'Pune', notes: 'Bulk orders', is_active: true, created_date: '2025-01-20' },
  { id: 5, name: 'Deepak Trading', phone: '9444555666', email: 'deepak@example.com', address: 'Chennai', notes: '', is_active: true, created_date: '2025-02-28' }
];

let mockTransactions = [
  { id: 1, transaction_type: 'buying', date: '2025-12-01', party_name: 'Rajesh Traders', phone: '9876543210', hny_rate: 450, hny_weight: 25, black_rate: 420, black_weight: 15, total_weight: 40, total_payment: 17550, notes: 'Good quality', created_by: 'admin@ledger.com', created_date: '2025-12-01T10:30:00' },
  { id: 2, transaction_type: 'selling', date: '2025-12-02', party_name: 'Suresh & Co', phone: '9123456789', hny_rate: 480, hny_weight: 20, black_rate: 450, black_weight: 10, total_weight: 30, total_payment: 14100, item_name: 'Shoes HNY', shoes_hny: 15, sheet_hny: 5, shoes_black: 8, sheet_black: 2, notes: '', created_by: 'admin@ledger.com', created_date: '2025-12-02T14:20:00' },
  { id: 3, transaction_type: 'buying', date: '2025-12-03', party_name: 'Priya Enterprises', phone: '9988776655', hny_rate: 440, hny_weight: 30, black_rate: 410, black_weight: 20, total_weight: 50, total_payment: 21400, notes: '', created_by: 'user@ledger.com', created_date: '2025-12-03T09:15:00' },
  { id: 4, transaction_type: 'selling', date: '2025-12-04', party_name: 'Amit Materials', phone: '9111222333', hny_rate: 490, hny_weight: 15, black_rate: 460, black_weight: 12, total_weight: 27, total_payment: 12870, item_name: 'Sheet Black', shoes_hny: 10, sheet_hny: 5, shoes_black: 7, sheet_black: 5, notes: 'Urgent delivery', created_by: 'admin@ledger.com', created_date: '2025-12-04T16:45:00' },
  { id: 5, transaction_type: 'buying', date: '2025-12-05', party_name: 'Deepak Trading', phone: '9444555666', hny_rate: 455, hny_weight: 22, black_rate: 425, black_weight: 18, total_weight: 40, total_payment: 17660, notes: '', created_by: 'user@ledger.com', created_date: '2025-12-05T11:30:00' },
  { id: 6, transaction_type: 'selling', date: '2025-12-06', party_name: 'Rajesh Traders', phone: '9876543210', hny_rate: 485, hny_weight: 18, black_rate: 455, black_weight: 14, total_weight: 32, total_payment: 15100, item_name: 'Mixed Lot', shoes_hny: 12, sheet_hny: 6, shoes_black: 9, sheet_black: 5, notes: 'Premium grade', created_by: 'admin@ledger.com', created_date: '2025-12-06T13:00:00' },
  { id: 7, transaction_type: 'buying', date: '2025-12-07', party_name: 'Suresh & Co', phone: '9123456789', hny_rate: 448, hny_weight: 28, black_rate: 418, black_weight: 16, total_weight: 44, total_payment: 19232, notes: 'Partial payment', created_by: 'user@ledger.com', created_date: '2025-12-07T10:00:00' },
  { id: 8, transaction_type: 'selling', date: '2025-12-08', party_name: 'Priya Enterprises', phone: '9988776655', hny_rate: 495, hny_weight: 16, black_rate: 465, black_weight: 11, total_weight: 27, total_payment: 13035, item_name: 'Shoes Black', shoes_hny: 11, sheet_hny: 5, shoes_black: 8, sheet_black: 3, notes: '', created_by: 'admin@ledger.com', created_date: '2025-12-08T15:30:00' },
  { id: 9, transaction_type: 'buying', date: '2025-12-09', party_name: 'Amit Materials', phone: '9111222333', hny_rate: 452, hny_weight: 24, black_rate: 422, black_weight: 19, total_weight: 43, total_payment: 18866, notes: 'Cash payment', created_by: 'user@ledger.com', created_date: '2025-12-09T12:15:00' },
  { id: 10, transaction_type: 'selling', date: '2025-12-10', party_name: 'Deepak Trading', phone: '9444555666', hny_rate: 488, hny_weight: 19, black_rate: 458, black_weight: 13, total_weight: 32, total_payment: 15226, item_name: 'Premium Grade', shoes_hny: 13, sheet_hny: 6, shoes_black: 9, sheet_black: 4, notes: '', created_by: 'admin@ledger.com', created_date: '2025-12-10T14:45:00' },
  { id: 11, transaction_type: 'buying', date: '2025-12-11', party_name: 'Rajesh Traders', phone: '9876543210', hny_rate: 460, hny_weight: 26, black_rate: 430, black_weight: 17, total_weight: 43, total_payment: 19270, notes: '', created_by: 'admin@ledger.com', created_date: '2025-12-11T09:30:00' }
];

let mockUsers = [
  { id: 1, email: 'admin@ledger.com', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@ledger.com', name: 'Regular User', role: 'user' }
];

let nextPartyId = 6;
let nextTransactionId = 12;

class EntityClient {
  constructor(entityName, endpoint, mockData, idGenerator) {
    this.entityName = entityName;
    this.endpoint = endpoint;
    this.mockData = mockData;
    this.idGenerator = idGenerator;
  }

  async list(sort = null) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let data = [...this.mockData()];
    if (sort) {
      const desc = sort.startsWith('-');
      const field = desc ? sort.substring(1) : sort;
      data.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
        return 0;
      });
    }
    return data;
  }

  async get(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const item = this.mockData().find(item => item.id === id);
    if (!item) throw new Error(`${this.entityName} not found`);
    return item;
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newItem = {
      ...data,
      id: this.idGenerator(),
      created_date: new Date().toISOString()
    };
    this.mockData().push(newItem);
    return newItem;
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.mockData().findIndex(item => item.id === id);
    if (index === -1) throw new Error(`${this.entityName} not found`);
    this.mockData()[index] = { ...this.mockData()[index], ...data };
    return this.mockData()[index];
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.mockData().findIndex(item => item.id === id);
    if (index === -1) throw new Error(`${this.entityName} not found`);
    this.mockData().splice(index, 1);
    return { success: true };
  }
}

export const base44 = {
  entities: {
    Transaction: new EntityClient('Transaction', '/transactions', () => mockTransactions, () => nextTransactionId++),
    Party: new EntityClient('Party', '/parties', () => mockParties, () => nextPartyId++),
    User: new EntityClient('User', '/users', () => mockUsers, () => mockUsers.length + 1),
  },
  
  async exportCSV() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const csv = 'Date,Type,Party,Phone,Weight,Payment\n' + 
      mockTransactions.map(t => `${t.date},${t.transaction_type},${t.party_name},${t.phone},${t.total_weight},${t.total_payment}`).join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },
  
  async getSummary() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const buying = mockTransactions.filter(t => t.transaction_type === 'buying');
    const selling = mockTransactions.filter(t => t.transaction_type === 'selling');
    
    return {
      buying: {
        count: buying.length,
        sum_weight: buying.reduce((sum, t) => sum + t.total_weight, 0),
        sum_payment: buying.reduce((sum, t) => sum + t.total_payment, 0)
      },
      selling: {
        count: selling.length,
        sum_weight: selling.reduce((sum, t) => sum + t.total_weight, 0),
        sum_payment: selling.reduce((sum, t) => sum + t.total_payment, 0)
      }
    };
  }
};
