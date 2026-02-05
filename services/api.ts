
import { Client, ServiceOrder, Product, CashTransaction, OSStatus, User } from '../types';

const STORAGE_KEY = 'asim_db_v1';
const USERS_KEY = 'asim_users_v1';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clients: [], os: [], products: [], transactions: [] };
};

const saveDb = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    const admin: User = { 
      id: 'admin-1', 
      username: 'admin', 
      password: '123', 
      name: 'Administrador Asim', 
      role: 'ADMIN', 
      createdAt: new Date().toISOString() 
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
    return [admin];
  }
  return JSON.parse(data);
};

export const api = {
  // --- USUÁRIOS E AUTH ---
  login: async (username: string, pass: string): Promise<User | null> => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass as User;
    }
    return null;
  },

  getUsersList: async (): Promise<User[]> => {
    return getUsers();
  },

  addUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{success: boolean, message: string}> => {
    const users = getUsers();
    if (users.length >= 3) {
      return { success: false, message: 'Limite de 2 usuários adicionais atingido.' };
    }
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Usuário cadastrado com sucesso.' };
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password, ...userWithoutPass } = users[index];
    return userWithoutPass as User;
  },

  removeUser: async (id: string): Promise<void> => {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id || u.id === 'admin-1');
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // --- CLIENTES ---
  getClients: async (): Promise<Client[]> => {
    return getDb().clients;
  },
  
  saveClient: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    const db = getDb();
    const newClient = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    db.clients.push(newClient);
    saveDb(db);
    return newClient;
  },

  // --- ORDENS DE SERVIÇO ---
  getOS: async (): Promise<ServiceOrder[]> => {
    return getDb().os;
  },

  createOS: async (osData: any): Promise<ServiceOrder> => {
    const db = getDb();
    const newOS = {
      ...osData,
      id: Math.random().toString(36).substr(2, 9),
      osNumber: (db.os.length + 1001).toString(),
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: OSStatus.RECEBIDO
    };
    db.os.push(newOS);
    saveDb(db);
    return newOS;
  },

  // --- ESTOQUE E GIRO ---
  getInventory: async (): Promise<Product[]> => {
    return getDb().products;
  },

  getDeadStock: async (): Promise<Product[]> => {
    const db = getDb();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return db.products.filter((p: Product) => {
      if (!p.lastSaleAt) return false;
      const lastSale = new Date(p.lastSaleAt);
      return lastSale < sixtyDaysAgo && p.quantity > 0;
    });
  },

  saveProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const db = getDb();
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastSaleAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    saveDb(db);
    return newProduct;
  }
};
