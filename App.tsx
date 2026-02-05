
import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreatingOS, setIsCreatingOS] = useState(false);

  const handleNewOS = () => {
    setActiveTab('os');
    setIsCreatingOS(true);
  };

  const handleSaveOS = (data: any) => {
    console.log("Salvando OS no Backend:", data);
    alert("Ordem de Serviço salva com sucesso (Simulação)!");
    setIsCreatingOS(false);
  };

  const renderContent = () => {
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
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <h2 className="text-xl font-bold italic">Seção em Desenvolvimento</h2>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => {
      setActiveTab(tab);
      setIsCreatingOS(false);
    }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
