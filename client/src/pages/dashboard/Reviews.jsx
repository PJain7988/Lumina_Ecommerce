import { FiStar } from 'react-icons/fi'

export default function Reviews() {
  return (
    <div>
      <h2 className="font-semibold text-brand text-lg mb-5">My Reviews</h2>
      <div className="card p-10 text-center">
        <FiStar className="text-5xl text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">You haven't written any reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">Purchase products and share your experience</p>
      </div>
    </div>
  )
}
