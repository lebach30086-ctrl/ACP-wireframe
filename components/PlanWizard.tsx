import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { AccountPlan } from '../types';

interface PlanWizardProps {
    onClose: () => void;
    onSave: (plan: AccountPlan) => void;
}

const STEPS = ['General Info', 'Objectives', 'Resources'];

const PlanWizard: React.FC<PlanWizardProps> = ({ onClose, onSave }) => {
    const [currentStep, setCurrentStep] = useState(0);
    
    // Form State
    const [formData, setFormData] = useState({
        accountName: '',
        fiscalYear: 'FY2024',
        description: '',
        revenue: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove existing dots and any non-digit characters
        const rawValue = e.target.value.replace(/\./g, '').replace(/\D/g, '');
        
        // Format with dots as thousand separators
        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        handleInputChange('revenue', formattedValue);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Create the new plan object
            const newPlan: AccountPlan = {
                id: `new-${Date.now()}`,
                accountName: formData.accountName || 'New Account Plan',
                fiscalYear: formData.fiscalYear,
                owner: 'John Doe', // Default to current user
                status: 'Draft',
                progress: 0,
                industry: 'Technology', // Default for now
                revenue: parseFloat(formData.revenue.replace(/\./g, '')) || 0, // Remove dots before parsing
                winRate: 0,
                isNew: true // Mark as new so dashboard shows empty states
            };
            
            // Trigger save and navigation in parent
            onSave(newPlan);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Create Account Plan</h2>
                        <p className="text-sm text-slate-500 mt-1">Define your strategy for the fiscal year</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                                    ${idx === currentStep ? 'border-blue-600 bg-blue-600 text-white' : 
                                      idx < currentStep ? 'border-green-500 bg-green-500 text-white' : 
                                      'border-slate-300 text-slate-400'}`}>
                                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                                </div>
                                <span className={`text-sm font-medium ${idx === currentStep ? 'text-blue-900' : 'text-slate-500'}`}>
                                    {step}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <div className="w-12 h-0.5 bg-slate-200 mx-4 hidden sm:block"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Account Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.accountName}
                                        onChange={(e) => handleInputChange('accountName', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500 shadow-inner" 
                                        placeholder="e.g. Acme Corp" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Fiscal Year</label>
                                    <select 
                                        value={formData.fiscalYear}
                                        onChange={(e) => handleInputChange('fiscalYear', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                                    >
                                        <option value="FY2024">FY2024</option>
                                        <option value="FY2025">FY2025</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder-slate-500 shadow-inner" 
                                    placeholder="Brief overview of the account status..."
                                ></textarea>
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Revenue Goal</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input 
                                        type="text" 
                                        value={formData.revenue}
                                        onChange={handleRevenueChange}
                                        className="w-full pl-8 pr-3 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500 shadow-inner text-lg font-medium" 
                                        placeholder="0" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Strategic Focus</label>
                                <div className="flex gap-2">
                                    {['Expansion', 'Retention', 'New Logo', 'Partnership'].map(tag => (
                                        <button key={tag} className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-sm bg-white">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                             <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">JD</div>
                                <div>
                                    <p className="font-medium text-slate-800">John Doe (You)</p>
                                    <p className="text-xs text-slate-500">Account Owner</p>
                                </div>
                             </div>
                             <button className="text-blue-600 text-sm font-medium hover:underline">+ Add Team Member</button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleNext}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                    >
                        {currentStep === STEPS.length - 1 ? 'Create Plan' : 'Next Step'}
                        {currentStep < STEPS.length - 1 && <Check size={16} className="hidden" />} 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanWizard;