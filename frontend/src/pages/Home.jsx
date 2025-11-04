import React from 'react'
import LeftHome from '../components/LeftHome.jsx'
import Feed from '../components/Feed.jsx'
import RightHome from '../components/RightHome.jsx'

function Home() {
  return (
    <div className='w-full flex min-h-screen bg-black'>
        <LeftHome className='w-[25%] hidden lg:block'/>
        <Feed  className='w-full lg:w-[50%]'/>
        <RightHome className='w-[25%] hidden lg:block'/>
    </div>
  )
}

export default Home