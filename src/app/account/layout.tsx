import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  UserCircle,
  MapPin,
  ShoppingBag,
  Heart,
  CreditCard,
} from "lucide-react";
import AccountNavigation from "./account-navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const links = [
    {
      href: "/account",
      icon: <UserCircle className="h-5 w-5" />,
      title: "Account Overview",
    },
    {
      href: "/account/addresses",
      icon: <MapPin className="h-5 w-5" />,
      title: "Addresses",
    },
    {
      href: "/account/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Orders",
      comingSoon: true,
    },
    {
      href: "/account/wishlist",
      icon: <Heart className="h-5 w-5" />,
      title: "Wishlist",
      comingSoon: true,
    },
    {
      href: "/account/payment",
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payment Methods",
      comingSoon: true,
    },
  ];

  // Extract only the needed properties from the user object
  const userInfo = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    emailAddress: user.emailAddresses[0]?.emailAddress || "",
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:flex-row md:px-6">
      <AccountNavigation links={links} user={userInfo} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
