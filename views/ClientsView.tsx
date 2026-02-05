
import React, { useState } from 'react';
import { Search, Plus, UserCircle, Phone, MapPin, Edit, Trash2, X, Save } from 'lucide-react';

const ClientsView: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: '1', name: 'João Silva', cpf: '123.456.789-00', phone: '(11) 98888-7777', email: 'joao@email.com', city: 'São Paulo' },
    { id: '2', name: 'Maria Oliveira', cpf: '987.654.321-11', phone: '(11) 97777-6666', email: 'maria@email.com', city: 'Campinas' },
    { id: '3', name: 'Ricardo Santos', cpf: '444.555.666-88', phone: '(21) 96666-5555', email: 'ric@email.com', city: 'Rio de Janeiro' },
  ];

  if (isFormOpen) {
    return (
      <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
          <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Novo Cadastro de Cliente</h2>
             <p className="text-slate-500 text-sm">Preencha as informações para a base de dados.</p>
          </div>
          <button onClick={() => setIsFormOpen(false)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"><X size={20}/></button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
           <div className="space-y-6">
              <h3 className="font-black text-xs uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-blue-600/10 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div></div>
                 Identificação Principal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Nome Completo *</label>
                  <input type="text" required className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="Ex: José da Silva Sauro" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">CPF ou CNPJ</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone Principal (WhatsApp)</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone Secundário</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">E-mail</label>
                  <input type="email" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="cliente@email.com" />
                </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="font-black text-xs uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
                 <div className="w-4 h-4 rounded-full bg-indigo-600/10 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div></div>
                 Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Rua / Logradouro</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Número</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Complemento</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Bairro</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Cidade</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Estado (UF)</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold text-center uppercase" maxLength={2} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">CEP</label>
                  <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" placeholder="00000-000" />
                </div>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Observações do Perfil</label>
              <textarea className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm font-medium" rows={4} placeholder="Ex: Cliente antigo, sempre traz iPhones. Prefere contato via WhatsApp."></textarea>
           </div>

           <div className="flex justify-end gap-4 pt-8">
              <button onClick={() => setIsFormOpen(false)} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">Descartar</button>
              <button className="px-12 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest flex items-center gap-3 active:scale-95">
                 <Save size={20} />
                 Salvar Cliente
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-[450px]">
          <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF, telefone..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold text-slate-700 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-all"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-all">
                <UserCircle size={32} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2.5 bg-white border border-slate-100 hover:border-blue-200 text-slate-600 rounded-xl shadow-sm hover:text-blue-600"><Edit size={18} /></button>
                <button className="p-2.5 bg-white border border-slate-100 hover:border-rose-200 text-rose-500 rounded-xl shadow-sm hover:bg-rose-50"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <h3 className="font-black text-xl text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{client.name}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{client.cpf}</p>
            
            <div className="space-y-3 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Phone size={16} />
                </div>
                {client.phone}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <MapPin size={16} />
                </div>
                {client.city}
              </div>
            </div>
            
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-inner">
              Ver Histórico de OS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsView;
