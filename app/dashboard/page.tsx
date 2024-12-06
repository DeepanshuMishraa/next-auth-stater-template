"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen">
      {session ? (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome {session?.user?.email}</p>
          <p>{session?.user?.name}</p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      ) : (
        <h1>Access Denied</h1>
      )}
    </div>
  );
}
