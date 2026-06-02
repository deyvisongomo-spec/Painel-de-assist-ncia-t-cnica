
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, Plus, ArrowRight, Smartphone, AlertTriangle, Timer, PackageSearch, Loader2 } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { api } from '../services/api';
import { Product, ServiceOrder, CashTransaction } from '../types';

interface DashboardProps {
  onNewOS: () => void;
  onViewAllOS: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewOS, onViewAllOS }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deadStockCount, setDeadStockCount] = useState(0);
  const [recentOS, setRecentOS] = useState<ServiceOrder[]>([]);
  const [stats, setStats] = useState({
    osToday: 0,
    criticalStock: 0,
    revenue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [os, products, transactions, deadItems] = await Promise.all([
        api.getServiceOrders(),
        api.getInventory(),
        api.getTransactions(),
        api.getDeadStock()
      ]);

      const today = new Date().toISOString().split('T')[0];
      
      const osToday = os.filter(o => o.openedAt && typeof o.openedAt === 'string' && o.openedAt.startsWith(today)).length;
      const criticalStock = products.filter(p => p.quantity <= p.minQuantity).length;
      const revenue = transactions
        .filter(t => t.date === today && t.type === 'entrada')
        .reduce((acc, t) => acc + (t.value || 0), 0);

      setStats({ osToday, criticalStock, revenue });
      setRecentOS(os.slice(0, 5));
      setDeadStockCount(deadItems.length);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'OS Hoje', value: stats.osToday.toString(), icon: <Plus className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Estoque Crítico', value: stats.criticalStock.toString(), icon: <AlertTriangle className={`text-amber-600 ${stats.criticalStock > 0 ? 'animate-pulse' : ''}`} />, color: 'bg-amber-50' },
    { label: 'Estoque Parado (+60d)', value: deadStockCount.toString(), icon: <Timer className="text-rose-600" />, color: 'bg-rose-50' },
    { label: 'Faturamento Hoje', value: `R$ ${stats.revenue.toFixed(2)}`, icon: <DollarSign className="text-emerald-600" />, color: 'bg-emerald-50' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sincronizando Sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">PainelCell</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Gestão de Assistência & Acessórios</p>
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
        {dashboardStats.map((stat, i) => (
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
          {recentOS.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma OS recente</p>
            </div>
          ) : (
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
                      <div className="font-black text-blue-600 text-xs">#{os.id?.slice(-4).toUpperCase() || '????'}</div>
                      <div className="text-xs font-bold text-slate-800">{os.clientName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-600">
                          {os.device?.brand || 'N/A'} {os.device?.model || ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_COLORS[os.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {os.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-[10px] font-black text-slate-400">
                      <div>{new Date(os.openedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                      <div className="font-medium text-slate-300">{new Date(os.openedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
