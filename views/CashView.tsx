
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, ShoppingCart, Plus, Search, Trash2, FileText, Calendar, X, Save, Loader2 } from 'lucide-react';
import CashReportView from './CashReportView';
import { api } from '../services/api';
import { CashTransaction } from '../types';

const CashView: React.FC = () => {
  const [isQuickSale, setIsQuickSale] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for manual transaction
  const [formData, setFormData] = useState<Omit<CashTransaction, 'id' | 'date'>>({
    description: '',
    type: 'entrada',
    value: 0,
    paymentMethod: 'Pix',
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!formData.description || formData.value <= 0) {
      alert('Descrição e Valor são obrigatórios!');
      return;
    }

    setIsSaving(true);
    try {
      await api.saveTransaction({
        ...formData,
        date: new Date().toISOString(),
      });
      setIsFormOpen(false);
      setFormData({
        description: '',
        type: 'entrada',
        value: 0,
        paymentMethod: 'Pix',
      });
      loadTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação.');
    } finally {
      setIsSaving(false);
    }
  };

  const totals = transactions.reduce((acc, t) => {
    const isToday = new Date(t.date).toDateString() === new Date().toDateString();
    if (isToday) {
      if (t.type === 'entrada') acc.entries += t.value;
      else acc.exits += t.value;
    }
    return acc;
  }, { entries: 0, exits: 0 });

  if (showReport) {
    return <CashReportView transactions={transactions} onBack={() => setShowReport(false)} />;
  }

  if (isQuickSale) {
    return (
      <div className="animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="text-blue-600" /> Venda Rápida</h2>
           <button onClick={() => setIsQuickSale(false)} className="px-6 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 font-bold transition-all shadow-sm">Cancelar Venda</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Adicionar Produto</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" placeholder="Nome do produto ou código de barras..." />
                </div>
                <button className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-all">Adicionar</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                   <tr>
                     <th className="px-6 py-4">Item</th>
                     <th className="px-6 py-4 text-center">Qtd</th>
                     <th className="px-6 py-4 text-right">Unitário</th>
                     <th className="px-6 py-4 text-right">Total</th>
                     <th className="px-6 py-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {/* Itens da venda rápida seriam gerenciados aqui */}
                 </tbody>
               </table>
               <div className="p-10 text-center text-slate-400 italic">
                 Nenhum item adicionado à venda.
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Total da Venda</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-400">
                   <span>Subtotal:</span>
                   <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                   <span>Desconto:</span>
                   <span>- R$ 0,00</span>
                </div>
                <div className="flex justify-between text-3xl font-bold pt-4">
                   <span>Total:</span>
                   <span>R$ 0,00</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                 <div>
                   <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Forma de Pagamento</label>
                   <select className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <option>Pix</option>
                     <option>Cartão de Crédito</option>
                     <option>Dinheiro</option>
                   </select>
                 </div>
                 <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900 transition-all">
                   Finalizar Venda
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
          <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nova Movimentação</h2>
             <p className="text-slate-500 text-sm">Registre entradas ou saídas manuais do caixa.</p>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"><X size={20}/></button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Descrição *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  placeholder="Ex: Pagamento de Aluguel, Venda de Acessório"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Tipo *</label>
                <select 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="entrada">Entrada (+)</option>
                  <option value="saida">Saída (-)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Valor (R$) *</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Forma de Pagamento</label>
                <select 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                >
                  <option>Pix</option>
                  <option>Dinheiro</option>
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>Transferência</option>
                </select>
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
                onClick={handleSaveTransaction}
                disabled={isSaving}
                className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                 {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Salvar Lançamento
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Fluxo Financeiro</h2>
          <p className="text-slate-500">Gerencie entradas, saídas e relatórios de fechamento.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setShowReport(true)}
             className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-2 rounded-xl font-bold transition-all"
           >
             <FileText size={18} /> Fechamento de Caixa
           </button>
           <button onClick={() => setIsQuickSale(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-100">
             <ShoppingCart size={18} /> Venda Rápida
           </button>
           <button 
             onClick={() => setIsFormOpen(true)}
             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold"
           >
             <Plus size={18} /> Nova Movimentação
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 text-emerald-600 mb-2">
             <ArrowUpCircle size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Entradas Hoje</span>
           </div>
           <p className="text-3xl font-black text-slate-800">R$ {totals.entries.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 text-rose-600 mb-2">
             <ArrowDownCircle size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Saídas Hoje</span>
           </div>
           <p className="text-3xl font-black text-slate-800">R$ {totals.exits.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
           <div className="flex items-center gap-3 text-blue-400 mb-2">
             <DollarSign size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Saldo do Dia</span>
           </div>
           <p className="text-3xl font-black">R$ {(totals.entries - totals.exits).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-slate-800">Lançamentos Recentes</h3>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando Lançamentos...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum lançamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b">
                 <tr>
                   <th className="px-6 py-4">Data/Hora</th>
                   <th className="px-6 py-4">Descrição</th>
                   <th className="px-6 py-4">Tipo</th>
                   <th className="px-6 py-4">Pagamento</th>
                   <th className="px-6 py-4 text-right">Valor</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {transactions.map(t => (
                   <tr key={t.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 text-xs text-slate-500">
                       {new Date(t.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                     </td>
                     <td className="px-6 py-4 text-sm font-semibold">{t.description}</td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.type === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                         {t.type}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-xs text-slate-500">{t.paymentMethod}</td>
                     <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {t.type === 'entrada' ? '+' : '-'} R$ {t.value.toFixed(2)}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashView;
