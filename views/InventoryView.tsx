
import React, { useState, useEffect } from 'react';
// Added TrendingUp to fix 'Cannot find name TrendingUp' error
import { Search, Plus, Filter, AlertTriangle, Package, DollarSign, Timer, TrendingUp } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';

const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deadStockIds, setDeadStockIds] = useState<string[]>([]);

  useEffect(() => {
    // Mock inicial caso o banco esteja vazio
    api.getInventory().then(items => {
      if (items.length === 0) {
        setProducts([
          { id: '1', name: 'Tela iPhone 13 Original', category: 'Telas', quantity: 5, minQuantity: 2, salePrice: 850, active: true, createdAt: '', lastSaleAt: '2023-01-01' },
          { id: '2', name: 'Bateria Galaxy S21', category: 'Baterias', quantity: 1, minQuantity: 3, salePrice: 250, active: true, createdAt: '', lastSaleAt: new Date().toISOString() },
          { id: '3', name: 'Caixa Som Bluetooth DJE', category: 'Acessórios', quantity: 10, minQuantity: 2, salePrice: 120, active: true, createdAt: '', lastSaleAt: '2023-10-10' },
        ]);
      } else {
        setProducts(items);
      }
    });

    api.getDeadStock().then(items => setDeadStockIds(items.map(i => i.id)));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Itens</p>
            <p className="text-3xl font-black text-slate-800">{products.reduce((acc, p) => acc + p.quantity, 0)}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 border-l-8 border-l-amber-400">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reposição Urgente</p>
            <p className="text-3xl font-black text-slate-800">{products.filter(p => p.quantity <= p.minQuantity).length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex items-center gap-6 text-white">
          <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capital Imobilizado</p>
            <p className="text-3xl font-black">R$ {products.reduce((acc, p) => acc + (p.salePrice * p.quantity), 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por peça ou código..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filtros
          </button>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b">
              <th className="px-8 py-5">Item / Detalhes</th>
              <th className="px-6 py-5">Categoria</th>
              <th className="px-6 py-5 text-center">Saldo</th>
              <th className="px-6 py-5 text-right">Preço</th>
              <th className="px-8 py-5 text-right">Giro de Estoque</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                   <div className="font-black text-slate-800 text-sm">{p.name}</div>
                   {p.quantity <= p.minQuantity && <span className="text-[8px] font-black uppercase text-amber-600 tracking-tighter bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Estoque Crítico</span>}
                </td>
                <td className="px-6 py-6">
                  <span className="text-[10px] font-black uppercase text-slate-400 border border-slate-100 px-3 py-1 rounded-xl">{p.category}</span>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className={`text-sm font-black ${p.quantity <= p.minQuantity ? 'text-amber-600' : 'text-slate-800'}`}>
                    {p.quantity} <span className="text-[10px] text-slate-300">UN</span>
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                   <div className="text-sm font-black text-slate-800">R$ {p.salePrice.toFixed(2)}</div>
                </td>
                <td className="px-8 py-6 text-right">
                   {deadStockIds.includes(p.id) ? (
                     <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl border border-rose-100 animate-pulse">
                        <Timer size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Estoque Parado</span>
                     </div>
                   ) : (
                     <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100">
                        <TrendingUp size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Giro Normal</span>
                     </div>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;
