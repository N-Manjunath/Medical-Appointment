import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    if (!userData) return null

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8 mt-6 mb-8">
            <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                    <img
                        className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary shadow transition-opacity duration-200 ${isEdit ? 'opacity-80' : ''}`}
                        src={image ? URL.createObjectURL(image) : userData.image}
                        alt="Profile"
                    />
                    {isEdit && (
                        <>
                            <label htmlFor="image" className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100 transition">
                                <img className="w-6 h-6" src={assets.upload_icon} alt="Upload" />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        </>
                    )}
                </div>
                {isEdit ? (
                    <input
                        className="bg-gray-50 text-2xl sm:text-3xl font-semibold text-center rounded px-2 py-1 max-w-xs"
                        type="text"
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        value={userData.name}
                    />
                ) : (
                    <p className="font-semibold text-2xl sm:text-3xl text-[#262626] mt-2 text-center">{userData.name}</p>
                )}
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
                <p className="text-gray-600 font-semibold mb-2">Contact Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-y-3 gap-x-4 text-[#363636]">
                    <p className="font-medium">Email:</p>
                    <p className="text-blue-500 break-all">{userData.email}</p>

                    <p className="font-medium">Phone:</p>
                    {isEdit ? (
                        <input
                            className="bg-gray-50 rounded px-2 py-1 w-full max-w-xs"
                            type="text"
                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            value={userData.phone}
                        />
                    ) : (
                        <p className="text-blue-500">{userData.phone}</p>
                    )}

                    <p className="font-medium">Address:</p>
                    {isEdit ? (
                        <div className="flex flex-col gap-1">
                            <input
                                className="bg-gray-50 rounded px-2 py-1 w-full"
                                type="text"
                                placeholder="Address line 1"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line1: e.target.value }
                                }))}
                                value={userData.address?.line1 || ''}
                            />
                            <input
                                className="bg-gray-50 rounded px-2 py-1 w-full"
                                type="text"
                                placeholder="Address line 2"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line2: e.target.value }
                                }))}
                                value={userData.address?.line2 || ''}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500 whitespace-pre-line">{userData.address?.line1} <br /> {userData.address?.line2}</p>
                    )}
                </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
                <p className="text-gray-600 font-semibold mb-2">Basic Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-y-3 gap-x-4 text-gray-600">
                    <p className="font-medium">Gender:</p>
                    {isEdit ? (
                        <select
                            className="max-w-xs bg-gray-50 rounded px-2 py-1"
                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                            value={userData.gender}
                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className="text-gray-500">{userData.gender}</p>
                    )}

                    <p className="font-medium">Birthday:</p>
                    {isEdit ? (
                        <input
                            className="max-w-xs bg-gray-50 rounded px-2 py-1"
                            type="date"
                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                            value={userData.dob}
                        />
                    ) : (
                        <p className="text-gray-500">{userData.dob}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-center mt-8">
                {isEdit ? (
                    <button
                        onClick={updateUserProfileData}
                        className="border border-primary px-8 py-2 rounded-full bg-primary text-white hover:bg-white hover:text-primary transition-all"
                    >
                        Save Information
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    )
}

export default MyProfile
