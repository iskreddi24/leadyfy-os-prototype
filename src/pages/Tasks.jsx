import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  User,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Tasks() {
  const {
    tasks,
    employees,
    addTask,
    toggleTaskStatus,
    deleteTask,
    requestConfirm
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [taskForm, setTaskForm] = useState({
    task: '',
    assignee: employees[0]?.name || 'Rahul Verma',
    module: 'Scripting',
    priority: 'High',
    deadline: '2026-03-28'
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch =
        t.task?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.module?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.task.trim()) return;
    addTask(taskForm);
    setIsAddModalOpen(false);
    setTaskForm({
      task: '',
      assignee: employees[0]?.name || 'Rahul Verma',
      module: 'Scripting',
      priority: 'High',
      deadline: '2026-03-28'
    });
  };

  const handleDeleteTask = (task) => {
    requestConfirm({
      title: 'Delete Task?',
      message: `Remove "${task.task}" from the action queue?`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => deleteTask(task.id)
    });
  };

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const urgentCount = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Operations Sprint
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Internal Action Items</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Team Tasks & Deadlines
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Track urgent renders, script reviews, payment reminders, and creator confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Task Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Total Tasks</span>
          <p className="text-xl font-extrabold text-stone-900 mt-0.5">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Completed</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{doneCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Urgent Pending</span>
          <p className="text-xl font-extrabold text-rose-600 mt-0.5">{urgentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Remaining</span>
          <p className="text-xl font-extrabold text-amber-600 mt-0.5">{tasks.length - doneCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task, assignee, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {['All', 'Urgent', 'High', 'Medium', 'Low'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  priorityFilter === p ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No tasks found for the selected criteria.
            </div>
          ) : (
            filteredTasks.map(t => {
              const isDone = t.status === 'Done';
              return (
                <div
                  key={t.id}
                  className={`p-4 transition-colors flex items-center justify-between gap-4 ${
                    isDone ? 'bg-stone-50/60' : 'hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleTaskStatus(t.id)}
                      className="mt-1 w-4 h-4 rounded-sm border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {t.task}
                        </p>
                        <Badge status={t.priority} size="xs" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {t.module}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          {t.assignee}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Due: {t.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t)}
                    className="p-2 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Sprint Task"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Task Action *</label>
              <input
                type="text"
                required
                placeholder="e.g. Export 9:16 high bitrate render for ChaiPoint reel"
                value={taskForm.task}
                onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assignee</label>
                <select
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Department / Module</label>
                <select
                  value={taskForm.module}
                  onChange={(e) => setTaskForm({ ...taskForm, module: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Scripting</option>
                  <option>Shoots</option>
                  <option>Editing</option>
                  <option>Client Review</option>
                  <option>Accounts & Invoicing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
