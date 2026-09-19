import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import ClientPortal from './pages/ClientPortal';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Scripts from './pages/Scripts';
import Creators from './pages/Creators';
import Shoots from './pages/Shoots';
import Videos from './pages/Videos';
import Tasks from './pages/Tasks';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import CreatorPayouts from './pages/CreatorPayouts';
import SupportTickets from './pages/SupportTickets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function RootRoute() {
  const { role } = useApp();
  return role === 'client' ? <ClientPortal /> : <Dashboard />;
}

function AgencyOnlyRoute({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  if (role === 'client') {
    return <Navigate to="/portal" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/clients" element={<AgencyOnlyRoute><Clients /></AgencyOnlyRoute>} />
            <Route path="/clients/:id" element={<AgencyOnlyRoute><ClientDetails /></AgencyOnlyRoute>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/creators" element={<AgencyOnlyRoute><Creators /></AgencyOnlyRoute>} />
            <Route path="/shoots" element={<AgencyOnlyRoute><Shoots /></AgencyOnlyRoute>} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/tasks" element={<AgencyOnlyRoute><Tasks /></AgencyOnlyRoute>} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<AgencyOnlyRoute><Expenses /></AgencyOnlyRoute>} />
            <Route path="/creator-payouts" element={<AgencyOnlyRoute><CreatorPayouts /></AgencyOnlyRoute>} />
            <Route path="/support-tickets" element={<SupportTickets />} />
            <Route path="/reports" element={<AgencyOnlyRoute><Reports /></AgencyOnlyRoute>} />
            <Route path="/settings" element={<AgencyOnlyRoute><Settings /></AgencyOnlyRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
