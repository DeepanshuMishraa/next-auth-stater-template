"use client";

import { signUp } from "@/actions/auth.actions";
import { SignUpSchema, signUpSchemaType } from "@/validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Signup = () => {
  const router = useRouter();
  const form = useForm<signUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function signUpHandler(data: signUpSchemaType) {
    try {
      const res = await signUp(data);
      if (!res.status) {
        throw new Error("SOmwthing went wrong");
      }

      router.push("/signin");
    } catch (e) {
      console.log(e);
      throw new Error(`Error: ${e}`);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signUpHandler)}
        className="mt-8 space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Your name"
                  className="border-0 bg-[#111] text-white placeholder-gray-500 focus-visible:ring-white/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="you@example.com"
                  className="border-0 bg-[#111] text-white placeholder-gray-500 focus-visible:ring-white/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Create a password"
                    className="border-0 bg-[#111] text-white placeholder-gray-500 focus-visible:ring-white/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-10 w-full bg-white text-black hover:bg-gray-200"
          aria-label="submit"
        >
          {form.formState.isSubmitting ? "Please wait..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};

export default Signup;
