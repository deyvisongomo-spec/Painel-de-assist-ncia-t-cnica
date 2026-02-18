
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CommissionReport } from '../types';
import { Wallet, Calendar, Search, TrendingUp, Users, Download, ArrowRight } from 'lucide-react';

const CommissionsView: React.FC = () => {
  const [reports, setReports] = useState<CommissionReport[]>([]);
  const [dates, setDates] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    const data = await api.getCommissions(dates.start, dates.end);
    setReports(data);
  };

  useEffect(() => { loadData(); }, [dates]);

  const totalCommissions = reports.reduce((acc, r) => acc + r.commissionValue, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Wallet size={32} className="text-emerald-500" /> Painel de Comissões
          </h2>
          <p className="text-slate-500 font-medium">Cálculo automático baseado em Mão de Obra de OS entregues.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <Calendar size={18} className="text-slate-400 ml-2" />
            <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} className="bg-transparent font-bold text-xs outline-none" />
            <ArrowRight size={14} className="text-slate-300" />
            <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} className="bg-transparent font-bold text-xs outline-none" />
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-2">Total a Pagar (Equipe)</p>
          <h3 className="text-4xl font-black tracking-tighter">R$ {totalCommissions.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">OS Entregues no Período</p>
          <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{reports.reduce((acc, r) => acc + r.osCount, 0)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Faturamento em Mão de Obra</p>
          <h3 className="text-4xl font-black text-slate-800 tracking-tighter">R$ {reports.reduce((acc, r) => acc + r.totalServices, 0).toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
              <th className="px-8 py-6">Colaborador</th>
              <th className="px-6 py-6 text-center">Qtd. OS</th>
              <th className="px-6 py-6 text-right">Mão de Obra (R$)</th>
              <th className="px-6 py-6 text-right">Faturamento Total</th>
              <th className="px-8 py-6 text-right">Comissão Devida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reports.map((r) => (
              <tr key={r.userId} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black">
                      {r.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-black text-slate-700">{r.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="text-sm font-bold text-slate-600">{r.osCount}</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="text-sm font-bold text-slate-600">R$ {r.totalServices.toFixed(2)}</span>
                </td>
                <td className="px-6 py-6 text-right">
                   <span className="text-[10px] font-black text-slate-400">R$ {r.totalValue.toFixed(2)}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-sm">
                    R$ {r.commissionValue.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionsView;
