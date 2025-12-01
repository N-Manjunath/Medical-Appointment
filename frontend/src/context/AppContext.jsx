import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export const AppContext = createContext()

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            console.log(data);
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })
console.log(data.success);
             if (data.success && data.userData) {
    const safeUserData = {
        ...data.userData,
        address: data.userData.address || { line1: '', line2: '' },
        gender: data.userData.gender || '',
        dob: data.userData.dob || ''
    }
    setUserData(safeUserData)
        } 
        else {
            console.log('here error',data.message);
            toast.error(data.message || "User data not found")
            navigate('/login');
        }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            navigate('/login');
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
