import { db, auth } from "@/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  limit,
  runTransaction
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { Client, ServiceOrder, Product, CashTransaction, OSStatus, User, ActivityLog, CommissionReport, Supplier, CatalogItem, Reminder } from "../types";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Tempo de resposta excedido (Timeout). Verifique sua conexão ou configuração do Firebase.')), timeoutMs))
  ]);
};

// --- COLEÇÕES FIREBASE ---
console.log('API: db disponível:', !!db);
const CLIENTS_COL = collection(db, "clients");
const PRODUCTS_COL = collection(db, "products");
const OS_COL = collection(db, "service_orders");
const LOGS_COL = collection(db, "activity_logs");
const USERS_COL = collection(db, "users");
const SUPPLIERS_COL = collection(db, "suppliers");
const TRANSACTIONS_COL = collection(db, "transactions");
const CATALOG_COL = collection(db, "catalog");
const REMINDERS_COL = collection(db, "reminders");

// --- CLIENTES ---
export const getClients = async (): Promise<Client[]> => {
  try {
    const snapshot = await withTimeout(getDocs(CLIENTS_COL));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
  } catch (error) {
    console.error('Erro ao buscar clientes no Firebase:', error);
    throw error;
  }
};

export const saveClient = async (client: Omit<Client, "id">): Promise<Client> => {
  console.log('Iniciando salvamento de cliente...', client);
  try {
    const docRef = await withTimeout(addDoc(CLIENTS_COL, {
      ...client,
      createdAt: new Date().toISOString()
    }));
    console.log('Cliente salvo no Firebase:', docRef.id);
    return { ...client, id: docRef.id } as Client;
  } catch (error) {
    console.error('Erro ao salvar no Firebase:', error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  const clientRef = doc(db, "clients", id);
  await updateDoc(clientRef, updates);
};

export const removeClient = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "clients", id));
};

// --- ESTOQUE (PRODUTOS) ---
export const getInventory = async (): Promise<Product[]> => {
  try {
    const snapshot = await withTimeout(getDocs(PRODUCTS_COL));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
  } catch (error) {
    console.error('Erro ao buscar estoque no Firebase:', error);
    throw error;
  }
};

export const saveProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const docRef = await withTimeout(addDoc(PRODUCTS_COL, {
      ...product,
      createdAt: new Date().toISOString()
    }));
    return { ...product, id: docRef.id } as Product;
  } catch (error) {
    console.error('Erro ao salvar produto no Firebase:', error);
    throw error;
  }
};

// --- ORDENS DE SERVIÇO (OS) ---
export const getServiceOrders = async (limitCount: number = 300): Promise<ServiceOrder[]> => {
  try {
    const q = query(OS_COL, orderBy("openedAt", "desc"), limit(limitCount));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id } as ServiceOrder))
      // Filtra OS com soft delete (deletedAt presente)
      .filter(os => !(os as any).deletedAt);
  } catch (error) {
    console.error('Erro ao buscar OS no Firebase:', error);
    throw error;
  }
};

export const saveServiceOrder = async (os: Omit<ServiceOrder, "id">): Promise<ServiceOrder> => {
  console.log('Iniciando salvamento de OS...', os);
  try {
    const counterRef = doc(db, 'metadata', 'osCounter');

    // Usa uma única transação para: incrementar contador + deduzir peças do estoque
    const { newOsNumber } = await runTransaction(db, async (transaction) => {
      // 1. Incrementa contador de OS
      const counterDoc = await transaction.get(counterRef);
      let currentNumber = 1;
      if (counterDoc.exists() && counterDoc.data().current) {
        currentNumber = counterDoc.data().current + 1;
      }
      transaction.set(counterRef, { current: currentNumber }, { merge: true });

      // 2. Deduz peças do estoque (apenas para OS nova, não edição)
      const parts = (os as any).parts as { id: string; quantity: number }[] | undefined;
      if (parts && parts.length > 0) {
        for (const part of parts) {
          if (!part.id) continue;
          const productRef = doc(db, 'products', part.id);
          const productSnap = await transaction.get(productRef);
          if (productSnap.exists()) {
            const currentQty = productSnap.data().quantity || 0;
            const newQty = Math.max(0, currentQty - part.quantity);
            transaction.update(productRef, { quantity: newQty });
          }
        }
      }

      return { newOsNumber: currentNumber };
    });

    const docRef = await withTimeout(addDoc(OS_COL, {
      ...os,
      osNumber: newOsNumber.toString(),
      osNumberValue: newOsNumber,
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    console.log('OS salva no Firebase com número:', newOsNumber, 'ID:', docRef.id);
    return { ...os, id: docRef.id, osNumber: newOsNumber.toString(), osNumberValue: newOsNumber } as ServiceOrder;
  } catch (error) {
    console.error('Erro ao salvar OS no Firebase:', error);
    throw error;
  }
};

export const updateOSStatus = async (id: string, newStatus: OSStatus): Promise<void> => {
  const osRef = doc(db, "service_orders", id);
  await updateDoc(osRef, { 
    status: newStatus,
    updatedAt: new Date().toISOString()
  });
};

export const updateServiceOrder = async (id: string, updates: Partial<ServiceOrder>): Promise<void> => {
  const osRef = doc(db, "service_orders", id);
  await updateDoc(osRef, { 
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// --- FORNECEDORES ---
export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const snapshot = await withTimeout(getDocs(SUPPLIERS_COL));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Supplier));
  } catch (error) {
    console.error('Erro ao buscar fornecedores no Firebase:', error);
    throw error;
  }
};

export const saveSupplier = async (supplier: Omit<Supplier, "id">): Promise<Supplier> => {
  try {
    const docRef = await withTimeout(addDoc(SUPPLIERS_COL, supplier));
    return { ...supplier, id: docRef.id } as Supplier;
  } catch (error) {
    console.error('Erro ao salvar fornecedor no Firebase:', error);
    throw error;
  }
};

// --- TRANSAÇÕES FINANCEIRAS ---
export const getTransactions = async (limitCount: number = 500): Promise<CashTransaction[]> => {
  try {
    const q = query(TRANSACTIONS_COL, orderBy("date", "desc"), limit(limitCount));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CashTransaction));
  } catch (error) {
    console.error('Erro ao buscar transações no Firebase:', error);
    throw error;
  }
};

export const saveTransaction = async (transaction: Omit<CashTransaction, "id">): Promise<CashTransaction> => {
  try {
    const docRef = await withTimeout(addDoc(TRANSACTIONS_COL, transaction));
    return { ...transaction, id: docRef.id } as CashTransaction;
  } catch (error) {
    console.error('Erro ao salvar transação no Firebase:', error);
    throw error;
  }
};

export const updateTransaction = async (id: string, updates: Partial<CashTransaction>): Promise<void> => {
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, updates);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "transactions", id));
};

// --- CATÁLOGO DE PREÇOS ---
export const getCatalog = async (): Promise<CatalogItem[]> => {
  try {
    const snapshot = await withTimeout(getDocs(CATALOG_COL));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CatalogItem));
  } catch (error) {
    console.error('Erro ao buscar catálogo no Firebase:', error);
    throw error;
  }
};

export const saveCatalogItem = async (item: Omit<CatalogItem, "id">): Promise<CatalogItem> => {
  try {
    const docRef = await withTimeout(addDoc(CATALOG_COL, item));
    return { ...item, id: docRef.id } as CatalogItem;
  } catch (error) {
    console.error('Erro ao salvar item do catálogo no Firebase:', error);
    throw error;
  }
};

export const deleteCatalogItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "catalog", id));
};

// --- LEMBRETES DE COMPRA ---
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const snapshot = await withTimeout(getDocs(REMINDERS_COL));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Reminder));
  } catch (error) {
    console.error('Erro ao buscar lembretes no Firebase:', error);
    throw error;
  }
};

export const saveReminder = async (reminder: Omit<Reminder, "id">): Promise<Reminder> => {
  try {
    const docRef = await withTimeout(addDoc(REMINDERS_COL, reminder));
    return { ...reminder, id: docRef.id } as Reminder;
  } catch (error) {
    console.error('Erro ao salvar lembrete no Firebase:', error);
    throw error;
  }
};

export const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<void> => {
  await updateDoc(doc(db, "reminders", id), updates);
};

export const deleteReminder = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "reminders", id));
};

// --- LOGS ---
export const registerLog = async (action: string, details: string, severity: 'info' | 'warning' | 'danger' = 'info') => {
  try {
    await addDoc(LOGS_COL, {
      action,
      details,
      severity,
      timestamp: new Date().toISOString(),
      userName: auth.currentUser?.email || "Sistema" 
    });
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
};

// --- USUÁRIOS (Login Simples) ---
export const getUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await getDocs(USERS_COL);
    if (snapshot.empty) {
      // Coleção vazia: não cria usuário automático com senha trivial.
      // O administrador deve criar o primeiro usuário manualmente via Firebase Console.
      console.warn('Nenhum usuário encontrado no Firestore. Crie o primeiro usuário via Firebase Console.');
      return [];
    }
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
  } catch (error: any) {
    // Usuário com role USER não tem acesso à lista completa: retorna apenas o próprio perfil
    if (error.code === 'permission-denied' && auth.currentUser) {
      console.warn('Acesso negado ao buscar lista de usuários. Retornando apenas próprio perfil.');
      const currentDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (currentDoc.exists()) {
        return [{ ...currentDoc.data(), id: currentDoc.id } as User];
      }
    }
    console.warn('Erro ao buscar usuários:', error);
    return [];
  }
};

/**
 * OBJETO DE COMPATIBILIDADE (API)
 * Mantém o funcionamento das telas existentes que chamam 'api.metodo()'
 */
export const api = {
  login: async (email: string, pass: string): Promise<User | null> => {
    try {
      // Login Real com Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // Busca perfil no Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        await registerLog('Login', `Usuário ${email} acessou via Firebase`);
        return { ...userData, id: firebaseUser.uid };
      } else {
        const newUser: User = {
          id: firebaseUser.uid,
          username: email,
          name: email.split('@')[0],
          role: email === 'deyvisongomo@gmail.com' ? 'ADMIN' : 'USER',
          commissionRate: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        return newUser;
      }
    } catch (error: any) {
      console.error("Erro no login Firebase:", error);
      // Lança o erro para que a View possa tratar
      throw error;
    }
  },

  recoverPassword: async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Falha na recuperação de senha:', error);
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('asim_session');
  },

  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe(); // cancela o listener após primeira resposta
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            resolve({ ...userDoc.data(), id: firebaseUser.uid } as User);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  },

  // Ordens de Serviço
  getOS: getServiceOrders,
  getServiceOrders: getServiceOrders,
  createOS: saveServiceOrder,
  updateOS: updateServiceOrder,
  updateOSStatus: updateOSStatus,
  removeOS: async (id: string): Promise<void> => {
    // Soft delete: marca como CANCELADO em vez de deletar permanentemente
    const osRef = doc(db, "service_orders", id);
    await updateDoc(osRef, {
      status: OSStatus.CANCELADO,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  // Clientes
  getClients: getClients,
  saveClient: saveClient,
  updateClient: updateClient,
  removeClient: removeClient,

  // Estoque
  getInventory: getInventory,
  saveProduct: saveProduct,
  getDeadStock: async (): Promise<Product[]> => {
    const products = await getInventory();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    return products.filter(p => p.lastSaleAt && new Date(p.lastSaleAt) < sixtyDaysAgo && p.quantity > 0);
  },

  // Fornecedores
  getSuppliers: getSuppliers,
  saveSupplier: saveSupplier,

  // Financeiro
  getTransactions: getTransactions,
  saveTransaction: saveTransaction,
  updateTransaction: updateTransaction,
  deleteTransaction: deleteTransaction,

  // Catálogo
  getCatalog: getCatalog,
  saveCatalogItem: saveCatalogItem,
  deleteCatalogItem: deleteCatalogItem,

  // Lembretes
  getReminders: getReminders,
  saveReminder: saveReminder,
  updateReminder: updateReminder,
  deleteReminder: deleteReminder,

  // Logs e Comissões
  getLogs: async (limitCount: number = 100): Promise<ActivityLog[]> => {
    const q = query(LOGS_COL, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ActivityLog[];
  },

  getCommissions: async (start: string, end: string): Promise<CommissionReport[]> => {
    const orders = await getServiceOrders();
    const delivered = orders.filter(o => {
      if (o.status !== OSStatus.ENTREGUE) return false;
      const date = o.updatedAt?.split('T')[0];
      return date && date >= start && date <= end;
    });

    const users = await getUsers();
    
    return users.map(user => {
      // Filtra OS onde o usuário é o responsável
      const userOS = delivered.filter(o => o.responsibleId === user.id);
      const totalLabor = userOS.reduce((acc, o) => acc + (Number(o.financial?.laborValue) || 0), 0);
      const totalValue = userOS.reduce((acc, o) => acc + (Number(o.financial?.totalValue) || 0), 0);
      
      return {
        userId: user.id,
        userName: user.name || 'Sem Nome',
        totalServices: totalLabor,
        totalValue: totalValue,
        commissionValue: (totalLabor * (Number(user.commissionRate) || 0)) / 100,
        osCount: userOS.length
      };
    });
  },

  // Gestão de Usuários
  getUsersList: getUsers,
  addUser: async (userData: any) => {
    const data = { ...userData, createdAt: new Date().toISOString() };
    await addDoc(USERS_COL, data);
    await registerLog('Equipe', `Novo usuário ${userData.name} cadastrado no Firebase`);
    return { success: true, message: 'Usuário cadastrado com sucesso.' };
  },
  updateUser: async (id: string, updates: any) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, updates);
    await registerLog('Equipe', `Usuário ${updates.name || id} atualizado no Firebase`);
    return { ...updates, id };
  },
  removeUser: async (id: string) => {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
    await registerLog('Equipe', `Usuário ID ${id} removido do Firebase`, 'danger');
    return { success: true };
  }
};