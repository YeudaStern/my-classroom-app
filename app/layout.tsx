"use client";

import { Rubik } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser
} from '@clerk/nextjs'
import { metadata } from './metadata';

const rubik = Rubik({
  subsets: ["hebrew"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="https://images.pexels.com/photos/256519/pexels-photo-256519.jpeg?auto=compress&cs=tinysrgb&w=400" />
        </head>
        <body className={rubik.className}>
          <div className="m-3" >
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                  התחברות
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="text-white flex">
                <UserInfo />
              </div>
            </SignedIn>
            <div className="border border-zinc-500 w-72 mt-3 m-1"></div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

function UserInfo() {
  const { user } = useUser();
  return (
    <div className="flex items-center">
      <UserButton />
      <span className="mx-2 text-zinc-500">שלום <strong>{user?.fullName}</strong></span>
    </div>
  );
}
