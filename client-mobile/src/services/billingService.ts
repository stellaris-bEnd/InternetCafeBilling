import api from './api';
import { Computer } from '../types/entities';

export const billingService = {
  getComputers: () => {
    return api.get<Computer[]>('/billing/computers');
  },
};