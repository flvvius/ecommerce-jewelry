import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  UserCircle,
  MapPin,
  ShoppingBag,
  Heart,
  CreditCard,
} from "lucide-react";
import { Button } from "~/components/ui/button";

export default async function AccountPage() {
  const user = await currentUser();

  const accountLinks = [
    {
      title: "Personal Information",
      description: "Update your personal details and preferences",
      icon: <UserCircle className="h-6 w-6" />,
      href: "/account/profile",
      comingSoon: true,
    },
    {
      title: "Addresses",
      description: "Manage your shipping and billing addresses",
      icon: <MapPin className="h-6 w-6" />,
      href: "/account/addresses",
      comingSoon: false,
    },
    {
      title: "Orders",
      description: "View your order history and track current orders",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/account/orders",
      comingSoon: true,
    },
    {
      title: "Wishlist",
      description: "Manage your saved items for future purchase",
      icon: <Heart className="h-6 w-6" />,
      href: "/account/wishlist",
      comingSoon: true,
    },
    {
      title: "Payment Methods",
      description: "Manage your payment methods and preferences",
      icon: <CreditCard className="h-6 w-6" />,
      href: "/account/payment",
      comingSoon: true,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Account Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {accountLinks.map((link) => (
          <div
            key={link.title}
            className="relative rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md"
          >
            {link.comingSoon && (
              <div className="absolute top-2 right-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Coming Soon
              </div>
            )}
            <div className="mb-4 flex items-center">
              <div className="bg-primary/10 mr-4 flex h-10 w-10 items-center justify-center rounded-full">
                {link.icon}
              </div>
              <h2 className="text-xl font-semibold">{link.title}</h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              {link.description}
            </p>
            {link.comingSoon ? (
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full">
                <Link href={link.href}>Manage {link.title}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
