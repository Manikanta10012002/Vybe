import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import axios from 'axios'
import { logout, setProfileData } from '../redux/userSlice.js';
import Nav from '../components/Nav.jsx';
import dp from '../assets/dp.webp';
import FollowButton from '../components/FollowButton.jsx';
import Post from '../components/Post.jsx';
import { setSelectedUser } from '../redux/messageSlice.js';

function Profile() {
  const { userName } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { profileData, userData } = useSelector(state => state.user)
  const {postData} = useSelector(state=>state.post)
  const [postType, setPostType] = useState('posts')

  const handleProfile = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/users/profile/${userName}`, { withCredentials: true });
      dispatch(setProfileData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/signout`, {}, { withCredentials: true });
      dispatch(logout(null));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleProfile()
  }, [userName, dispatch])

  return (
    <div className='w-full min-h-screen bg-black text-white'>

      {/* 🔹 Header Section */}
      <div className='w-full h-[80px] flex items-center justify-between relative px-[30px]'>
        <div onClick={() => navigate('/')}>
          <MdOutlineKeyboardBackspace className='text-white w-[25px] h-[25px] cursor-pointer' />
        </div>

        <div className='absolute left-1/2 transform -translate-x-1/2 font-semibold text-[20px]'>
          {profileData?.userName}
        </div>

        <div
          className='font-semibold cursor-pointer text-[20px] text-blue-500'
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>

      {/* 🔹 Profile Info */}
      <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

  <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden bg-gray-200'>
    <img
      src={profileData?.profileImage || './assets/dp.webp'}
      alt="Profile"
      className='w-full h-full object-cover'
      onError={(e) => e.target.src = './assets/dp.webp'}
    />
  </div>
</div>


      <div className='text-center'>
        <div className='font-semibold text-[22px]'>{profileData?.name}</div>
        <div className='text-[17px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
        <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
      </div>

      {/* 🔹 Stats Section */}
      <div className='w-full h-[100px] flex items-center justify-between gap-[40px] md:gap-[60px] px-[30%] pt-[30px] text-white'>
        {/* Posts */}
        <div>
          <div className='text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
        </div>

        {/* Followers */}
        <div>
          <div className='flex items-center justify-center gap-[20px]'>
            <div className='flex relative'>
              {profileData?.followers?.slice(0,3).map((user,index)=>(
         <div key={user._id} className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*9}px]`:''}`}>
                <img src={user?.profileImage} alt="" className='w-full object-cover' />
              </div>
              ))}
              
              
            </div>
            <div className='text-[22px] md:text-[30px] font-semibold'>
              {profileData?.followers.length}
            </div>
          </div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
        </div>

        {/* Following */}
        <div>
          <div className='flex items-center justify-center gap-[20px]'>
            <div className='flex relative'>
                {profileData?.following?.slice(0,3).map((user,index)=>(
         <div key={user._id} className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*9}px]`:''}`}>
                <img src={user?.profileImage} alt="" className='w-full object-cover' />
              </div>
              ))}
              
            </div>
            <div className='text-[22px] md:text-[30px] font-semibold'>
              {profileData?.following.length}
            </div>
          </div>
          <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
        </div>
      </div>

      {/* 🔹 Action Buttons */}
      <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
        {profileData?._id === userData?._id ? (
          <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white text-black cursor-pointer rounded-2xl' onClick={()=>navigate('/editprofile')} >
            Edit Profile
          </button>
        ) : (
          <>
            

            <FollowButton tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500 text-white cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange ={handleProfile}/>
            <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-blue-500 text-white cursor-pointer rounded-2xl' onClick={()=>{
              dispatch(setSelectedUser(profileData))
              navigate('/messageArea')}}>
              Message
            </button>
          </>
        )}
      </div>

      {/* 🔹 Bottom Section (Nav) */}
      <div className='w-full min-h-[100vh] flex justify-center'>
        <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>
          {profileData?._id == userData._id &&       <div className='w-[90%] max-w-[500px] h-[80px] bg-[white] rounded-full flex justify-center items-center gap-[10px]' onClick={()=>mediaInput.current.click()}>
  
    <div className={`${postType=='posts'?'bg-black  text-white shadow-2xl shadow-black': ''}
    w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setPostType('posts')}>Posts</div>

    <div className={`${postType=='saved'?'bg-black  text-white shadow-2xl shadow-black': ''}
    w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={()=>setPostType('saved')}>Saved</div>

    

 </div>}

     
          <Nav />

      {profileData?._id == userData._id && <> {postType == 'posts' &&
          postData.map((post,index)=>(
            post.author?._id == profileData?._id && <Post post={post} key={index} />

          )).filter(Boolean)


         }{ postType == 'saved' && userData.saved.map((post,index)=>(
           userData.saved.includes(post._id) && <Post post={post} key={index}/>
          )).filter(Boolean)}</>}

          {profileData?._id != userData._id && postData.map((post,index)=>(
            post.author?._id == profileData?._id && <Post post={post} key={index} />
          )).filter(Boolean)}
         

          


        </div>
      </div>
    </div>
  )
}

export default Profile
