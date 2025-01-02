"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAppContext } from '../context/ContextApi';

const Navbar = () => {

    const router = useRouter();
    const { userData } = useAppContext();
    const user = userData;
 
    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/auth/login')       
    }
    return (
        <>
            <nav className="bg-blue-500 border-gray-400 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-white">CRUD</span>
                    </Link>
                    <p className='hover:text-white '>{user?.data?.username}</p>
                    <p className='hover:text-white '>{user?.data?.role} Dashboard</p>
                    <button onClick={handleLogout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</button>
                </div>
            </nav>
        </>
    )
}

export default Navbar