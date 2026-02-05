
import React, { useState } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, ShoppingCart, Plus, Search, Trash2, FileText, Calendar } from 'lucide-react';
import CashReportView from './CashReportView';

const CashView: React.FC = () => {
  const [isQuickSale, setIsQuickSale] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Mock de transações para demonstração
  const transactions = [
    { id: '1', desc: 'Sinal OS #8452', type: 'entrada', val: 150, date: '2024-05-22T10:45:00', method: 'Pix' },
    { id: '2', desc: 'Venda Película 3D', type: 'entrada', val: 45, date: '2024-05-22T11:15:00', method: 'Dinheiro' },
    { id: '3', desc: 'Compra de Suprimentos', type: 'saida', val: 80, date: '2024-05-22T12:00:00', method: 'Cartão de Débito' },
    { id: '4', desc: 'Troca de Tela iPhone 11', type: 'entrada', val: 450, date: '2024-05-22T14:30:00', method: 'Cartão de Crédito' },
    { id: '5', desc: 'Conector de Carga Moto G8', type: 'entrada', val: 120, date: '2024-05-21T16:00:00', method: 'Pix' },
  ];

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
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold">Capa Silicone iPhone 13 - Azul</td>
                      <td className="px-6 py-4 text-center">1</td>
                      <td className="px-6 py-4 text-right text-sm">R$ 50,00</td>
                      <td className="px-6 py-4 text-right text-sm font-bold">R$ 50,00</td>
                      <td className="px-6 py-4 text-center"><button className="text-rose-400 hover:text-rose-600"><Trash2 size={16}/></button></td>
                    </tr>
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
           <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold">
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
           <p className="text-3xl font-black text-slate-800">R$ 645,00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 text-rose-600 mb-2">
             <ArrowDownCircle size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Saídas Hoje</span>
           </div>
           <p className="text-3xl font-black text-slate-800">R$ 80,00</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
           <div className="flex items-center gap-3 text-blue-400 mb-2">
             <DollarSign size={24} />
             <span className="text-xs font-bold uppercase tracking-wider">Saldo do Dia</span>
           </div>
           <p className="text-3xl font-black">R$ 565,00</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-slate-800">Lançamentos Recentes</h3>
        </div>
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
                   <td className="px-6 py-4 text-sm font-semibold">{t.desc}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.type === 'entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                       {t.type}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-xs text-slate-500">{t.method}</td>
                   <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                     {t.type === 'entrada' ? '+' : '-'} R$ {t.val.toFixed(2)}
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashView;
