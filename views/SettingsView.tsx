
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { Image, Save, Building2, Phone, MapPin, Hash, Trash2 } from 'lucide-react';
import { formatPhone, formatCPFOrCNPJ } from '../src/lib/utils';

const SettingsView: React.FC = () => {
  const [config, setConfig] = useState({
    logo: '',
    name: 'PAINELCELL',
    cnpj: '00.000.000/0001-00',
    phone: '(00) 00000-0000',
    address: 'Rua Principal da Assistência, 100',
    city: 'Sua Cidade - UF',
    terms: 'Garantia de 90 dias conforme CDC sobre serviços e peças. A garantia não cobre danos por mau uso, umidade ou intervenção de terceiros.'
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_config');
    if (saved) setConfig(JSON.parse(saved));
    else localStorage.setItem('app_config', JSON.stringify(config));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveConfig = () => {
    localStorage.setItem('app_config', JSON.stringify(config));
    toast.success('Configurações salvas com sucesso!');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Ajustes do Painel</h2>
          <p className="text-slate-500 font-medium">Personalize a identidade da sua loja.</p>
        </div>
        <button 
          onClick={saveConfig}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <Save size={20} /> Salvar Configurações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] mb-6">Logotipo</h3>
            <div className="relative group">
              <div className="w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                {config.logo ? (
                  <img src={config.logo} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <Image size={40} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-90">
                <Image size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
            <p className="mt-6 text-xs text-slate-400 font-medium leading-relaxed">PNG ou JPG (400x400px recomendado).</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nome Fantasia</label>
                <input type="text" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-xs">CNPJ / CPF</label>
                <input type="text" value={config.cnpj} onChange={e => setConfig({...config, cnpj: formatCPFOrCNPJ(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-xs">WhatsApp Loja</label>
                <input type="text" value={config.phone} onChange={e => setConfig({...config, phone: formatPhone(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-xs">Endereço</label>
                <input type="text" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-xs">Termos de OS</label>
              <textarea rows={4} value={config.terms} onChange={e => setConfig({...config, terms: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
