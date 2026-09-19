import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getData,
  setData,
  clearAllData
} from '../utils/storage';
import {
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_CREATORS,
  INITIAL_SCRIPTS,
  INITIAL_SHOOTS,
  INITIAL_VIDEOS,
  INITIAL_TASKS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_CREATOR_PAYOUTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMPLOYEES
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Demo Role: 'owner' | 'admin' | 'employee' | 'client'
  const [role, setRoleState] = useState(() => getData('current_role', 'owner'));
  
  // Active client for Client Portal prototype
  const [activeClientId, setActiveClientId] = useState(() => getData('active_client_id', 'cli-1'));

  // Collapsible sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => getData('sidebar_collapsed', false));

  // Entities stored in localStorage
  const [clients, setClientsState] = useState(() => getData('clients', INITIAL_CLIENTS));
  const [orders, setOrdersState] = useState(() => getData('orders', INITIAL_ORDERS));
  const [creators, setCreatorsState] = useState(() => getData('creators', INITIAL_CREATORS));
  const [scripts, setScriptsState] = useState(() => getData('scripts', INITIAL_SCRIPTS));
  const [shoots, setShootsState] = useState(() => getData('shoots', INITIAL_SHOOTS));
  const [videos, setVideosState] = useState(() => getData('videos', INITIAL_VIDEOS));
  const [tasks, setTasksState] = useState(() => getData('tasks', INITIAL_TASKS));
  const [payments, setPaymentsState] = useState(() => getData('payments', INITIAL_PAYMENTS));
  const [expenses, setExpensesState] = useState(() => getData('expenses', INITIAL_EXPENSES));
  const [creatorPayouts, setCreatorPayoutsState] = useState(() => getData('creator_payouts', INITIAL_CREATOR_PAYOUTS));
  const [supportTickets, setSupportTicketsState] = useState(() => getData('support_tickets', INITIAL_SUPPORT_TICKETS));
  const [notifications, setNotificationsState] = useState(() => getData('notifications', INITIAL_NOTIFICATIONS));
  const [employees] = useState(INITIAL_EMPLOYEES);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDanger: false,
    onConfirm: null
  });

  const showToast = (title, message = '', type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showConfirm = ({ title, message, onConfirm, confirmText = 'Confirm', isDanger = false }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeConfirm();
      }
    });
  };

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  // Role Switcher
  const setRole = (newRole) => {
    setRoleState(newRole);
    setData('current_role', newRole);
    showToast(`Switched view to ${newRole.toUpperCase()} mode`, 'Role context updated', 'info');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      setData('sidebar_collapsed', next);
      return next;
    });
  };

  // Updaters that persist to localStorage
  const setClients = (updater) => {
    setClientsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('clients', next);
      return next;
    });
  };

  const setOrders = (updater) => {
    setOrdersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('orders', next);
      return next;
    });
  };

  const setCreators = (updater) => {
    setCreatorsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('creators', next);
      return next;
    });
  };

  const setScripts = (updater) => {
    setScriptsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('scripts', next);
      return next;
    });
  };

  const setShoots = (updater) => {
    setShootsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('shoots', next);
      return next;
    });
  };

  const setVideos = (updater) => {
    setVideosState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('videos', next);
      return next;
    });
  };

  const setTasks = (updater) => {
    setTasksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('tasks', next);
      return next;
    });
  };

  const setPayments = (updater) => {
    setPaymentsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('payments', next);
      return next;
    });
  };

  const setExpenses = (updater) => {
    setExpensesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('expenses', next);
      return next;
    });
  };

  const setCreatorPayouts = (updater) => {
    setCreatorPayoutsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('creator_payouts', next);
      return next;
    });
  };

  const setSupportTickets = (updater) => {
    setSupportTicketsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('support_tickets', next);
      return next;
    });
  };

  const setNotifications = (updater) => {
    setNotificationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setData('notifications', next);
      return next;
    });
  };

  // Operations: Client
  const addClient = (clientData) => {
    const newClient = {
      id: `cli-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      activeOrdersCount: 0,
      notes: '',
      ...clientData
    };
    setClients(prev => [newClient, ...prev]);
    showToast('Client Created', `${newClient.companyName || newClient.clientName} added successfully.`);
    return newClient;
  };

  const updateClient = (id, clientData) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c));
    showToast('Client Updated', 'Client profile updated successfully.');
  };

  const deleteClient = (id) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Client Deleted', `${client ? (client.companyName || client.clientName) : 'Client'} removed.`, 'warning');
  };

  // Operations: Order
  const addOrder = (orderData) => {
    const newOrder = {
      id: `ord-${Date.now().toString().slice(-3)}`,
      startDate: new Date().toISOString().split('T')[0],
      assignedVideos: 0,
      completedVideos: 0,
      deliveredVideos: 0,
      remainingQuota: Number(orderData.contractedVideoCount || 10),
      orderStatus: 'New',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    // increment client active orders count
    if (newOrder.clientId) {
      setClients(prev => prev.map(c => c.id === newOrder.clientId ? { ...c, activeOrdersCount: (c.activeOrdersCount || 0) + 1 } : c));
    }
    showToast('Order Created', `Order "${newOrder.packageName}" successfully created.`);
    return newOrder;
  };

  const updateOrder = (id, orderData) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...orderData } : o));
    showToast('Order Updated', 'Order information saved.');
  };

  // Operations: Script
  const addScript = (scriptData) => {
    const newScript = {
      id: `scr-${Date.now().toString().slice(-3)}`,
      revisionCount: 0,
      status: 'Draft',
      comments: [],
      ...scriptData
    };
    setScripts(prev => [newScript, ...prev]);
    showToast('Script Created', `Script "${newScript.videoNumber} - ${newScript.title}" added.`);
    return newScript;
  };

  const updateScriptStatus = (scriptId, newStatus, commentText = '') => {
    setScripts(prev => prev.map(s => {
      if (s.id === scriptId) {
        const comments = [...(s.comments || [])];
        if (commentText) {
          comments.push({
            author: role === 'client' ? 'Client Reviewer' : 'Internal Team',
            time: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            text: commentText
          });
        }
        let revisionCount = s.revisionCount || 0;
        if (newStatus === 'Revision Required') {
          revisionCount += 1;
        }
        return {
          ...s,
          status: newStatus,
          revisionCount,
          comments
        };
      }
      return s;
    }));
    showToast('Script Status Updated', `Status changed to: ${newStatus}`);
  };

  // Operations: Creator
  const updateCreatorAvailability = (creatorId, availability) => {
    setCreators(prev => prev.map(c => c.id === creatorId ? { ...c, availability } : c));
    showToast('Creator Availability Updated', `Creator is now marked as ${availability}`);
  };

  // Operations: Shoots
  const addShoot = (shootData) => {
    const newShoot = {
      id: `sht-${Date.now().toString().slice(-3)}`,
      shootStatus: 'Scheduled',
      checklist: {
        scriptApproved: true,
        creatorConfirmed: true,
        locationPermission: false,
        clientProductReceived: true,
        teamBriefing: false
      },
      postShootVerification: {
        footageUploaded: false,
        rawIntegrityChecked: false,
        reshootRequired: false
      },
      ...shootData
    };
    setShoots(prev => [newShoot, ...prev]);
    showToast('Shoot Scheduled', `Shoot "${newShoot.title}" added to calendar.`);
    return newShoot;
  };

  const updateShoot = (id, shootData) => {
    setShoots(prev => prev.map(s => s.id === id ? { ...s, ...shootData } : s));
    showToast('Shoot Updated', 'Shoot details successfully updated.');
  };

  const toggleShootChecklist = (shootId, itemKey) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) {
        const current = s.checklist || {};
        return {
          ...s,
          checklist: {
            ...current,
            [itemKey]: !current[itemKey]
          }
        };
      }
      return s;
    }));
    showToast('Checklist Updated', 'Pre-shoot checklist item toggled.');
  };

  // Operations: Videos & Production Pipeline
  const addVideo = (videoData) => {
    const newVideo = {
      id: `vid-${Date.now().toString().slice(-3)}`,
      stage: 'Script Approved',
      revisionCount: 0,
      timeline: [{ stage: 'Script Approved', timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }],
      clientFeedbackLog: [],
      ...videoData
    };
    setVideos(prev => [newVideo, ...prev]);
    showToast('Video Added to Pipeline', `${newVideo.videoNumber} added to production.`);
    return newVideo;
  };

  const updateVideoStage = (videoId, newStage, comment = '') => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const timeline = [...(v.timeline || [])];
        timeline.push({
          stage: newStage,
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        });
        
        let finalDeliveryLink = v.finalDeliveryLink;
        if (newStage === 'Delivered' && !finalDeliveryLink) {
          finalDeliveryLink = `https://drive.google.com/file/d/leadyfy_delivered_${v.videoNumber.toLowerCase()}_master.mp4`;
        }

        // If stage becomes Final Approved or Delivered, sync Order stats
        if (newStage === 'Delivered' && v.orderId) {
          setOrders(orderList => orderList.map(ord => {
            if (ord.id === v.orderId) {
              const completed = Math.min(ord.contractedVideoCount, (ord.completedVideos || 0) + 1);
              const delivered = Math.min(ord.contractedVideoCount, (ord.deliveredVideos || 0) + 1);
              const remaining = Math.max(0, ord.contractedVideoCount - delivered);
              return {
                ...ord,
                completedVideos: completed,
                deliveredVideos: delivered,
                remainingQuota: remaining,
                orderStatus: remaining === 0 ? 'Completed' : 'Partially Delivered'
              };
            }
            return ord;
          }));
        }

        return {
          ...v,
          stage: newStage,
          timeline,
          finalDeliveryLink
        };
      }
      return v;
    }));
    showToast('Pipeline Stage Updated', `Video moved to: ${newStage}`);
  };

  // Client Portal Action: Client reviews video
  const clientReviewVideo = (videoId, action, feedbackText = '') => {
    const vid = videos.find(v => v.id === videoId);
    if (!vid) return;

    if (action === 'approve') {
      updateVideoStage(videoId, 'Final Approved');
      showToast('Video Approved!', 'Thank you! Video has been marked as Final Approved.');
    } else if (action === 'request_revision') {
      setVideos(prev => prev.map(v => {
        if (v.id === videoId) {
          const newRev = (v.revisionCount || 0) + 1;
          const feedbackLog = [
            ...(v.clientFeedbackLog || []),
            {
              author: 'Client Reviewer',
              time: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              comment: feedbackText || 'Revision requested by client.',
              revisionCycle: newRev
            }
          ];
          const timeline = [
            ...(v.timeline || []),
            { stage: 'Revision', timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) }
          ];
          return {
            ...v,
            stage: 'Revision',
            revisionCount: newRev,
            clientFeedbackLog: feedbackLog,
            timeline
          };
        }
        return v;
      }));
      showToast('Revision Requested', 'Feedback logged and re-assigned to editor queue.', 'warning');
    }
  };

  // Operations: Tasks
  const addTask = (taskData) => {
    const newTask = {
      id: `tsk-${Date.now().toString().slice(-3)}`,
      status: 'To Do',
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task Created', `"${newTask.task}" added.`);
    return newTask;
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Done' ? 'To Do' : 'Done';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task Removed', 'Task deleted from board.');
  };

  // Operations: Payments
  const recordPayment = (paymentData) => {
    const newPayment = {
      id: `pay-${Date.now().toString().slice(-3)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionReference: `TXN${Date.now().toString().slice(-6)}`,
      status: Number(paymentData.amountReceived) >= Number(paymentData.invoiceAmount) ? 'Paid' : 'Partially Paid',
      ...paymentData
    };
    setPayments(prev => [newPayment, ...prev]);
    // Also update order outstanding balance
    if (newPayment.orderId) {
      setOrders(ordersList => ordersList.map(ord => {
        if (ord.id === newPayment.orderId) {
          const rec = (ord.amountReceived || 0) + Number(newPayment.amountReceived || 0);
          const bal = Math.max(0, (ord.totalInvoiceAmount || 0) - rec);
          return { ...ord, amountReceived: rec, outstandingBalance: bal };
        }
        return ord;
      }));
    }
    showToast('Payment Recorded', `₹${Number(newPayment.amountReceived).toLocaleString('en-IN')} received.`);
    return newPayment;
  };

  // Operations: Expenses
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      ...expenseData
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast('Expense Recorded', `₹${Number(newExpense.amount).toLocaleString('en-IN')} logged.`);
    return newExpense;
  };

  // Operations: Payouts
  const updatePayoutStatus = (payoutId, newStatus) => {
    setCreatorPayouts(prev => prev.map(p => p.id === payoutId ? { ...p, status: newStatus } : p));
    showToast('Payout Updated', `Status changed to ${newStatus}`);
  };

  // Operations: Support Tickets
  const addSupportTicket = (ticketData) => {
    const newTicket = {
      id: `TK-${Date.now().toString().slice(-3)}`,
      createdDate: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Open',
      ...ticketData
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    showToast('Ticket Created', `Support ticket #${newTicket.id} logged.`);
    return newTicket;
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    showToast('Ticket Updated', `Ticket #${ticketId} marked as ${newStatus}`);
  };

  // Operations: Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All Read', 'Notifications marked as read.');
  };

  // Factory Reset
  const resetAllData = () => {
    clearAllData();
    setClientsState(INITIAL_CLIENTS);
    setOrdersState(INITIAL_ORDERS);
    setCreatorsState(INITIAL_CREATORS);
    setScriptsState(INITIAL_SCRIPTS);
    setShootsState(INITIAL_SHOOTS);
    setVideosState(INITIAL_VIDEOS);
    setTasksState(INITIAL_TASKS);
    setPaymentsState(INITIAL_PAYMENTS);
    setExpensesState(INITIAL_EXPENSES);
    setCreatorPayoutsState(INITIAL_CREATOR_PAYOUTS);
    setSupportTicketsState(INITIAL_SUPPORT_TICKETS);
    setNotificationsState(INITIAL_NOTIFICATIONS);
    setRoleState('owner');
    setActiveClientId('cli-1');
    showToast('System Reset', 'All demo data has been restored to factory state.', 'info');
  };

  // Computed financial stats
  const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amountReceived) || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const totalCreatorPayouts = creatorPayouts.filter(p => p.status === 'Paid').reduce((acc, p) => acc + (Number(p.totalPayout) || 0), 0);
  const estimatedNetProfit = totalRevenue - totalExpenses - totalCreatorPayouts;
  const totalReceivables = orders.reduce((acc, o) => acc + (Number(o.outstandingBalance) || 0), 0);

  return (
    <AppContext.Provider
      value={{
        // Role & Identity
        role,
        setRole,
        activeClientId,
        setActiveClientId,
        activeClient: clients.find(c => c.id === activeClientId) || clients[0],
        employees,
        isSidebarCollapsed,
        toggleSidebar,

        // Data Collections
        clients,
        orders,
        creators,
        scripts,
        shoots,
        videos,
        tasks,
        payments,
        expenses,
        creatorPayouts,
        supportTickets,
        notifications,

        // Financial summary
        totalRevenue,
        totalExpenses,
        totalCreatorPayouts,
        estimatedNetProfit,
        totalReceivables,

        // Toast & Modal
        toasts,
        showToast,
        removeToast,
        confirmModal,
        showConfirm,
        closeConfirm,

        // Operations
        addClient,
        updateClient,
        deleteClient,
        addOrder,
        updateOrder,
        addScript,
        updateScriptStatus,
        updateCreatorAvailability,
        addShoot,
        updateShoot,
        toggleShootChecklist,
        addVideo,
        updateVideoStage,
        clientReviewVideo,
        addTask,
        toggleTaskStatus,
        deleteTask,
        recordPayment,
        addExpense,
        updatePayoutStatus,
        addSupportTicket,
        updateTicketStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
