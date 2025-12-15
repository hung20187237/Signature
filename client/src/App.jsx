import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import NewArrivals from './pages/NewArrivals';
import DealsPage from './pages/DealsPage';
import AllBrands from './pages/AllBrands';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import CollectionPage from './pages/Shop/CollectionPage';

// Admin Imports
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import ProductForm from './pages/Admin/ProductForm';
import CollectionList from './pages/Admin/CollectionList';
import CollectionDetail from './pages/Admin/CollectionDetail';
import OrderList from './pages/Admin/OrderList';
import OrderDetail from './pages/Admin/OrderDetail';
import CreateOrder from './pages/Admin/CreateOrder';
import CustomerList from './pages/Admin/CustomerList';
import CustomerDetail from './pages/Admin/CustomerDetail';
import AdminProfile from './pages/Admin/Profile';

import AnnouncementBar from './components/Layout/AnnouncementBar';
import CartDrawer from './components/Cart/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

// Separate layout for customer pages to include Navbar/Footer
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/collections/new-arrivals" element={<NewArrivals />} />
          <Route path="/collections/deals-all" element={<DealsPage />} />
          <Route path="/collections/on-sale" element={<DealsPage />} />
          <Route path="/collections/clearance" element={<DealsPage />} />
          <Route path="/collections/production-used" element={<DealsPage />} />
          <Route path="/pages/brands" element={<AllBrands />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/pages/about" element={<AboutUs />} />
          <Route path="/pages/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="collections" element={<CollectionList />} />
            <Route path="collections/:id" element={<CollectionDetail />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/new" element={<CreateOrder />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="profile" element={<AdminProfile />} />
            {/* Future admin routes will go here */}
          </Route>

          {/* Customer Routes */}
          <Route path="/*" element={<CustomerLayout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
