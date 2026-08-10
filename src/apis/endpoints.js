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
};