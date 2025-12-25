
import React, { useState } from 'react';
import Layout from './components/Layout';
import PlanList from './components/PlanList';
import PlanDashboard from './components/PlanDashboard';
import PlanWizard from './components/PlanWizard';
import CompanyList, { MOCK_COMPANIES } from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import ReportDashboard from './components/ReportDashboard';
import { AccountPlan, Company } from './types';

type ViewType = 'plan-list' | 'plan-detail' | 'company-list' | 'company-detail' | 'reports';
type NavTab = 'Dashboard' | 'Company' | 'Account Planning' | 'Reports' | 'Settings';

function App() {
  const [view, setView] = useState<ViewType>('plan-list');
  const [activeTab, setActiveTab] = useState<NavTab>('Account Planning');
  const [selectedPlan, setSelectedPlan] = useState<AccountPlan | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as NavTab);
    if (tab === 'Company') {
        setView('company-list');
        setSelectedPlan(null);
        setSelectedCompany(null);
    } else if (tab === 'Account Planning') {
        setView('plan-list');
        setSelectedPlan(null);
        setSelectedCompany(null);
    } else if (tab === 'Reports') {
        setView('reports');
        setSelectedPlan(null);
        setSelectedCompany(null);
    } else if (tab === 'Dashboard') {
        setView('plan-list'); 
    }
  };

  // Plan Handlers
  const handleSelectPlan = (plan: AccountPlan) => {
    setSelectedPlan(plan);
    setView('plan-detail');
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setView('plan-list');
  };

  const handlePlanCreated = (newPlan: AccountPlan) => {
    setShowWizard(false);
    setSelectedPlan(newPlan);
    setView('plan-detail');
  };

  const handleUpdatePlan = (updatedFields: Partial<AccountPlan>) => {
    if (selectedPlan) {
      setSelectedPlan({ ...selectedPlan, ...updatedFields, isNew: false });
    }
  };

  // Company Handlers
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setView('company-detail');
    setActiveTab('Company'); 
  };

  const handleSelectCompanyById = (companyId: string) => {
    const company = MOCK_COMPANIES.find(c => c.id === companyId);
    if (company) {
        handleSelectCompany(company);
    }
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setView('company-list');
    setActiveTab('Company');
  };

  return (
    <Layout activeTab={activeTab} onNavigate={handleNavigate}>
      {view === 'plan-list' && (
        <PlanList 
          onSelectPlan={handleSelectPlan} 
          onCreatePlan={() => setShowWizard(true)} 
          onSelectCompanyId={handleSelectCompanyById}
        />
      )}
      
      {view === 'plan-detail' && selectedPlan && (
        <PlanDashboard 
          plan={selectedPlan} 
          onBack={handleBackToPlans} 
          onUpdatePlan={handleUpdatePlan}
        />
      )}

      {view === 'company-list' && (
        <CompanyList onSelectCompany={handleSelectCompany} />
      )}

      {view === 'company-detail' && selectedCompany && (
        <CompanyDetail 
            company={selectedCompany} 
            onBack={handleBackToCompanies} 
        />
      )}

      {view === 'reports' && (
          <ReportDashboard />
      )}

      {showWizard && (
        <PlanWizard 
            onClose={() => setShowWizard(false)} 
            onSave={handlePlanCreated}
        />
      )}
    </Layout>
  );
}

export default App;
