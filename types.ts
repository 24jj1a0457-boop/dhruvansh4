
export type AppView = 'LANDING' | 'USER_LOGIN' | 'ADMIN_LOGIN' | 'REGISTER' | 'USER_DASHBOARD' | 'ADMIN_DASHBOARD' | 'PENDING_MESSAGE';

export interface PendingUser {
  id?: string;
  fullName: string;
  email: string;
  vehicleId: string;
  status: 'pending';
  timestamp: number;
}

export interface ApprovedUser {
  uid: string;
  fullName: string;
  email: string;
  vehicleId: string;
  status: 'idle' | 'emergency';
  esp32Connected: boolean;
}

// Fix: Adding the Product interface which was missing from the exports and required by Sidebar.tsx
export interface Product {
  id: string;
  name: string;
  price: string;
  type: string;
}
