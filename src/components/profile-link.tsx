"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { UserIcon } from "lucide-react";

export default function ProfileLink() {
  const { user } = useUser();

  if (!user) return null;

  const username =
    user.username ?? user.emailAddresses[0].emailAddress.split("@")[0];

  return (
    <Link href={`/profile/${username}`}>
      <div className="flex items-center gap-3">
        <UserIcon className="w-4 h-4" />
        Profile
      </div>
    </Link>
  );
}
