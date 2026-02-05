
import React, { useState, useEffect } from 'react';
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
import { User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatingOS, setIsCreatingOS] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('asim_session');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('asim_session');
      }
    }
  }, []);

  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    const authenticated = await api.login(user, pass);
    if (authenticated) {
      localStorage.setItem('asim_session', JSON.stringify(authenticated));
      setCurrentUser(authenticated);
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const handleUpdateSelf = (updated: User) => {
    localStorage.setItem('asim_session', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('asim_session');
    setCurrentUser(null);
  };

  const handleNewOS = () => {
    setActiveTab('os');
    setIsCreatingOS(true);
  };

  const handleSaveOS = (data: any) => {
    alert("Ordem de Serviço salva com sucesso!");
    setIsCreatingOS(false);
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (currentUser.role === 'USER') {
      const restrictedTabs = ['caixa', 'fornecedores', 'configuracoes', 'usuarios'];
      if (restrictedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
        return <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} />;
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} />;
      case 'os':
        return isCreatingOS ? 
          <ServiceOrderForm onBack={() => setIsCreatingOS(false)} onSave={handleSaveOS} /> : 
          <ServiceOrdersList onNewOS={() => setIsCreatingOS(true)} />;
      case 'clientes':
        return <ClientsView />;
      case 'fornecedores':
        return <SuppliersView />;
      case 'lista-compras':
        return <ShoppingListView />;
      case 'estoque':
      case 'produtos':
        return <InventoryView />;
      case 'caixa':
        return <CashView />;
      case 'pre-orcamento':
        return <PreOrcamentoView />;
      case 'configuracoes':
        return <SettingsView />;
      case 'usuarios':
        return <UserManagementView currentUser={currentUser} onUpdateSelf={handleUpdateSelf} />;
      default:
        return <Dashboard onNewOS={handleNewOS} onViewAllOS={() => setActiveTab('os')} />;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setIsCreatingOS(false);
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
