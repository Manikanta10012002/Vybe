import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import { setNotificationData, setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'


function getAllNotifications() {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    
            const fetchNotifications = async () => {
                try {
                    const result = await axios.get(`${serverUrl}/api/users/getAllNotifications`, { withCredentials: true });
                    dispatch(setNotificationData(result.data))
                }
                catch (error) {
                    console.log(error)
                }
            }
      fetchNotifications()


}

export default getAllNotifications