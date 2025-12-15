export interface AccountPlan {
    id: string;
    accountName: string;
    fiscalYear: string;
    owner: string;
    status: 'Draft' | 'Active' | 'Review' | 'Completed';
    progress: number;
    industry: string;
    revenue: number; // Projected revenue
    winRate: number;
    isNew?: boolean; // Flag to identify newly created plans without detailed data
    
    // Extended fields
    employees?: string;
    location?: string;
    tier?: string;
  }
  
  export interface Goal {
    id: string;
    title: string;
    type: 'Revenue' | 'Strategic';
    progress: number;
    metric: string;
    targetValue: string;
    currentValue: string;
  }
  
  export interface Task {
    id: string;
    goalId: string;
    title: string;
    assignee: string; // Avatar URL or Initials
    assigneeName: string;
    dueDate: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
  }
  
  export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    title: string;
    influence: number; // 0-100 (X axis)
    interest: number; // 0-100 (Y axis)
    sentiment: 'Positive' | 'Neutral' | 'Negative'; // Color coding
  }
  
  export enum PlanTab {
    OVERVIEW = 'overview',
    MARKET = 'market',
    STRATEGY = 'strategy',
    EXECUTION = 'execution',
  }