"use client"
import React from 'react'
import { Bell, ShoppingBag, Tag, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetNotificationsByCustomerQuery, useMarkAsSeenMutation } from '@/redux/api/notificationApi/notificationApi'
import useAuthState from '@/hooks/useAuthState'
import { useRouter } from 'next/navigation'
import { Notification } from '@/types/notification'

// Native replacement for formatDistanceToNow
const formatDistanceToNowNative = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

const NotificationBell = () => {
  const user = useAuthState()
  const router = useRouter()
  const customerId = user?.id || null
  
  const { data: notifications = [], isLoading } = useGetNotificationsByCustomerQuery(customerId as string, {
    skip: !customerId,
    pollingInterval: 30000, // Poll every 30 seconds
  })

  const [markAsSeen] = useMarkAsSeenMutation()

  const unreadCount = notifications.filter(n => !n.isSeen).length

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isSeen && customerId) {
      await markAsSeen({ id: notif.id, customerId })
    }

    if (notif.orderId) {
      router.push(`/dashboard/orders/details/${notif.orderId}`)
    }
  }

  const getIcon = (notif: Notification) => {
    if (notif.orderId) return <ShoppingBag className="w-4 h-4 text-blue-500" />
    if (notif.offer) return <Tag className="w-4 h-4 text-green-500" />
    return <Info className="w-4 h-4 text-gray-400" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full w-10 h-10 transition-colors">
          <Bell className="w-5 h-5 text-primary" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 border-2 border-white font-black animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 max-h-[450px] overflow-y-auto p-0 border-none shadow-2xl rounded-xl mt-2" align="end">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <DropdownMenuLabel className="p-0 font-black text-xs uppercase tracking-widest text-primary">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
                <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} NEW
                </span>
            )}
        </div>
        
        <DropdownMenuSeparator className="m-0" />
        
        <div className="py-1">
            {isLoading && <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing...</div>}
            {!isLoading && notifications.length === 0 && (
              <div className="p-8 text-center bg-white">
                <Bell className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Awaiting experiences</p>
              </div>
            )}
            
            {notifications.slice(0, 10).map((notif) => (
              <DropdownMenuItem 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`flex flex-col items-start gap-1 p-4 cursor-pointer border-b last:border-0 transition-colors ${!notif.isSeen ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between w-full">
                   <div className="flex items-center gap-2">
                       {getIcon(notif)}
                       <span className={`text-[11px] uppercase tracking-wide ${!notif.isSeen ? 'font-black text-primary' : 'font-bold text-gray-500'}`}>
                           {notif.title}
                       </span>
                   </div>
                   {!notif.isSeen && <div className="w-2 h-2 bg-secondary rounded-full" />}
                </div>
                <p className={`text-xs leading-relaxed ${!notif.isSeen ? 'text-primary font-medium' : 'text-gray-500'}`}>
                    {notif.message}
                </p>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                    {formatDistanceToNowNative(new Date(notif.createdAt))}
                </span>
              </DropdownMenuItem>
            ))}
        </div>

        {notifications.length > 5 && (
            <div className="p-2 bg-gray-50 border-t">
                <Button variant="ghost" className="w-full h-8 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
                    View All History
                </Button>
            </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationBell
