"use client";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import { Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import SignInput from "@/app/components/SignInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import PageTransition from "@/app/components/PageTransition";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/lib/features/logged/loggedSlice";

export default function SigninPage() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmaiL] = useState("");
  return (
    <PageTransition>
      <Link
        href="/"
        className="flex items-center gap-2 border-1 border-background hover:bg-background/5 transition-colors rounded-2xl px-2 py-1 self-start"
      >
        <span className="w-8">
          <img className="w-full" src="../logo-white.png" alt="" />
        </span>
        <span>SharkStage</span>
      </Link>
      <div className="flex flex-col gap-6 w-8/10">
        <div>
          <h2 className="text-3xl font-bold text-center">
            Sign in to your account
          </h2>
        </div>
        <SignInput
          text="Email address"
          value={email}
          onChange={(e) => setEmaiL(e.target.value)}
        />
        <SignInput
          text="Password"
          type={showPassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        sx={{ color: "var(--color-background)" }}
                      />
                    ) : (
                      <Visibility sx={{ color: "var(--color-background)" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Link
          onClick={() => dispatch(loggedIn(email))}
          href={"/"}
          className="text-primary self-center cursor-pointer transition-shadow font-medium hover:shadow-lg bg-buttons text-xl py-2 px-4 rounded-2xl"
        >
          Continue <LoginIcon />
        </Link>
        <div className="flex flex-col gap-4">
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "var(--color-background)",
              },
            }}
          >
            Or login with
          </Divider>
          <div className="flex justify-between gap-4">
            <div className="cursor-pointer hover:bg-background/5 transition-colors grow border-1 rounded-2xl border-background flex justify-center items-center gap-4 py-2">
              <FcGoogle size={24} />
              <span>Google</span>
            </div>
            <div className="cursor-pointer hover:bg-background/5 transition-colors grow border-1 rounded-2xl border-background flex justify-center items-center gap-4 py-2">
              <FaLinkedin size={24} />
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-lg:flex-col max-lg:gap-2 max-lg:items-center justify-between w-full">
        <h4>
          Don't have an account?{" "}
          <Link
            href="/sign/up"
            className="text-buttons hover:text-buttons/50 transition-colors font-bold"
          >
            Create one
          </Link>
        </h4>
        <Link
          href="#"
          className="text-buttons hover:text-buttons/50 transition-colors font-bold"
        >
          Terms&Conditions
        </Link>
      </div>
    </PageTransition>
  );
}
