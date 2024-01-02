import React from 'react'
import Image from 'next/image'
import { HashLoader } from 'react-spinners'

function Loading() {
    return (
        <div className='bg-[#091B18] h-screen flex flex-col items-center justify-center'>
          <div className='flex items-center space-x-2 mb-10'>
            <Image className='rounded-full h-20 w-20'
                src="https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2019/03/dfada4ef-116e-4d78-8216-c54afbcae6b6_-gID_5-pID_1.png@webp"
                width={50}
                height={50}
                alt="Picture of the author"
            />
            <h1 className='text-lg text-white font-bold '>Chargement...</h1>
          </div>
          <HashLoader color='white' size={30} />
        </div>
        )
}

export default Loading
