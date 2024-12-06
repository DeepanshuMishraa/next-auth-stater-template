"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SignInSchema, signInSchemaType } from "@/validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Login =  () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<signInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInHandler(data: signInSchemaType) {
    try {
      setIsLoading(true);
      const res = await signIn("signin", {
        ...data,
        redirect: false,
      });

      if (!res?.ok) {
        throw new Error("Something went wrong");
      }

      router.push("/dashboard");
    } catch (e) {
      console.log(e);
      throw new Error(`Error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signInHandler)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email</label>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
                      placeholder="Enter your email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Password</label>
                  <FormControl>
                    <div className="relative">
                      <input
                        {...field}
                        className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
                        placeholder="Enter your password"
                        autoCapitalize="none"
                        autoComplete="current-password"
                        autoCorrect="off"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              href="/recover"
              className="text-sm text-gray-400 hover:text-white"
            >
              Forgot your password? Recover here.
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-white py-3 text-black hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log in
          </Button>
        </form>
      </Form>
      <Button
        variant={null}
        type="button"
        disabled={isLoading}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex w-full items-center justify-center rounded-lg border border-gray-800 bg-transparent px-4 py-3 text-white hover:bg-gray-900"
      >
        Google
      </Button>
    </div>
  );
};

export default Login;
