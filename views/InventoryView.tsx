import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, AlertTriangle, Package, DollarSign, Timer, TrendingUp, Loader2, X, Save } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';

const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deadStockIds, setDeadStockIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    category: '',
    barCode: '',
    costPrice: 0,
    salePrice: 0,
    quantity: 0,
    minQuantity: 0,
    active: true,
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const items = await api.getInventory();
      setProducts(items);
      const deadItems = await api.getDeadStock();
      setDeadStockIds(deadItems.map(i => i.id));
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      alert('Nome e Categoria são obrigatórios!');
      return;
    }

    setIsSaving(true);
    try {
      await api.saveProduct(formData as any);
      setIsFormOpen(false);
      setFormData({
        name: '',
        category: '',
        barCode: '',
        costPrice: 0,
        salePrice: 0,
        quantity: 0,
        minQuantity: 0,
        active: true,
      });
      loadInventory();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barCode?.includes(searchTerm)
  );

  if (isFormOpen) {
    return (
      <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
          <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Novo Produto no Estoque</h2>
             <p className="text-slate-500 text-sm">Adicione novos itens para venda ou reposição.</p>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"><X size={20}/></button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nome do Produto *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  placeholder="Ex: Tela iPhone 13 Original"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Categoria *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  placeholder="Ex: Telas, Baterias, Acessórios"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Código de Barras / SKU</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  placeholder="000000000000"
                  value={formData.barCode}
                  onChange={(e) => setFormData({...formData, barCode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Preço de Custo (R$)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  value={formData.costPrice}
                  onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Preço de Venda (R$)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  value={formData.salePrice}
                  onChange={(e) => setFormData({...formData, salePrice: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Quantidade em Estoque</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Quantidade Mínima (Alerta)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({...formData, minQuantity: Number(e.target.value)})}
                />
              </div>
           </div>

           <div className="flex justify-end gap-4 pt-8">
              <button 
                onClick={() => setIsFormOpen(false)} 
                disabled={isSaving}
                className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
              >
                Descartar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                 {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Salvar Produto
              </button>
           </div>
        </div>
      </div>
    );
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filtros
          </button>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando Estoque...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <Package className="text-slate-200 mb-6" size={64} />
          <h3 className="text-xl font-black text-slate-800 mb-2">Estoque Vazio</h3>
          <p className="text-slate-500 max-w-xs">Cadastre seu primeiro produto para começar a gerir seu estoque.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b">
                <th className="px-8 py-5">Item / Detalhes</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5 text-center">Saldo</th>
                <th className="px-6 py-5 text-right">Preço Venda</th>
                <th className="px-8 py-5 text-right">Giro de Estoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
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
      )}
    </div>
  );
};

export default InventoryView;
