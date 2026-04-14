"use client"
import React, { useState } from 'react'
import { Bell, Send, Calendar, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { useCreateOfferNotificationMutation, useGetAllNotificationsQuery } from '@/redux/api/notificationApi/notificationApi'
import { toast } from 'sonner'
import Loading from '../shared/Loading'
import { Textarea } from '../ui/textarea'

// Native replacement for format
const formatNative = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date)
}

const NotificationManager = () => {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    
    const { data: notifications = [], isLoading } = useGetAllNotificationsQuery()
    const [createOffer, { isLoading: isCreating }] = useCreateOfferNotificationMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !message) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            await createOffer({ title, message }).unwrap()
            toast.success("Notification sent to all customers!")
            setTitle('')
            setMessage('')
        } catch {
            toast.error("Failed to send notification")
        }
    }

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter flex items-center gap-3">
                    <Megaphone className="w-8 h-8 text-secondary" />
                    Broadcast Center
                </h1>
                <p className="text-gray-500 text-sm font-medium">Manage and dispatch store-wide notifications to your community.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Section */}
                <Card className="lg:col-span-1 border-none shadow-xl bg-primary text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Bell className="w-24 h-24" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-widest text-secondary">New Announcement</CardTitle>
                        <CardDescription className="text-gray-400 font-medium">Send a global alert to all customers.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Heading</label>
                                <Input 
                                    placeholder="e.g. Summer Collection Live!" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-bold focus:ring-secondary/50 focus:border-secondary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Content</label>
                                <Textarea 
                                    placeholder="Describe the promotion or update..." 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-medium min-h-[120px] focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                type="submit" 
                                disabled={isCreating}
                                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black uppercase tracking-[0.2em] h-12 transition-all shadow-lg hover:shadow-secondary/20"
                            >
                                {isCreating ? "Dispatching..." : "Transmit Now"}
                                <Send className="w-4 h-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* History Section */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-widest text-primary">Transmission Log</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-tighter">History of global notifications</CardDescription>
                        </div>
                        <Badge variant="outline" className="font-black text-[10px] uppercase border-gray-100 text-gray-400">
                             {notifications.filter(n => n.offer).length} Total Broadcasts
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-6 h-12">Event</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 h-12">Message</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 h-12">Timestamp</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right pr-6 h-12">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.filter(n => n.offer).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-20">
                                            <Bell className="w-12 h-12 text-gray-50 mx-auto mb-4" />
                                            <p className="text-xs text-gray-300 font-black uppercase tracking-widest">No global history found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notifications.filter(n => n.offer).map((notif) => (
                                        <TableRow key={notif.id} className="group hover:bg-gray-50/50 transition-colors border-b last:border-none border-gray-50">
                                            <TableCell className="pl-6 font-black text-xs uppercase tracking-tight text-primary">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-6 bg-secondary rounded-full group-hover:h-8 transition-all" />
                                                    {notif.title}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500 font-medium max-w-[200px] truncate">
                                                {notif.message}
                                            </TableCell>
                                            <TableCell className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatNative(new Date(notif.createdAt))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge className="bg-green-50 text-green-600 border-green-100 uppercase text-[9px] font-black px-2 py-0.5">
                                                    Live
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default NotificationManager
