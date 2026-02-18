
import { Client, ServiceOrder, Product, CashTransaction, OSStatus, User, ActivityLog, CommissionReport } from '../types';

const STORAGE_KEY = 'asim_db_v1';
const USERS_KEY = 'asim_users_v1';
const LOGS_KEY = 'asim_logs_v1';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clients: [], os: [], products: [], transactions: [] };
};

const saveDb = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

const getCurrentUser = (): User | null => {
  const session = localStorage.getItem('asim_session');
  return session ? JSON.parse(session) : null;
};

const registerLog = (action: string, details: string, severity: ActivityLog['severity'] = 'info') => {
  const user = getCurrentUser();
  const logsData = localStorage.getItem(LOGS_KEY);
  const logs: ActivityLog[] = logsData ? JSON.parse(logsData) : [];
  
  const newLog: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId: user?.id || 'system',
    userName: user?.name || 'Sistema',
    action,
    details,
    severity,
    timestamp: new Date().toISOString()
  };
  
  logs.unshift(newLog);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
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
      commissionRate: 0,
      createdAt: new Date().toISOString() 
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
    return [admin];
  }
  return JSON.parse(data);
};

export const api = {
  // --- AUDITORIA ---
  getLogs: async (): Promise<ActivityLog[]> => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // --- COMISSÕES ---
  getCommissions: async (startDate: string, endDate: string): Promise<CommissionReport[]> => {
    const db = getDb();
    const users = getUsers();
    const deliveredOS = db.os.filter((o: ServiceOrder) => {
      const date = o.updatedAt.split('T')[0];
      return o.status === OSStatus.ENTREGUE && date >= startDate && date <= endDate;
    });

    return users.map(user => {
      const userOS = deliveredOS.filter((o: ServiceOrder) => o.responsibleId === user.id);
      const totalLabor = userOS.reduce((acc: number, o: ServiceOrder) => acc + o.financial.laborValue, 0);
      return {
        userId: user.id,
        userName: user.name,
        totalServices: totalLabor,
        totalValue: userOS.reduce((acc: number, o: ServiceOrder) => acc + o.financial.totalValue, 0),
        commissionValue: (totalLabor * user.commissionRate) / 100,
        osCount: userOS.length
      };
    });
  },

  // --- USUÁRIOS E AUTH ---
  login: async (username: string, pass: string): Promise<User | null> => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      registerLog('Login', `Usuário ${user.username} acessou o sistema`);
      const { password, ...userWithoutPass } = user;
      return userWithoutPass as User;
    }
    registerLog('Falha de Login', `Tentativa de acesso com usuário: ${username}`, 'warning');
    return null;
  },

  getUsersList: async (): Promise<User[]> => {
    return getUsers();
  },

  addUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{success: boolean, message: string}> => {
    const users = getUsers();
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    registerLog('Criação de Usuário', `Novo usuário: ${newUser.name}`, 'info');
    return { success: true, message: 'Usuário cadastrado com sucesso.' };
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    registerLog('Alteração de Perfil', `Perfil de ${users[index].name} atualizado`, 'warning');
    const { password, ...userWithoutPass } = users[index];
    return userWithoutPass as User;
  },

  removeUser: async (id: string): Promise<void> => {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id || u.id === 'admin-1');
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // --- ORDENS DE SERVIÇO ---
  getOS: async (): Promise<ServiceOrder[]> => getDb().os,
  
  createOS: async (osData: any): Promise<ServiceOrder> => {
    const db = getDb();
    const user = getCurrentUser();
    const newOS = {
      ...osData,
      id: Math.random().toString(36).substr(2, 9),
      osNumber: (db.os.length + 1001).toString(),
      responsibleId: user?.id || 'admin-1',
      responsibleName: user?.name || 'Administrador',
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: OSStatus.RECEBIDO
    };
    db.os.push(newOS);
    saveDb(db);
    registerLog('Nova OS', `OS #${newOS.osNumber} aberta para ${newOS.clientName}`, 'info');
    return newOS;
  },

  updateOSStatus: async (id: string, newStatus: OSStatus): Promise<void> => {
    const db = getDb();
    const os = db.os.find((o: ServiceOrder) => o.id === id);
    if (os) {
      const oldStatus = os.status;
      os.status = newStatus;
      os.updatedAt = new Date().toISOString();
      saveDb(db);
      registerLog('Status OS', `OS #${os.osNumber} -> ${newStatus}`, 'info');
    }
  },

  // --- OUTROS ---
  getClients: async (): Promise<Client[]> => getDb().clients,
  saveClient: async (client: any) => {
    const db = getDb();
    const newC = {...client, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString()};
    db.clients.push(newC);
    saveDb(db);
    return newC;
  },
  getInventory: async (): Promise<Product[]> => getDb().products,
  saveProduct: async (product: any) => {
    const db = getDb();
    const newP = {...product, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), lastSaleAt: new Date().toISOString()};
    db.products.push(newP);
    saveDb(db);
    return newP;
  },
  getDeadStock: async (): Promise<Product[]> => {
    const db = getDb();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    return db.products.filter((p: Product) => p.lastSaleAt && new Date(p.lastSaleAt) < sixtyDaysAgo && p.quantity > 0);
  }
};
