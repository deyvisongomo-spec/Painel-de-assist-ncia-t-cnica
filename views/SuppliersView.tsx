
import React, { useState } from 'react';
import { 
  Search, Plus, Truck, Phone, MapPin, Edit, Trash2, X, Save, 
  PackageSearch, Tag, AlertTriangle, ShoppingCart, MessageSquare, ArrowUpRight 
} from 'lucide-react';

const SuppliersView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'suggestions'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const suppliers = [
    { 
      id: '1', 
      name: 'Sky Peças Import', 
      contact: 'Anderson (Vendas)', 
      phone: '5511912345678', 
      address: 'Rua Santa Ifigênia, 120 - SP', 
      items: 'Telas Premium, Baterias Gold, Flex de Carga' 
    },
    { 
      id: '2', 
      name: 'Master Cell Atacado', 
      contact: 'Cláudia', 
      phone: '5511987654321', 
      address: 'Av. Paulista, 500 - SP', 
      items: 'Máquinas de bancada, Estações de Solda, Insumos Químicos' 
    },
  ];

  // Dados simulados de estoque cruzado
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
                  <input type="text" required className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="Ex: Sky Peças Ltda" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone (Somente números com DDD)</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="5511999999999" />
                </div>
              </div>
           </div>
           
           <div className="flex justify-end gap-4 pt-8">
              <button onClick={() => setIsFormOpen(false)} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">Descartar</button>
              <button className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center gap-3 active:scale-95">
                 <Save size={20} />
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
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95"
          >
            <Plus size={20} />
            Novo Fornecedor
          </button>
        )}
      </div>

      {activeSubTab === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suppliers.map((sup) => (
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
