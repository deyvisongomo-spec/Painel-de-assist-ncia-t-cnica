
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, UserPlus, Search, Smartphone, Printer, FileText, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { OS_BRANDS, STATUS_COLORS } from '../constants';
import { OSStatus, OSType } from '../types';

interface ServiceOrderFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({ onBack, onSave }) => {
  const [printFormat, setPrintFormat] = useState<'80mm' | 'a4'>('80mm');
  const [config, setConfig] = useState({
    logo: '',
    name: 'DJE CELULARES',
    cnpj: '00.000.000/0001-00',
    phone: '(00) 00000-0000',
    address: 'Rua Principal, 100 - Centro',
    terms: 'Garantia legal de 90 dias conforme CDC. A garantia não cobre danos por líquidos ou quedas.'
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const [formData, setFormData] = useState({
    type: OSType.REPARO,
    clientName: '',
    model: '',
    brand: 'Samsung',
    imei: '',
    problemReported: '',
    laborValue: 0,
    parts: [] as any[],
    status: OSStatus.RECEBIDO,
    termsAccepted: false
  });

  const totalOS = formData.laborValue + formData.parts.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);

  const handlePrint = (format: '80mm' | 'a4') => {
    setPrintFormat(format);
    setTimeout(() => window.print(), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) return alert("Por favor, aceite os termos.");
    onSave(formData);
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-in slide-in-from-right duration-300">
      
      {/* CSS DE IMPRESSÃO - CORE ENGINE */}
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          #root, main, aside, header { display: none !important; }
          
          .print-container { display: block !important; visibility: visible !important; position: absolute; left: 0; top: 0; background: white; color: black; }
          
          /* Layout 80mm */
          .thermal-layout {
            width: 80mm; padding: 4mm; font-family: 'Courier New', monospace; font-size: 9pt;
            display: ${printFormat === '80mm' ? 'block !important' : 'none !important'};
          }
          
          /* Layout A4 */
          .a4-layout {
            width: 210mm; min-height: 297mm; padding: 15mm; font-family: 'Inter', sans-serif; font-size: 11pt;
            display: ${printFormat === 'a4' ? 'block !important' : 'none !important'};
          }

          .print-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
          .a4-header { border-bottom: 4px solid #ff0000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .section-title { font-weight: 900; text-transform: uppercase; font-size: 10px; color: #64748b; border-bottom: 1px solid #e2e8f0; margin-bottom: 10px; padding-bottom: 5px; }
          .data-grid { display: grid; grid-cols: 2; gap: 20px; margin-bottom: 30px; }
          .table-full { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table-full th { background: #0f172a; color: white; padding: 10px; text-align: left; text-transform: uppercase; font-size: 10px; }
          .table-full td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
        }
      `}</style>

      {/* COMPONENTE DE IMPRESSÃO (OCULTO NA TELA) */}
      <div className="hidden print-container">
        
        {/* VIEW TÉRMICA */}
        <div className="thermal-layout">
          <center>
            {config.logo && <img src={config.logo} className="print-logo" style={{maxWidth: '40mm'}} />}
            <h2 style={{fontWeight: '900'}}>{config.name}</h2>
            <p>{config.phone}</p>
          </center>
          <hr style={{borderStyle: 'dashed'}} />
          <p><b>OS Nº:</b> {Math.floor(1000 + Math.random() * 9000)}</p>
          <p><b>DATA:</b> {new Date().toLocaleDateString('pt-BR')}</p>
          <p><b>CLIENTE:</b> {formData.clientName}</p>
          <p><b>APARELHO:</b> {formData.brand} {formData.model}</p>
          <p><b>IMEI:</b> {formData.imei}</p>
          <hr style={{borderStyle: 'dashed'}} />
          <p style={{fontSize: '12pt'}}><b>TOTAL: R$ {totalOS.toFixed(2)}</b></p>
          <br/><br/>
          <center>__________________________<br/>Assinatura do Cliente</center>
        </div>

        {/* VIEW A4 FORMAL */}
        <div className="a4-layout">
          <div className="a4-header">
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              {config.logo && <img src={config.logo} className="print-logo" style={{maxWidth: '80px'}} />}
              <div>
                <h1 style={{fontSize: '28pt', fontWeight: '900', color: '#0070e0', margin: 0}}>{config.name}</h1>
                <p style={{color: '#ff0000', fontWeight: 'bold', textTransform: 'uppercase', margin: 0}}>Tecnologia & Assistência Especializada</p>
              </div>
            </div>
            <div style={{textAlign: 'right', fontSize: '9pt'}}>
              <p><b>CNPJ:</b> {config.cnpj}</p>
              <p>{config.address}</p>
              <p><b>WHATSAPP:</b> {config.phone}</p>
            </div>
          </div>

          <div style={{background: '#f8fafc', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
            <h2 style={{margin: 0, fontWeight: '900', textTransform: 'uppercase'}}>Ordem de Serviço #{(1000 + Math.random() * 9000).toFixed(0)}</h2>
            <p style={{margin: 0, fontWeight: 'bold'}}>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px'}}>
            <div>
              <p className="section-title">Contratante / Cliente</p>
              <p style={{fontSize: '14pt', fontWeight: 'bold', margin: 0}}>{formData.clientName || '---'}</p>
              <p style={{margin: '5px 0'}}>CPF/CNPJ: {config.cnpj === '00.000.000/0001-00' ? '---' : 'Consulte ficha'}</p>
            </div>
            <div>
              <p className="section-title">Equipamento / Aparelho</p>
              <p style={{fontSize: '14pt', fontWeight: 'bold', margin: 0}}>{formData.brand} {formData.model || '---'}</p>
              <p style={{margin: '5px 0'}}>Identificador: {formData.imei || '---'}</p>
            </div>
          </div>

          <p className="section-title">Descrição do Defeito e Diagnóstico Técnico</p>
          <div style={{minHeight: '120px', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '10px', marginBottom: '30px'}}>
            {formData.problemReported || 'Defeito informado pelo cliente pendente de análise técnica detalhada.'}
          </div>

          <table className="table-full">
            <thead>
              <tr><th>Descrição do Serviço / Componente</th><th style={{textAlign: 'right'}}>Valor</th></tr>
            </thead>
            <tbody>
              <tr><td>Mão de Obra e Testes de Bancada</td><td style={{textAlign: 'right'}}>R$ {formData.laborValue.toFixed(2)}</td></tr>
              {formData.parts.map((p, i) => (
                <tr key={i}><td>{p.name}</td><td style={{textAlign: 'right'}}>R$ {p.unitPrice.toFixed(2)}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{padding: '20px 10px', textAlign: 'right', fontWeight: 'bold', textTransform: 'uppercase'}}>Total Bruto do Reparo:</td>
                <td style={{padding: '20px 10px', textAlign: 'right', fontWeight: '900', fontSize: '24pt', color: '#0070e0'}}>R$ {totalOS.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style={{marginTop: '40px', padding: '20px', background: '#0f172a', color: 'white', borderRadius: '15px', fontSize: '9pt'}}>
            <p style={{fontWeight: '900', color: '#ff0000', textTransform: 'uppercase', marginBottom: '10px'}}>Termos de Garantia DJE:</p>
            <p>{config.terms}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '80px', textAlign: 'center'}}>
            <div style={{borderTop: '2px solid black', paddingTop: '10px', fontSize: '10px', fontWeight: 'bold'}}>DJE CELULARES - TÉCNICO RESPONSÁVEL</div>
            <div style={{borderTop: '2px solid black', paddingTop: '10px', fontSize: '10px', fontWeight: 'bold'}}>CLIENTE - ACEITE DE ORÇAMENTO/SERVIÇO</div>
          </div>
        </div>
      </div>

      {/* HEADER DE AÇÕES (WEB) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all"><ArrowLeft size={20}/></button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Nova Ficha de OS</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Painel Administrativo DJE</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex gap-2">
          <button onClick={() => handlePrint('a4')} className="flex items-center justify-center gap-2 bg-white border-2 border-slate-900 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-900 hover:text-white transition-all"><FileText size={16}/> A4</button>
          <button onClick={() => handlePrint('80mm')} className="flex items-center justify-center gap-2 bg-white border-2 border-blue-600 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Printer size={16}/> 80mm</button>
          <button type="submit" form="os-form" className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-200 active:scale-95"><Save size={16}/> Salvar Registro</button>
        </div>
      </div>

      <form id="os-form" onSubmit={handleSubmit} className="space-y-6 no-print">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Smartphone size={24}/></div>
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Dados do Aparelho & Cliente</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proprietário</label>
                <div className="relative">
                  <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome do Cliente" />
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca / Modelo</label>
                <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: iPhone 14 Pro Max" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IMEI ou SN</label>
                <input required type="text" value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Número Identificador Único" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Defeito Relatado</label>
                <textarea value={formData.problemReported} onChange={e => setFormData({...formData, problemReported: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={4} placeholder="O que o cliente informou?" />
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
