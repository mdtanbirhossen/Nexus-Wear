"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { useInitiatePaymentMutation } from "@/redux/api/paymentApi/paymentApi"
import { useGetAddressByCustomerIdQuery, useSaveCustomerAddressMutation } from "@/redux/api/addressApi/addressApi"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { clearCart } from "@/redux/features/cart/cartSlice"
import useAuthState from "@/hooks/useAuthState"

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useAuthState()
  
  const { items, totalAmount } = useSelector((state: RootState) => state.cart)
  
  const [initiatePayment, { isLoading: isPaymentLoading }] = useInitiatePaymentMutation()
  const [saveAddress] = useSaveCustomerAddressMutation()
  
  const { data: addressResponse, isLoading: isLoadingAddress } = useGetAddressByCustomerIdQuery(user?.id as string, {
    skip: !user?.id
  })
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })
  
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz")

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please login to proceed to checkout")
      router.push("/login")
    }
  }, [user, router])

  // Prefill shipping info
  useEffect(() => {
    if (addressResponse?.data) {
      const addr = addressResponse.data
      setFormData({
        firstName: addr.firstName || "",
        lastName: addr.lastName || "",
        email: addr.email || user?.email || "",
        phone: addr.phone || "",
        address: addr.addressLine || "",
        city: addr.city || "",
        postalCode: addr.postalCode || "",
      })
    } else if (user) {
       setFormData(prev => ({ ...prev, email: user.email || "" }))
    }
  }, [addressResponse, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!user?.id) {
       toast.error("You must be logged in")
       return
    }

    try {
      // 1. Save or Update address silently
      await saveAddress({
        customerId: user.id,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          addressLine: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          customerId: user.id,
        }
      }).unwrap()

      // 2. Prepare standardized Order Payload
      const payload = {
        addressLine: formData.address,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phoneNumber: formData.phone,
        paymentType: paymentMethod === "sslcommerz" ? "SSL" : "COD",
        customerId: user.id,
        totalAmount,
        products: items.map(i => ({
           productId: i.productId,
           quantity: i.quantity,
           unitPrice: i.price,
           totalPrice: i.price * i.quantity,
           sizeId: i.sizeId || "",
           colorId: i.colorId || ""
        }))
      }
      
      const res = await initiatePayment(payload).unwrap()
      
      if (paymentMethod === "sslcommerz") {
        if (res?.paymentUrl) {
           window.location.href = res.paymentUrl
        } else {
           toast.error(res?.message || "Failed to initiate payment")
        }
      } else if (paymentMethod === "cod") {
        toast.success("Order placed successfully with Cash on Delivery")
        dispatch(clearCart())
        router.push("/dashboard/orders")
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong")
    }
  }

  if (!user || isLoadingAddress) {
     return <div className="min-h-screen flex justify-center items-center">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty. Please add some items before checking out.</p>
        <Button onClick={() => router.push("/")}>Return to Shop</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact & Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your delivery address and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you'd like to pay for your order.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="sslcommerz" id="sslcommerz" />
                    <Label htmlFor="sslcommerz" className="font-medium cursor-pointer w-full flex justify-between items-center">
                      <span>Online Payment (Cards, Mobile Banking)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="font-medium cursor-pointer w-full">Cash on Delivery (COD)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="font-medium text-gray-500">{item.quantity}x</span>
                        <span className="line-clamp-1 truncate" title={item.product?.name}>{item.product?.name}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
