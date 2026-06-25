import { useSelector, useDispatch } from 'react-redux'
import { FiBell, FiCheck } from 'react-icons/fi'
import { markNotificationRead, clearNotifications } from '../../redux/slices/uiSlice'

export default function Notifications() {
  const { notifications } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-brand text-lg">Notifications</h2>
        {notifications.length > 0 && (
          <button onClick={() => dispatch(clearNotifications())} className="btn-ghost text-sm text-red-400">Clear All</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-10 text-center">
          <FiBell className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">Order updates and alerts will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`card p-4 flex items-start gap-3 ${!n.read ? 'border-primary/20 bg-primary/5' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${n.read ? 'bg-gray-100' : 'bg-primary/10'}`}>
                <FiBell className={n.read ? 'text-gray-400' : 'text-primary'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.id).toLocaleString()}</p>
              </div>
              {!n.read && (
                <button onClick={() => dispatch(markNotificationRead(n.id))} className="text-primary hover:text-primary-700">
                  <FiCheck />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
