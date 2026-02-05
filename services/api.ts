
import { Client, ServiceOrder, Product, CashTransaction, OSStatus } from '../types';

// Simulação de Banco de Dados Google Firestore
// Para usar o real, você instalaria 'firebase/app' e 'firebase/firestore'
const STORAGE_KEY = 'asim_db_v1';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clients: [], os: [], products: [], transactions: [] };
};

const saveDb = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const api = {
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

  // --- ESTOQUE E GIRO (BACK-END LOGIC) ---
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
      lastSaleAt: new Date().toISOString() // Inicializa para não marcar como morto imediatamente
    };
    db.products.push(newProduct);
    saveDb(db);
    return newProduct;
  }
};
