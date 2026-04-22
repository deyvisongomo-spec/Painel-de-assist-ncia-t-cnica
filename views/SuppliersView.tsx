import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Truck, Phone, MapPin, Edit, Trash2, X, Save, 
  PackageSearch, Tag, AlertTriangle, ShoppingCart, MessageSquare, ArrowUpRight, Loader2 
} from 'lucide-react';
import { api } from '../services/api';
import { Supplier } from '../types';
import { formatPhone } from '../src/lib/utils';

const SuppliersView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'suggestions'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    contact: '',
    phone: '',
    address: '',
    items: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Nome é obrigatório!');
      return;
    }

    setIsSaving(true);
    try {
      await api.saveSupplier(formData as any);
      setIsFormOpen(false);
      setFormData({
        name: '',
        contact: '',
        phone: '',
        address: '',
        items: '',
      });
      loadSuppliers();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor.');
    } finally {
      setIsSaving(false);
    }
  };

  // Dados simulados de estoque cruzado (Poderia vir da API também)
  const stockSuggestions = [
    { supplierId: '1', partName: 'Tela iPhone 13 Original', current: 1, min: 3, needs: 5 },
    { supplierId: '1', partName: 'Bateria iPhone 11', current: 0, min: 2, needs: 5 },
    { supplierId: '1', partName: 'Conector de Carga Moto G30', current: 2, min: 5, needs: 10 },
    { supplierId: '2', partName: 'Fluxo de Solda Amtech', current: 1, min: 2, needs: 3 },
  ];

  const handleSendToWhatsApp = (supplierName: string, phone: string, items: any[]) => {
    const message = `Olá ${supplierName}, gostaria de fazer um pedido de reposição para a DJE CELULARES:\n\n` + 
      items.map(i => `• ${i.partName}: ${i.needs} unid.`).join('\n') + 
      `\n\nFavor confirmar disponibilidade e valores.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFormOpen) {
    return (
      <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
          <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Novo Fornecedor</h2>
             <p className="text-slate-500 text-sm">Gestão de parceiros para suprimento de estoque.</p>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"><X size={20}/></button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
           <div className="space-y-6">
              <h3 className="font-black text-xs uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-blue-600/10 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div></div>
                 Dados Comerciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Razão Social / Nome Fantasia *</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="Ex: Sky Peças Ltda"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Contato (Vendedor)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="Ex: Anderson"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Endereço</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="Rua, Número, Cidade - UF"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Principais Itens Fornecidos</label>
                  <textarea 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold min-h-[100px]" 
                    placeholder="Ex: Telas, Baterias, Conectores..."
                    value={formData.items}
                    onChange={(e) => setFormData({...formData, items: e.target.value})}
                  />
                </div>
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
                 Salvar Fornecedor
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <button 
             onClick={() => setActiveSubTab('list')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Parceiros
           </button>
           <button 
             onClick={() => setActiveSubTab('suggestions')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === 'suggestions' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <AlertTriangle size={14} /> Reposição Inteligente
           </button>
        </div>
        
        {activeSubTab === 'list' && (
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 w-full md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar fornecedor..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm font-semibold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95 text-xs"
            >
              <Plus size={20} />
              Novo Fornecedor
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando Fornecedores...</p>
        </div>
      ) : activeSubTab === 'list' ? (
        filteredSuppliers.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <Truck className="text-slate-200 mb-6" size={64} />
            <h3 className="text-xl font-black text-slate-800 mb-2">Sem Fornecedores</h3>
            <p className="text-slate-500 max-w-xs">Cadastre seus parceiros para facilitar a reposição de estoque.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSuppliers.map((sup) => (
              <div key={sup.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col md:flex-row gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-105 transition-all">
                        <Truck size={40} />
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-black text-xl text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{sup.name}</h3>
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{sup.contact}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                        <PackageSearch size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Principais Produtos:</p>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">{sup.items}</p>
                        </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <button className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            Catálogo de Preços
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-8">
           {suppliers.map(sup => {
             const needs = stockSuggestions.filter(s => s.supplierId === sup.id);
             if (needs.length === 0) return null;

             return (
               <div key={sup.id} className="bg-white rounded-[2.5rem] border border-amber-100 shadow-sm overflow-hidden border-l-8 border-l-amber-500">
                  <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-amber-50/30">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-600"><ShoppingCart size={24}/></div>
                        <div>
                           <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">{sup.name}</h3>
                           <p className="text-xs font-bold text-slate-500">{needs.length} itens aguardando reposição</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => handleSendToWhatsApp(sup.name, sup.phone, needs)}
                       className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95"
                     >
                       <MessageSquare size={18} /> Gerar Pedido WhatsApp
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50/50">
                              <th className="px-8 py-4">Peça / Insumo</th>
                              <th className="px-4 py-4 text-center">Atual</th>
                              <th className="px-4 py-4 text-center">Mínimo</th>
                              <th className="px-4 py-4 text-center">Status</th>
                              <th className="px-8 py-4 text-right">Sugestão Compra</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {needs.map((item, idx) => (
                             <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5">
                                   <div className="font-black text-slate-800 text-sm">{item.partName}</div>
                                   <div className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Código: REPO-{idx+100}</div>
                                </td>
                                <td className="px-4 py-5 text-center">
                                   <span className="font-black text-slate-800">{item.current}</span>
                                </td>
                                <td className="px-4 py-5 text-center">
                                   <span className="font-black text-slate-400">{item.min}</span>
                                </td>
                                <td className="px-4 py-5">
                                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${item.current === 0 ? 'bg-red-500' : 'bg-amber-500'}`} 
                                        style={{ width: `${(item.current / item.min) * 100}%` }}
                                      ></div>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-black text-xs">
                                      +{item.needs} unid.
                                   </span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};

export default SuppliersView;
