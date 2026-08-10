import { axiosInstance } from '../axiosinstance';
import { API_ENDPOINTS } from '../endpoints';

export const machineEfficiencyApi = {
  getMachineEfficiencyData: async (filters = {}, page = 1, limit = 10) => {
    return await axiosInstance.get(API_ENDPOINTS.MACHINE_EFFICIENCY.MACHINE_EFFICIENCY, {
      params: { ...filters, page, limit }
    });
  },
  
  getFilterOptions: async () => {
    return await axiosInstance.get(API_ENDPOINTS.MACHINE_EFFICIENCY.FILTER_OPTIONS);
  },
  
  getMachineDrilldown: async (machineId) => {
    return await axiosInstance.get(API_ENDPOINTS.MACHINE_EFFICIENCY.MACHINE_DRILLDOWN(machineId));
  },
  
  getOrderDrilldown: async (orderNum) => {
    return await axiosInstance.get(API_ENDPOINTS.MACHINE_EFFICIENCY.ORDER_DRILLDOWN(orderNum));
  }
};
