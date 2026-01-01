import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner";
import CartProvider from './components/shoping-view/CartProvider';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <CartProvider>
        <App />
        <Toaster richColors position="top-center" />
      </CartProvider>
    </Provider>
  </BrowserRouter>
);
