"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  // const [formData,setformData]=useState<any>();
  const [week, setWeek] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [selectError, setselectError] = useState<string>("");


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
    fetchuserData();
  }, []);

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
        console.log("Get Slot:", data?.data);
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
    const formData = { weekday: week, slotTime: time };
    const response = await fetch(`${url}userdata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      showToast("success", "Slot Added successfully")
      const data = await response.json();

      console.log("slot booking :", data);
    } else {
      const data = await response.json();
      if (data.message === "weekname already exists") {
        showToast("error","weekname already appointed")
        setselectError("weekname already appointed");
        
      } else if (data.message === "slot already exists") {
        showToast("error","Slot already booked")
        setselectError("Slot already booked");
      } else {
        setselectError("An error occurred. Please try again.");
      }
    }
  }

    return (
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

    );
  }

export default User;
