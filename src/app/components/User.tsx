"use client";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/ContextApi";

interface UserData {
  _id: string;
  weekday: string;
  slotTime: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const User = () => {
  const [fetchData, setfetchData] = useState<UserData[]>([]);
  const { userData } = useAppContext();
  const [week, setWeek] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectError, setselectError] = useState<string>("");
  const [bookslot, setBookslot] = useState<any>()

  const userId = userData?.data?._id
  const role = userData?.data?.role
  console.log("role",role)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "week") {
      setWeek(value);
    } else if (name === "slot") {
      setTime(value);
    }
  };

  const showToast = (type: "success" | "error" | "warn", message: string) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  useEffect(() => {
    if (userId) {
      fetchuserData();
      getUserData()
    }

  }, [userId]);

  const fetchuserData = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}userdata`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setfetchData(data?.data || []);
        // console.log("Get Slot:", data?.data);
      } else {
        showToast("error", "Failed to fetch user data.");
      }
    } catch (error) {
      showToast("error", "An unexpected error occurred.");
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = process.env.NEXT_PUBLIC_API_URL;
    const formData = { weekday: week, slotTime: time, userId };
    const response = await fetch(`${url}userdata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      showToast("success", "Slot Added successfully")
      const data = await response.json();
      fetchuserData()
      // console.log("slot booking :", data);
    } else {
      const data = await response.json();
      if (data.message === "weekname already exists") {
        showToast("error", "weekname already appointed")
        setselectError("weekname already appointed");

      } else if (data.message === "slot already exists") {
        showToast("error", "Slot already booked")
        setselectError("Slot already booked");
      } else {
        setselectError("An error occurred. Please try again.");
      }
    }
  }

  const getUserData = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    let token = localStorage.getItem("token");
    if (userId && token) {
      const response = await fetch(`${url}userbookeddata?userId=${userId}&role=${role}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (response) {
        const bookData: any = await response.json();
        setBookslot(bookData.data)
      } else {
        console.log("Token validation failed");
      }
    }
  }
  console.log("===========", bookslot)
  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border rounded-lg gap-4 bg-green-200 hover:bg-green-500">
            {/* Weekday Select */}
            <select name="week" value={week} onChange={handleChange} className="p-2 border rounded w-full md:w-1/4">
              <option value="">Select Weekday</option>
              {fetchData.map((item) => (
                <option key={item._id} value={item.weekday}>
                  {item.weekday}
                </option>
              ))}
            </select>

            {/* Time Slot Select */}
            <select name="slot" value={time} onChange={handleChange} className="p-2 border rounded w-full md:w-1/4">
              <option value="">Select Time</option>
              {fetchData.map((item) => (
                <option key={item._id} value={item.slotTime}>
                  {item.slotTime}
                </option>
              ))}
            </select>
          </div>
          {selectError}
          <button
            type="submit"
            className="bg-green-100 hover:bg-green-500 px-4 py-2 border-b rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="relative overflow-x-auto mx-5 my-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-red-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Booked Slot
              </th>
            </tr>
          </thead>
          {bookslot && bookslot.length > 0 && bookslot.map((item: any,index:any) => (
            console.log(item),
            <tbody key={index}>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item?.weekday}
                </th>
                <td className="px-6 py-4">
                  {item?.slotTime}
                </td>
              </tr>
            </tbody>
          )
          )}
        </table>
      </div>
    </>
  );
}

export default User;
