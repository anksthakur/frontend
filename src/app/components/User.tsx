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

  return (
    <div className="p-4">
      <form>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border rounded-lg gap-4 bg-green-200 hover:bg-green-500">
          {/* Weekday Select */}
          <select name="week" className="p-2 border rounded w-full md:w-1/4">
            <option value="">Select Weekday</option>
            {fetchData.map((item) => (
              <option key={item._id} value={item.weekday}>
                {item.weekday}
              </option>
            ))}
          </select>

          {/* Time Slot Select */}
          <select name="slot" className="p-2 border rounded w-full md:w-1/4">
            <option value="">Select Time</option>
            {fetchData.map((item) => (
              <option key={item._id} value={item.slotTime}>
                {item.slotTime}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-100 hover:bg-green-500 px-4 py-2 border-b rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default User;
