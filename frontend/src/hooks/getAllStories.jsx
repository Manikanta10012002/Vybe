import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import axios from 'axios'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setStoryList } from '../redux/storySlice'


function getAllStories() {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    const {storyData} = useSelector(state=>state.story)
    useEffect(() => {
        if (userData) {
            const fetchStories = async () => {
                try {
                    const result = await axios.get(`${serverUrl}/api/story/getAll`, { withCredentials: true });
                    dispatch(setStoryList(result.data))

                }
                catch (error) {
                    console.log(error)
                }
            }
           fetchStories()
        }
    }, [userData,storyData])


}

export default getAllStories