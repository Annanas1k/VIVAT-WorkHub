import { useTranslation } from "react-i18next";
import type { Customer } from "../../types/customer.type";

interface Props {
    customers: Customer[];
    selectedId: number | null;
    onSelectCustomer: (id: number) => void;
}

export const CustomerSidebarList = ({ customers, selectedId, onSelectCustomer }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4 p-1">
            {/* Header Sidebar */}
            <div className="pb-3 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t('customers.sidebar.customers')} ({customers.length})
                </h2>
            </div>

            {/* Lista de Carduri */}
            <ul className="space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                {customers.map((c) => {
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
        </div>
    );
};