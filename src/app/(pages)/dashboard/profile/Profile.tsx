"use client"
import useAuthState from "@/hooks/useAuthState"
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "@/redux/api/user/user";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Pencil, Save, X, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

// Define validation schema with Zod
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const dispatch = useDispatch();
  const user = useAuthState()
  const id = user?.id;
  const { data: customer, error, isLoading } = useGetCustomerByIdQuery(id || '');
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize React Hook Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    mode: "onChange",
  });

  // Reset form with customer data when it changes
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        country: customer.country || "",
      });
    }
  }, [customer, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Automatically upload to backend
      try {
        const formData = new FormData();
        formData.append("image", file);

        const toastId = toast.loading("Uploading new profile image...");
        
        const res = await updateCustomer({ id: id as string, data: formData }).unwrap();
        
        if (res.status === "success") {
          // Sync Redux auth state
          dispatch(setAuth({
            token: user?.token || null,
            id: res.data.id,
            email: res.data.email,
            image: res.data.image,
            expiresAt: user?.expiresAt || null
          }));
          
          toast.success("Profile image updated!", { id: toastId });
          setSelectedImage(null);
        }
      } catch (err) {
        console.error("Auto-upload error:", err);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      // append all fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await updateCustomer({ id: id as string, data: formData }).unwrap();
      if (res.status === "success") {
        // Sync Redux auth state to persist changes across reload
        dispatch(setAuth({
          token: user?.token || null,
          id: res.data.id,
          email: res.data.email,
          image: res.data.image,
          expiresAt: user?.expiresAt || null
        }));
        setIsEditing(false);
        setSelectedImage(null);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (customer) {
      form.reset({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        country: customer.country || "",
      });
    }
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-10 w-64" />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <Card>
                <CardHeader className="items-center">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-6 w-48 mt-4" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Profile</CardTitle>
            <CardDescription>Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Profile</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - User Card */}
          <div className="w-full lg:w-1/3">
            <Card>
              <CardHeader className="items-center">
                <div className="relative w-full h-48 bg-muted border-4 rounded-2xl border-muted overflow-hidden">
                  <Image
                    src={imagePreview || customer?.image || "/default-avatar.png"}
                    alt={customer?.name || "Customer Image"}
                    fill
                    className="object-cover"
                  />
                  <Input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-4 right-4 rounded-full h-10 w-10 bg-black backdrop-blur-sm"
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>
                </div>

              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className=" space-y-1 pb-2">
                    <CardTitle className="text-xl">{customer?.name}</CardTitle>
                    <CardDescription>{customer?.email}</CardDescription>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground mb-2">Account Status</h3>
                    <Badge
                      variant={customer?.status === 'active' ? 'default' : 'destructive'}
                      className="mb-1"
                    >
                      {customer?.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm">Phone: {customer?.phone || ''}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    type="button"
                  >
                    {isEditing ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        {...form.register("address")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.address && (
                        <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        {...form.register("city")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        type="text"
                        {...form.register("state")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        {...form.register("zipCode")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-destructive">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        type="text"
                        {...form.register("country")}
                        disabled={!isEditing}
                      />
                      {form.formState.errors.country && (
                        <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-3"
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={(!form.formState.isDirty && !selectedImage) || !form.formState.isValid || isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}