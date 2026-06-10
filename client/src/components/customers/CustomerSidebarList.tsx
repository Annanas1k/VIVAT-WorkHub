import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { MdSearch } from "react-icons/md";
import type { Customer } from "../../types/customer.type";

interface Props {
    customers: Customer[];
    selectedId: number | null;
    onSelectCustomer: (id: number) => void;
}

export const CustomerSidebarList = ({ customers, selectedId, onSelectCustomer }: Props) => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Extragere Filtre din URL
    const search = searchParams.get('search') || '';
    const typeFilter = searchParams.get('type') || 'all';

    // Helper pentru a updata URL-ul păstrând ceilalți parametri (precum ID-ul selectat)
    const updateUrlParams = (newParams: Record<string, string | null>) => {
        const current = Object.fromEntries(searchParams.entries());
        const updated = { ...current, ...newParams };
        
        Object.keys(updated).forEach(key => {
            if (!updated[key]) delete updated[key];
        });
        
        setSearchParams(updated);
    };

    // 2. Logica de Filtrare locală bazată pe parametrii din URL
    const filteredCustomers = customers.filter(c => {
        const matchType = typeFilter === 'all' || c.type === typeFilter;
        const q = search.toLowerCase();
        const matchSearch = !search ||
            c.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.company?.toLowerCase().includes(q);
        return matchType && matchSearch;
    });

    return (
        <div className="space-y-4 p-1">
            {/* Header Sidebar */}
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t('customers.sidebar.customers')} ({filteredCustomers.length} / {customers.length})
                </h2>
            </div>

            {/* Zona de Căutare și Filtrare */}
            <div className="space-y-2">
                {/* Input Căutare */}
                <div className="relative w-full">
                    <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('team.search_placeholder', 'Search...')}
                        value={search}
                        onChange={e => updateUrlParams({ search: e.target.value || null })}
                        className="pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-full text-gray-700 bg-white"
                    />
                </div>

                {/* Filtre Tip (All, Individual, Company) */}
                <div className="flex gap-1.5 bg-gray-50 p-1 rounded-lg">
                    {(['all', 'individual', 'company'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => updateUrlParams({ type: f === 'all' ? null : f })}
                            className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors capitalize ${
                                typeFilter === f
                                    ? 'bg-white text-indigo-900 shadow-sm font-semibold'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                            }`}
                        >
                            {f === 'all' ? t('team.filter_all', 'All') : t(`customer.${f}`, f)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de Carduri Filtrată */}
            <ul className="space-y-2 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {filteredCustomers.map((c) => {
                    const isSelected = c.id === selectedId;

                    return (
                        <li key={c.id}>
                            <button
                                onClick={() => onSelectCustomer(c.id)}
                                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                                    isSelected
                                        ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900 shadow-sm'
                                        : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm'
                                }`}
                            >   
                                {/* Rândul 1: Numele clientului și tipul */}
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-sm font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                        {c.name}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                                        isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {t(`customers.details.type_${c.type}`, c.type)}
                                    </span>
                                </div>

                                {/* Rândul 2: ID și Proiecte asociate */}
                                <div className="flex items-center justify-between text-xs text-gray-400 w-full">
                                    <span className="font-mono text-[11px]">#customer-{c.id}</span>
                                    <span className={`font-medium ${c.projects?.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        [{c.projects?.length || 0} {t('customers.sidebar.projects')}]
                                    </span>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Fallback când nu există rezultate */}
            {filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs font-mono">
                    {t('team.no_users', 'No customers found')}
                </div>
            )}
        </div>
    );
};