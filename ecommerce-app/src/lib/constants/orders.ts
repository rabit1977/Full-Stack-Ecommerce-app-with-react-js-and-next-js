import { Order } from "@/lib/types";

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2023-08-15T10:00:00Z",
    items: [
      {
        id: "sku-456",
        cartItemId: "cart-sku-456-color-graphite",
        title: "NebulaPhone 12 Pro",
        price: 999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        options: { Color: "Graphite" },
      },
      {
        id: "sku-101",
        cartItemId: "cart-sku-101",
        title: "SoundScape Pro Headphones",
        price: 349,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
      },
    ],
    total: 1353.92, // 999 + 349 + 5 (shipping) + taxes
    status: "Pending",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "90210",
      country: "USA",
    },
    billingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "90210",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-08-15T10:00:00Z",
  },
  {
    id: "ORD-002",
    date: "2023-08-10T14:30:00Z",
    items: [
      {
        id: "sku-123",
        cartItemId: "cart-sku-123-color-black",
        title: "Quantum QLED 65\" TV",
        price: 1299,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=800&auto=format&fit=crop",
        options: { Color: "Black" },
      },
    ],
    total: 1408.92, // 1299 + 5 (shipping) + taxes
    status: "Shipped",
    shippingAddress: {
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Otherville",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    billingAddress: {
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Otherville",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-08-10T14:30:00Z",
  },
  {
    id: "ORD-003",
    date: "2023-08-01T09:15:00Z",
    items: [
      {
        id: "sku-555",
        cartItemId: "cart-sku-555",
        title: "ChronoWatch Series 8",
        price: 429,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      },
    ],
    total: 933.36, // 429*2 + 5 (shipping) + taxes
    status: "Delivered",
    shippingAddress: {
      name: "Alice Johnson",
      street: "789 Pine Ln",
      city: "Smalltown",
      state: "TX",
      zip: "73301",
      country: "USA",
    },
    billingAddress: {
      name: "Alice Johnson",
      street: "789 Pine Ln",
      city: "Smalltown",
      state: "TX",
      zip: "73301",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-08-01T09:15:00Z",
  },
];
