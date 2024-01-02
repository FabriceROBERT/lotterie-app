import Header from '@/components/Header'
import Loading from '@/components/Loading'
import LoginScreen from '@/components/LoginScreen'
import { useContract, ConnectWallet, useDisconnect, useAddress ,useContractRead, useContractWrite} from '@thirdweb-dev/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { currency } from '@/config/constant'
import CountdownTimer from '@/components/CountdownTimer'
import toast from 'react-hot-toast'


export default function Home() {
  const address = useAddress()
  const [userTickets, setUserTickets] = useState(0)

  const [quantity,setQuantity] = useState<number>(1)
  const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets")
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward")
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice",)
  const { data:ticketCommission} = useContractRead(contract, "ticketCommission")
  const { data:expiration } = useContractRead(contract, "expiration")
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")
  const { data: tickets } = useContractRead(contract, "getTickets")
  const { data:winnings } = useContractRead(contract, "getWinningsForAddress" ,[address]
  )
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")



  useEffect(() => {
    if(!tickets) return
    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)
    setUserTickets(noOfUserTickets)
  }, [tickets, address])
  console.log(userTickets);
  
  const handleClick = async() =>{
    if (!ticketPrice) return
    const notification = toast.loading("Achat en cours...");
    try {
      const data = await BuyTickets({overrides: {value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString())}});
      toast.success("L'achat des tickets s'est effecué avec succès", {
        id:notification,
      })
      console.info("contract call successs", data);
    } catch(err) {
      toast.error('Oups quelque chose ne va pas !', {
        id:notification,
      })
      console.log("Echec de l'achat", err);
      
    }

  }

  const onWithDrawWinnings = async () =>  {
    const notification = toast.loading("Versement des gains...")

    try  {
      const data = await WithdrawWinnings({})
      toast.success("Le versement s'est effecué avec succès", {
        id:notification,
      })
    }
    catch(err) { 
      toast.error('Oups quelque chose ne va pas !', {
        id:notification,
      })
    console.log("Echec de l'achat", err);

    }
  }

    if (isLoading) return <Loading/>
    if (!address) return (
      <LoginScreen/> 
      )
  
  return (
    <div
      className="bg-[#091B18] min-h-screen flex flex-col"
    >
      <Head>
        <title>Lottery by Fabrice</title>
      </Head>

      <div className='flex-1'>

      <Header/>
      {winnings > 0 &&  (
        
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithDrawWinnings} className=' p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
            <p className='font-bold'>Bingo! Jackpot! </p>
            <p className='font-semibold'>Montant Total Remporté: {ethers.utils.formatEther(winnings.toString())} {currency} </p>
            <br />
            <p>Cliquez ici pour encaisser</p>
          </button>
        </div>
      )
      }

      <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center space-x-2 ' >
        <div className='stats-container'>
          <h1 className='text-5xl font-semibold text-white text-center'>Le Prochain Tirage</h1>
        <div className='flex justify-between p-2 space-x-2'>
          <div className='stats'>
            <h2 className='text-sm'>Pool Total </h2>
            <p className='text-xl'>{currentWinningReward &&  ethers.utils.formatEther(currentWinningReward.toString())}{""} {currency} </p>
          </div>
          <div className="stats">
            <h2 className='text-sm'>Tickets Restants</h2>
            <p className='text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
        </div>
        <div className=' mt-5 mb-3'>
          <CountdownTimer/>
        </div>
      </div>
      <div className="stats-container space-y-2">
        <div className="stats-container">
          <div className='flex justify-between items-center gap-2 text-white pb-2'>
            <h2>Prix par Ticket</h2>
            <p>{ticketPrice &&  ethers.utils.formatEther(ticketPrice?.toString())}{""} {currency} </p>
          </div>
          <div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4 '>
            <p>TICKETS</p>
            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} max={10} className='flex w-full bg-transparent text-right outline-none' />
          </div>
          <div className='space-y-2 mt5'>
            <div className='flex items-center justify-between text-emerald-300 text-sm italic font-extrabold'  >
              <p>Prix Total</p> 
              <p>{ticketPrice &&  Number(ethers.utils.formatEther(ticketPrice?.toString())) * quantity}{""} {currency}</p>
              </div>
              </div>
        <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
          <p>Frais de services</p>
          <p>{ticketCommission &&  ethers.utils.formatEther(ticketCommission.toString())}{""} {currency} </p>
        </div>
        <div  className='flex items-center justify-between text-emerald-300 text-xs italic'><p>+ Frais de réseaux</p>
        <p>TBC</p></div>
        <button disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber()=== 0} className='mt-5 w-full  px-3 bg-gradient-to-br from-orange-500 to-emerald-600 py-5 rounded-md shadow-xl disabled:from-gray-600 disabled:to-gray-100 disabled:cursor-not-allowed font-bold  text-white' onClick={handleClick}>Acheter {quantity} Tickets pour {ticketPrice &&  Number(ethers.utils.formatEther(ticketPrice?.toString())) * quantity} {""} {currency} </button>
      </div>
      {userTickets> 0 && <div className='stats'>
        <p>Vous avez {userTickets === 1 ?  `${userTickets} Ticket pour ce Tirage` : `${userTickets} Tickets pour ce Tirage`} </p>

        <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
          {Array(userTickets).fill("").map((_, index) => (<p className='text-emerald-300 mt-5 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic' key={index} >{index + 1} </p>))}
        </div>
        
        </div>}
        </div>
        </div>
      </div>

      <div>
      </div>
    </div>
  )
}
