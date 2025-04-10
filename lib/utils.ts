'use client';

import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function GetUsername() {

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // only run on client side
    if (typeof window !== 'undefined') {
      let storedName = localStorage.getItem('userName');

      if (!storedName) {
        storedName = localStorage.getItem('user')
      }
      setUserName(storedName);
    }
  }, []);

  console.log(userName, 'this is my username')

  return userName;
}


export function GetUserId() {

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // only run on client side
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem('userId');

      if (!storedId) {
        storedId = localStorage.getItem('user_id')
      }
      setUserId(storedId);
    }
  }, []);

  console.log(userId, 'this is my userId')

  return userId;
}

