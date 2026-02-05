
import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Printer, Trash2 } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { OSStatus, OSType } from '../types';

interface ServiceOrdersListProps {
  onNewOS: () => void;
}

const ServiceOrdersList: React.FC<ServiceOrdersListProps> = ({ onNewOS }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Mock list
  const orders = [
    { id: '1', os: '8452', client: 'João Silva', device: 'iPhone 13', type: OSType.REPARO, problem: 'Tela quebrada', tech: 'Lucas', status: OSStatus.EM_SERVICO, openedAt: '22/05 09:30', forecast: '23/05' },
    { id: '2', os: '8451', client: 'Maria Oliveira', device: 'Galaxy S21', type: OSType.ORCAMENTO, problem: 'Não liga', tech: 'Bruna', status: OSStatus.EM_ANALISE, openedAt: '22/05 10:15', forecast: '22/05' },
    { id: '3', os: '8450', client: 'Pedro Santos', device: 'Redmi Note 11', type: OSType.GARANTIA, problem: 'Touch falhando', tech: 'Lucas', status: OSStatus.RECEBIDO, openedAt: '21/05 14:00', forecast: '22/05' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, OS, IMEI..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Todos os Status</option>
            {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button 
          onClick={onNewOS}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-100"
        >
          <Plus size={18} />
          Nova OS / Orçamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b">
                <th className="px-6 py-4">Nº OS</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Cliente / Aparelho</th>
                <th className="px-6 py-4">Problema</th>
                <th className="px-6 py-4 text-center">Técnico</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Abertura</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">#{os.os}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      os.type === OSType.ORCAMENTO ? 'border-amber-200 text-amber-600 bg-amber-50' : 
                      os.type === OSType.GARANTIA ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-slate-200 text-slate-500 bg-slate-50'
                    }`}>
                      {os.type === OSType.GARANTIA ? 'Garantia' : os.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{os.client}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{os.device}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{os.problem}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{os.tech}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[os.status]}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{os.openedAt}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Visualizar" className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"><Eye size={16} /></button>
                      <button title="Imprimir" className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"><Printer size={16} /></button>
                      <button title="Excluir" className="p-1.5 hover:bg-slate-100 text-rose-500 rounded-md"><Trash2 size={16} /></button>
                    </div>
                    <button className="md:hidden p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"><MoreVertical size={16} /></button>
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

export default ServiceOrdersList;
