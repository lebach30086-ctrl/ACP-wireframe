
export interface AccountPlan {
    id: string;
    accountName: string; // This represents the Plan Name (e.g., "Global Expansion 2024")
    companyId: string;   // Reference to the Company
    companyName: string; // Display name of the Company
    companySegment?: 'Enterprise' | 'SME' | 'Corporate' | 'Retail'; // Synced from Company
    fiscalYear: string;
    owner: string;
    status: 'Draft' | 'Pending Approval' | 'Active' | 'Needs Revision' | 'Completed';
    progress: number;
    industry: string;
    revenue: number; // Projected revenue
    winRate: number;
    isNew?: boolean; // Flag to identify newly created plans without detailed data
    
    // Extended fields
    employees?: string;
    location?: string;
    tier?: string;
    taxCode?: string;
    legalRepresentative?: string;

    // Date fields
    startDate?: string;
    endDate?: string;
    submittedDate?: string;
    approvedDate?: string;
    rejectionReason?: string;
  }

  export interface Company {
    id: string;
    name: string;
    cif: string;
    taxCode: string;
    legalRepresentative: string;
    segment: 'Enterprise' | 'SME' | 'Corporate' | 'Retail';
    
    // Detailed fields
    address?: string;
    officeAddress?: string;
    email?: string;
    phone?: string;
    description?: string;
    industry?: string;
    licenseDate?: string;
    operatingDate?: string;
    owner?: string;
    ownerEmail?: string;
    avatarUrl?: string; // For the company logo/icon placeholder
  }
  
  export interface Goal {
    id: string;
    title: string;
    type: 'Revenue' | 'Strategic';
    progress: number;
    metric: string;
    targetValue: string;
    currentValue: string;
    // Added for Action Plan UI
    startDate?: string;
    endDate?: string;
    completeDate?: string;
    status?: string;
  }
  
  export interface Task {
    id: string;
    goalId: string;
    title: string;
    assignee: string; // Avatar URL or Initials
    assigneeName: string;
    assigneeEmail?: string;
    dueDate: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
    attachmentCount?: number;
    commentCount?: number;
    startTime?: string;
    endTime?: string;
  }
  
  export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    title: string;
    influence: number; // 0-100 (X axis)
    interest: number; // 0-100 (Y axis)
    sentiment: 'Positive' | 'Neutral' | 'Negative'; // Color coding
    department?: string;
    email?: string;
    phone?: string;
  }
  
  export enum PlanTab {
    OVERVIEW = 'overview',
    ANALYSIS = 'analysis',
    WHITESPACE = 'whitespace',
    STAKEHOLDERS = 'stakeholders',
    ACTION_PLAN = 'action_plan',
    APPROVAL = 'approval'
  }
