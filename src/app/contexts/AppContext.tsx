import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  CartItem,
  OrderInterface,
  Product,
  Staff,
  User,
  ModalScreen,
} from "@/app/data/interFaces";

import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";

/* const CartItems: CartItem[] = await ApiRequest({
  url: `${baseUrl}/cart`,
}); */



interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  orders: OrderInterface[];
  addOrder: (order: OrderInterface) => void;
  updateOrderStatus: (
    orderId: string,
    status: "new" | "in-progress" | "completed",
  ) => void;
  userRole: "customer" | "staff" | "admin" | null;
  setUserRole: (role: "customer" | "staff" | "admin" | null) => void;
  // auth additions
  user: User | null;
  modalOpen: boolean;
  modalScreen: ModalScreen;
  openModal: (screen?: ModalScreen) => void;
  closeModal: () => void;
  login: (user: User) => void;
  logout: () => void;
  products: Product[];
  setProducts: (product: Product[]) => void;
  categories: String[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [userRole, setUserRole] = useState<
    "customer" | "staff" | "admin" | null
  >("customer");

  const [loadCart, setLoadCart] = useState<boolean>(false);
  const [loadProduct, setLoadProduct] = useState<boolean>(false);
  const [loadOrder, setloadOrder] = useState<boolean>(false);
  const [loadAuth, setloadAuth] = useState<boolean>(false);
  const [loadStaff, setloadStaff] = useState<boolean>(false);
  
  // auth state
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalScreen, setModalScreen] = useState<ModalScreen>("login");

  const navigate = useNavigate();

  
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
            setLoadCart(!loadCart);
            setloadOrder(!loadOrder);
          }
        },
      )
      .catch(console.error)
      .finally(() => setAuthReady(true));
  }, [loadAuth]);

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
        .then((data: any) => {
          setOrders(data as OrderInterface[]);
        })
        .catch(console.error);
  }, [loadOrder]);

  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/product` })
      .then((data: { products: Product[]; categories: String[] }) => {
        setProducts(data.products as Product[]);
        setCategories(data.categories as String[]);
      })
      .catch(console.error);
  }, [loadProduct]);

  useEffect(() => {
    if(userRole === 'admin')
      console.log('here at staff ln AppContext:140');
      ApiRequest({ url: `${baseUrl}/user` })
      .then((data: Staff) => {
        setStaff(data as Staff[]);
      })
      .catch(console.error);
  }, [loadStaff]);

  const createOrder = async (order: OrderInterface) => {
    const update = await ApiRequest({
      url: `${baseUrl}/orders`,
      method: "POST",
      body: order,
    });

    return update as OrderInterface;
  };

  const addToCart = async (item: CartItem) => {
    const payload = {
      product_id: item.id,
      quantity: item.quantity,
    };

    const cart = await ApiRequest({
      url: `${baseUrl}/cart`,
      method: "POST",
      body: payload,
    });

    console.log(cart);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = async (id: string) => {
    const cart = await ApiRequest({
      url: `${baseUrl}/cart/${id}`,
      method: "DELETE",
    });

    //console.log(cart);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = async (order: OrderInterface) => {
    const newOrder = await createOrder(order);
    //console.log(newOrder);
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

  const login = (userData: User) => {
    setUser(userData);
    setLoadCart((prev: boolean) => !prev);
    setloadOrder((prev: boolean) => !prev);
    setloadStaff((prev: boolean) => !prev);
    closeModal();
  };

  const logout = async () => {
    await ApiRequest({
      url: `${baseUrl}/auth/logout`,
      method: "get",
    });

    setUser(null);
    setCart([]);
    setOrders([]);
    setStaff([]);
    setUserRole('customer');
    console.log('out');
  };

  const updateOrderStatus = (
    orderId: string,
    status: "new" | "in-progress" | "completed",
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
        userRole,
        setUserRole,
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
