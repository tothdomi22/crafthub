"use client";
import React, {FormEvent, useState} from "react";
import useRegister from "@/app/hooks/auth/useRegister";
import {useRouter} from "next/navigation";

export default function registerPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {mutate: registerMutation, isPending, error} = useRegister();
  const router = useRouter();
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const data = {name, email, password};

    registerMutation(data, {
      onSuccess: async () => {
        // Give browser time to process Set-Cookie header
        await new Promise(resolve => setTimeout(resolve, 100));
        // Refresh to update auth state
        router.refresh();
        // Then redirect
        router.push("/");
      },
    });
  };
  return (
    <section className="relative w-screen min-h-screen bg-brandWhite flex justify-evenly gap-10 items-center text-informedMainGray p-10">
      <div className="w-[374px]">
        <form className="flex flex-col gap-6" onSubmit={handleRegister}>
          <div className="space-y-[10px]">
            <div
              className={`h-[50px] w-full flex flex-col justify-between rounded-[9px] p-2 border ${
                error
                  ? "border-informedNegative bg-[#FFF5F3]"
                  : "bg-informedDarkerBackground"
              }`}>
              <input
                id="name-input"
                className={`h-full w-full ${
                  error ? "bg-[#FFF5F3]" : "bg-informedDarkerBackground"
                } focus:outline-none px-2 text-informedMainGray placeholder:text-informedMainGray`}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div
              className={`h-[50px] w-full flex flex-col justify-between rounded-[9px] p-2 border ${
                error
                  ? "border-informedNegative bg-[#FFF5F3]"
                  : "bg-informedDarkerBackground"
              }`}>
              <input
                id="email-input"
                className={`h-full w-full ${
                  error ? "bg-[#FFF5F3]" : "bg-informedDarkerBackground"
                } focus:outline-none px-2 text-informedMainGray placeholder:text-informedMainGray`}
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div
              className={`h-[50px] w-full flex flex-col justify-between rounded-[9px] p-2 border ${
                error
                  ? "border-informedNegative bg-[#FFF5F3]"
                  : "bg-informedDarkerBackground"
              }`}>
              <input
                className={`h-full w-full ${
                  error ? "bg-[#FFF5F3]" : "bg-informedDarkerBackground"
                } focus:outline-none px-2 text-informedMainGray placeholder:text-informedMainGray`}
                type="password"
                id="password-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <button
            id="register-button"
            className="h-[55px] w-full flex items-center justify-center hover:underline bg-[#5271FF] text-[17px] font-bold text-brandWhite rounded-[10px] disabled:opacity-50"
            disabled={isPending}
            type="submit">
            {isPending ? "Loading..." : "Register"}
          </button>

          {error?.message && (
            <p className="text-informedNegative -mt-3 text-center font-medium">
              {error.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
