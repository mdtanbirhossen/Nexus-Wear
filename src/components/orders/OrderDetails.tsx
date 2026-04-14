"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '@/redux/api/orderApi/orderApi'
import Loading from '../shared/Loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, CreditCard, User, MapPin } from 'lucide-react'
import { OrderStatus } from '@/types/order'

const OrderDetails = () => {
    const { id } = useParams()
    const router = useRouter()
    const { data: order, isLoading, isError } = useGetOrderByIdQuery(id as string)
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        if (!order) return
        try {
            await updateOrder({ id: order.id, data: { status: newStatus } }).unwrap()
        } catch (err) {
            console.error('Failed to update status', err)
        }
    }

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>
    if (isError || !order) return <div className="p-10 text-center text-red-500 font-bold">Order not found.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Order Details <span className="text-secondary ml-2">#{order.id}</span></h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Order Info & Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary text-white p-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Ordered Items
                                </CardTitle>
                                <Badge className="bg-secondary text-secondary-foreground font-black px-4 py-1">
                                    {order.products.length} Items
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-xs uppercase text-primary">Product</TableHead>
                                        <TableHead className="font-bold text-xs uppercase text-primary text-center">Qty</TableHead>
                                        <TableHead className="font-bold text-xs uppercase text-primary text-right">Unit Price</TableHead>
                                        <TableHead className="font-bold text-xs uppercase text-primary text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.products.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary italic">SKU: {item.productCode || 'N/A'}</span>
                                                    <span className="text-xs text-gray-500">ID: {item.productId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-primary">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-gray-600">BDT {item.unitPrice.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-black text-primary">BDT {item.totalPrice.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-gray-50/50">
                                        <TableCell colSpan={3} className="text-right font-black uppercase tracking-widest text-primary pt-6">Total Amount</TableCell>
                                        <TableCell className="text-right font-black text-xl text-secondary pt-6 underline decoration-primary decoration-4 underline-offset-4">
                                            BDT {order.totalAmount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Order Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white z-10">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Placed</span>
                                    <div className="absolute left-[50%] top-4 w-full h-[2px] bg-green-500" />
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${['processing', 'delivered', 'completed'].includes(order.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Processing</span>
                                    <div className="absolute left-[50%] top-4 w-full h-[2px] bg-gray-200" />
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${['delivered', 'completed'].includes(order.status) ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Delivered</span>
                                    <div className="absolute left-[50%] top-4 w-full h-[2px] bg-gray-200" />
                                </div>
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${order.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Completed</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Customer & Actions */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="bg-secondary text-secondary-foreground p-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4" /> Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex flex-col">
                                <span className="text-secondary font-black text-xs uppercase">Name</span>
                                <span className="font-bold text-primary">{order.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-secondary font-black text-xs uppercase">Email</span>
                                <span className="font-medium text-gray-700">{order.email}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-secondary font-black text-xs uppercase">Phone</span>
                                <span className="font-medium text-gray-700">{order.phoneNumber}</span>
                            </div>
                            <div className="pt-4 border-t flex flex-col gap-2">
                                <span className="text-secondary font-black text-xs uppercase flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Shipping Address
                                </span>
                                <p className="text-sm text-gray-600 font-medium">
                                    {order.addressLine}<br />
                                    {order.insideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment & Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-xs font-bold uppercase text-gray-500">Method</span>
                                <Badge variant="secondary" className="font-black uppercase tracking-tighter">{order.paymentType}</Badge>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-xs font-bold uppercase text-gray-500">Payment</span>
                                <Badge className={`uppercase font-black text-[10px] ${order.payment === 'paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {order.payment}
                                </Badge>
                            </div>
                            
                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-black uppercase text-primary tracking-widest">Update Order Status</label>
                                <Select 
                                    disabled={isUpdating}
                                    value={order.status} 
                                    onValueChange={(val) => handleStatusUpdate(val as OrderStatus)}
                                >
                                    <SelectTrigger className="w-full border-primary border-2 font-bold uppercase text-xs tracking-widest">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(OrderStatus).map((status) => (
                                            <SelectItem key={status} value={status} className="uppercase font-bold text-xs tracking-tighter">
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails
