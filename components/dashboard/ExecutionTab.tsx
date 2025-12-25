
import React, { useState, useEffect } from 'react';
import { Goal, Task, AccountPlan } from '../../types';
import { 
    Plus, 
    CheckSquare, 
    ChevronDown, 
    ChevronRight, 
    MessageSquare, 
    Paperclip, 
    Flag, 
    MoreHorizontal, 
    Calendar, 
    CornerDownRight,
    Edit2,
    Save,
    Circle,
    CheckCircle2,
    X
} from 'lucide-react';
import Modal from '../ui/Modal';

interface ExecutionTabProps {
    plan: AccountPlan;
}

const MOCK_GOALS_INIT: Goal[] = [
    { 
        id: 'g1', 
        title: 'Kế hoạch 30 ngày', 
        type: 'Strategic', 
        progress: 100, 
        metric: 'Percent', 
        targetValue: '100%', 
        currentValue: '100%',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
        completeDate: '2025-06-01',
        status: 'Completed'
    },
    { 
        id: 'g2', 
        title: 'Kế hoạch 60 ngày', 
        type: 'Strategic', 
        progress: 50, 
        metric: 'Percent', 
        targetValue: '100%', 
        currentValue: '50%',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
        status: 'In Progress'
    },
    { 
        id: 'g3', 
        title: 'Kế hoạch 90 ngày', 
        type: 'Revenue', 
        progress: 0, 
        metric: 'Revenue', 
        targetValue: '$1.2M', 
        currentValue: '$0',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
        status: 'Not Started'
    },
];

const MOCK_TASKS_INIT: Task[] = [
    { 
        id: 't1', 
        goalId: 'g1', 
        title: 'Gọi điện cho chị MaiNT', 
        assignee: 'BN', 
        assigneeName: 'BÙI THẢO NHI', 
        dueDate: '25/12/2022', 
        startTime: '10:30',
        endTime: '11:20',
        status: 'Done', 
        priority: 'High',
        attachmentCount: 1,
        commentCount: 0
    },
    { 
        id: 't2', 
        goalId: 'g1', 
        title: 'Gửi email báo giá sơ bộ', 
        assignee: 'BN', 
        assigneeName: 'BÙI THẢO NHI', 
        dueDate: '25/12/2022', 
        startTime: '14:00',
        endTime: '14:30',
        status: 'Done', 
        priority: 'Medium',
        attachmentCount: 1,
        commentCount: 2
    },
    { 
        id: 't1a', 
        goalId: 'g1', 
        title: 'Khảo sát hạ tầng kỹ thuật thực tế tại văn phòng HCM', 
        assignee: 'JD', 
        assigneeName: 'JOHN DOE', 
        dueDate: '28/12/2022', 
        startTime: '09:00',
        endTime: '11:00',
        status: 'Done', 
        priority: 'High',
        attachmentCount: 3,
        commentCount: 1
    },
    { 
        id: 't1b', 
        goalId: 'g1', 
        title: 'Phê duyệt phương án tài chính giai đoạn 1', 
        assignee: 'SM', 
        assigneeName: 'SARAH MANAGER', 
        dueDate: '30/12/2022', 
        startTime: '16:00',
        endTime: '17:00',
        status: 'Done', 
        priority: 'High',
        attachmentCount: 1,
        commentCount: 4
    },
    { 
        id: 't3', 
        goalId: 'g2', 
        title: 'Demo sản phẩm trực tiếp cho Ban Giám Đốc', 
        assignee: 'BN', 
        assigneeName: 'BÙI THẢO NHI', 
        dueDate: '05/01/2025', 
        startTime: '10:30',
        endTime: '11:20',
        status: 'Done', 
        priority: 'High',
        attachmentCount: 1,
        commentCount: 5
    },
    { 
        id: 't4', 
        goalId: 'g2', 
        title: 'Chốt hợp đồng nguyên tắc', 
        assignee: 'BN', 
        assigneeName: 'BÙI THẢO NHI', 
        dueDate: '25/12/2022', 
        startTime: '10:30',
        endTime: '11:20',
        status: 'To Do', 
        priority: 'High',
        attachmentCount: 1,
        commentCount: 0
    },
];

const ExecutionTab: React.FC<ExecutionTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [goals, setGoals] = useState<Goal[]>(isNew ? [] : MOCK_GOALS_INIT);
    const [tasks, setTasks] = useState<Task[]>(isNew ? [] : MOCK_TASKS_INIT);
    const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['g1', 'g2'])); 
    
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isUpdateGoalModalOpen, setIsUpdateGoalModalOpen] = useState(false);
    const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

    const [newGoal, setNewGoal] = useState<Partial<Goal>>({ type: 'Strategic', startDate: '', endDate: '', status: 'Not Started' });
    const [newTask, setNewTask] = useState<Partial<Task>>({ status: 'To Do', priority: 'Medium', assignee: 'JD', assigneeName: 'You' });
    const [updatingGoal, setUpdatingGoal] = useState<Goal | null>(null);

    const recalculateGoalProgress = (goalId: string, updatedTasks: Task[]) => {
        const goalTasks = updatedTasks.filter(t => t.goalId === goalId);
        if (goalTasks.length === 0) return;

        const doneCount = goalTasks.filter(t => t.status === 'Done').length;
        const progress = Math.round((doneCount / goalTasks.length) * 100);
        
        let status = 'In Progress';
        if (progress === 100) status = 'Completed';
        else if (progress === 0) status = 'Not Started';

        setGoals(prev => prev.map(g => 
            g.id === goalId ? { ...g, progress, status } : g
        ));
    };

    const toggleGoalExpand = (goalId: string) => {
        const newExpanded = new Set(expandedGoals);
        if (newExpanded.has(goalId)) {
            newExpanded.delete(goalId);
        } else {
            newExpanded.add(goalId);
        }
        setExpandedGoals(newExpanded);
    };

    const toggleTaskStatus = (taskId: string) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, status: t.status === 'Done' ? 'To Do' : 'Done' } as Task : t
        );
        setTasks(updatedTasks);
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            recalculateGoalProgress(task.goalId, updatedTasks);
        }
    };

    const handleAddGoal = () => {
        if(newGoal.title) {
            setGoals([...goals, { 
                ...newGoal, 
                id: Date.now().toString(), 
                progress: 0,
                currentValue: '0%',
                targetValue: '100%',
                metric: 'Percent',
                status: 'Not Started'
            } as Goal]);
            setIsGoalModalOpen(false);
            setNewGoal({ type: 'Strategic', startDate: '', endDate: '', status: 'Not Started' });
        }
    };

    const handleUpdateGoal = () => {
        if (updatingGoal) {
            setGoals(prev => prev.map(g => g.id === updatingGoal.id ? updatingGoal : g));
            setIsUpdateGoalModalOpen(false);
            setUpdatingGoal(null);
        }
    };

    const handleAddTask = () => {
        if(newTask.title && activeGoalId) {
            const addedTask = { 
                ...newTask, 
                id: Date.now().toString(), 
                goalId: activeGoalId 
            } as Task;
            const updatedTasks = [...tasks, addedTask];
            setTasks(updatedTasks);
            recalculateGoalProgress(activeGoalId, updatedTasks);
            setIsTaskModalOpen(false);
            setNewTask({ status: 'To Do', priority: 'Medium', assignee: 'JD', assigneeName: 'You' });
        }
    };

    const openAddTaskModal = (goalId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveGoalId(goalId);
        setIsTaskModalOpen(true);
    };

    const openUpdateGoalModal = (goal: Goal, e: React.MouseEvent) => {
        e.stopPropagation();
        setUpdatingGoal({ ...goal });
        setIsUpdateGoalModalOpen(true);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Delayed': return 'bg-red-100 text-red-700 border-red-200';
            case 'Not Started': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatDateDisplay = (dateStr?: string) => {
        if (!dateStr) return '--';
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center px-1">
                 <h3 className="text-xl font-bold text-slate-800">Kế hoạch hành động</h3>
                 <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-100"
                >
                    <Plus size={18} /> Create Objective
                </button>
            </div>

            <div className="space-y-6">
                {goals.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-16 text-center text-slate-400">
                        <CheckSquare size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-medium">Chưa có kế hoạch hành động nào được tạo.</p>
                        <button onClick={() => setIsGoalModalOpen(true)} className="mt-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-wider">Bắt đầu ngay</button>
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group">
                            <div 
                                onClick={() => toggleGoalExpand(goal.id)}
                                className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-[260px]">
                                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                        {expandedGoals.has(goal.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-bold text-slate-900 text-[15px] leading-tight">{goal.title}</span>
                                        <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getStatusColor(goal.status)}`}>
                                            {goal.status || 'Not Started'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex items-center justify-between gap-8">
                                    <div className="text-xs font-bold text-slate-500 whitespace-nowrap">{formatDateDisplay(goal.startDate)}</div>
                                    <div className="text-xs font-bold text-slate-500 whitespace-nowrap">{formatDateDisplay(goal.endDate)}</div>
                                    <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                                        <div className="flex justify-between text-[11px] font-black text-blue-600 uppercase tracking-tighter">
                                            <span>TIẾN ĐỘ</span>
                                            <span>{goal.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className={`h-full transition-all duration-700 ${goal.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 ml-6">
                                    <button 
                                        onClick={(e) => openUpdateGoalModal(goal, e)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => openAddTaskModal(goal.id, e)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {expandedGoals.has(goal.id) && (
                                <div className="bg-slate-50/20 border-t border-slate-100">
                                    {tasks.filter(t => t.goalId === goal.id).length === 0 ? (
                                         <div className="px-16 py-6 text-xs text-slate-400 font-medium italic">Không có công việc cụ thể.</div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {tasks.filter(t => t.goalId === goal.id).map(task => (
                                                <div key={task.id} className="px-6 py-4 pl-16 hover:bg-white transition-colors flex items-center justify-between group/task border-l-2 border-transparent hover:border-blue-500">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className={`text-sm font-bold ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                                {task.title}
                                                            </h4>
                                                            {task.attachmentCount ? (
                                                                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-400">
                                                                    <Paperclip size={12} /> {task.attachmentCount}
                                                                </span>
                                                            ) : null}
                                                            {task.priority === 'High' && (
                                                                <Flag size={12} className="text-red-500 fill-red-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                                            <div className="flex items-center gap-1.5">
                                                                <CornerDownRight size={12} className="text-slate-300" />
                                                                <span className="text-slate-500 font-black">{task.assigneeName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar size={12} className="text-slate-300" />
                                                                <span>{task.dueDate} {task.startTime && `(${task.startTime} - ${task.endTime})`}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => toggleTaskStatus(task.id)}
                                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all
                                                                ${task.status === 'Done' 
                                                                    ? 'text-green-500' 
                                                                    : 'text-slate-200 border-2 border-slate-100 hover:border-green-400'}
                                                            `}
                                                        >
                                                            {task.status === 'Done' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                                        </button>

                                                        <button className="h-8 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wide flex items-center gap-1.5 transition-colors">
                                                            {task.commentCount || 0} PHẢN HỒI <ChevronDown size={14} />
                                                        </button>

                                                        <button className="h-8 px-4 rounded-lg border border-blue-600 text-[10px] font-black text-blue-600 uppercase tracking-wide hover:bg-blue-50 transition-colors">
                                                            THẢO LUẬN
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal Cập nhật kế hoạch - Updated UI according to screenshot */}
            <Modal
                isOpen={isUpdateGoalModalOpen}
                onClose={() => setIsUpdateGoalModalOpen(false)}
                title="Cập nhật kế hoạch"
                maxWidth="max-w-lg"
            >
                {updatingGoal && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">TÊN KẾ HOẠCH</label>
                             <input 
                                type="text" 
                                value={updatingGoal.title} 
                                onChange={e => setUpdatingGoal({...updatingGoal, title: e.target.value})} 
                                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">NGÀY BẮT ĐẦU</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input 
                                        type="date" 
                                        value={updatingGoal.startDate || ''} 
                                        onChange={e => setUpdatingGoal({...updatingGoal, startDate: e.target.value})} 
                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">HẠN ĐỊNH</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input 
                                        type="date" 
                                        value={updatingGoal.endDate || ''} 
                                        onChange={e => setUpdatingGoal({...updatingGoal, endDate: e.target.value})} 
                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end items-center gap-8">
                            <button 
                                onClick={() => setIsUpdateGoalModalOpen(false)} 
                                className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors px-4"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleUpdateGoal} 
                                className="px-10 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Save size={20} /> Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Khởi tạo kế hoạch - Consistently styled with Edit Modal */}
            <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Create Objective">
                <div className="space-y-6">
                    <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">TÊN KẾ HOẠCH</label>
                         <input 
                            type="text" 
                            value={newGoal.title || ''} 
                            onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
                            className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:font-medium placeholder:text-slate-400" 
                            placeholder="Nhập tên kế hoạch..." 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">START DATE</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    value={newGoal.startDate || ''} 
                                    onChange={e => setNewGoal({...newGoal, startDate: e.target.value})} 
                                    onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">END DATE</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                <input 
                                    type="date" 
                                    value={newGoal.endDate || ''} 
                                    onChange={e => setNewGoal({...newGoal, endDate: e.target.value})} 
                                    onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 flex justify-end gap-3">
                        <button 
                            onClick={() => setIsGoalModalOpen(false)} 
                            className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-bold text-sm transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleAddGoal} 
                            className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-sm shadow-xl shadow-blue-100 transition-all active:scale-95"
                        >
                            Khởi tạo
                        </button>
                    </div>
                </div>
            </Modal>

             {/* Modal Thêm công việc */}
             <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Thêm công việc">
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-700">Nội dung công việc</label>
                        <input 
                            type="text" 
                            value={newTask.title || ''} 
                            onChange={e => setNewTask({...newTask, title: e.target.value})} 
                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                            placeholder="Nhập nội dung công việc..." 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700">Người phụ trách</label>
                            <input 
                                type="text" 
                                value={newTask.assigneeName || ''} 
                                onChange={e => setNewTask({...newTask, assigneeName: e.target.value})} 
                                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                                placeholder="Tên người thực hiện" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700">Độ ưu tiên</label>
                            <select 
                                value={newTask.priority} 
                                onChange={e => setNewTask({...newTask, priority: e.target.value as any})} 
                                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none shadow-sm"
                            >
                                <option value="Medium">Trung bình</option>
                                <option value="Low">Thấp</option>
                                <option value="High">Cao</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end items-center gap-4">
                        <button 
                            onClick={() => setIsTaskModalOpen(false)} 
                            className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors px-4 py-2"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleAddTask} 
                            className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            Thêm
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExecutionTab;
