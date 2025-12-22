"use client";

import React, {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import useRegister from "@/app/hooks/auth/useRegister";
import {notifyError} from "@/app/utils/toastHelper";

export default function RegisterPage() {
  const router = useRouter();

  // --- Form State ---
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // --- Error State ---
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [termsError, setTermsError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");

  const {mutate: registerMutation, isPending} = useRegister();

  // --- Validation Logic ---
  const validateName = (val: string) => {
    if (!val.trim()) return "A teljes név megadása kötelező.";
    return "";
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return "Az email cím megadása kötelező.";
    if (!emailRegex.test(val)) return "Érvénytelen email formátum.";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "A jelszó megadása kötelező.";
    if (val.length < 8)
      return "A jelszónak legalább 8 karakter hosszúnak kell lennie.";
    return "";
  };

  const validateConfirmPassword = (original: string, confirm: string) => {
    if (original !== confirm) return "A jelszavak nem egyeznek.";
    return "";
  };

  // --- Helper to clear errors on type ---
  const handleInputChange = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    value: T,
    errorSetter?: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setter(value);
    if (errorSetter) errorSetter("");
    setGeneralError(""); // from component scope
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Reset Errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");
    setGeneralError("");

    // 2. Validate
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    const termsErr = !termsAccepted ? "A feltételek elfogadása kötelező." : "";

    if (nameErr || emailErr || passwordErr || confirmErr || termsErr) {
      setNameError(nameErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setConfirmPasswordError(confirmErr);
      setTermsError(termsErr);
      return;
    }

    // 3. Submit
    const data = {name, email, password};

    registerMutation(data, {
      onSuccess: async () => {
        // Give browser time to process Set-Cookie header
        await new Promise(resolve => setTimeout(resolve, 100));
        router.refresh();
        router.push("/");
      },
      onError: error => {
        console.error("Register failed:", error);
        const backendMessage = error?.message;

        if (backendMessage) {
          // Handle specific backend errors (e.g. "Email already exists")
          setGeneralError(backendMessage);
          notifyError("Regisztrációs hiba történt.");
        } else {
          setGeneralError("Váratlan hiba történt. Kérjük próbálja újra.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* --- LEFT SIDE: IMAGE --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <Image
          src={"/images/auth-image.webp"}
          alt={"Register image"}
          fill
          priority
          unoptimized
          className="object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 w-full text-text-main h-full">
          <div className="bg-surface/10 backdrop-blur-md border border-border/20 p-6 rounded-2xl max-w-md">
            <div className="flex gap-1 mb-2 text-yellow-400">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-lg font-medium italic mb-4">
              &#34;Végre egy hely, ahol értékelik a kézimunkát. Az eladások
              gyorsak, a közösség pedig támogató.&#34;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface/20"></div>
              <span className="font-bold text-sm">Anna, Keramikus</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 lg:shadow-none lg:p-0 lg:bg-transparent">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-text-main mb-2">
              Fiók létrehozása
            </h1>
            <p className="text-text-muted">
              Csatlakozz a kézműves közösséghez még ma.
            </p>
          </div>

          {/* --- GENERAL ERROR ALERT --- */}
          {generalError && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 flex-shrink-0">
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{generalError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-text-main ml-1">
                Teljes név
              </label>
              <input
                type="text"
                name="name"
                placeholder="Pl. Kiss János"
                value={name}
                onChange={e =>
                  handleInputChange(setName, e.target.value, setNameError)
                }
                className={`w-full bg-background border rounded-xl px-4 py-3.5 outline-none focus:bg-surface focus:ring-4 transition-all text-text-main placeholder:text-text-muted font-medium ${
                  nameError
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
              {nameError && (
                <p className="text-red-500 text-[13px] font-medium ml-1">
                  {nameError}
                </p>
              )}
            </div>

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
                className={`w-full bg-background border rounded-xl px-4 py-3.5 outline-none focus:bg-surface focus:ring-4 transition-all text-text-main placeholder:text-text-muted font-medium ${
                  emailError || generalError
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-[13px] font-medium ml-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-text-main ml-1">
                Jelszó
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min. 8 karakter"
                value={password}
                onChange={e =>
                  handleInputChange(
                    setPassword,
                    e.target.value,
                    setPasswordError,
                  )
                }
                className={`w-full bg-background border rounded-xl px-4 py-3.5 outline-none focus:bg-surface focus:ring-4 transition-all text-text-main placeholder:text-text-muted font-medium ${
                  passwordError
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-[13px] font-medium ml-1">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-text-main ml-1">
                Jelszó megerősítése
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e =>
                  handleInputChange(
                    setConfirmPassword,
                    e.target.value,
                    setConfirmPasswordError,
                  )
                }
                className={`w-full bg-background border rounded-xl px-4 py-3.5 outline-none focus:bg-surface focus:ring-4 transition-all text-text-main placeholder:text-text-muted font-medium ${
                  confirmPasswordError
                    ? "border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-[13px] font-medium ml-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={e =>
                    handleInputChange(
                      setTermsAccepted,
                      e.target.checked,
                      setTermsError,
                    )
                  }
                  className={`mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary accent-primary cursor-pointer ${
                    termsError
                      ? "outline-2 outline-red-500 outline-offset-1"
                      : ""
                  }`}
                />
                <label
                  htmlFor="terms"
                  className={`text-xs cursor-pointer select-none ${termsError ? "text-red-500" : "text-text-muted"}`}>
                  Elolvastam és elfogadom az{" "}
                  <span className="text-primary font-bold hover:underline">
                    Adatkezelési Tájékoztatót
                  </span>{" "}
                  és a{" "}
                  <span className="text-primary font-bold hover:underline">
                    Felhasználási feltételeket
                  </span>
                  .
                </label>
              </div>
              {/* Optional: explicit error text for terms */}
              {termsError && (
                <p className="text-red-500 text-[11px] font-medium mt-1 ml-7">
                  {termsError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-hover text-surface py-4 rounded-xl shadow-lg shadow-primary/20 font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {isPending ? (
                <div className="w-5 h-5 border-2 border-border/30 border-t-surface rounded-full animate-spin" />
              ) : (
                "Regisztráció"
              )}
            </button>
          </form>

          {/* Footer / Login Link */}
          <div className="mt-8 text-center text-sm text-text-muted font-medium">
            Már van fiókod?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline">
              Jelentkezz be
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
