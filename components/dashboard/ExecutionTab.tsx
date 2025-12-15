import React, { useState } from 'react';
import { Goal, Task, AccountPlan } from '../../types';
import { Plus, ChevronDown, CheckCircle2, Circle, MoreVertical, Calendar, User as UserIcon, ListTodo, Target } from 'lucide-react';
import Modal from '../ui/Modal';

interface ExecutionTabProps {
    plan: AccountPlan;
}

const MOCK_GOALS_INIT: Goal[] = [
    { id: 'g1', title: 'Achieve $1.2M Revenue', type: 'Revenue', progress: 65, metric: 'Revenue', currentValue: '$780k', targetValue: '$1.2M' },
];

const MOCK_TASKS_INIT: Task[] = [
    { id: 't1', goalId: 'g1', title: 'Present Expansion Proposal', assignee: 'JD', assigneeName: 'John Doe', dueDate: 'Nov 15', status: 'To Do', priority: 'High' },
];

const ExecutionTab: React.FC<ExecutionTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [goals, setGoals] = useState<Goal[]>(isNew ? [] : MOCK_GOALS_INIT);
    const [tasks, setTasks] = useState<Task[]>(isNew ? [] : MOCK_TASKS_INIT);
    const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);
    
    // Modal States
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Form States
    const [newGoal, setNewGoal] = useState<Partial<Goal>>({ type: 'Revenue' });
    const [newTask, setNewTask] = useState<Partial<Task>>({ status: 'To Do', priority: 'Medium', assignee: 'JD', assigneeName: 'You' });

    const toggleTaskStatus = (taskId: string) => {
        setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, status: t.status === 'Done' ? 'To Do' : 'Done' } : t
        ));
    };

    const handleAddGoal = () => {
        if(newGoal.title) {
            setGoals([...goals, { ...newGoal, id: Date.now().toString(), progress: 0 } as Goal]);
            setIsGoalModalOpen(false);
            setNewGoal({ type: 'Revenue' });
        }
    };

    const handleAddTask = () => {
        if(newTask.title) {
            setTasks([...tasks, { ...newTask, id: Date.now().toString() } as Task]);
            setIsTaskModalOpen(false);
            setNewTask({ status: 'To Do', priority: 'Medium', assignee: 'JD', assigneeName: 'You' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* GOALS WIDGET */}
            <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-center mb-2">
                     <h3 className="text-lg font-bold text-slate-800">Goals</h3>
                     <button onClick={() => setIsGoalModalOpen(true)} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                        <Plus size={14} /> New Goal
                    </button>
                </div>
                
                <div className="space-y-4">
                    {goals.length === 0 ? (
                         <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                            <div className="bg-slate-50 p-3 rounded-full mb-3">
                                <Target size={24} />
                            </div>
                            <p className="text-sm font-medium text-center">No goals set</p>
                            <p className="text-xs text-center text-slate-400 mt-1">Define success metrics to track progress.</p>
                            <button onClick={() => setIsGoalModalOpen(true)} className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg">Add Goal</button>
                         </div>
                    ) : (
                        goals.map(goal => (
                            <div 
                                key={goal.id}
                                onMouseEnter={() => setHoveredGoalId(goal.id)}
                                onMouseLeave={() => setHoveredGoalId(null)}
                                className={`bg-white p-5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden
                                    ${hoveredGoalId === goal.id ? 'border-blue-400 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide
                                        ${goal.type === 'Revenue' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}
                                    `}>
                                        {goal.type}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">{goal.progress}%</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm mb-4">{goal.title}</h4>
                                
                                <div className="relative h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                                    <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                                </div>
                                
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Current: <strong className="text-slate-700">{goal.currentValue}</strong></span>
                                    <span>Target: <strong className="text-slate-700">{goal.targetValue}</strong></span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ACTION PLAN WIDGET */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                    <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Action Plan</h3>
                        <div className="flex gap-2">
                             <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                                <Plus size={16} /> Add Task
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto relative">
                        {tasks.length === 0 ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                    <ListTodo size={32} />
                                </div>
                                <p className="text-sm font-medium">Your action plan is empty</p>
                                <button onClick={() => setIsTaskModalOpen(true)} className="mt-4 text-blue-600 text-sm font-medium hover:underline">Create First Task</button>
                             </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100">
                                    <tr>
                                        <th className="px-5 py-3 w-10"></th>
                                        <th className="px-5 py-3">Task Name</th>
                                        <th className="px-5 py-3">Owner</th>
                                        <th className="px-5 py-3">Due Date</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tasks.map(task => {
                                        const isRelevant = hoveredGoalId ? task.goalId === hoveredGoalId : true;
                                        return (
                                            <tr 
                                                key={task.id} 
                                                className={`group transition-colors duration-200 
                                                    ${isRelevant ? 'opacity-100' : 'opacity-30'}
                                                    ${task.status === 'Done' ? 'bg-slate-50/50' : 'hover:bg-slate-50'}
                                                `}
                                            >
                                                <td className="px-5 py-3">
                                                    <button 
                                                        onClick={() => toggleTaskStatus(task.id)}
                                                        className={`transition-colors ${task.status === 'Done' ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
                                                    >
                                                        {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`font-medium text-slate-800 ${task.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                    {task.goalId && (
                                                        <div className="text-[10px] text-slate-400 mt-0.5">
                                                            Linked to: {goals.find(g => g.id === task.goalId)?.title || 'Goal'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                     <div className="flex items-center gap-2" title={task.assigneeName}>
                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-200">
                                                            {task.assignee}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded w-fit
                                                        ${task.status !== 'Done' ? 'bg-orange-50 text-orange-700' : 'text-slate-400'}
                                                    `}>
                                                        <Calendar size={12} />
                                                        {task.dueDate}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                     <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                                        ${task.status === 'To Do' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                                                        ${task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                                                        ${task.status === 'Done' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                                    `}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Goal Modal */}
            <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Create New Goal">
                <div className="space-y-4">
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-slate-700">Goal Title</label>
                         <input type="text" value={newGoal.title || ''} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Increase Revenue by 10%" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Type</label>
                            <select value={newGoal.type} onChange={e => setNewGoal({...newGoal, type: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg outline-none">
                                <option value="Revenue">Revenue</option>
                                <option value="Strategic">Strategic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Metric Name</label>
                            <input type="text" value={newGoal.metric || ''} onChange={e => setNewGoal({...newGoal, metric: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="e.g. USD" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Current Value</label>
                            <input type="text" value={newGoal.currentValue || ''} onChange={e => setNewGoal({...newGoal, currentValue: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Target Value</label>
                            <input type="text" value={newGoal.targetValue || ''} onChange={e => setNewGoal({...newGoal, targetValue: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="100" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsGoalModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button onClick={handleAddGoal} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Create Goal</button>
                    </div>
                </div>
            </Modal>

            {/* Create Task Modal */}
             <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add Task">
                <div className="space-y-4">
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-slate-700">Task Name</label>
                         <input type="text" value={newTask.title || ''} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What needs to be done?" />
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium text-slate-700">Link to Goal (Optional)</label>
                         <select value={newTask.goalId || ''} onChange={e => setNewTask({...newTask, goalId: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none text-slate-700">
                             <option value="">-- No Link --</option>
                             {goals.map(g => (
                                 <option key={g.id} value={g.id}>{g.title}</option>
                             ))}
                         </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Due Date</label>
                            <input type="date" value={newTask.dueDate || ''} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Priority</label>
                            <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg outline-none">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button onClick={handleAddTask} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Add Task</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExecutionTab;