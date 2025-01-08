"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/ContextApi";

const Admin = () => {

  const [week, setWeek] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [errors, setErrors] = useState<any>(null);
  const [selectError, setselectError] = useState<string>("");
  const [bookslot, setBookslot] = useState<any>();
  const weekDays: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeCheck = ["Morning", "Afternoon", "Evening"];
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
  const { userData } = useAppContext();
  const userId = userData?.data?._id
  const role = userData?.data?.role
  console.log("userId",userId)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "week") {
      setWeek(value);
    } else if (name === "slot") {
      setTime(value);
    }
  };
  useEffect(() => {
    if (userId) {
      getUserData()
    }
  }, [userId])
  const validateInputs = (): boolean => {
    const newErrors: any = {};
    if (!week) {
      newErrors.week = "Weekday is required";
    }
    if (!time) {
      newErrors.time = "Time slot is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSlot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs()) return;
    const url = process.env.NEXT_PUBLIC_API_URL;
    const formData = { weekday: week, slotTime: time };
    // console.log("form data", formData)
    const response = await fetch(`${url}slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      showToast("success", "Slot Added successfully")
      const data = await response.json();

      console.log("slot booking :", data);
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
  };
  const getUserData = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    let token = localStorage.getItem("token");
    if (userId) {
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
  console.log("bookslot",bookslot)

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSlot}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 border rounded-lg gap-4 bg-blue-200 hover:bg-blue-500">
            {/* Weekday Select */}
            <select
              name="week"
              className="p-2 border rounded w-full md:w-1/4"
              onChange={handleChange}
              value={week}
            >
              <option value="">Select Weekday</option>
              {weekDays.map((day, idx) => (
                <option key={idx} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {/* Time Slot Select */}
            <select
              name="slot"
              className="p-2 border rounded w-full md:w-1/4"
              onChange={handleChange}
              value={time}
            >
              <option value="">Select Time</option>
              {timeCheck.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          {selectError}
          {errors && (
            <div className="text-red-500 mb-2">
              {errors.week && <p>{errors.week}</p>}
              {errors.time && <p>{errors.time}</p>}
            </div>
          )}
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
                Slot
              </th>
              <th scope="col" className="px-6 py-3">
                Custmor Name
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
                <td className="px-6 py-4">
                  {item?.userDetails[0]?.username}
                </td>
              </tr>
            </tbody>
          )
          )}
        </table>
      </div>
    </>
  );
};

export default Admin;
