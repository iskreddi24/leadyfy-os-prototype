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

function RoleRouteWrapper({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  // If role is set to client and visiting root, we could either show ClientPortal or let user access with layout
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/shoots" element={<Shoots />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/creator-payouts" element={<CreatorPayouts />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
