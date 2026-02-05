
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ShoppingCart, 
  MessageSquare, 
  Tag, 
  AlertTriangle,
  Lightbulb,
  Smartphone,
  Headphones,
  ShoppingBag
} from 'lucide-react';

interface Reminder {
  id: string;
  text: string;
  category: 'Acessórios' | 'Peças' | 'Insumos' | 'Outros';
  checked: boolean;
}

const ShoppingListView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reminders' | 'stock'>('reminders');
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Capinhas iPhone 15 (Transparente e Silicone)', category: 'Acessórios', checked: false },
    { id: '2', text: 'Películas 3D para linha Samsung S23', category: 'Acessórios', checked: false },
    { id: '3', text: 'Caixas de Som Bluetooth (Tipo JBL Go)', category: 'Acessórios', checked: true },
    { id: '4', text: 'Cabos USB-C Turbo (Qualidade Premium)', category: 'Acessórios', checked: false },
  ]);
  const [newReminder, setNewReminder] = useState('');
  const [newCategory, setNewCategory] = useState<Reminder['category']>('Acessórios');

  // Mock de estoque baixo sincronizado
  const lowStockItems = [
    { name: 'Película Cerâmica iPhone 11', stock: 2, min: 10, category: 'Acessórios' },
    { name: 'Tela iPhone 12 Incell', stock: 1, min: 3, category: 'Peças' },
    { name: 'Bateria iPhone XR Gold', stock: 0, min: 2, category: 'Peças' },
    { name: 'Carregador 20W DJE Tech', stock: 3, min: 15, category: 'Acessórios' },
  ];

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    const newItem: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      text: newReminder,
      category: newCategory,
      checked: false
    };
    setReminders([newItem, ...reminders]);
    setNewReminder('');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const shareList = () => {
    const listText = reminders
      .filter(r => !r.checked)
      .map(r => `• [${r.category}] ${r.text}`)
      .join('\n');
    
    const stockText = lowStockItems
      .map(i => `• [ESTOQUE BAIXO] ${i.name} (Restam ${i.stock})`)
      .join('\n');

    const fullMessage = `*LISTA DE COMPRAS - DJE CELULARES*\n\n*LEMBRETES:*\n${listText || 'Nenhum'}\n\n*REPOSIÇÃO URGENTE:*\n${stockText}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-blue-600" /> Lista de Compras
          </h2>
          <p className="text-slate-500 font-medium">Não perca vendas por falta de acessórios ou peças.</p>
        </div>
        <button 
          onClick={shareList}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95"
        >
          <MessageSquare size={18} /> Enviar p/ WhatsApp
        </button>
      </div>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab('reminders')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'reminders' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Lightbulb size={16} /> Lembretes de Loja
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'stock' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <AlertTriangle size={16} /> Reposição de Estoque
        </button>
      </div>

      {activeTab === 'reminders' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Adicionar Novo */}
          <div className="lg:col-span-4 sticky top-24">
            <form onSubmit={addReminder} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest border-b pb-4">Anotar Necessidade</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">O que comprar?</label>
                  <input 
                    type="text" 
                    value={newReminder}
                    onChange={e => setNewReminder(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Capinha S24 Ultra Preta"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Categoria</label>
                  <select 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as Reminder['category'])}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Acessórios">Acessórios (Venda)</option>
                    <option value="Peças">Peças (Reparo)</option>
                    <option value="Insumos">Insumos (Bancada)</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                <Plus size={18} /> Adicionar na Lista
              </button>
            </form>
          </div>

          {/* Lista de Lembretes */}
          <div className="lg:col-span-8 space-y-4">
            {reminders.length === 0 && (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Sua lista está vazia</h3>
                <p className="text-slate-400 text-sm mt-2">Anote aqui o que os clientes estão pedindo!</p>
              </div>
            )}
            
            {reminders.map(r => (
              <div 
                key={r.id} 
                className={`bg-white p-6 rounded-3xl border transition-all flex items-center justify-between group ${r.checked ? 'border-slate-50 opacity-60' : 'border-slate-100 shadow-sm'}`}
              >
                <div className="flex items-center gap-6">
                  <button onClick={() => toggleReminder(r.id)} className={`transition-colors ${r.checked ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}>
                    {r.checked ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </button>
                  <div>
                    <h4 className={`font-black text-lg ${r.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>{r.text}</h4>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      r.category === 'Acessórios' ? 'bg-indigo-50 text-indigo-600' : 
                      r.category === 'Peças' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {r.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteReminder(r.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Aba de Estoque Baixo */
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-amber-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">Alerta de Reposição</h3>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Sincronizado com seu Estoque Atual</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50/50">
                  <th className="px-8 py-5">Item com Estoque Baixo</th>
                  <th className="px-4 py-5 text-center">Atual</th>
                  <th className="px-4 py-5 text-center">Mínimo Ideal</th>
                  <th className="px-4 py-5">Status Crítico</th>
                  <th className="px-8 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lowStockItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${item.category === 'Acessórios' ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-500'}`}>
                          {item.category === 'Acessórios' ? <Headphones size={20} /> : <Smartphone size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className={`font-black text-lg ${item.stock === 0 ? 'text-rose-600' : 'text-amber-600'}`}>{item.stock}</span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className="font-black text-slate-400">{item.min}</span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stock === 0 ? 'bg-red-500' : 'bg-amber-500'}`} 
                          style={{ width: `${Math.min((item.stock / item.min) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">Ver Fornecedores</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListView;
