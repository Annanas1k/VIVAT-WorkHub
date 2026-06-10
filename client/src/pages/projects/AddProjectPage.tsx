import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createProject } from '../../services/project.service';
import { ProjectMembersPanel } from '../../components/projects/ProjectsMemberPanel';
import { getAllCustomers } from '../../services/customer.service';
import { BeatLoader } from 'react-spinners';
export const AddProjectPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active' as const,
    startDate: '',
    dueDate: '',
    budget: '',
    customerId: null as number | null,
  });

  useEffect(()=>{
    getAllCustomers().then(setCustomers).catch(console.error).finally(()=>setLoading(false))
  },[])

  const set = (field: string, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const project = await createProject({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
        startDate: form.startDate || undefined,
        dueDate: form.dueDate || undefined,
      });
      setCreatedProjectId(project.id);
    } finally {
      setSaving(false);
    }
  };

    if (loading) return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <BeatLoader size={15} color="#4D179A" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      <div className="mb-6">
        <h1 className="text-base font-bold text-gray-900">New project</h1>
        <p className="text-xs text-gray-400 mt-0.5">Fill in the details below to create a project.</p>
      </div>

      <div className="flex flex-col gap-4">

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Project name *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Website Redesign"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Short description of the project…"
            rows={3}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
          />
        </div>

        {/* Customer */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Customer</label>
          <select
            value={form.customerId || ''}
            onChange={(e) => set('customerId', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
        >
            <option value=''>
            Select a customer...
            </option>
            
            {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
                {customer.name}
            </option>
            ))}
        </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <select
            value={form.status}
            onChange={e => set('status', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          >
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Start date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Budget</label>
          <input
            type="number"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
            placeholder="0.00"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          />
        </div>

        {/* Submit */}
        {!createdProjectId && (
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || saving}
            className="mt-2 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            {saving ? 'Creating…' : 'Create project'}
          </button>
        )}

        {/* Members — apare doar dupa ce proiectul a fost creat */}
        {createdProjectId && (
          <>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-600 mb-3">Members</p>
              <ProjectMembersPanel projectId={createdProjectId} />
            </div>

            <button
              onClick={() => navigate(`/projects/${createdProjectId}/overview`)}
              className="mt-2 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to project →
            </button>
          </>
        )}

      </div>
    </div>
  );
};