import React from 'react'

const Nonlogin = () => {
  return (
    <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  alignItems:'center'
                }}
              >
              <video
  src="./mm.mp4"
  autoPlay
  loop
  muted
  className=" w-sm-90 w-md-75 w-lg-70 "
/>

                <h3
                  className="d-flex justify-content-center align-items-center p-4"
                  style={{  zIndex: 1  }}
                >
                  Please Login to Metamask or any other wallet to Connect to us.
                </h3>
              </div>
  )
}

export default Nonlogin