import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData } from '../redux/userSlice'
import dp from '../assets/dp.webp'

function Search() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const dispatch = useDispatch()
  const { searchData } = useSelector(state => state.user)

  // 🔍 Search users from backend
  const performSearch = async () => {
    if (!input.trim()) {
      dispatch(setSearchData([]))
      return
    }
    try {
      const result = await axios.get(`${serverUrl}/api/users/search?keyWord=${input}`, { withCredentials: true })
      // Backend returns an array of users
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  // ⏳ Debounce search (wait for user to stop typing)
  useEffect(() => {
    const delay = setTimeout(() => {
      performSearch()
    }, 400)
    return () => clearTimeout(delay)
  }, [input])

  return (
    <div className='w-full min-h-[100vh] bg-black flex flex-col items-center gap-[20px]'>
      {/* Back Button */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
        <MdOutlineKeyboardBackspace
          className='text-white cursor-pointer w-[25px] h-[25px]'
          onClick={() => navigate('/')}
        />
      </div>

      {/* Search Input */}
      <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
        <form
          className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'
          onSubmit={(e) => { e.preventDefault(); performSearch() }}
        >
          <FiSearch className='w-[18px] h-[18px] text-white' />
          <input
            type='text'
            placeholder='Search users...'
            className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]'
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

      {/* Search Results */}
   {input && searchData.length > 0 ? (
        searchData?.map((user) => (
          <div
            key={user._id}
            className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] hover:bg-gray-200 cursor-pointer' onClick={() => navigate(`/profile/${user.userName}`)}
          >
            <div
              className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
              
            >
              <img src={user.profileImage || dp} alt='' className='w-full h-full object-cover' />
            </div>
            <div className='flex flex-col'>
              <p className='text-black font-semibold text-[16px]'>{user.userName}</p>
              {user.name && <p className='text-gray-600 text-[14px]'>{user.name}</p>}
            </div>
          </div>
        ))
      ) : (
        input && <p className='text-gray-400 mt-[20px]'>No users found</p>
      )}
      {!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here....</div>}
    </div>
  )
}

export default Search
