
import { toast } from 'sonner';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, Eye, Printer, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { OSStatus, OSType, ServiceOrder } from '../types';
import { api } from '../services/api';
import { getServiceOrdersPaged } from '../services/api';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface ServiceOrdersListProps {
  onNewOS: () => void;
  onViewOS: (os: ServiceOrder) => void;
  onPrintOS: (os: ServiceOrder) => void;
  onDeleteOS: (id: string) => void;
}

const ServiceOrdersList: React.FC<ServiceOrdersListProps> = ({ onNewOS, onViewOS, onPrintOS, onDeleteOS }) => {
  const [textFilter, setTextFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OSStatus | ''>('');
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadOrders = useCallback(async (status?: OSStatus) => {
    setIsLoading(true);
    setOrders([]);
    setLastDoc(null);
    try {
      const result = await getServiceOrdersPaged(status || undefined);
      setOrders(result.orders);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Erro ao carregar ordens de serviço:', error);
      toast.error('Erro ao carregar ordens de serviço.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(statusFilter as OSStatus || undefined);
  }, [statusFilter]);

  const loadMore = async () => {
    if (!lastDoc || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await getServiceOrdersPaged(statusFilter as OSStatus || undefined, lastDoc);
      setOrders(prev => [...prev, ...result.orders]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Erro ao carregar mais OS:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente cancelar esta Ordem de Serviço? (A OS será marcada como cancelada, não excluída)')) {
      try {
        await onDeleteOS(id);
        setOrders(prev => prev.filter(os => os.id !== id));
        toast.success('Ordem de Serviço cancelada.');
      } catch (error) {
        console.error('Erro ao cancelar OS:', error);
        toast.error('Erro ao cancelar Ordem de Serviço.');
      }
    }
  };

  // Filtro de texto é client-side (busca no lote já carregado)
  const filteredOrders = orders.filter(os => {
    if (!textFilter) return true;
    const t = textFilter.toLowerCase();
    return (
      (os.clientName?.toLowerCase() || '').includes(t) ||
      (os.osNumber || '').includes(t) ||
      (os.device?.model?.toLowerCase() || '').includes(t) ||
      (os.device?.imei || '').includes(t)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, OS, IMEI..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm font-semibold"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-semibold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OSStatus | '')}
          >
            <option value="">Todos os Status</option>
            {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button 
          onClick={onNewOS}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          <Plus size={18} />
          Nova OS / Orçamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando Ordens...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma ordem encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b">
                  <th className="px-6 py-4">Nº OS</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Cliente / Aparelho</th>
                  <th className="px-6 py-4">Problema</th>
                  <th className="px-6 py-4 text-center">Responsável</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Abertura</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((os) => (
                  <tr key={os.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600">{os.osNumber || '---'}</span>
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
                      <div className="text-sm font-bold text-slate-800">{os.clientName || 'N/A'}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">
                        {os.device?.brand || 'N/A'} {os.device?.model || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium truncate max-w-[200px]">{os.problemReported}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-semibold">{os.responsibleName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[os.status]}`}>
                        {os.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-bold whitespace-nowrap">
                      {os.openedAt ? (
                        <>
                          <div className="font-semibold text-slate-700">{new Date(os.openedAt).toLocaleDateString('pt-BR')}</div>
                          <div className="text-[10px] text-slate-400">{new Date(os.openedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          title="Visualizar" 
                          onClick={() => onViewOS(os)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          title="Imprimir" 
                          onClick={() => onPrintOS(os)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          title="Excluir" 
                          onClick={() => handleDelete(os.id)}
                          className="p-1.5 hover:bg-slate-100 text-rose-500 rounded-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button className="md:hidden p-1.5 hover:bg-slate-100 text-slate-600 rounded-md"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hasMore && !isLoading && (
          <div className="flex justify-center py-6 border-t border-slate-100">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {isLoadingMore ? <Loader2 className="animate-spin" size={16} /> : <ChevronDown size={16} />}
              {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceOrdersList;
