import { useEffect, useState } from "react"
import { Link } from "react-router"
import type { ActivityLog } from "../../types/logs.types"
import { adminGetAllLogs } from "../../services/admin.service"
import { BeatLoader } from "react-spinners"
export const LogsPage = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    
    useEffect(()=>{
        const fetchLogs = async () =>{
            try{
                setLoading(true)
                const data = await adminGetAllLogs()
                setLogs(data.logs)
            }catch(error){
                console.error('error fetching logs: ', error)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])




    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        )
    }

  return(
    <section className="p-6 text-gray-300 font-mono text-sm">
    <ul className="w-full  divide-gray-800">
      {logs.map((l) => (
        <li key={l.id} className="hover:bg-gray-900/30 transition-colors underline">
          <Link 
            to={`/admin/logs/${l.id}`} 
            className="flex flex-wrap items-center gap-x-2 py-2 px-1 text-gray-400 hover:text-indigo-400 "
          >
            <span className="text-gray-600">[{new Date(l.createdAt).toLocaleTimeString('ro-RO')}]</span>
            <span className="text-indigo-500 font-semibold">#LOG-id-{l.id}</span>
            <span className="text-gray-700">|</span>
            <span className="text-amber-400 uppercase font-bold">{l.action}</span>
            <span className="text-gray-700">|</span>
            <span className="text-emerald-400 font-medium">{l.entityType} ({l.entityId})</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-600">{l.note || 'no note'}</span>
          </Link>
        </li>
      ))}
    </ul>

    {logs.length === 0 && (
      <p className="text-gray-600 italic py-4 font-sans">No logs available.</p>
    )}
  </section>
  )





}