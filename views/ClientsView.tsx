
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, UserCircle, Phone, MapPin, Edit, Trash2, X, Save, Loader2, Upload, FileText } from 'lucide-react';
import { api } from '../services/api';
import { Client } from '../types';
import Papa from 'papaparse';
import { formatPhone, formatCPFOrCNPJ, formatCEP } from '../src/lib/utils';

const ClientsView: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    cpfCnpj: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      cpfCnpj: client.cpfCnpj || '',
      phone: client.phone,
      secondaryPhone: client.secondaryPhone || '',
      email: client.email || '',
      address: client.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
      notes: client.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await api.removeClient(id);
      loadClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente.');
    }
  };

  const handleImportPDF = () => {
    // This now triggers file input click
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        if (rows.length === 0) {
          alert('Arquivo CSV vazio ou inválido.');
          setIsImporting(false);
          return;
        }

        if (!confirm(`Encontrados ${rows.length} clientes na planilha! Deseja importar para o banco de dados agora?`)) {
           setIsImporting(false);
           return;
        }

        let successCount = 0;
        try {
          for (const row of rows) {
             // O CSV pode ter colunas chamadas Nome, CPF, Telefone, Email etc.
             const nome = row['Nome'] || row['nome'] || row['Name'] || row['name'] || Object.values(row)[0];
             if (!nome) continue; // Pula se n ter nome

             const cpfCnpj = row['CPF'] || row['cpf'] || row['Documento'] || row['CNPJ'] || '';
             const phone = row['Telefone'] || row['telefone'] || row['Phone'] || row['Celular'] || '';
             const email = row['Email'] || row['email'] || row['E-mail'] || '';

             await api.saveClient({
               name: String(nome),
               cpfCnpj: String(cpfCnpj),
               phone: String(phone),
               email: String(email),
               secondaryPhone: '',
               address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
               notes: 'Importado via planilha CSV/Excel',
               createdAt: new Date().toISOString()
             });
             successCount++;
          }
          alert(`✅ SUCESSO!\n${successCount} clientes importados perfeitamente.`);
          loadClients();
        } catch(err) {
          alert("Houve um erro no processo de importação. Verifique o console.");
          console.error(err);
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (err) => {
        alert('Erro ao ler a planilha: ' + err.message);
        setIsImporting(false);
      }
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) {
      alert('Nome e Telefone são obrigatórios!');
      return;
    }

    setIsSaving(true);
    try {
      if (editingClient) {
        await api.updateClient(editingClient.id, formData as any);
      } else {
        await api.saveClient(formData as any);
      }
      setIsFormOpen(false);
      setEditingClient(null);
      setFormData({
        name: '',
        cpfCnpj: '',
        phone: '',
        secondaryPhone: '',
        email: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
        notes: '',
      });
      loadClients();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Verifique o console.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.cpfCnpj && c.cpfCnpj.includes(searchTerm)) ||
    (c.phone && c.phone.includes(searchTerm))
  ).sort((a, b) => a.name.localeCompare(b.name));

  if (isFormOpen) {
    return (
      <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
          <div>
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
               {editingClient ? 'Editar Cliente' : 'Novo Cadastro de Cliente'}
             </h2>
             <p className="text-slate-500 text-sm">Preencha as informações para a base de dados.</p>
          </div>
          <button onClick={() => { setIsFormOpen(false); setEditingClient(null); }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 shadow-sm transition-all"><X size={20}/></button>
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
                  <input 
                    type="text" 
                    required 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="Ex: José da Silva Sauro"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">CPF ou CNPJ</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="000.000.000-00"
                    value={formData.cpfCnpj}
                    onChange={(e) => setFormData({...formData, cpfCnpj: formatCPFOrCNPJ(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone Principal (WhatsApp) *</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Telefone Secundário</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="(00) 00000-0000"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({...formData, secondaryPhone: formatPhone(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">E-mail</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="cliente@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
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
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                    value={formData.address.street}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Número</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                    value={formData.address.number}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, number: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Complemento</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                    value={formData.address.complement}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, complement: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Bairro</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                    value={formData.address.neighborhood}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, neighborhood: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Cidade</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold"
                    value={formData.address.city}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Estado (UF)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold text-center uppercase" 
                    maxLength={2}
                    value={formData.address.state}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value.toUpperCase()}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">CEP</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-semibold" 
                    placeholder="00000-000"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: formatCEP(e.target.value)}})}
                  />
                </div>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Observações do Perfil</label>
              <textarea 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm font-medium" 
                rows={4} 
                placeholder="Ex: Cliente antigo, sempre traz iPhones. Prefere contato via WhatsApp."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
           </div>

           <div className="flex justify-end gap-4 pt-8">
              <button 
                onClick={() => { setIsFormOpen(false); setEditingClient(null); }} 
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
                 {editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}
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
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={handleImportPDF}
            disabled={isImporting}
            className="bg-emerald-600 w-full md:w-auto hover:bg-emerald-700 text-white px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            title="Importar Clientes de Planilha (CSV)"
          >
            {isImporting ? <Loader2 size={24} className="animate-spin" /> : <><FileText size={20} /> CSV</>}
          </button>
          
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />

          <button 
             onClick={() => setIsFormOpen(true)}
             className="bg-blue-600 flex-1 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95"
           >
             <Plus size={20} />
             Novo Cliente
           </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando Clientes...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <UserCircle size={48} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Nenhum cliente encontrado</h3>
          <p className="text-slate-500 max-w-xs mb-6">Tente ajustar sua busca ou cadastre um novo cliente agora mesmo.</p>
          <button 
            onClick={handleImportPDF} 
            className="flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors"
          >
            <FileText size={18} />
            Importar de CSV ou Planilha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-all">
                  <UserCircle size={32} />
                </div>
                <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEdit(client)}
                    className="p-2.5 bg-white border border-slate-100 hover:border-blue-200 text-slate-600 rounded-xl shadow-sm hover:text-blue-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)}
                    className="p-2.5 bg-white border border-slate-100 hover:border-rose-200 text-rose-500 rounded-xl shadow-sm hover:bg-rose-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="font-black text-xl text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{client.name}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{client.cpfCnpj}</p>
              
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
                  {client.address.city}
                </div>
              </div>
              
              <button 
                onClick={async () => {
                  const orders = await api.getOS();
                  const clientOrders = orders.filter(o => o.clientId === client.id);
                  if (clientOrders.length > 0) {
                    // Aqui você pode implementar a navegação para o histórico
                    alert(`Este cliente possui ${clientOrders.length} ordens de serviço.`);
                  } else {
                    alert("Esse cliente não possui ordem de serviço");
                  }
                }}
                className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-inner"
              >
                Ver Histórico de OS
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsView;
