import { axiosInstance } from '../axiosinstance';
import { API_ENDPOINTS } from '../endpoints';

export const productionTrendApi = {
  getSummary: async (filters = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.SUMMARY, { params: filters });
  },
  getMonthlyTrend: async (filters = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.MONTHLY, { params: filters });
  },
  getYearlyTrend: async (filters = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.YEARLY, { params: filters });
  },
  getProductShare: async (filters = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.PRODUCT_SHARE, { params: filters });
  },
  getYearComparison: async (filters = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.YEAR_COMPARISON, { params: filters });
  },
  getTableData: async (filters = {}, page = 1, pageSize = 10, search = '') => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.TABLE, {
      params: { ...filters, page, pageSize, search }
    });
  },
  getFilterOptions: async () => {
    return await axiosInstance.get(API_ENDPOINTS.PRODUCTION_TREND.FILTERS);
  }
};
