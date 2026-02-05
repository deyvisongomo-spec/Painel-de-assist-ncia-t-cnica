
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  Wallet, 
  Settings,
  Calculator,
  Truck,
  ShoppingCart,
  ClipboardList
} from 'lucide-react';

export const COLORS = {
  primary: '#0070e0', // Azul DJE
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ff0000', // Vermelho DJE
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} /> },
  { id: 'os', label: 'Ordens de Serviço', icon: <FileText size={20} /> },
  { id: 'clientes', label: 'Clientes', icon: <Users size={20} /> },
  { id: 'fornecedores', label: 'Fornecedores', icon: <Truck size={20} /> },
  { id: 'lista-compras', label: 'Lista de Compras', icon: <ClipboardList size={20} /> },
  { id: 'estoque', label: 'Estoque', icon: <Package size={20} /> },
  { id: 'caixa', label: 'Caixa / Vendas', icon: <Wallet size={20} /> },
  { id: 'pre-orcamento', label: 'Orçamentos', icon: <Calculator size={20} /> },
  { id: 'configuracoes', label: 'Ajustes', icon: <Settings size={20} /> },
];

export const OS_BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Asus', 'LG', 'Huawei', 'Oppo', 'Realme', 'Google', 'Outro'
];

export const STATUS_COLORS: Record<string, string> = {
  'Recebido': 'bg-blue-100 text-blue-700 border-blue-200',
  'Em análise': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Aguardando peça': 'bg-orange-100 text-orange-700 border-orange-200',
  'Em serviço': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Pronto para retirada': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Entregue': 'bg-green-100 text-green-700 border-green-200',
  'Cancelado': 'bg-red-100 text-red-700 border-red-200',
  'Abandonado': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const PAYMENT_METHODS = [
  'Pix',
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Transferência'
];
