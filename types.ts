
export enum OSStatus {
  RECEBIDO = 'Recebido',
  EM_ANALISE = 'Em análise',
  AGUARDANDO_PECA = 'Aguardando peça',
  EM_SERVICO = 'Em serviço',
  PRONTO_RETIRADA = 'Pronto para retirada',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado',
  ABANDONADO = 'Abandonado'
}

export enum OSType {
  REPARO = 'Reparo',
  ORCAMENTO = 'Orçamento',
  GARANTIA = 'Garantia/Reclamação'
}

export type UserRole = 'ADMIN' | 'USER';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface User {
  id: string;
  username: string;
  name: string;
  password?: string;
  role: UserRole;
  commissionRate: number; // Porcentagem de comissão (ex: 10 para 10%)
  createdAt: string;
}

export interface CommissionReport {
  userId: string;
  userName: string;
  totalServices: number;
  totalValue: number;
  commissionValue: number;
  osCount: number;
}

export interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  barCode?: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  lastSaleAt?: string;
  createdAt: string;
  active: boolean;
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  type: OSType;
  clientId: string;
  clientName: string;
  responsibleId: string; // ID do usuário responsável
  responsibleName: string;
  device: {
    brand: string;
    model: string;
    color: string;
    capacity: string;
    imei: string;
    password?: string;
    itemsLeft: string[];
  };
  problemReported: string;
  technicalDiagnosis?: string;
  servicesToExecute: string;
  financial: {
    partsValue: number;
    laborValue: number;
    totalValue: number;
    paymentMethod?: string;
  };
  status: OSStatus;
  openedAt: string;
  updatedAt: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  description: string;
  type: 'entrada' | 'saida';
  value: number;
  paymentMethod: string;
  referenceId?: string;
}
