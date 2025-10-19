"use client";
import Link from "next/link";
import {
  Divider,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SignInput from "@/app/components/SignInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import PageTransition from "@/app/components/PageTransition";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/features/auth/auththunks";

export default function SignupPage() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      accountType: "investor",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  async function myHandleSubmit(data) {
    await dispatch(registerUser(data));
  }

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

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
      <form
        className="flex flex-col gap-6 w-8/10"
        onSubmit={handleSubmit(myHandleSubmit)}
      >
        <div>
          <h2 className="text-3xl font-bold text-center">Create an account</h2>
        </div>
        <div className="flex items-center max-lg:gap-2">
          <span className="w-2/5">Select Your Role</span>

          <Controller
            name="accountType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                color="primary"
                exclusive
                {...field}
                onChange={(_, newValue) => {
                  if (newValue) field.onChange(newValue);
                }}
                fullWidth
                sx={{ borderRadius: "1rem" }}
              >
                {["Investor", "Owner"].map((type) => (
                  <ToggleButton
                    key={type}
                    value={type.toLowerCase()}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.01)",
                      textTransform: "none",
                      fontWeight: "500",
                      px: 3,
                      py: 1,
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "white",
                        borderColor: "rgba(255,255,255,0.4)",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255,255,255,0.35)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        </div>
        <div className="flex gap-4">
          <SignInput text="First name" name="firstName" control={control} />
          <SignInput text="Last name" name="lastName" control={control} />
        </div>
        <SignInput text="Email address" name="email" control={control} />
        <SignInput
          name="password"
          text="Password"
          control={control}
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
        <button className="text-primary self-center cursor-pointer transition-shadow font-medium hover:shadow-lg bg-buttons text-xl py-2 px-4 rounded-2xl">
          Create account
        </button>
        <div className="flex flex-col gap-4">
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "var(--color-background)",
              },
            }}
          >
            Or register with
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
      </form>
      <div className="flex justify-between w-full">
        <h4>
          Have an account?{" "}
          <Link
            href="/sign/in"
            className="text-buttons hover:text-buttons/50 transition-colors font-bold"
          >
            Sign in
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
