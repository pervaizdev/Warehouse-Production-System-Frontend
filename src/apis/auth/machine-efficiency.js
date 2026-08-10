import { axiosInstance } from '../axiosinstance';
import { API_ENDPOINTS } from '../endpoints';

export const machineEfficiencyApi = {
  getMachineEfficiencyData: async () => {
    return await axiosInstance.get(API_ENDPOINTS.MACHINE_EFFICIENCY.MACHINE_EFFICIENCY);
  }
};
