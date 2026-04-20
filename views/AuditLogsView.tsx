
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ActivityLog } from '../types';
import { History, Search, ShieldAlert, Info, AlertTriangle, Clock, User as UserIcon } from 'lucide-react';

const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) || 
    log.userName.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase())
  );

  const getSeverityStyle = (severity: ActivityLog['severity']) => {
    switch(severity) {
      case 'danger': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getSeverityIcon = (severity: ActivityLog['severity']) => {
    switch(severity) {
      case 'danger': return <ShieldAlert size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <History size={32} className="text-slate-400" /> Linha do Tempo da Loja
          </h2>
          <p className="text-slate-500 font-medium">Auditoria completa de todas as ações realizadas no PainelCell.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por ação ou usuário..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <th className="px-8 py-5">Quando</th>
                <th className="px-6 py-5">Responsável</th>
                <th className="px-6 py-5">Ação</th>
                <th className="px-8 py-5">Detalhes do Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                      <Clock size={14} className="text-slate-300" />
                      {new Date(log.timestamp).toLocaleString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserIcon size={14} />
                      </div>
                      <span className="text-sm font-black text-slate-700">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 w-fit ${getSeverityStyle(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{log.details}</p>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <History size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Nenhum registro encontrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;
