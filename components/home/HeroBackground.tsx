"use client"

import { useState } from "react"

interface HeroBackgroundProps {
  imageUrl?: string
  videoUrl?: string
  overlay?: boolean
}

export default function HeroBackground({ 
  imageUrl = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  videoUrl,
  overlay = true 
}: HeroBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <div className="absolute inset-0 z-0">
      {videoUrl ? (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{
              filter: 'blur(2px)',
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!isVideoLoaded && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${imageUrl})`,
                filter: 'blur(2px)',
              }}
            />
          )}
        </>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: 'blur(2px)',
          }}
        />
      )}
      {overlay && (
        <>
          {/* Base overlay for overall brightness */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/65 to-medtronic-vibrant-blue/25" />
          {/* Radial gradient focused on center for text area */}
          <div className="absolute inset-0 bg-gradient-radial from-white/60 via-transparent to-transparent" 
               style={{
                 background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)'
               }} />
        </>
      )}
    </div>
  )
}

