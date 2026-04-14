"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Trash, Search } from 'lucide-react'
import { useGetAllOrdersQuery, useDeleteOrderMutation } from '@/redux/api/orderApi/orderApi'
import Loading from '../shared/Loading'
import { OrderStatus } from '@/types/order'

const OrderTable = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    
    const { data, isLoading } = useGetAllOrdersQuery({ page, limit })
    const [deleteOrder] = useDeleteOrderMutation()
    const router = useRouter()

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>

    const orders = data?.data || []

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200'
            case OrderStatus.DELIVERED: return 'bg-primary text-white border-primary'
            case OrderStatus.PENDING: return 'bg-secondary text-secondary-foreground border-secondary shadow-sm'
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200'
            case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search by ID or Email..." 
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <Select value={limit.toString()} onValueChange={(val) => setLimit(Number(val))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 Rows</SelectItem>
                            <SelectItem value="20">20 Rows</SelectItem>
                            <SelectItem value="50">50 Rows</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Order ID</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Date</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Customer</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Total</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Payment</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider text-center">Status</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-900 capitalize">#{order.id}</TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-primary">{order.name}</span>
                                            <span className="text-xs text-gray-400">{order.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-primary">
                                        BDT {order.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize font-bold text-[10px] ${order.payment === 'paid' ? 'border-green-500 text-green-600' : 'border-red-300 text-red-500'}`}>
                                            {order.payment}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`capitalize font-bold px-3 py-1 rounded-sm text-[10px] tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => router.push(`/management/orders/details/${order.id}`)}
                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => deleteOrder(order.id)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-gray-400 italic">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex justify-between items-center px-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                    Total Result: <span className="text-primary font-bold">{data?.total || 0}</span>
                </p>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="text-xs font-bold uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white"
                    >
                        Prev
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        disabled={orders.length < limit}
                        onClick={() => setPage(p => p + 1)}
                        className="text-xs font-bold uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrderTable
