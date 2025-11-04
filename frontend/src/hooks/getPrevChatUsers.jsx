import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'
import { setPrevChatUsers } from '../redux/messageSlice'


function getPrevChatUsers() {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {messages} = useSelector(state=>state.message)
    useEffect(() => {
        if (userData) {
            const fetchUser = async () => {
                try {
                    const result = await axios.get(`${serverUrl}/api/message/prevChats`, { withCredentials: true });
                    dispatch(setPrevChatUsers(result.data))
                }
                catch (error) {
                    console.log(error)
                }
            }
           fetchUser()
        }
    }, [userData,messages])


}

export default getPrevChatUsers