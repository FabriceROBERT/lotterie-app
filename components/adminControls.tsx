import { currency } from '@/config/constant'
import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import React from 'react'
import toast from 'react-hot-toast'

function adminControls() {

    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

    const { data:totalCommission } = useContractRead(contract, "operatorTotalCommission", )
    const { mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll} = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw} = useContractWrite(contract, "restartDraw")
    const { mutateAsync: WithdrawCommission} = useContractWrite(contract, "WithdrawCommission")

    const drawWinner = async () => {
    const notification = toast.loading("Selection du gagnant...")

        try {
            const data = await DrawWinnerTicket({})
            toast.success("Un gagnant a été selectionné!", {
                id:notification,
              })
              
        } catch (error) {
            toast.error('Oups quelque chose ne va pas !', {
                id:notification,
              })
              console.log("Echec du processus", error);
        }
    }

    const withdrawCommission = async () => {
    const notification = toast.loading("commission de retrait...")

        try {
            const data = await WithdrawCommission({})
            toast.success("Votre commission a été retirée avec succès!", {
                id:notification,
              })
              
        } catch (error) {
            toast.error('Oups quelque chose ne va pas !', {
                id:notification,
              })
              console.log("Echec du processus", error);
        }
    }

    const onRestartDraw = async () => {
        const notification = toast.loading("Relancement du Tirage...")
    
            try {
                const data = await restartDraw({})
                toast.success("Tirage relancé avec succès!", {
                    id:notification,
                  })
                  
            } catch (error) {
                toast.error('Oups quelque chose ne va pas !', {
                    id:notification,
                  })
                  console.log("Echec du processus", error);
            }
        }

        const onRefundAll = async () => {
            const notification = toast.loading("Remboursement en cours...")
        
                try {
                    const data = await RefundAll({})
                    toast.success("Remboursement effectué avec succès!", {
                        id:notification,
                      })
                      
                } catch (error) {
                    toast.error('Oups quelque chose ne va pas !', {
                        id:notification,
                      })
                      console.log("Echec du processus", error);
                }
            }

  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
      <h2 className=' font-bold'>Administation</h2>
      <p className=' mb-5'>Commission totale à retirer : {totalCommission && ethers.utils.formatEther(totalCommission?.toString())} {currency}</p>
      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0  md:space-x-2'>
        <button onClick={drawWinner} className='admin-button'>
        <StarIcon className='h-6 mx-auto mb-2'/>
            Gagnant du Tirage au sort </button>
        <button onClick={withdrawCommission} className='admin-button'>
            <CurrencyDollarIcon className='h-6 mx-auto mb-2'/>
            Retirer une commission</button>
        <button onClick={onRestartDraw} className='admin-button'>
            <ArrowPathIcon className='h-6 mx-auto mb-2'/>
            Relancer le Tirage</button>
        <button onClick={onRefundAll} className='admin-button'>
            <ArrowUturnDownIcon className='h-6 mx-auto mb-2'/>
            Tout Rembourser</button>
      </div>
    </div>
  )
}

export default adminControls
