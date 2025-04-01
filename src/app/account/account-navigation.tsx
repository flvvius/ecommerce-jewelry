"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface AccountLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  comingSoon?: boolean;
}

function AccountLink({
  href,
  icon,
  title,
  active,
  comingSoon,
}: AccountLinkProps) {
  return (
    <Link
      href={comingSoon ? "#" : href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-primary/5 text-foreground/80 hover:text-foreground",
        comingSoon && "cursor-not-allowed opacity-50",
      )}
      onClick={comingSoon ? (e) => e.preventDefault() : undefined}
    >
      {icon}
      <span>{title}</span>
      {comingSoon && (
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          Soon
        </span>
      )}
    </Link>
  );
}

interface UserInfo {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export default function AccountNavigation({
  links,
  user,
}: {
  links: {
    href: string;
    icon: React.ReactNode;
    title: string;
    comingSoon?: boolean;
  }[];
  user: UserInfo;
}) {
  const pathname = usePathname();

  return (
    <aside className="md:w-1/4 lg:w-1/5">
      <div className="mb-4">
        <h2 className="font-bold">
          Hello, {user.firstName || user.emailAddress.split("@")[0]}
        </h2>
        <p className="text-muted-foreground text-sm">{user.emailAddress}</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <AccountLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            title={link.title}
            active={
              link.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(link.href)
            }
            comingSoon={link.comingSoon}
          />
        ))}
      </nav>
    </aside>
  );
}
