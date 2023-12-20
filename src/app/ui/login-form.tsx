'use client'

import { Button, Card, Input } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import {
  signInWithGoogle
} from "@/lib/firebase/auth";

const handleSignIn = (event: any) => {
  event.preventDefault();
  signInWithGoogle();
};

// TODO: Allow username/password login as well as Google login.
export default function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Welcome to Game Profile</h1>
        <Card className="w-1/2 h-72 flex flex-col justify-evenly items-center mt-4">
          <Input isRequired className="w-3/4" type="email" placeholder="Username" />
          <Input isRequired className="w-3/4" type="password" placeholder="Password" />
        </Card>
        <div className="flex gap-4 my-4">
          <Button color="secondary"><a href="#">Create Account</a></Button>
          <Button color="primary"><a href="#">Login</a></Button>
        </div>
        <Divider className="my-4" />
        <div className="flex gap-4">
          <i onClick={handleSignIn} className="fa-brands fa-google hover:cursor-pointer"></i>
          <i onClick={handleSignIn} className="fa-brands fa-twitter hover:cursor-pointer"></i>
          <i onClick={handleSignIn} className="fa-brands fa-facebook hover:cursor-pointer"></i>
          <i onClick={handleSignIn} className="fa-brands fa-github hover:cursor-pointer"></i>
          <i onClick={handleSignIn} className="fa-brands fa-instagram hover:cursor-pointer"></i>
          <i onClick={handleSignIn} className="fa-brands fa-discord hover:cursor-pointer"></i>
        </div>
      </div>
    </div>
  )
}