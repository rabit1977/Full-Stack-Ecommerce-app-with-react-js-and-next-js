import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import * as React from "react"

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  user: {
    name?: string | null
    image?: string | null
  } | null | undefined
  fallbackText?: string
  fallbackClassName?: string
}

export function UserAvatar({ 
  user, 
  fallbackText,
  fallbackClassName, 
  className,
  ...props 
}: UserAvatarProps) {
  const imageUrl = user?.image 
    ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) 
    : '';

  const initials = React.useMemo(() => {
    if (fallbackText) return fallbackText;
    if (!user?.name) return 'U';
    const parts = user.name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user, fallbackText]);

  return (
    <Avatar className={className} {...props}>
      <AvatarImage src={imageUrl} alt={user?.name || 'User'} className="object-cover" />
      <AvatarFallback 
        className={cn(
          "bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white font-bold",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
