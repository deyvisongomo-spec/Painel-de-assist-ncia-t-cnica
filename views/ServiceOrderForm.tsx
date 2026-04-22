
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, UserPlus, Search, Smartphone, Printer, FileText, CheckCircle2, ShieldAlert, Plus, Trash2, Loader2, DollarSign, MessageCircle
} from 'lucide-react';
import { OS_BRANDS, STATUS_COLORS } from '../constants';
import { OSStatus, OSType, Client, Product } from '../types';
import { api } from '../services/api';
import { OSPrintLayouts } from '../components/OSPrintLayouts';

interface ServiceOrderFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  printOnLoad?: boolean;
}

const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onBack, onSave, initialData, printOnLoad }) => {
  const [printFormat, setPrintFormat] = useState<'80mm' | 'a4'>('80mm');
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  const [config, setConfig] = useState({
    logo: '',
    name: 'DJE CELULARES',
    cnpj: '49.275.843/0001-90',
    phone: '(31) 2028-1027',
    whatsapp: '(31) 99544-9149',
    email: 'deyvisongomo@gmail.com',
    address: 'Av. Nossa Senhora do Carmo, 425, Vila do Carmo, Mariana - MG',
    responsible: 'DEYVISON GOMES DOS SANTOS',
    terms: 'Garantia legal de 90 dias conforme CDC. A garantia não cobre danos por líquidos ou quedas.'
  });

  const [formData, setFormData] = useState({
    type: OSType.REPARO,
    clientId: '',
    clientName: '',
    model: '',
    brand: 'Samsung',
    color: '',
    capacity: '',
    imei: '',
    password: '',
    itemsLeft: '',
    problemReported: '',
    technicalDiagnosis: '',
    servicesToExecute: '',
    laborValue: 0,
    parts: [] as { id: string; name: string; quantity: number; unitPrice: number }[],
    status: OSStatus.RECEBIDO,
    termsAccepted: false
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clientsData, inventoryData] = await Promise.all([
        api.getClients(),
        api.getInventory()
      ]);
      setClients(clientsData);
      setInventory(inventoryData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('app_config');
    if (saved) setConfig(JSON.parse(saved));
    loadData();

    if (initialData) {
      setFormData({
        ...initialData,
        model: initialData.device?.model || '',
        brand: initialData.device?.brand || 'Samsung',
        color: initialData.device?.color || '',
        capacity: initialData.device?.capacity || '',
        imei: initialData.device?.imei || '',
        password: initialData.device?.password || '',
        itemsLeft: Array.isArray(initialData.device?.itemsLeft) ? initialData.device.itemsLeft.join(', ') : (initialData.device?.itemsLeft || ''),
        problemReported: initialData.problemReported || '',
        technicalDiagnosis: initialData.technicalDiagnosis || '',
        servicesToExecute: initialData.servicesToExecute || '',
        parts: initialData.parts || [], 
        termsAccepted: true 
      });

      if (printOnLoad) {
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    }
  }, [initialData, printOnLoad]);

  const totalParts = formData.parts.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);
  const totalOS = formData.laborValue + totalParts;

  const handlePrint = (format: '80mm' | 'a4') => {
    setPrintFormat(format);
    setTimeout(() => window.print(), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ServiceOrderForm: handleSubmit iniciado');
    if (!formData.clientName) return alert("Por favor, selecione ou informe o cliente.");
    if (!formData.termsAccepted) return alert("Por favor, aceite os termos.");
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar OS:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.phone.includes(clientSearchTerm)
  );

  const selectedClientData = clients.find(c => c.id === formData.clientId);

  const handleWhatsAppNotify = () => {
    if (!selectedClientData?.phone) return alert("Cliente não possui telefone cadastrado.");
    const cleanPhone = selectedClientData.phone.replace(/\D/g, '');
    let msg = `Olá *${formData.clientName}*! 👋\n\n`;
    msg += `Passando para dar atualizações sobre o seu aparelho: *${formData.brand} ${formData.model}*.\n`;
    
    if (formData.status === OSStatus.PRONTO_RETIRADA) {
      msg += `🎉 *Ótimas notícias! O aparelho já está PRONTO para retirada.*\n\nO valor do serviço ficou em *R$ ${totalOS.toFixed(2)}*.\n`;
    } else if (formData.status === OSStatus.EM_ANALISE) {
      msg += `📋 Temos o orçamento em análise/pronto para o seu aparelho. O total previsto é de *R$ ${totalOS.toFixed(2)}*.\nPor favor, confirme se podemos seguir com o reparo.\n`;
    } else {
      msg += `O status atual da sua OS (#${initialData?.osNumber || 'recém criada'}) é: *${formData.status}*.\n`;
    }
    msg += `\nQualquer dúvida estamos à disposição. _${config.name}_.`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/55${cleanPhone}?text=${encodedMsg}`, '_blank');
  };

  const addPart = (product: Product) => {
    const existing = formData.parts.find(p => p.id === product.id);
    if (existing) {
      setFormData({
        ...formData,
        parts: formData.parts.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
      });
    } else {
      setFormData({
        ...formData,
        parts: [...formData.parts, { id: product.id, name: product.name, quantity: 1, unitPrice: product.salePrice }]
      });
    }
  };

  const removePart = (id: string) => {
    setFormData({
      ...formData,
      parts: formData.parts.filter(p => p.id !== id)
    });
  };

  const selectClient = (client: Client) => {
    setFormData({
      ...formData,
      clientId: client.id,
      clientName: client.name
    });
    setShowClientSearch(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-in slide-in-from-right duration-300">
      <OSPrintLayouts
        printFormat={printFormat}
        config={config}
        initialData={initialData}
        formData={formData}
        selectedClientData={selectedClientData}
        totalOS={totalOS}
      />

      {/* HEADER DE AÇÕES (WEB) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Nova Ficha de OS</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PainelCell - Gestão de Assistência</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex gap-2">
          {initialData && selectedClientData?.phone && (
            <button 
              type="button"
              onClick={handleWhatsAppNotify} 
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-200 hover:bg-green-600 transition-all col-span-2 md:col-span-1"
            >
              <MessageCircle size={16}/> Notificar Info
            </button>
          )}
          <button onClick={() => handlePrint('a4')} className="flex items-center justify-center gap-2 bg-white border-2 border-slate-900 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-900 hover:text-white transition-all"><FileText size={16}/> A4</button>
          <button onClick={() => handlePrint('80mm')} className="flex items-center justify-center gap-2 bg-white border-2 border-blue-600 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Printer size={16}/> 80mm</button>
          <button 
            type="submit" 
            form="os-form" 
            disabled={isSaving}
            className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16}/>} 
            Salvar Registro
          </button>
        </div>
      </div>

      <form id="os-form" onSubmit={handleSubmit} className="space-y-6 no-print">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Smartphone size={24}/></div>
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Dados do Aparelho & Cliente</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proprietário</label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    value={formData.clientName} 
                    onChange={e => {
                      setFormData({...formData, clientName: e.target.value, clientId: ''});
                      setClientSearchTerm(e.target.value);
                      setShowClientSearch(true);
                    }} 
                    onFocus={() => setShowClientSearch(true)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Nome do Cliente" 
                  />
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
                {showClientSearch && filteredClients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto mt-2">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectClient(c)}
                        className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex justify-between items-center"
                      >
                        <span className="font-bold text-slate-700">{c.name}</span>
                        <span className="text-xs text-slate-400">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca / Modelo</label>
                <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: iPhone 14 Pro Max" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cor</label>
                  <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Preto" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade</label>
                  <input type="text" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 128GB" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IMEI ou SN</label>
                <input required type="text" value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Número Identificador Único" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha do Aparelho</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Opcional" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acessórios Deixados</label>
                <input type="text" value={formData.itemsLeft} onChange={e => setFormData({...formData, itemsLeft: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Capinha, Carregador, Chip..." />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Defeito Relatado (Cliente)</label>
                <textarea value={formData.problemReported} onChange={e => setFormData({...formData, problemReported: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} placeholder="O que o cliente informou?" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnóstico Técnico</label>
                  <textarea value={formData.technicalDiagnosis} onChange={e => setFormData({...formData, technicalDiagnosis: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} placeholder="O que foi identificado?" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Serviços a Executar</label>
                  <textarea value={formData.servicesToExecute} onChange={e => setFormData({...formData, servicesToExecute: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} placeholder="O que será feito?" />
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24}/></div>
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Serviços & Peças</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mão de Obra (R$)</label>
                  <input 
                    type="number" 
                    value={formData.laborValue} 
                    onChange={e => setFormData({...formData, laborValue: Number(e.target.value)})} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peças Utilizadas</label>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                        <tr>
                          <th className="px-6 py-3">Descrição</th>
                          <th className="px-6 py-3 text-right">Valor</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formData.parts.map(p => (
                          <tr key={p.id}>
                            <td className="px-6 py-4 text-sm font-bold">{p.name}</td>
                            <td className="px-6 py-4 text-right text-sm font-bold">R$ {p.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                              <button type="button" onClick={() => removePart(p.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                        {formData.parts.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic text-sm">Nenhuma peça adicionada</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Adicionar do Estoque</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {inventory.filter(p => p.quantity > 0).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addPart(p)}
                        className="w-full text-left p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-300 transition-all flex justify-between items-center group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-700">{p.name}</p>
                          <p className="text-[10px] text-slate-400">Estoque: {p.quantity}</p>
                        </div>
                        <Plus size={16} className="text-slate-300 group-hover:text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total da OS</p>
                  <p className="text-4xl font-black">R$ {totalOS.toFixed(2)}</p>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm border-l-8 border-l-blue-600">
          <label className="flex items-center gap-4 cursor-pointer p-4 md:p-8 border-2 border-slate-100 rounded-[2rem] hover:bg-blue-50 transition-all border-dashed">
            <input 
              type="checkbox" 
              checked={formData.termsAccepted}
              onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
              className="w-10 h-10 rounded-xl border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-tight">O Cliente autoriza o reparo e aceita a garantia DJE Celulares.</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conforme Art. 40 do CDC.</p>
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};

export default ServiceOrderForm;
