
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Plus, ArrowRight, Smartphone, AlertTriangle, Timer, PackageSearch } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { api } from '../services/api';
import { Product } from '../types';

interface DashboardProps {
  onNewOS: () => void;
  onViewAllOS: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewOS, onViewAllOS }) => {
  const [deadStockCount, setDeadStockCount] = useState(0);

  useEffect(() => {
    api.getDeadStock().then(items => setDeadStockCount(items.length));
  }, []);

  const stats = [
    { label: 'OS Hoje', value: '12', icon: <Plus className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Estoque Crítico', value: '8', icon: <AlertTriangle className="text-amber-600 animate-pulse" />, color: 'bg-amber-50' },
    { label: 'Estoque Parado (+60d)', value: deadStockCount.toString(), icon: <Timer className="text-rose-600" />, color: 'bg-rose-50' },
    { label: 'Faturamento', value: 'R$ 2.450', icon: <DollarSign className="text-emerald-600" />, color: 'bg-emerald-50' },
  ];

  const recentOS = [
    { id: '1', os: '8452', client: 'João Silva', device: 'iPhone 13', type: 'Reparo', status: 'Em serviço', date: '22/05' },
    { id: '2', os: '8451', client: 'Maria Oliveira', device: 'Galaxy S21', type: 'Orçamento', status: 'Em análise', date: '22/05' },
    { id: '3', os: '8450', client: 'Pedro Santos', device: 'Redmi Note 11', type: 'Garantia', status: 'Recebido', date: '21/05' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">Painel da Asim</h1>
          <p className="text-slate-500 font-medium">Gestão inteligente de Assistência & Vitrine.</p>
        </div>
        <button 
          onClick={onNewOS}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Abrir Nova OS
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {stat.label.includes('Parado') && deadStockCount > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
            )}
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-lg md:text-2xl font-black text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      {deadStockCount > 0 && (
        <div className="bg-rose-600 p-6 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-rose-100">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl"><PackageSearch size={24}/></div>
              <div>
                 <h4 className="font-black uppercase text-sm tracking-tight">Oportunidade de Caixa!</h4>
                 <p className="text-xs text-rose-100">Você tem {deadStockCount} itens sem venda há mais de 60 dias. Hora de fazer uma promoção?</p>
              </div>
           </div>
           <button className="bg-white text-rose-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-colors">
              Ver Itens Parados
           </button>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Atividade Recente</h3>
          <button 
            onClick={onViewAllOS}
            className="text-blue-600 hover:text-blue-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
          >
            Ver Todas <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b">
                <th className="px-6 py-4">OS / Cliente</th>
                <th className="px-6 py-4 hidden md:table-cell">Aparelho</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOS.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-black text-blue-600 text-xs">#{os.os}</div>
                    <div className="text-xs font-bold text-slate-800">{os.client}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-600">{os.device}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_COLORS[os.status]}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[10px] font-black text-slate-400">{os.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
