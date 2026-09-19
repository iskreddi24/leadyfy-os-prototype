/**
 * Client Filtering & Prototype RBAC Utility
 * Ensures strict client isolation for the external Client Portal perspective
 * without breaking internal Owner/Admin/Employee agency capabilities.
 */

export const DEMO_CLIENT_ID = 'cli-1';
export const DEMO_CLIENT_NAME = 'NovaFit Nutrition Pvt Ltd';
export const DEMO_CONTACT_PERSON = 'Aditya Verma';

/**
 * Returns strictly isolated, client-scoped data collections.
 * Uses entity relationships (order.clientId, script.orderId/clientId, video.orderId/clientId)
 * to prevent any internal agency or multi-client data leakage.
 */
export function getClientScopedData({
  clientId = DEMO_CLIENT_ID,
  orders = [],
  scripts = [],
  videos = [],
  shoots = [],
  payments = [],
  supportTickets = [],
  notifications = []
}) {
  // 1. Orders directly contracted by the client
  const clientOrders = orders.filter(order => order.clientId === clientId);
  const clientOrderIds = clientOrders.map(order => order.id);

  // 2. Scripts connected to the client or the client's orders
  const clientScripts = scripts.filter(script => {
    if (script.clientId && script.clientId !== clientId) return false;
    if (script.orderId) return clientOrderIds.includes(script.orderId);
    return script.clientId === clientId;
  });
  const clientScriptIds = clientScripts.map(script => script.id);

  // 3. Videos connected to the client or the client's orders
  const clientVideos = videos.filter(video => {
    if (video.clientId && video.clientId !== clientId) return false;
    if (video.orderId) return clientOrderIds.includes(video.orderId);
    if (video.scriptId) return clientScriptIds.includes(video.scriptId);
    return video.clientId === clientId;
  });

  // 4. Shoots connected to the client or the client's orders
  const clientShoots = shoots.filter(shoot => {
    if (shoot.clientId && shoot.clientId !== clientId) return false;
    if (shoot.orderId) return clientOrderIds.includes(shoot.orderId);
    return shoot.clientId === clientId;
  });

  // 5. Invoices / Payments connected to the client or the client's orders
  const clientPayments = payments.filter(payment => {
    if (payment.clientId && payment.clientId !== clientId) return false;
    if (payment.orderId) return clientOrderIds.includes(payment.orderId);
    return payment.clientId === clientId;
  });

  // 6. Support Tickets strictly belonging to the client
  const clientTickets = supportTickets.filter(ticket => ticket.clientId === clientId);

  // 7. Notifications scoped to client
  const clientNotifications = notifications.filter(notif => {
    if (notif.clientId) return notif.clientId === clientId;
    if (notif.orderId) return clientOrderIds.includes(notif.orderId);
    return false;
  });

  return {
    orders: clientOrders,
    orderIds: clientOrderIds,
    scripts: clientScripts,
    scriptIds: clientScriptIds,
    videos: clientVideos,
    shoots: clientShoots,
    payments: clientPayments,
    supportTickets: clientTickets,
    tickets: clientTickets,
    notifications: clientNotifications
  };
}
