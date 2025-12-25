
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
    CheckCircle2
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
        startDate: '01 Thg 1, 2025',
        endDate: '01 Thg 6, 2025',
        completeDate: '01 Thg 6, 2025',
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
        startDate: '01 Thg 1, 2025',
        endDate: '01 Thg 6, 2025',
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
        startDate: '01 Thg 1, 2025',
        endDate: '01 Thg 6, 2025',
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

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center px-1">
                 <h3 className="text-lg font-bold text-slate-800">Kế hoạch hành động</h3>
                 <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                    <Plus size={14} /> Tạo kế hoạch
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {goals.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <CheckSquare size={48} className="mx-auto mb-4 opacity-10" />
                            <p className="text-sm font-medium">Chưa có kế hoạch hành động nào được tạo.</p>
                            <button onClick={() => setIsGoalModalOpen(true)} className="mt-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-wider">Bắt đầu ngay</button>
                        </div>
                    ) : (
                        goals.map(goal => (
                            <div key={goal.id} className="group">
                                <div 
                                    onClick={() => toggleGoalExpand(goal.id)}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-[240px]">
                                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                            {expandedGoals.has(goal.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-800 text-[13px] leading-tight">{goal.title}</span>
                                            <span className={`w-fit px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getStatusColor(goal.status)}`}>
                                                {goal.status || 'Not Started'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-between gap-6">
                                        <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{goal.startDate || '--'}</div>
                                        <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{goal.endDate || '--'}</div>
                                        <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                            <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                                <span>TIẾN ĐỘ</span>
                                                <span>{goal.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-700 ${goal.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                    style={{ width: `${goal.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-1 ml-4">
                                        <button 
                                            onClick={(e) => openUpdateGoalModal(goal, e)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => openAddTaskModal(goal.id, e)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {expandedGoals.has(goal.id) && (
                                    <div className="bg-slate-50/20 border-t border-slate-100">
                                        {tasks.filter(t => t.goalId === goal.id).length === 0 ? (
                                             <div className="px-12 py-5 text-xs text-slate-400 font-medium italic">Không có công việc cụ thể.</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {tasks.filter(t => t.goalId === goal.id).map(task => (
                                                    <div key={task.id} className="px-5 py-3 pl-12 hover:bg-white transition-colors flex items-center justify-between group/task border-l-2 border-transparent hover:border-blue-500">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h4 className={`text-xs font-bold ${task.status === 'Done' ? 'text-slate-400' : 'text-slate-800'}`}>
                                                                    {task.title}
                                                                </h4>
                                                                {task.attachmentCount ? (
                                                                    <span className="flex items-center gap-0.5 px-1 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-400">
                                                                        <Paperclip size={10} /> {task.attachmentCount}
                                                                    </span>
                                                                ) : null}
                                                                {task.priority === 'High' && (
                                                                    <Flag size={10} className="text-red-500 fill-red-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] font-bold text-slate-400 uppercase">
                                                                <div className="flex items-center gap-1">
                                                                    <CornerDownRight size={10} className="text-slate-300" />
                                                                    <span className="text-slate-500 font-black">{task.assigneeName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar size={10} className="text-slate-300" />
                                                                    <span>{task.dueDate} {task.startTime && `(${task.startTime} - ${task.endTime})`}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => toggleTaskStatus(task.id)}
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                                                    ${task.status === 'Done' 
                                                                        ? 'text-green-500' 
                                                                        : 'text-slate-200 border-2 border-slate-100 hover:border-green-400'}
                                                                `}
                                                            >
                                                                {task.status === 'Done' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                                            </button>

                                                            <button className="h-7 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[9px] font-black text-slate-600 uppercase tracking-tight flex items-center gap-1 transition-colors">
                                                                {task.commentCount || 0} PHẢN HỒI <ChevronDown size={12} />
                                                            </button>

                                                            <button className="h-7 px-3 rounded-lg border border-blue-600 text-[9px] font-black text-blue-600 uppercase tracking-tight hover:bg-blue-50 transition-colors">
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
            </div>

            {/* Modal Cập nhật kế hoạch */}
            <Modal
                isOpen={isUpdateGoalModalOpen}
                onClose={() => setIsUpdateGoalModalOpen(false)}
                title="Cập nhật kế hoạch"
                maxWidth="max-w-md"
            >
                {updatingGoal && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Tên kế hoạch</label>
                             <input 
                                type="text" 
                                value={updatingGoal.title} 
                                onChange={e => setUpdatingGoal({...updatingGoal, title: e.target.value})} 
                                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Ngày bắt đầu</label>
                                <input 
                                    type="text" 
                                    value={updatingGoal.startDate || ''} 
                                    onChange={e => setUpdatingGoal({...updatingGoal, startDate: e.target.value})} 
                                    className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Hạn định</label>
                                <input 
                                    type="text" 
                                    value={updatingGoal.endDate || ''} 
                                    onChange={e => setUpdatingGoal({...updatingGoal, endDate: e.target.value})} 
                                    className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end items-center gap-6">
                            <button 
                                onClick={() => setIsUpdateGoalModalOpen(false)} 
                                className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleUpdateGoal} 
                                className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Save size={18} /> Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Khởi tạo kế hoạch */}
            <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Khởi tạo kế hoạch">
                <div className="space-y-4">
                    <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-400 uppercase px-1">Tên kế hoạch</label>
                         <input 
                            type="text" 
                            value={newGoal.title || ''} 
                            onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-sm outline-none" 
                            placeholder="Nhập tên kế hoạch..." 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={newGoal.startDate || ''} onChange={e => setNewGoal({...newGoal, startDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                        <input type="date" value={newGoal.endDate || ''} onChange={e => setNewGoal({...newGoal, endDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <button onClick={() => setIsGoalModalOpen(false)} className="px-4 py-2 text-slate-500 text-xs font-bold">Hủy</button>
                        <button onClick={handleAddGoal} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Khởi tạo</button>
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
