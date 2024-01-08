import React from 'react'
import Image from 'next/image'
import { ConnectWallet, useConnect, useMetamask } from '@thirdweb-dev/react'

function LoginScreen() {
  const connectWithMetamask = useMetamask()
  const handleConnectClick = async () => {
    try {
      
await connectWithMetamask();
    } 
    
catch (error) {
      console.error('Erreur lors de la connexion Metamask :', error);
      
 } 
    }
 
  return (
    <div className='bg-[#091B18] flex flex-col items-center justify-center min-h-screen'>
     <div className='flex flex-col items-center '><Image className='  rounded-md mb-10'
      src="https://img.decrypt.co/insecure/rs:fit:3840:0:0:0/plain/https://cdn.decrypt.co/wp-content/uploads/2019/03/dfada4ef-116e-4d78-8216-c54afbcae6b6_-gID_5-pID_1.png@webp"
      width={500}
      height={500}
      alt="Picture of the author"
    />
    <h1 className='text-6xl text-white font-bold mb-3'>Crypto Draw</h1> 
    <h2 className='text-white tracking-widest '>Commencer par vous connecter avec MetaMask</h2>
    <button onClick={handleConnectClick} className='bg-white rounded-lg text-xl px-8 py-5 mt-10 shadow-lg font-bold animate-pulse'>Se Connecter avec Metamask</button></div>
    </div>
  )
}

export default LoginScreen
