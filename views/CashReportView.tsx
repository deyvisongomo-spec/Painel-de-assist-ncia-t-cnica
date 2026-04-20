
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Printer, Calendar, TrendingUp, TrendingDown, Wallet, FileText, ChevronRight, Download } from 'lucide-react';

interface CashReportViewProps {
  transactions: any[];
  onBack: () => void;
}

const CashReportView: React.FC<CashReportViewProps> = ({ transactions, onBack }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [preset, setPreset] = useState('Hoje');

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const tDate = t.date.split('T')[0];
      return tDate >= dateRange.start && tDate <= dateRange.end;
    });
  }, [dateRange, transactions]);

  const stats = useMemo(() => {
    const entradas = filteredData.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.val, 0);
    const saidas = filteredData.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.val, 0);
    
    const byMethod: Record<string, number> = {};
    filteredData.filter(t => t.type === 'entrada').forEach(t => {
      byMethod[t.method] = (byMethod[t.method] || 0) + t.val;
    });

    return { totalEntradas: entradas, totalSaidas: saidas, saldo: entradas - saidas, byMethod };
  }, [filteredData]);

  const handlePreset = (p: string) => {
    setPreset(p);
    const today = new Date();
    let start = new Date();
    
    if (p === 'Hoje') {
      start = today;
    } else if (p === 'Últimos 7 dias') {
      start.setDate(today.getDate() - 7);
    } else if (p === 'Mês Atual') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Estilos para Impressão 80mm */}
      <style>{`
        @media print {
          @page { margin: 0; size: 80mm auto; }
          body * { visibility: hidden; }
          #thermal-report, #thermal-report * { visibility: visible; }
          #thermal-report {
            position: absolute;
            left: 0; top: 0;
            width: 80mm;
            padding: 5mm;
            font-family: 'Courier New', Courier, monospace;
            font-size: 9pt;
            color: black;
            background: white;
          }
          .r-sep { border-top: 1px dashed black; margin: 3mm 0; }
          .r-bold { font-weight: bold; text-transform: uppercase; }
          .r-center { text-align: center; }
          .r-flex { display: flex; justify-content: space-between; }
        }
      `}</style>

      {/* Template do Relatório Oculto */}
      <div id="thermal-report" className="hidden print:block">
        <div className="r-center">
          <p className="r-bold" style={{fontSize: '12pt'}}>FECHAMENTO DE CAIXA</p>
          <p>PAINELCELL</p>
          <p>PERÍODO: {new Date(dateRange.start).toLocaleDateString()} ATÉ {new Date(dateRange.end).toLocaleDateString()}</p>
        </div>
        <div className="r-sep"></div>
        <div className="r-flex r-bold">
          <span>ENTRADAS:</span>
          <span>R$ {stats.totalEntradas.toFixed(2)}</span>
        </div>
        <div className="r-flex r-bold">
          <span>SAÍDAS:</span>
          <span>R$ {stats.totalSaidas.toFixed(2)}</span>
        </div>
        <div className="r-sep"></div>
        <p className="r-bold">POR MÉTODO DE PAGAMENTO:</p>
        {Object.entries(stats.byMethod).map(([m, v]) => (
          <div key={m} className="r-flex">
            <span>{m}:</span>
            {/* Adicionando asserção de tipo para número para corrigir erro de toFixed */}
            <span>R$ {(v as number).toFixed(2)}</span>
          </div>
        ))}
        <div className="r-sep"></div>
        <div className="r-flex r-bold" style={{fontSize: '11pt'}}>
          <span>SALDO LÍQUIDO:</span>
          <span>R$ {stats.saldo.toFixed(2)}</span>
        </div>
        <div className="r-sep"></div>
        <p className="r-center">EMITIDO EM: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Relatório de Fechamento</h2>
            <p className="text-slate-500 font-medium">Análise de saúde financeira por período.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Printer size={20} />
            Imprimir 80mm
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-wrap gap-2">
          {['Hoje', 'Últimos 7 dias', 'Mês Atual', 'Personalizado'].map(p => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                preset === p ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        {preset === 'Personalizado' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Data Início</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Data Fim</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Dashboard de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entradas</p>
          <p className="text-4xl font-black text-slate-800 tracking-tighter">R$ {stats.totalEntradas.toFixed(2)}</p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <TrendingDown size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Saídas</p>
          <p className="text-4xl font-black text-slate-800 tracking-tighter">R$ {stats.totalSaidas.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
            <Wallet size={24} />
          </div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Saldo Líquido</p>
          <p className="text-4xl font-black text-white tracking-tighter">R$ {stats.saldo.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Detalhamento por Método */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Conciliação por Método</h3>
          <div className="space-y-4">
            {Object.entries(stats.byMethod).map(([method, value]) => (
              <div key={method} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold text-slate-600">{method}</span>
                </div>
                {/* Adicionando asserção de tipo para número */}
                <span className="font-black text-slate-800">R$ {(value as number).toFixed(2)}</span>
              </div>
            ))}
            {Object.keys(stats.byMethod).length === 0 && (
              <p className="text-center text-slate-400 text-xs py-10 italic">Nenhuma entrada no período.</p>
            )}
          </div>
        </div>

        {/* Lista de Movimentações */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">Listagem Detalhada</h3>
            <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">{filteredData.length} registros</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-4">Data</th>
                  <th className="px-4 py-4">Descrição</th>
                  <th className="px-4 py-4">Método</th>
                  <th className="px-8 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 text-xs font-bold text-slate-400">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black text-slate-800 tracking-tight">{t.desc}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold text-slate-500 border border-slate-100 px-2 py-0.5 rounded-lg">{t.method}</span>
                    </td>
                    <td className={`px-8 py-4 text-right font-black text-sm ${t.type === 'entrada' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {t.type === 'entrada' ? '+' : '-'} R$ {t.val.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="font-bold uppercase text-xs tracking-widest">Nenhum dado para este período</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashReportView;
