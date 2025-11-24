"use client";

import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <AuthLayout isSignUp={!isSignUp} onToggle={handleToggle}>
      <LoginForm isVisible={!isSignUp} />
      <SignupForm isVisible={isSignUp} />
    </AuthLayout>
  );
}
