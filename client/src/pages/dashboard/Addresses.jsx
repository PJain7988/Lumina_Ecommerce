import { useState } from 'react'
import { FiPlus, FiMapPin, FiTrash2, FiEdit } from 'react-icons/fi'

export default function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-brand text-lg">Saved Addresses</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <FiPlus /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-10 text-center">
          <FiMapPin className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No saved addresses yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6">Add Your First Address</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr, i) => (
            <div key={i} className="card p-4">
              <p className="font-medium text-brand">{addr.fullName}</p>
              <p className="text-sm text-gray-500 mt-1">{addr.address}, {addr.city}</p>
              <p className="text-sm text-gray-500">{addr.state} - {addr.pincode}</p>
              <div className="flex gap-2 mt-3">
                <button className="btn-ghost text-xs flex items-center gap-1"><FiEdit className="text-xs" /> Edit</button>
                <button className="btn-ghost text-xs text-red-400 flex items-center gap-1"><FiTrash2 className="text-xs" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
