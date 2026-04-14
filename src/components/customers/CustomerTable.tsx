"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Search, UserX } from 'lucide-react'
import { useGetAllCustomersQuery } from '@/redux/api/user/user'
import Loading from '../shared/Loading'
import { CustomerStatus, Customer } from '@/types/customer'
import Image from 'next/image'

const CustomerTable = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    
    const { data, isLoading } = useGetAllCustomersQuery({ page, limit })
    const router = useRouter()

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>

    const customers = data?.data || []

    const getStatusColor = (status: CustomerStatus) => {
        switch (status) {
            case CustomerStatus.ACTIVE: return 'bg-green-100 text-green-700 border-green-200'
            case CustomerStatus.SUSPENDED: return 'bg-orange-100 text-orange-700 border-orange-200'
            case CustomerStatus.INACTIVE: return 'bg-gray-100 text-gray-700 border-gray-200'
            case CustomerStatus.DELETED: return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search customers..." 
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
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Customer</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Contact</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Location</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider">Joined At</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider text-center">Status</TableHead>
                            <TableHead className="font-bold text-primary uppercase text-xs tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length > 0 ? (
                            customers.map((customer: Customer) => (
                                <TableRow key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                                                <Image 
                                                    src={customer.image || "/profileImg.jpg"} 
                                                    alt={customer.name || 'Customer'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-primary">{customer.name || 'Nexus User'}</span>
                                                <span className="text-xs text-secondary font-medium italic">UID: {customer.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="text-gray-900 font-medium">{customer.email}</span>
                                            <span className="text-gray-400 text-xs">{customer.phone || 'No Phone'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {customer.city ? `${customer.city}, ${customer.country}` : 'Not Specified'}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={`capitalize font-bold px-3 py-1 rounded-sm text-[10px] tracking-widest ${getStatusColor(customer.status)}`}>
                                            {customer.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => router.push(`/management/customers/details/${customer.id}`)}
                                                className="h-8 w-8 p-0 text-primary hover:text-secondary hover:bg-gray-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="h-8 w-8 p-0 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-gray-400 italic">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex justify-between items-center px-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                    Total Records: <span className="text-primary font-bold">{data?.total || 0}</span>
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
                        disabled={customers.length < limit}
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

export default CustomerTable
