import api from './api';

export const adminService = {
  // Fitur 3
  changeRole: (userId: number, newRole: string) => {
    return api.post('/admin/change-role', { userId, newRole });
  },
  // Fitur 4
  updatePrice: (itemName: string, newPrice: number) => {
    return api.post('/admin/update-price', { itemName, newPrice });
  },

  forceLogoutPC: (computerId: number) => {
    return api.post('/admin/force-logout', { computerId });
  },
};