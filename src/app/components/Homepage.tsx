"use client"
import React from 'react'
import { useAppContext } from '../context/ContextApi'
import Admin from './Admin';
import User from './User';

const Homepage = () => {
    const {userData}=useAppContext();
    const data = userData
  return (
    <div>{data?.role === "admin"?<Admin/>:<User/>}</div>
  )
}

export default Homepage