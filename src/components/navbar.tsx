"use client";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/friends" className="text-lg">
                Friends
              </Link>
            </li>
            <li>
              <Link href="/journals" className="text-lg">
                Journals
              </Link>
            </li>
            <li>
              <Link href="/tasks" className="text-lg">
                Reminders
              </Link>
            </li>
            <li>
              <Link href="/chat" className="text-lg">
                AI Chat
              </Link>
            </li>
          </ul>
        </div>

        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
        <span className="btn btn-ghost text-xl">Journal Share App</span>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-3 text-lg">
          <li>
            <Link href="/friends">Friends</Link>
          </li>
          <li>
            <Link href="/journals">Journals</Link>
          </li>
          <li>
            <Link href="/tasks">Reminders</Link>
          </li>
          <li>
            <Link href="/chat">AI Chat</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end mr-5">
        <SignedOut>
          <SignInButton>
            <button className="rounded-lg btn text-md hover:text-lg hover:btn-primary">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded-lg btn text-md hover:text-lg hover:btn-primary">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
