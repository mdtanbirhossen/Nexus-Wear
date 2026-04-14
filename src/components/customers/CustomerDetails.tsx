"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetCustomerByIdQuery } from '@/redux/api/user/user'
import { useGetAllOrdersQuery } from '@/redux/api/orderApi/orderApi'
import Loading from '../shared/Loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft,  Phone, Mail, MapPin, Calendar, ShoppingBag, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const CustomerDetails = () => {
    const { id } = useParams()
    const router = useRouter()
    const { data: customer, isLoading, isError } = useGetCustomerByIdQuery(id as string)
    
    // Fetch customer's orders
    const { data: ordersData, isLoading: isLoadingOrders } = useGetAllOrdersQuery({ 
        customerId: Number(id),
        limit: 10
    })

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>
    if (isError || !customer) return <div className="p-10 text-center text-red-500 font-bold">Customer not found.</div>

    const orders = ordersData?.data || []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-gray-100 font-bold uppercase text-[10px] tracking-widest">
                    <ArrowLeft className="w-4 h-4 mr-2 text-secondary" />
                    Back
                </Button>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Customer Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <div className="h-24 bg-primary relative">
                            <div className="absolute -bottom-10 left-6">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-md bg-white">
                                    <Image 
                                        src={customer.image || "/profileImg.jpg"} 
                                        alt={customer.name || 'Customer'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-12 p-6 space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-primary uppercase">{customer.name || 'Nexus User'}</h2>
                                <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-widest bg-secondary/10 text-secondary border-secondary/20">
                                    {customer.status}
                                </Badge>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-secondary" />
                                    <span className="text-gray-600 font-medium">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-secondary" />
                                    <span className="text-gray-600 font-medium">{customer.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-secondary" />
                                    <span className="text-gray-600 font-medium">
                                        {customer.city ? `${customer.city}, ${customer.country}` : 'No Address'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-secondary" />
                                    <span className="text-gray-600 font-medium italic">
                                        Joined {new Date(customer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-primary text-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Insight</span>
                                <ShoppingBag className="w-4 h-4 text-secondary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold uppercase text-secondary">Total Orders</h3>
                                <p className="text-3xl font-black">{ordersData?.total || 0}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm min-h-[500px]">
                        <CardHeader className="border-b">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-secondary" /> Recent Order History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoadingOrders ? (
                                <div className="py-20 flex justify-center"><Loading /></div>
                            ) : orders.length > 0 ? (
                                <div className="divide-y">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-primary uppercase">Order #{order.id}</span>
                                                <span className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col text-right">
                                                    <span className="text-sm font-bold text-primary">BDT {order.totalAmount.toLocaleString()}</span>
                                                    <Badge className="text-[9px] h-4 uppercase font-bold tracking-tighter bg-secondary text-secondary-foreground">{order.status}</Badge>
                                                </div>
                                                <Link href={`/management/orders/details/${order.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-100 hover:border-secondary transition-all">
                                                        <ExternalLink className="w-3 h-3 text-gray-400" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-2">
                                    <ShoppingBag className="w-8 h-8 text-gray-200 mx-auto" />
                                    <p className="text-sm text-gray-400 italic">No orders found for this customer.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CustomerDetails
