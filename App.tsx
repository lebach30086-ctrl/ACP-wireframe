import React, { useState } from 'react';
import Layout from './components/Layout';
import PlanList from './components/PlanList';
import PlanDashboard from './components/PlanDashboard';
import PlanWizard from './components/PlanWizard';
import { AccountPlan } from './types';

function App() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPlan, setSelectedPlan] = useState<AccountPlan | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleSelectPlan = (plan: AccountPlan) => {
    setSelectedPlan(plan);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedPlan(null);
    setView('list');
  };

  const handlePlanCreated = (newPlan: AccountPlan) => {
    setShowWizard(false);
    setSelectedPlan(newPlan);
    setView('detail');
  };

  const handleUpdatePlan = (updatedFields: Partial<AccountPlan>) => {
    if (selectedPlan) {
      setSelectedPlan({ ...selectedPlan, ...updatedFields, isNew: false });
    }
  };

  return (
    <Layout>
      {view === 'list' && (
        <PlanList 
          onSelectPlan={handleSelectPlan} 
          onCreatePlan={() => setShowWizard(true)} 
        />
      )}
      
      {view === 'detail' && selectedPlan && (
        <PlanDashboard 
          plan={selectedPlan} 
          onBack={handleBack} 
          onUpdatePlan={handleUpdatePlan}
        />
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