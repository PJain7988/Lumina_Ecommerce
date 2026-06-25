import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiCamera, FiSave } from 'react-icons/fi'
import { updateUser } from '../../redux/slices/authSlice'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

const pwSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name, phone: user?.phone, bio: user?.bio },
  })

  const { register: regPw, handleSubmit: handlePwSubmit, reset: resetPw, formState: { errors: pwErrors } } = useForm({
    resolver: zodResolver(pwSchema),
  })

  const onUpdateProfile = async (data) => {
    setSaving(true)
    try {
      const res = await authService.updateProfile(data)
      dispatch(updateUser(res.user))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const onChangePassword = async (data) => {
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password changed successfully')
      resetPw()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await authService.uploadAvatar(formData)
      dispatch(updateUser({ avatar: res.avatar }))
      toast.success('Avatar updated')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="font-semibold text-brand mb-6">Profile Information</h2>
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
              {uploading ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <FiCamera className="text-white text-xs" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-semibold text-brand">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onUpdateProfile)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input {...register('name')} className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} className="input-field" placeholder="+91 9876543210" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Bio</label>
            <textarea {...register('bio')} className="input-field resize-none" rows={3} placeholder="Tell us about yourself..." />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="font-semibold text-brand mb-6">Change Password</h2>
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-4 max-w-md">
          <div>
            <label className="label">Current Password</label>
            <input {...regPw('currentPassword')} type="password" className={`input-field ${pwErrors.currentPassword ? 'border-red-400' : ''}`} />
            {pwErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="label">New Password</label>
            <input {...regPw('newPassword')} type="password" className={`input-field ${pwErrors.newPassword ? 'border-red-400' : ''}`} />
            {pwErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input {...regPw('confirmPassword')} type="password" className={`input-field ${pwErrors.confirmPassword ? 'border-red-400' : ''}`} />
            {pwErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="btn-primary">Change Password</button>
        </form>
      </div>
    </div>
  )
}
