"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Check, X, Home, Plus, Loader2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";
import { useClerk, useUser } from "@clerk/nextjs";

export type Address = {
  id: number;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault?: boolean;
};

export type ShippingAddressData = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

interface CheckoutAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: ShippingAddressData) => void;
}

export default function CheckoutAddressForm({
  isOpen,
  onClose,
  onSubmit,
}: CheckoutAddressFormProps) {
  const [addressType, setAddressType] = useState<"saved" | "new">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToAccount, setSaveToAccount] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  const [newAddress, setNewAddress] = useState<ShippingAddressData>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch saved addresses when the form opens
  useEffect(() => {
    if (isOpen && isSignedIn) {
      fetchSavedAddresses();
    } else if (isOpen && !isSignedIn) {
      // If user is not signed in, always use new address form
      setAddressType("new");
    }
  }, [isOpen, isSignedIn]);

  // Set form initial values based on user information if available
  useEffect(() => {
    if (user && isSignedIn && addressType === "new") {
      setNewAddress((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
      }));
    }
  }, [user, isSignedIn, addressType]);

  const fetchSavedAddresses = async () => {
    if (!isSignedIn) return;

    setIsLoadingAddresses(true);
    try {
      const response = await fetch("/api/addresses");
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setSavedAddresses(data);

      // Set default address as selected
      const defaultAddress = data.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }

      // If user has addresses, default to using saved addresses
      if (data.length > 0) {
        setAddressType("saved");
      } else {
        setAddressType("new");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Could not load your saved addresses");
      setAddressType("new");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleNewAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    if (addressType === "saved" && selectedAddressId) {
      return true;
    }

    const newErrors: Record<string, string> = {};

    // Required fields for new address
    if (!newAddress.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!newAddress.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!newAddress.address1.trim()) newErrors.address1 = "Address is required";
    if (!newAddress.city.trim()) newErrors.city = "City is required";
    if (!newAddress.state.trim()) newErrors.state = "State is required";
    if (!newAddress.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!newAddress.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (addressType === "saved" && selectedAddressId) {
      // Submit selected saved address
      const selectedAddress = savedAddresses.find(
        (addr) => addr.id === selectedAddressId,
      );
      if (selectedAddress) {
        const addressData: ShippingAddressData = {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          address1: selectedAddress.address1,
          address2: selectedAddress.address2 || undefined,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone || undefined,
        };
        onSubmit(addressData);
      }
    } else {
      // Handle new address
      setIsSaving(true);

      // If user is signed in and wants to save, save the address to account
      if (isSignedIn && saveToAccount) {
        try {
          const response = await fetch("/api/addresses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...newAddress,
              isDefault: savedAddresses.length === 0, // Make default if first address
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save address");
          }

          toast.success("Address saved to your account");
        } catch (error) {
          console.error("Error saving address:", error);
          toast.error("Failed to save address to your account");
        }
      }

      onSubmit(newAddress);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Shipping Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {isLoaded && isSignedIn && (
            <>
              <RadioGroup
                value={addressType}
                onValueChange={(value) =>
                  setAddressType(value as "saved" | "new")
                }
                className="mb-4"
              >
                {savedAddresses.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="saved" id="saved-address" />
                    <Label
                      htmlFor="saved-address"
                      className="cursor-pointer font-medium"
                    >
                      Use a saved address
                    </Label>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new-address" />
                  <Label
                    htmlFor="new-address"
                    className="cursor-pointer font-medium"
                  >
                    {savedAddresses.length > 0
                      ? "Use a new address"
                      : "Add a new address"}
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-4" />
            </>
          )}

          {/* Saved addresses section */}
          {addressType === "saved" && (
            <div className="space-y-3">
              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2">Loading your addresses...</span>
                </div>
              ) : (
                <>
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`cursor-pointer rounded-md border p-3 transition-colors ${
                        selectedAddressId === address.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">
                            {address.firstName} {address.lastName}
                            {address.isDefault && (
                              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>{address.address1}</div>
                            {address.address2 && <div>{address.address2}</div>}
                            <div>
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </div>
                            <div>{address.country}</div>
                            {address.phone && <div>{address.phone}</div>}
                          </div>
                        </div>
                        <div className="mt-1">
                          {selectedAddressId === address.id && (
                            <Check className="text-primary h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* New address form */}
          {addressType === "new" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={newAddress.firstName}
                    onChange={handleNewAddressChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={newAddress.lastName}
                    onChange={handleNewAddressChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={newAddress.address1}
                  onChange={handleNewAddressChange}
                  className={errors.address1 ? "border-red-500" : ""}
                />
                {errors.address1 && (
                  <p className="text-xs text-red-500">{errors.address1}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={newAddress.address2}
                  onChange={handleNewAddressChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-red-500">{errors.postalCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    name="country"
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                    className={`border-input bg-background w-full rounded-md border px-3 py-2 ${
                      errors.country ? "border-red-500" : ""
                    }`}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="JP">Japan</option>
                  </select>
                  {errors.country && (
                    <p className="text-xs text-red-500">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newAddress.phone}
                  onChange={handleNewAddressChange}
                />
              </div>

              {isSignedIn && addressType === "new" && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="saveAddress"
                    checked={saveToAccount}
                    onCheckedChange={() => setSaveToAccount(!saveToAccount)}
                  />
                  <Label
                    htmlFor="saveAddress"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Save this address to my account
                  </Label>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSaving || (addressType === "saved" && !selectedAddressId)
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Use This Address
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
