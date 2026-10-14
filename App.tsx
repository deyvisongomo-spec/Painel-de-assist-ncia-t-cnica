
import React, { useState, useEffect, Component, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import ClientsView from './views/ClientsView';
import SuppliersView from './views/SuppliersView';
import ServiceOrdersList from './views/ServiceOrdersList';
import ServiceOrderForm from './views/ServiceOrderForm';
import InventoryView from './views/InventoryView';
import CashView from './views/CashView';
import PreOrcamentoView from './views/PreOrcamentoView';
import SettingsView from './views/SettingsView';
import ShoppingListView from './views/ShoppingListView';
import LoginView from './views/LoginView';
import UserManagementView from './views/UserManagementView';
import AuditLogsView from './views/AuditLogsView';
import CommissionsView from './views/CommissionsView';
import { User, ActivityLog, CommissionReport, Supplier, CatalogItem, Reminder, OSStatus, OSType } from './types';
import { api } from './services/api';
import { History } from 'lucide-react';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-rose-100 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <History size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Ops! Algo deu errado</h1>
            <p className="text-slate-500 mb-6 font-medium">Ocorreu um erro inesperado ao carregar esta parte do sistema.</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-left mb-6 overflow-auto max-h-40">
              <code className="text-[10px] text-rose-600 font-mono break-all">
                {this.state.error?.message || "Erro desconhecido"}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatingOS, setIsCreatingOS] = useState(false);
  const [selectedOS, setSelectedOS] = useState<any>(null);
  const [isPrintingOS, setIsPrintingOS] = useState(false);

  useEffect(() => {
    // Verifica o estado real no Firebase e só libera o app quando o Auth SDK estiver inicializado
    api.getCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('asim_session', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('asim_session');
      }
      setIsAuthReady(true);
    });
  }, []);

  // Se um funcionário comum estiver numa aba restrita, volta para o painel.
  // Fica aqui (e não dentro da renderização) para não causar avisos/re-renders do React.
  useEffect(() => {
    const restrictedTabs = ['caixa', 'fornecedores', 'configuracoes', 'usuarios', 'auditoria', 'comissoes'];
    if (currentUser?.role === 'USER' && restrictedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentUser, activeTab]);

  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const authenticated = await api.login(user, pass);
      if (authenticated) {
        localStorage.setItem('asim_session', JSON.stringify(authenticated));
        setCurrentUser(authenticated);
        setActiveTab('dashboard');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erro no handleLogin:', error);
      throw error; // Repassa para a View tratar
    }
  };

  const handleUpdateSelf = (updated: User) => {
    localStorage.setItem('asim_session', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const handleNewOS = () => {
    setSelectedOS(null);
    setIsPrintingOS(false);
    setActiveTab('os');
    setIsCreatingOS(true);
  };

  const handleSaveOS = async (data: any) => {
    try {
      const { model, brand, color, capacity, imei, hasImei, imeiReason, password, itemsLeft, ...rest } = data;
      
      const osData = {
        ...rest,
        device: {
          model,
          brand,
          color,
          capacity,
          imei: hasImei ? imei : '',
          hasImei: hasImei !== false, // default true
          imeiReason: !hasImei ? imeiReason : '',
          password,
          itemsLeft: typeof itemsLeft === 'string' ? itemsLeft.split(',').map((s: string) => s.trim()).filter(Boolean) : itemsLeft
        },
        responsibleId: currentUser?.id || '',
        responsibleName: currentUser?.name || '',
        financial: {
          partsValue: data.parts.reduce((acc: number, p: any) => acc + (p.unitPrice * p.quantity), 0),
          laborValue: data.laborValue,
          totalValue: data.laborValue + data.parts.reduce((acc: number, p: any) => acc + (p.unitPrice * p.quantity), 0)
        }
      };

      if (selectedOS) {
        await api.updateOS(selectedOS.id, osData);
        toast.success("Ordem de Serviço atualizada com sucesso!");
      } else {
        await api.createOS(osData);
        toast.success("Ordem de Serviço salva com sucesso!");
      }
      
      setIsCreatingOS(false);
      setSelectedOS(null);
      setActiveTab('os');
    } catch (error) {
      console.error('Erro ao salvar OS:', error);
      toast.error('Erro ao salvar Ordem de Serviço.');
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">Carregando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const restrictedTabs = ['caixa', 'fornecedores', 'configuracoes', 'usuarios', 'auditoria', 'comissoes'];
    if (currentUser.role === 'USER' && restrictedTabs.includes(activeTab)) {
      // Funcionário comum não acessa abas restritas: mostra o painel.
      // O redirecionamento da aba ativa é feito no useEffect abaixo (nunca durante a renderização).
      return (
        <ErrorBoundary>
          <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} userRole={currentUser.role} />
        </ErrorBoundary>
      );
    }

    let content;
    switch (activeTab) {
      case 'dashboard':
        content = <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} userRole={currentUser.role} />;
        break;
      case 'os':
        content = isCreatingOS ? 
          <ServiceOrderForm 
            onBack={() => { setIsCreatingOS(false); setSelectedOS(null); setIsPrintingOS(false); }} 
            onSave={handleSaveOS} 
            initialData={selectedOS}
            printOnLoad={isPrintingOS}
          /> : 
          <ServiceOrdersList 
            onNewOS={() => { setIsCreatingOS(true); setSelectedOS(null); setIsPrintingOS(false); }} 
            onViewOS={(os) => { setSelectedOS(os); setIsCreatingOS(true); setIsPrintingOS(false); }}
            onPrintOS={(os) => { setSelectedOS(os); setIsCreatingOS(true); setIsPrintingOS(true); }}
            onDeleteOS={async (id) => { await api.removeOS(id); }}
          />;
        break;
      case 'clientes':
        content = <ClientsView />;
        break;
      case 'fornecedores':
        content = <SuppliersView />;
        break;
      case 'lista-compras':
        content = <ShoppingListView />;
        break;
      case 'estoque':
      case 'produtos':
        content = <InventoryView />;
        break;
      case 'caixa':
        content = <CashView currentUser={currentUser} />;
        break;
      case 'pre-orcamento':
        content = <PreOrcamentoView />;
        break;
      case 'configuracoes':
        content = <SettingsView />;
        break;
      case 'usuarios':
        content = <UserManagementView currentUser={currentUser} onUpdateSelf={handleUpdateSelf} />;
        break;
      case 'auditoria':
        content = <AuditLogsView />;
        break;
      case 'comissoes':
        content = <CommissionsView />;
        break;
      default:
        content = <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} userRole={currentUser.role} />;
    }

    return (
      <ErrorBoundary>
        <Toaster richColors position="top-right" />
        {content}
      </ErrorBoundary>
    );
  };

  return (
    <ErrorBoundary>
      <Toaster richColors position="top-right" />
      <Layout 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsCreatingOS(false);
        }}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
