export enum UserRole {
  ADMIN = 'Admin',
  IIL_OPS = 'IIL Operations',
  CLIENT = 'Client',
  WAREHOUSE = 'Warehouse'
}

export enum ProjectStatus {
  REQUIREMENTS = 'Requirements',
  WAREHOUSE = 'Warehouse',
  DISPATCH = 'Dispatch',
  CENTERS = 'Centers',
  EXAM = 'Exam',
  REPORTS = 'Reports',
  RETURNS = 'Returns'
}

export enum ItemStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  MISMATCH = 'Mismatch'
}

export interface MaterialRequirement {
  enabled: boolean;
  quantity: number;
  nomenclature: string;
}

export interface ManualMaterialRequirement {
  id: string;
  type: string;
  nomenclature: string;
  quantity: number;
  // Sub-fields for GPS Locks
  subFields?: {
    locks: number;
    rfid: number;
    chargers: number;
    adapters: number;
  };
}

export interface ShiftInventory {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  gpsLocks: MaterialRequirement;
  chargers: MaterialRequirement;
  adaptors: MaterialRequirement;
  rfidMaster: MaterialRequirement;
  rfidUnique: MaterialRequirement;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  code: string;
  examDate: string;
  status: ProjectStatus;
  totalCenters: number;
  totalLocks: number;
  shifts: ShiftInventory[];
  manualRequirements: ManualMaterialRequirement[];
  requirementDocuments?: string[];
  // Security fields
  projectPasscode: string;
  adminPasscode: string;
}

export interface AuthState {
  user: {
    role: UserRole;
    name: string;
  } | null;
  activeProject: Project | null;
}