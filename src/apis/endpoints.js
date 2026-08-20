export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  MACHINE_EFFICIENCY: {
    MACHINE_EFFICIENCY: '/machine-efficiency/machine-efficiency',
    FILTER_OPTIONS: '/machine-efficiency/filter-options',
    MACHINE_DRILLDOWN: (machineId) => `/machine-efficiency/machine/${machineId}`,
    ORDER_DRILLDOWN: (orderNum) => `/machine-efficiency/order/${orderNum}`,
  },

  PRODUCTION_TREND: {
    SUMMARY: '/production-trend/summary',
    MONTHLY: '/production-trend/monthly',
    YEARLY: '/production-trend/yearly',
    PRODUCT_SHARE: '/production-trend/product-share',
    YEAR_COMPARISON: '/production-trend/year-comparison',
    TABLE: '/production-trend/table',
    FILTERS: '/production-trend/filters',
  },

  INVENTORY: {
    SUMMARY: '/inventory/summary',
    CURRENT: '/inventory/current',
    WAREHOUSES: '/inventory/warehouses',
    ITEM_GROUPS: '/inventory/item-groups',
    MOVEMENTS: '/inventory/movements',
    EXPIRY: '/inventory/expiry',
    BATCHES: '/inventory/batches',
    PURCHASE_PIPELINE: '/inventory/purchase-pipeline',
    COMMITMENTS: '/inventory/commitments',
    PRODUCTION_DEMAND: '/inventory/production-demand',
    FILTERS: '/inventory/filters',
    ITEM_DETAIL: (itemCode) => `/inventory/items/${encodeURIComponent(itemCode)}`,
  },
  
  PRODUCTION_PLANNING: {
    KPIS: '/production-planning/kpis',
    SHORTAGES: '/production-planning/shortages',
    BATCH_EXPIRY: '/production-planning/batch-expiry',
    HISTORY: '/production-planning/history',
    TREND: '/production-planning/trend',
    RECOMMENDATIONS: '/production-planning/recommendations',
  },

  DASHBOARD: {
    OVERVIEW: '/dashboard'
  }
};