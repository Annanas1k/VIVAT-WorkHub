import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router';
import { adminGetLogByIdLog } from "../../services/admin.service"
import type { DetailedActivityLog } from '../../types/logs.types';
import { BeatLoader } from 'react-spinners';
export const LogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [log, setLog]       = useState<DetailedActivityLog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
console.log(log)
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await adminGetLogByIdLog(Number(id));
        setLog(data.log);
      } catch (error) {
        console.error('Error fetching log details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <BeatLoader size={15} color="#4D179A" aria-label="Loading spinner" loading={loading} />
            </div>
        )
    }
    if (!log) return <div className="p-4 font-mono text-sm text-red-400">Log not found.</div>;

  return (
    <section className="p-4 text-gray-300 font-mono text-sm">
      {/* Navigare Înapoi */}
      <div className="mb-6">
        <Link to="/admin/logs" className="text-indigo-500 hover:underline">
          &lt;-- Back to logs list
        </Link>
      </div>

      {/* Date Metatag simple */}
      <div className="space-y-1 mb-6 border-b border-gray-800 pb-4">
        <p><span className="text-gray-600">TIMESTAMP : {new Date(log.createdAt).toLocaleString('ro-RO')}</span> </p>
        <p><span className="text-gray-600">LOG ID    :</span> <span className="text-indigo-500">#{log.id}</span></p>
        <p><span className="text-gray-600">ACTION    :</span> <span className="text-amber-400 uppercase font-bold">{log.action}</span></p>
        <p><span className="text-gray-600">TARGET    :</span> <span className="text-emerald-400">{log.entityType} (ID: {log.entityId})</span></p>
        <p><span className="text-gray-600">BY  :</span> <span className="text-gray-400">{log.performedBy ? `${log.performedBy.name} (${log.performedBy.role})` : 'SYSTEM'}</span></p>
        <p><span className="text-gray-600">NOTE      :</span> <span className="text-gray-500">{log.note || 'no note provided'}</span></p>
        <p><span className="text-gray-600">IP ADRESS :</span> <span className="text-gray-500">{log.ip || 'no ip provided'}</span></p>
        <p><span className="text-gray-600">USER AGENT:</span> <span className="text-gray-500">{log.userAgent || 'no user agetn provided provided'}</span></p>
      </div>

      {/* Afișare JSON JSON-Diff brut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* State BEFORE */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">DATA BEFORE (-) :</p>
          <div className="p-3 bg-gray-900/40 border border-gray-900 rounded overflow-x-auto max-h-96 text-s text-red-800">
            {log.before ? (
              <pre><code className="block whitespace-pre">{JSON.stringify(log.before, null, 2)}</code></pre>
            ) : (
              <span className="text-gray-600 italic">No prior data (e.g. creation / login event).</span>
            )}
          </div>
        </div>

        {/* State AFTER */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">DATA AFTER (+) :</p>
          <div className="p-3 bg-gray-900/40 border border-gray-900 rounded overflow-x-auto max-h-96 text-s text-green-300">
            {log.after ? (
              <pre><code className="block whitespace-pre">{JSON.stringify(log.after, null, 2)}</code></pre>
            ) : (
              <span className="text-gray-600 italic">No trailing data (e.g. deletion / logout event).</span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};