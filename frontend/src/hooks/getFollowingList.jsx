import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'


function getFollowingList() {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {storyData} = useSelector(state=>state.story)
    useEffect(() => {
        if (userData) {
            const fetchUser = async () => {
                try {
                    const result = await axios.get(`${serverUrl}/api/users/followingList`, { withCredentials: true });
                    dispatch(setFollowing(result.data))

                }
                catch (error) {
                    console.log(error)
                }
            }
           fetchUser()
        }
    }, [userData,storyData])


}

export default getFollowingList