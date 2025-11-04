import React, { useRef, useState,useEffect } from 'react'
import { FiVolume2 } from 'react-icons/fi'
import { FiVolumeX } from 'react-icons/fi'

function VideoPlayer({media}) {
    const videoTag = useRef()
    const [mute,setMute] = useState(true)
    const [isPlaying,setIsPlaying] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleClick=()=>{
        if(isPlaying){
            videoTag.current.pause()
            setIsPlaying(false)
        }
        else{
            videoTag.current.play().catch(e => console.log('Video play failed:', e))
            setIsPlaying(true)
        }
    }

    const handleVideoError = (e) => {
        console.log('VideoPlayer error:', e)
        setHasError(true)
    }

    const handleVideoLoad = () => {
        setHasError(false)
    }

     useEffect(()=>{
            const observer = new IntersectionObserver((entries)=>{
               const entry = entries[0]
               const video= videoTag.current
               if(video){
                if(entry.isIntersecting){
                    video.play().catch(e => {
                        console.log('VideoPlayer play failed on intersect:', e)
                        // Fallback for preview videos
                        if (e.name === 'NotAllowedError') {
                            console.log('Auto-play blocked, waiting for user interaction')
                        }
                    })
                    setIsPlaying(true)
                   }
                   else{
                    video.pause()
                    setIsPlaying(false)
                   }
               }
            },{threshold: 0.5})
        if(videoTag.current){
             observer.observe(videoTag.current)
        }
        return ()=>{
            if (videoTag.current) {
                observer.unobserve(videoTag.current)
            }
        }

        },[])

  return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
        {hasError ? (
            <div className='h-full w-full flex items-center justify-center bg-gray-800 text-white rounded-2xl'>
                <p>Video failed to load</p>
            </div>
        ) : (
            <video
                ref={videoTag}
                src={media}
                autoPlay
                loop
                muted={mute}
                controls={false} // Remove controls for preview
                className='h-[100%] cursor-pointer w-full object-cover rounded-2xl'
                onClick={handleClick}
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                playsInline // Better mobile support
            />
        )}
        {!hasError && (
            <div className='absolute bottom-[10px] right-[10px]' onClick={()=>setMute(prev=>!prev)}>
                {!mute ? <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/> : <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>}
            </div>
        )}
    </div>
  )
}

export default VideoPlayer
