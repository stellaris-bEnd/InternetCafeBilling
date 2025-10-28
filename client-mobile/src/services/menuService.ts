import api from './api';
import { PriceList } from '../types/entities';

export const menuService = {
  getPrices: () => {
    // Pastikan endpoint ini ('/menu/prices')
    // cocok dengan yang ada di router backend Go Anda
    return api.get<PriceList>('/menu/prices');
  },
};