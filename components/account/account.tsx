"use client";

import useSWR from "swr";
import { fetcher } from "@/utisl/fetcher";
import { AuthActions } from "@/utisl/auth";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { CheckoutForm } from "../billing";

const getToken = (tokenType: "access" | "refresh") => {
  return Cookies.get(`${tokenType}Token`);
};

export default function Account() {
  const router = useRouter();
  const { logout, removeTokens } = AuthActions();
  const searchParams = useSearchParams();
  const { data: user, error } = useSWR("/api/auth/profile/", fetcher);
  const { data: organisations } = useSWR("/api/auth/user-organisations/", fetcher);

  const [name, setName] = useState(user?.name || "");
  const [customerId, setCustomerId] = useState(user?.customer_id || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [sessionIdFromUrl, setSessionIdFromUrl] = useState<string | null>(null);

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();
        router.push("/login");
      })
      .catch(() => {
        removeTokens();
        router.push("/login");
      });
  };

  const handleSave = async () => {
    const token = getToken("access");

    if (!token) {
      console.error("No token found!");
      return;
    }

    await fetch("http://localhost:8000/api/auth/profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        customer_id: customerId,
      }),
    });

    setIsEditing(false);
  };

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId && sessionId !== customerId) {
      setSessionIdFromUrl(sessionId);
      setCustomerId(sessionId); // Automatically update the customer_id
    }
  }, [searchParams, customerId]);

  useEffect(() => {
    if (sessionIdFromUrl) {
      const token = getToken("access");

      if (!token) {
        console.error("No token found!");
        return;
      };

      fetch("http://localhost:8000/api/auth/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: sessionIdFromUrl,
        }),
      });
    }
  }, [sessionIdFromUrl]);

  if (error) {
    return <div>Error loading user data...</div>;
  }

  if (!user || !organisations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.name || user?.username}!</h1>
        <p className="mb-4">Your account details:</p>
        <ul className="mb-4">
          <li>Username: {user?.username}</li>
          <li>Email: {user?.email}</li>
          {isEditing ? (
            <>
              <li>
                <input
                  type="text"
                  value={name || user?.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="border px-2 py-1 rounded"
                />
              </li>
              <li>
                <input
                  type="text"
                  value={customerId || user?.customer_id}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Customer ID"
                  className="border px-2 py-1 rounded"
                />
              </li>
            </>
          ) : (
            <>
              <li>Name: {user?.name}</li>
              <li>Customer ID: {user?.customer_id}</li>
            </>
          )}
        </ul>
        {isEditing ? (
          <div className="mb-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Your Organisations:</h2>
          <ul className="mb-4">
            {organisations?.organisations?.map((org: string, index: number) => (
              <li key={index}>{org}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
      
      <CheckoutForm />
    </div>
  );
};