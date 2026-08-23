export interface Reservation {
  guestName: string;
  hotelName: string;
  hotelCity: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  roomNumber: string;
  folioId: string;
}

export interface UpsellOption {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

export type MenuCategory = "All" | "Midnight Craving" | "Main Course" | "Beverages" | "Housekeeping";
export type ServiceTab = "In-Room Dining" | "Housekeeping Services" | "Hotel Amenities";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  tab: ServiceTab;
  emoji: string;
  prepTime?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type PaymentMethod = "folio" | "upi";
