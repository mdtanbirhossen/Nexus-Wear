"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ILogin } from '@/@types/auth';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginCustomerMutation } from "@/redux/api/user/user";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { setAuth } from "@/redux/features/auth/authSlice";
import Link from "next/link";

// Define a proper error type instead of using 'any'
interface ApiError {
  data?: {
    message?: string;
  };
  status?: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  
  const [loginCustomer, { isLoading, error }] = useLoginCustomerMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const { email, password } = data;
    
    try {
      // Clear any previous errors
      setLoginError(null);
      
      // Call the login mutation
      const result = await loginCustomer({ email, password }).unwrap();
      console.log("Login Response:", result);
      
      // Set userToken cookie for middleware (expires in 7 days)
      if (result.accessToken) {
        document.cookie = `userToken=${result.accessToken}; path=/; max-age=${7 * 24 * 60 * 60};`;
      }

      // Dispatch the credentials to Redux store using your auth slice
      dispatch(setAuth({
        token: result.accessToken,
        id: result.data.id.toString(),
        email: result.data.email,
        image: result.data.image,
        expiresAt: null
      }));
      
      toast.success(result.message);
      router.push("/");
      
    } catch (err: unknown) {
      console.error("Login error:", err);
      
      // Type guard to check if it's an ApiError
      const isApiError = (error: unknown): error is ApiError => {
        return typeof error === 'object' && error !== null && ('data' in error || 'status' in error);
      };
      
      if (isApiError(err)) {
        if (err.data?.message) {
          toast.error(err.data.message);
          setLoginError(err.data.message);
        } else if (err.status === "FETCH_ERROR") {
          const errorMsg = "Network error. Please check your connection.";
          toast.error(errorMsg);
          setLoginError(errorMsg);
        } else {
          const errorMsg = "Login failed. Please check your credentials and try again.";
          toast.error(errorMsg);
          setLoginError(errorMsg);
        }
      } else {
        const errorMsg = "An unexpected error occurred. Please try again.";
        toast.error(errorMsg);
        setLoginError(errorMsg);
      }
    }
  };
  
  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      
      {/* Display login error if any */}
      {loginError && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {loginError}
        </div>
      )}
      
      {/* Display API error if any */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {'data' in error ? 
            (error.data as { message?: string }).message || 'Login failed' : 
            'Login failed'}
        </div>
      )}
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <span className="font-semibold text-sm text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              },
              maxLength: {
                value: 12,
                message: "Password cannot exceed 12 characters"
              }
            })}
          />
          {errors.password && (
            <span className="font-semibold text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </form>
  )
}