export type UserRole = 'member' | 'admin';
export type MemberStatus = 'regular' | 'vip' | 'vvip'; // <-- BARU

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  // --- TAMBAHAN BARU ---
  memberStatus: MemberStatus;
  remainingTimeSeconds: number;
}

export type ComputerStatus = 'available' | 'occupied' | 'maintenance';

export interface Computer {
  id: number;
  name: string;
  status: ComputerStatus;
  username?: string;
}

// --- TIPE BARU UNTUK MENU PAGE (FITUR 1) ---
export interface PackagePrice {
  name: string;
  price: number;
}
export interface ProductPrice {
  name: string;
  price: number;
  type: 'food' | 'drink';
}
export interface UpgradePrice {
  name: string;
  price: number;
}
export interface PriceList {
  packages: PackagePrice[];
  products: ProductPrice[];
  upgrades: UpgradePrice[];
}