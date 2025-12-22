"use client";

import React, {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import useLogin from "@/app/hooks/auth/useLogin";
import HideCredentialsSVG from "/public/svgs/hide-credentials.svg";
import ShowCredentialsSVG from "/public/svgs/show-credentials.svg";
import BrandLogo from "@/app/components/global/BrandLogo"; // Import Logo

export default function LoginPage() {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");

  const {mutate: loginMutation, isPending} = useLogin();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Az email cím megadása kötelező.";
    } else if (!emailRegex.test(email)) {
      return "Érvénytelen email formátum.";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "A jelszó megadása kötelező.";
    }
    return "";
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    errorSetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(value);
    if (errorSetter) errorSetter("");
    if (generalError) setGeneralError("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Reset Errors
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // 2. Client-side Validation
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    // 3. API Call
    const data = {email, password};

    loginMutation(data, {
      onSuccess: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        router.refresh();
        router.push("/");
      },
      onError: error => {
        console.error("Login failed:", error);
        const backendMessage = error?.message;
        if (backendMessage) {
          setGeneralError("Hibás email cím vagy jelszó.");
        } else {
          setGeneralError("Váratlan hiba történt. Kérjük próbálja újra.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* --- LEFT SIDE: IMAGE / BRANDING --- */}
      {/* Updated bg-slate-900 -> bg-background (Dark Mode will handle contrast) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f0f13] relative overflow-hidden">
        <Image
          src="/images/auth-image.webp"
          alt={"Register image"}
          fill
          priority
          unoptimized
          className="object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          {/* REPLACED: Hardcoded text -> BrandLogo White Variant */}
          <div>
            <BrandLogo colorMode="white" />
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Találd meg az egyedi
              <br /> kézműves kincseket.
            </h2>
            <p className="text-slate-300 text-lg max-w-md">
              Csatlakozz a közösségünkhöz és támogasd a hazai alkotókat
              közvetlen vásárlással.
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl shadow-xl shadow-primary/5 lg:shadow-none lg:p-0 lg:bg-transparent">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              Üdv újra!
            </h1>
            <p className="text-text-muted">
              Jelentkezz be a fiókodba a folytatáshoz.
            </p>
          </div>

          {/* --- GENERAL ERROR ALERT --- */}
          {generalError && (
            <div className="mb-6 bg-danger-bg border border-danger-border text-danger-text px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 flex-shrink-0 text-danger-solid">
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-danger-solid">
                {generalError}
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-text-main ml-1">
                Email cím
              </label>
              <input
                type="email"
                name="email"
                placeholder="pelda@email.hu"
                value={email}
                onChange={e =>
                  handleInputChange(setEmail, e.target.value, setEmailError)
                }
                className={`
                  w-full px-4 py-3.5 rounded-xl font-medium transition-all outline-none
                  bg-bg-hover text-text-main placeholder:text-text-muted
                  ${
                    emailError || generalError
                      ? "border border-danger-border focus:border-danger-solid focus:ring-4 focus:ring-danger-solid/10"
                      : "border border-border focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10"
                  }
                `}
              />
              {emailError && (
                <p className="text-danger-solid text-[13px] font-medium ml-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-text-main">
                  Jelszó
                </label>
                <Link
                  href="/forgot-password"
                  tabIndex={-1}
                  className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">
                  Elfelejtetted?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e =>
                    handleInputChange(
                      setPassword,
                      e.target.value,
                      setPasswordError,
                    )
                  }
                  className={`
                    w-full px-4 py-3.5 rounded-xl font-medium transition-all outline-none pr-12
                    bg-bg-hover text-text-main placeholder:text-text-muted
                    ${
                      passwordError || generalError
                        ? "border border-danger-border focus:border-danger-solid focus:ring-4 focus:ring-danger-solid/10"
                        : "border border-border focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors">
                  {showPassword ? (
                    <HideCredentialsSVG />
                  ) : (
                    <ShowCredentialsSVG />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-danger-solid text-[13px] font-medium ml-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl shadow-lg shadow-primary/20 font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-bg-disabled disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed mt-4">
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Bejelentkezés"
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="mt-8 text-center text-sm text-text-muted font-medium">
            Nincs még fiókod?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Regisztrálj ingyen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
