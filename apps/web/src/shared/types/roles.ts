export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  CATALOG_MANAGER = 'CATALOG_MANAGER',
  MEDIA_MANAGER = 'MEDIA_MANAGER',
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  ORDER_MANAGER = 'ORDER_MANAGER',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  SUPPORT = 'SUPPORT',
  ANALYST = 'ANALYST',
}

export enum Permission {
  // Admin & Users
  ADMIN_READ = 'admin:read',
  ADMIN_WRITE = 'admin:write',
  ADMIN_DELETE = 'admin:delete',
  ROLES_MANAGE = 'roles:manage',
  SECURITY_MANAGE = 'security:manage',
  AUDIT_READ = 'audit:read',

  // CMS
  CMS_READ = 'cms:read',
  CMS_WRITE = 'cms:write',
  CMS_PUBLISH = 'cms:publish',

  // Media
  MEDIA_READ = 'media:read',
  MEDIA_UPLOAD = 'media:upload',
  MEDIA_DELETE = 'media:delete',

  // Catalog
  CATALOG_READ = 'catalog:read',
  CATALOG_WRITE = 'catalog:write',
  CATALOG_DELETE = 'catalog:delete',
  CATALOG_PUBLISH = 'catalog:publish',

  // Inventory
  INVENTORY_READ = 'inventory:read',
  INVENTORY_ADJUST = 'inventory:adjust',
  INVENTORY_APPROVE = 'inventory:approve',

  // Orders & Refunds
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  REFUNDS_INITIATE = 'refunds:initiate',
  REFUNDS_APPROVE = 'refunds:approve',

  // Customers
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_WRITE = 'customers:write',
  CUSTOMERS_EXPORT = 'customers:export',

  // Promotions & Reports
  PROMOTIONS_MANAGE = 'promotions:manage',
  REPORTS_READ = 'reports:read',
  REPORTS_EXPORT = 'reports:export',
}

export const ROLE_METADATA: Record<
  AdminRole,
  { label: string; description: string; color: string }
> = {
  [AdminRole.SUPER_ADMIN]: {
    label: 'Super Administrator',
    description: 'Unrestricted full access to all system, financial, security, and catalog domains.',
    color: '#C5A880',
  },
  [AdminRole.SECURITY_ADMIN]: {
    label: 'Security Administrator',
    description: 'Manages identity policies, MFA enforcement, session revocations, and audit ledgers.',
    color: '#EF4444',
  },
  [AdminRole.CATALOG_MANAGER]: {
    label: 'Catalog Manager',
    description: 'Manages jewelry SKUs, diamonds, metals, collections, and photography pipeline.',
    color: '#F59E0B',
  },
  [AdminRole.MEDIA_MANAGER]: {
    label: 'Media Asset Specialist',
    description: 'Manages high-res photography uploads, 3D render assets, and Cloudinary CDN optimization.',
    color: '#8B5CF6',
  },
  [AdminRole.INVENTORY_MANAGER]: {
    label: 'Vault & Inventory Manager',
    description: 'Oversees warehouse vault levels, stock adjustments, safety thresholds, and alerts.',
    color: '#10B981',
  },
  [AdminRole.ORDER_MANAGER]: {
    label: 'Order Fulfillment Manager',
    description: 'Processes domestic and international orders, shipment dispatches, and refund requests.',
    color: '#3B82F6',
  },
  [AdminRole.FINANCE]: {
    label: 'Finance & Comptroller',
    description: 'Financial reporting, 3D secure transaction ledgers, VAT/tax compliance, and refund approvals.',
    color: '#06B6D4',
  },
  [AdminRole.MARKETING]: {
    label: 'Marketing & Editorial Lead',
    description: 'Controls storefront banners, luxury storytelling CMS pages, and promotional coupon rules.',
    color: '#EC4899',
  },
  [AdminRole.SUPPORT]: {
    label: 'Customer Concierge Specialist',
    description: 'Manages customer inquiries, VIP profiles, order history lookups, and dispute resolution.',
    color: '#6366F1',
  },
  [AdminRole.ANALYST]: {
    label: 'Data & Growth Analyst',
    description: 'Read-only access to sales velocity, revenue analytics, customer cohort data, and exports.',
    color: '#64748B',
  },
};

export const PERMISSION_GROUPS: {
  name: string;
  description: string;
  permissions: { key: Permission; label: string; description: string }[];
}[] = [
  {
    name: 'Identity, Security & Governance',
    description: 'Privileged identity access, RBAC assignment, and audit forensics.',
    permissions: [
      { key: Permission.ADMIN_READ, label: 'View Admin Accounts', description: 'Inspect administrator directory' },
      { key: Permission.ADMIN_WRITE, label: 'Manage Admin Accounts', description: 'Create and modify administrator profiles' },
      { key: Permission.ADMIN_DELETE, label: 'Deactivate Admin Accounts', description: 'Deactivate privileged accounts' },
      { key: Permission.ROLES_MANAGE, label: 'Manage RBAC Matrix', description: 'Update role assignments and permissions' },
      { key: Permission.SECURITY_MANAGE, label: 'Enforce Security Policies', description: 'Manage 2FA policies and session revocations' },
      { key: Permission.AUDIT_READ, label: 'Inspect Audit Ledger', description: 'View immutable append-only audit trail' },
    ],
  },
  {
    name: 'Jewelry Catalog & Merchandising',
    description: 'SKU attributes, gold carats, precious gemstone specs, and pricing.',
    permissions: [
      { key: Permission.CATALOG_READ, label: 'View Jewelry Catalog', description: 'Inspect products, collections and pricing' },
      { key: Permission.CATALOG_WRITE, label: 'Create & Edit Jewelry SKUs', description: 'Modify gold weights, stones and details' },
      { key: Permission.CATALOG_DELETE, label: 'Archive Products', description: 'Archive obsolete jewelry designs' },
      { key: Permission.CATALOG_PUBLISH, label: 'Publish to Storefront', description: 'Change product publication visibility' },
    ],
  },
  {
    name: 'Vault & Inventory Management',
    description: 'Stock tracking, physical vault allocation, and low-level alerts.',
    permissions: [
      { key: Permission.INVENTORY_READ, label: 'Inspect Vault Levels', description: 'View stock counts and reserve quantities' },
      { key: Permission.INVENTORY_ADJUST, label: 'Adjust Vault Counts', description: 'Log incoming stock or recount discrepancies' },
      { key: Permission.INVENTORY_APPROVE, label: 'Approve Stock Write-offs', description: 'Authorize damage or vault adjustments' },
    ],
  },
  {
    name: 'Orders, Fulfillment & Refunds',
    description: 'International checkout processing, tracking numbers, and refunds.',
    permissions: [
      { key: Permission.ORDERS_READ, label: 'View Orders', description: 'Review customer orders and shipment states' },
      { key: Permission.ORDERS_WRITE, label: 'Update Fulfillment', description: 'Assign air waybills and dispatch packages' },
      { key: Permission.REFUNDS_INITIATE, label: 'Initiate Customer Refunds', description: 'Submit return/refund requests' },
      { key: Permission.REFUNDS_APPROVE, label: 'Approve Financial Refunds', description: 'Authorize fund reversals through payment gateways' },
    ],
  },
  {
    name: 'Customers & VIP Concierge',
    description: 'Client profile management, VIP tiers, and communication.',
    permissions: [
      { key: Permission.CUSTOMERS_READ, label: 'View Customer Profiles', description: 'Inspect client orders and delivery addresses' },
      { key: Permission.CUSTOMERS_WRITE, label: 'Manage Customer Details', description: 'Update customer notes and VIP tier' },
      { key: Permission.CUSTOMERS_EXPORT, label: 'Export Customer Lists', description: 'Download GDPR-compliant customer data' },
    ],
  },
  {
    name: 'Content, Media & Promotions',
    description: 'Storytelling pages, high-res photography CDN, and discount codes.',
    permissions: [
      { key: Permission.CMS_READ, label: 'View CMS Pages', description: 'Inspect landing pages and policies' },
      { key: Permission.CMS_WRITE, label: 'Edit CMS Pages', description: 'Update storytelling copy and hero banners' },
      { key: Permission.CMS_PUBLISH, label: 'Publish CMS Content', description: 'Push CMS revisions to production' },
      { key: Permission.MEDIA_READ, label: 'View Media Assets', description: 'Browse CDN photography and video library' },
      { key: Permission.MEDIA_UPLOAD, label: 'Upload Media', description: 'Upload raw high-res jewelry photography' },
      { key: Permission.MEDIA_DELETE, label: 'Delete Media', description: 'Remove unused media assets from CDN' },
      { key: Permission.PROMOTIONS_MANAGE, label: 'Manage Promo Rules', description: 'Create multi-currency discount codes' },
    ],
  },
  {
    name: 'Financial Intelligence & Reports',
    description: 'Executive statements, conversion metrics, and sales exports.',
    permissions: [
      { key: Permission.REPORTS_READ, label: 'View Executive Analytics', description: 'Inspect revenue KPIs and conversion charts' },
      { key: Permission.REPORTS_EXPORT, label: 'Export Financial Statements', description: 'Download CSV and PDF audit records' },
    ],
  },
];

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission),
  [AdminRole.SECURITY_ADMIN]: [
    Permission.ADMIN_READ,
    Permission.ADMIN_WRITE,
    Permission.ROLES_MANAGE,
    Permission.SECURITY_MANAGE,
    Permission.AUDIT_READ,
    Permission.CUSTOMERS_READ,
    Permission.REPORTS_READ,
  ],
  [AdminRole.CATALOG_MANAGER]: [
    Permission.CATALOG_READ,
    Permission.CATALOG_WRITE,
    Permission.CATALOG_DELETE,
    Permission.CATALOG_PUBLISH,
    Permission.MEDIA_READ,
    Permission.MEDIA_UPLOAD,
    Permission.INVENTORY_READ,
  ],
  [AdminRole.MEDIA_MANAGER]: [
    Permission.MEDIA_READ,
    Permission.MEDIA_UPLOAD,
    Permission.MEDIA_DELETE,
  ],
  [AdminRole.INVENTORY_MANAGER]: [
    Permission.INVENTORY_READ,
    Permission.INVENTORY_ADJUST,
    Permission.CATALOG_READ,
  ],
  [AdminRole.ORDER_MANAGER]: [
    Permission.ORDERS_READ,
    Permission.ORDERS_WRITE,
    Permission.REFUNDS_INITIATE,
    Permission.CUSTOMERS_READ,
    Permission.INVENTORY_READ,
  ],
  [AdminRole.FINANCE]: [
    Permission.ORDERS_READ,
    Permission.REFUNDS_INITIATE,
    Permission.REFUNDS_APPROVE,
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT,
  ],
  [AdminRole.MARKETING]: [
    Permission.CMS_READ,
    Permission.CMS_WRITE,
    Permission.CMS_PUBLISH,
    Permission.PROMOTIONS_MANAGE,
    Permission.CATALOG_READ,
    Permission.REPORTS_READ,
  ],
  [AdminRole.SUPPORT]: [
    Permission.CUSTOMERS_READ,
    Permission.CUSTOMERS_WRITE,
    Permission.ORDERS_READ,
    Permission.CATALOG_READ,
  ],
  [AdminRole.ANALYST]: [
    Permission.REPORTS_READ,
    Permission.CATALOG_READ,
    Permission.ORDERS_READ,
    Permission.CUSTOMERS_READ,
  ],
};

export interface UpdateAdminUserDto {
  firstName?: string;
  lastName?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface RoleMatrixItemDto {
  role: AdminRole;
  label: string;
  description: string;
  color: string;
  userCount: number;
  permissions: Permission[];
}
