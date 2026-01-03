// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import store from "./store/store";
// import { Provider } from "react-redux";
// import { Toaster } from "./components/ui/sonner";
// import CartProvider from './components/shoping-view/CartProvider';

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Provider store={store}>
//       <CartProvider>
//         <App />
//         <Toaster richColors position="top-center" />
//       </CartProvider>
//     </Provider>
//   </BrowserRouter>
// );


// main.jsx - UPDATED WITH ERROR BOUNDARY
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner";
import CartProvider from './components/shoping-view/CartProvider';
import ErrorBoundary from './components/ErrorBoundary'; // ADD THIS IMPORT

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <CartProvider>
        <ErrorBoundary> {/* WRAP APP WITH ERROR BOUNDARY */}
          <App />
        </ErrorBoundary>
        <Toaster richColors position="top-center" />
      </CartProvider>
    </Provider>
  </BrowserRouter>
);