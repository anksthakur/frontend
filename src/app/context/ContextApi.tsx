"use client"
import React, { createContext, useState, useContext, useEffect } from "react";

interface AppContextType {
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: any) => {
    const [userData, setUserData] = useState<any>(null);
    

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem("token");
            if (token) {
                const url = process.env.NEXT_PUBLIC_API_URL;
                try {
                    const response = await fetch(`${url}checktoken`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            
                        }
                    });
                    if (response) {
                        const data = await response.json();
                        // console.log("fetch data :",data)
                        setUserData(data);
                    } else {
                        console.log("Token validation failed");
                    }
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            } else {
                console.log("No token found in localStorage");
            }
        };
        fetchData();
    }, []);


    return (
        <AppContext.Provider value={{ userData, setUserData }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
