import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Plus,
  X,
  Trash2,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { CatalogItem } from '../types';

const PreOrcamentoView: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('TODOS');
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [data, setData] = useState({
    device: '',
    partValue: 0,
    shippingValue: 0,
    laborValue: 0,
  });

  const [newModel, setNewModel] = useState<Omit<CatalogItem, 'id'>>({ 
    brand: 'APPLE', model: '', char: '', master: 0, import: 0, premium: 0, pro: 0 
  });

  const brands = ['TODOS', 'APPLE', 'SAMSUNG', 'MOTOROLA', 'XIAOMI', 'LG', 'ASUS', 'OUTROS'];

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCatalog();
      setCatalog(data);
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCatalog = useMemo(() => {
    return catalog.filter(item => {
      const searchStr = `${item.brand} ${item.model} ${item.char}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'TODOS' || 
                         (selectedBrand === 'OUTROS' && !['APPLE','SAMSUNG','MOTOROLA','XIAOMI','LG','ASUS'].includes(item.brand)) ||
                         item.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand, catalog]);

  const total = data.partValue + data.shippingValue + data.laborValue;

  const handleSelectPrice = (price: number, item: CatalogItem) => {
    setData(prev => ({ 
      ...prev, 
      partValue: price, 
      device: `${item.brand} ${item.model} (${item.char})` 
    }));
  };

  const handleSaveNewModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.model) return;
    
    try {
      await api.saveCatalogItem(newModel);
      setIsAddingNew(false);
      setNewModel({ brand: 'APPLE', model: '', char: '', master: 0, import: 0, premium: 0, pro: 0 });
      loadCatalog();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item no catálogo.');
    }
  };

  const clearCalculator = () => {
    setData({
      device: '',
      partValue: 0,
      shippingValue: 0,
      laborValue: 0,
    });
  };

  const removeModel = async (id: string) => {
    if(!confirm("Deseja remover este item do catálogo?")) return;
    try {
      await api.deleteCatalogItem(id);
      loadCatalog();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item do catálogo.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calculator className="text-blue-600 w-9 h-9" /> Tabela de Preços
          </h2>
          <p className="text-slate-500 font-medium">Cadastre seus custos e calcule orçamentos rápidos.</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          <Plus size={20} /> Cadastrar Novo Item
        </button>
      </div>

      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-xl text-slate-800 uppercase">Novo Preço de Custo</h3>
              <button onClick={() => setIsAddingNew(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveNewModel} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Marca</label>
                  <select value={newModel.brand} onChange={e => setNewModel({...newModel, brand: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                    {brands.filter(b => b !== 'TODOS').map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Modelo</label>
                  <input type="text" required value={newModel.model} onChange={e => setNewModel({...newModel, model: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" placeholder="Ex: iPhone 11" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['master', 'import', 'premium', 'pro'].map(k => (
                  <div key={k}>
                    <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">{k}</label>
                    <input type="number" value={(newModel as any)[k]} onChange={e => setNewModel({...newModel, [k]: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center" />
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest">Salvar no Catálogo</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex gap-4">
            <input 
              type="text" placeholder="Filtrar modelo..." 
              className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
            <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando Catálogo...</p>
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum item encontrado</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                    <th className="px-6 py-4">Aparelho</th>
                    <th className="px-2 py-4 text-center">Incell/M</th>
                    <th className="px-2 py-4 text-center">Premium</th>
                    <th className="px-2 py-4 text-center">Orig.</th>
                    <th className="px-4 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCatalog.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-800 text-sm">{item.model}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{item.brand} • {item.char}</div>
                      </td>
                      <td className="px-2 py-5">
                         <button onClick={() => handleSelectPrice(item.master, item)} className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg font-black text-[10px] hover:bg-slate-900 hover:text-white transition-all">R$ {item.master}</button>
                      </td>
                      <td className="px-2 py-5">
                         <button onClick={() => handleSelectPrice(item.premium, item)} className="w-full py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-black text-[10px] hover:bg-amber-600 hover:text-white transition-all">R$ {item.premium}</button>
                      </td>
                      <td className="px-2 py-5">
                         <button onClick={() => handleSelectPrice(item.pro, item)} className="w-full py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-black text-[10px] hover:bg-blue-600 hover:text-white transition-all">R$ {item.pro}</button>
                      </td>
                      <td className="px-4 py-5 text-right">
                         <button onClick={() => removeModel(item.id)} className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-24 h-fit">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
               <h3 className="font-black text-xs uppercase tracking-[0.3em] text-blue-400">Calculadora de OS</h3>
               <button onClick={clearCalculator} className="text-white/20 hover:text-white transition-colors"><RefreshCcw size={18}/></button>
            </div>
            
            <div className="space-y-6">
               <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Aparelho</label>
                  <input type="text" value={data.device} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl font-bold text-sm outline-none" placeholder="..." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Custo Peça</label>
                    <input type="number" value={data.partValue} onChange={e => setData({...data, partValue: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl font-bold text-lg outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Frete/Desp.</label>
                    <input type="number" value={data.shippingValue} onChange={e => setData({...data, shippingValue: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl font-bold text-lg outline-none" />
                  </div>
               </div>
               <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                  <label className="text-[10px] font-black uppercase text-blue-400 block mb-3">Mão de Obra + Lucro</label>
                  <input type="number" value={data.laborValue} onChange={e => setData({...data, laborValue: Number(e.target.value)})} className="w-full bg-transparent text-4xl font-black text-white outline-none" placeholder="0" />
               </div>
            </div>

            <div className="pt-8 border-t border-white/10">
               <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Total Sugerido</p>
               <h4 className="text-5xl font-black tracking-tighter">R$ {total.toFixed(2)}</h4>
            </div>

            <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900 transition-all active:scale-95">
               Gerar Orçamento Final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrcamentoView;
