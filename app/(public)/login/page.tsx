"use client";

import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import useLogin from "@/app/hooks/auth/useLogin";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const router = useRouter();

  const {mutate: loginMutation, isPending, error} = useLogin();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    return "";
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // Validate fields
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    // If there are validation errors, don't submit
    if (emailValidationError || passwordValidationError) {
      return;
    }
    const data = {email, password};

    loginMutation(data, {
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
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="space-y-[10px]">
            <div>
              <div
                className={`h-[50px] w-full flex flex-col justify-between rounded-[9px] p-2 border ${
                  emailError || error
                    ? "border-informedNegative bg-[#FFF5F3]"
                    : "bg-informedDarkerBackground"
                }`}>
                <input
                  id="email-input"
                  className={`h-full w-full ${
                    emailError || error
                      ? "bg-[#FFF5F3]"
                      : "bg-informedDarkerBackground"
                  } focus:outline-none px-2 text-informedMainGray placeholder:text-informedMainGray`}
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                />
              </div>
              {emailError && (
                <p className="text-informedNegative text-[13px] mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <div
                className={`h-[50px] w-full flex flex-col justify-between rounded-[9px] p-2 border ${
                  passwordError || error
                    ? "border-informedNegative bg-[#FFF5F3]"
                    : "bg-informedDarkerBackground"
                }`}>
                <input
                  className={`h-full w-full ${
                    passwordError || error
                      ? "bg-[#FFF5F3]"
                      : "bg-informedDarkerBackground"
                  } focus:outline-none px-2 text-informedMainGray placeholder:text-informedMainGray`}
                  type="password"
                  id="password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
              </div>
              {passwordError && (
                <p className="text-informedNegative text-[13px] mt-1">
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          <button
            id="sign-in-button"
            className="h-[55px] w-full flex items-center justify-center hover:underline bg-[#5271FF] text-[17px] font-bold text-brandWhite rounded-[10px] disabled:opacity-50"
            disabled={isPending}
            type="submit">
            {isPending ? "Loading..." : "Sign in"}
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
