
import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../constants';
import { Menu, X, Bell, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [config, setConfig] = useState({
    logo: '',
    name: 'Painel da Assistência'
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {config.logo ? (
            <img src={config.logo} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <h1 className="text-xl font-bold text-blue-600">{config.name}</h1>
          )}
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-md">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 bottom-0 left-0 w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-8 hidden md:block border-b mb-4">
          {config.logo ? (
            <img src={config.logo} alt="Logo" className="max-h-16 w-full object-contain mb-2" />
          ) : (
            <h1 className="text-2xl font-bold text-blue-600">{config.name}</h1>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin DJE</p>
              <p className="text-xs text-slate-500 truncate">Gerente Geral</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        {/* Top bar (Desktop) */}
        <div className="hidden md:flex bg-white border-b h-16 items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            {MENU_ITEMS.find(item => item.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' })}</span>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
