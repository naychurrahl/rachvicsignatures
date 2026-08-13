import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  CartItem,
  NewOrderInput,
  OrderInterface,
  Product,
  SiteSettings,
  Staff,
  User,
  ModalScreen,
} from "@/app/data/interFaces";

import { DEFAULT_SETTINGS } from "@/app/data/defaultSettings";

import {
  ApiRequest,
  baseUrl,
  setAuthToken,
  clearAuthToken,
} from "@/app/contexts/ApiRequest";

const GUEST_CART_KEY = "guest_cart";

function readGuestCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(cart: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}



interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  orders: OrderInterface[];
  addOrder: (order: NewOrderInput) => Promise<OrderInterface>;
  updateOrderStatus: (
    orderId: string,
    status: "new" | "in-progress" | "completed" | "cancelled",
  ) => void;
  // auth additions
  user: User | null;
  modalOpen: boolean;
  modalScreen: ModalScreen;
  openModal: (screen?: ModalScreen) => void;
  closeModal: (redirectHome?: boolean) => void;
  login: (user: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  products: Product[];
  setProducts: (product: Product[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
  loadCart: boolean;
  setLoadCart: (data: boolean) => void;
  loadProduct: boolean;
  setLoadProduct: (data: boolean) => void;
  loadOrder: boolean;
  setloadOrder: (data: boolean) => void;
  loadAuth: boolean;
  setloadAuth: (data: boolean) => void;
  loadStaff: boolean;
  setloadStaff: (data: boolean) => void;
  authReady: boolean;
  settings: SiteSettings;
  loadSettings: boolean;
  setLoadSettings: (data: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(readGuestCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [orders, setOrders] = useState<OrderInterface[]>([]);

  const [loadCart, setLoadCart] = useState<boolean>(false);
  const [loadProduct, setLoadProduct] = useState<boolean>(false);
  const [loadOrder, setloadOrder] = useState<boolean>(false);
  const [loadAuth, setloadAuth] = useState<boolean>(false);
  const [loadStaff, setloadStaff] = useState<boolean>(false);
  const [loadSettings, setLoadSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // auth state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalScreen, setModalScreen] = useState<ModalScreen>("login");

  const navigate = useNavigate();
  const { setTheme } = useTheme();


  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/ping` })
      .then(
        (data: {
          status: "in" | "out";
          timestamp: String;
          message: String;
          user?: User;
        }) => {
          if (data.user) {
            setUser(data.user as User);
            if (data.user.theme === "light" || data.user.theme === "dark") {
              setTheme(data.user.theme);
            }
            setLoadCart(!loadCart);
            setloadOrder(!loadOrder);
          }
        },
      )
      .catch(console.error)
      .finally(() => setAuthReady(true));
  }, [loadAuth]);

  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/settings` })
      .then((data: SiteSettings) => setSettings(data))
      .catch(console.error);
  }, [loadSettings]);

  // fetch on mount instead
  useEffect(() => {
    if (user)
      ApiRequest({ url: `${baseUrl}/cart` })
        .then((data: any) => setCart(data as CartItem[]))
        .catch(console.error);
  }, [loadCart]);

  // fetch on mount instead
  useEffect(() => {
    if (user)
      ApiRequest({ url: `${baseUrl}/orders` })
        .then((data: any) => setOrders(data as OrderInterface[]))
        .catch(console.error);
  }, [loadOrder]);

  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/product` })
      .then((data: { products?: Product[]; categories?: string[] }) => {
        if (Array.isArray(data.products)) setProducts(data.products);
        if (Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch(console.error);
  }, [loadProduct]);

  useEffect(() => {
    if (user?.role === 'admin') {
      ApiRequest({ url: `${baseUrl}/user` })
        .then((data: Staff[]) => setStaff(data))
        .catch(console.error);
    }
  }, [loadStaff]);

  const createOrder = async (order: NewOrderInput) => {
    const update = await ApiRequest({
      url: `${baseUrl}/orders`,
      method: "POST",
      body: order,
    });

    return update as OrderInterface;
  };

  const mergeCartItem = (prev: CartItem[], item: CartItem) => {
    const existing = prev.find((i) => i.id === item.id);
    if (existing) {
      return prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
          : i,
      );
    }
    return [...prev, { ...item, quantity: Math.min(item.quantity, item.stock) }];
  };

  const addToCart = async (item: CartItem) => {
    if (!user) {
      setCart((prev) => {
        const next = mergeCartItem(prev, item);
        writeGuestCart(next);
        return next;
      });
      return;
    }

    await ApiRequest({
      url: `${baseUrl}/cart`,
      method: "POST",
      body: { product_id: item.id, quantity: item.quantity },
    });

    setCart((prev) => mergeCartItem(prev, item));
  };

  const removeFromCart = async (id: string) => {
    if (!user) {
      setCart((prev) => {
        const next = prev.filter((item) => item.id !== id);
        writeGuestCart(next);
        return next;
      });
      return;
    }

    await ApiRequest({
      url: `${baseUrl}/cart/${id}`,
      method: "DELETE",
    });

    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) {
      setCart((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        );
        writeGuestCart(next);
        return next;
      });
      return;
    }

    await ApiRequest({
      url: `${baseUrl}/cart`,
      method: "PUT",
      body: { product_id: id, quantity },
    });

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
    if (!user) writeGuestCart([]);
  };

  const addOrder = async (order: NewOrderInput) => {
    const newOrder = await createOrder(order);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  //
  const openModal = (screen: ModalScreen = "login") => {
    setModalScreen(screen);
    setModalOpen(true);
  };

  const closeModal = (red: boolean = false) => {
    setModalOpen(false);
    if (red === true) navigate('/');
  };

  const login = async (userData: User, token?: string) => {
    if (token) setAuthToken(token);
    if (userData.theme === "light" || userData.theme === "dark") {
      setTheme(userData.theme);
    }

    const guestItems = readGuestCart();
    setUser(userData);
    closeModal();

    if (guestItems.length > 0) {
      const results = await Promise.allSettled(
        guestItems.map((item) =>
          ApiRequest({
            url: `${baseUrl}/cart`,
            method: "POST",
            body: { product_id: item.id, quantity: item.quantity },
          }),
        ),
      );

      const failedItems = guestItems.filter((_, i) => results[i].status === "rejected");

      if (failedItems.length > 0) {
        results.forEach((r, i) => {
          if (r.status === "rejected") {
            console.error(`Failed to merge guest cart item ${guestItems[i].id}`, r.reason);
          }
        });
        toast.error(
          failedItems.length === guestItems.length
            ? "Couldn't restore your cart. Please add your items again."
            : "Some cart items couldn't be restored. Please check your cart.",
        );
      }

      writeGuestCart(failedItems);
    }

    setLoadCart((prev: boolean) => !prev);
    setloadOrder((prev: boolean) => !prev);
    setloadStaff((prev: boolean) => !prev);
  };

  const logout = async () => {
    try {
      await ApiRequest({
        url: `${baseUrl}/auth/logout`,
        method: "get",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    }

    clearAuthToken();
    setUser(null);
    setCart([]);
    setOrders([]);
    setStaff([]);
  };

  const updateOrderStatus = (
    orderId: string,
    status: "new" | "in-progress" | "completed" | "cancelled",
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        addOrder,
        updateOrderStatus,
        user,
        modalOpen,
        modalScreen,
        openModal,
        closeModal,
        login,
        logout,
        products,
        setProducts,
        categories,
        setCategories,
        loadCart,
        setLoadCart,
        loadProduct,
        setLoadProduct,
        loadOrder,
        setloadOrder,
        loadAuth,
        setloadAuth,
        staff,
        setStaff,
        loadStaff,
        setloadStaff,
        authReady,
        settings,
        loadSettings,
        setLoadSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
