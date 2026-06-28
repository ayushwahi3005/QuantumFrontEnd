// Data Models for Inspections Component
// These interfaces define the expected structure of API responses

export interface StatusCount {
  status: string; // "PENDING" | "COMPLETED" | "ONGOING" | "CANCELLED"
  count: number;
}

export interface StatusCountResponse {
  statusCounts: StatusCount[];
  totalInspections: number;
}

export interface PerformerCount {
  performedBy: string; // Employee name
  count: number;       // Number of pending inspections
}

export interface PerformerCountResponse {
  performerCounts: PerformerCount[];
}

export interface InspectionInstance {
  id?: string;
  inspectionName?: string;
  assetId?: string;
  status?: string; // "PENDING" | "COMPLETED" | "ONGOING"
  performedBy?: string;
  dueDate?: Date | string;
  location?: string;
  [key: string]: any; // Additional properties from backend
}

export interface InspectionDetail {
  inspectionInstance: InspectionInstance;
  customerId: string;
  assetName: string;
  assetCategory: string;
  customerName: string;
}

export interface InspectionDetailResponse {
  data: InspectionDetail[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface InspectionFilter {
  customerId?: string;           // Exact match
  assetId?: string;              // Exact match
  assetCategory?: string;        // Case-insensitive regex
  inspectionName?: string;       // Case-insensitive regex
  status?: string;               // PENDING | COMPLETED | CANCELLED
  createdDateFrom?: string;      // ISO format date
  createdDateTo?: string;        // ISO format date
  performedBy?: string;          // Exact match
  pageNumber: number;            // 0-indexed
  pageSize: number;              // Records per page
  sortField: string;             // Field to sort by
  sortDirection: string;         // ASC | DESC
}

/**
 * Example API Responses
 */

// Example Status Count Response
const statusCountExample: StatusCountResponse = {
  statusCounts: [
    { status: "PENDING", count: 15 },
    { status: "COMPLETED", count: 42 },
    { status: "ONGOING", count: 8 }
  ],
  totalInspections: 65
};

// Example Performer Count Response
const performerCountExample: PerformerCountResponse = {
  performerCounts: [
    { performedBy: "John Doe", count: 12 },
    { performedBy: "Jane Smith", count: 8 },
    { performedBy: "Mike Johnson", count: 5 }
  ]
};

// Example Detailed Inspection Response
const detailedInspectionExample: InspectionDetailResponse = {
  data: [
    {
      inspectionInstance: {
        id: "INS001",
        inspectionName: "Monthly Equipment Check",
        assetId: "AST456",
        status: "PENDING",
        performedBy: "John Doe",
        dueDate: "2026-06-15",
        location: "Building A"
      },
      customerId: "CUST123",
      assetName: "HVAC Unit 12",
      assetCategory: "Climate Control",
      customerName: "ABC Corporation"
    }
  ],
  totalRecords: 45,
  currentPage: 0,
  pageSize: 10,
  totalPages: 5,
  hasNext: true,
  hasPrevious: false
};

/**
 * Key Field Mappings
 */

export const StatusMapping: Record<string, string> = {
  'PENDING': 'Pending',
  'COMPLETED': 'Completed',
  'ONGOING': 'Ongoing',
  'CANCELLED': 'Cancelled'
};

export const StatusColorMapping: Record<string, string> = {
  'PENDING': '#FF9800',
  'COMPLETED': '#4CAF50',
  'ONGOING': '#2196F3',
  'CANCELLED': '#9E9E9E'
};

export const StatusBadgeClassMapping: Record<string, string> = {
  'PENDING': 'status-pending',
  'COMPLETED': 'status-completed',
  'ONGOING': 'status-ongoing',
  'CANCELLED': 'status-default'
};

/**
 * Filter Validation Rules
 */

export const FilterValidationRules = {
  // Date format should be ISO string: "YYYY-MM-DD"
  dateFormat: /^\d{4}-\d{2}-\d{2}$/,

  // Status should be one of these values
  validStatuses: ['PENDING', 'COMPLETED', 'ONGOING', 'CANCELLED'],

  // Sort direction should be one of these
  validSortDirections: ['ASC', 'DESC'],

  // Valid sort fields
  validSortFields: [
    'id',
    'inspectionName',
    'assetName',
    'assetId',
    'customerName',
    'status',
    'performedBy',
    'dueDate',
    'createdAt'
  ]
};

/**
 * Component Constants
 */

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SORT_FIELD: 'createdAt',
  DEFAULT_SORT_DIRECTION: 'DESC'
};

export const TABLE_COLUMNS = [
  { label: 'ID', field: 'id', sortable: true },
  { label: 'Template', field: 'inspectionName', sortable: true },
  { label: 'Asset', field: 'assetName', sortable: true },
  { label: 'Serial', field: 'assetId', sortable: true },
  { label: 'Customer', field: 'customerName', sortable: true },
  { label: 'Location', field: 'location', sortable: true },
  { label: 'Performed By', field: 'performedBy', sortable: true },
  { label: 'Due Date', field: 'dueDate', sortable: true },
  { label: 'Status', field: 'status', sortable: true }
];

/**
 * Error Handling
 */

export const ErrorMessages = {
  LOAD_STATUS_FAILED: 'Failed to load inspection status counts',
  LOAD_PERFORMER_FAILED: 'Failed to load performer data',
  LOAD_DETAILS_FAILED: 'Failed to load inspection details',
  INVALID_COMPANY_ID: 'Invalid or missing company ID',
  API_TIMEOUT: 'API request timed out',
  NETWORK_ERROR: 'Network connection error'
};
