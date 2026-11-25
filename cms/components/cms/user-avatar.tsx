import { toneClasses, type Tone } from "@/components/cms/icon-chip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function initials(name: string | null, email: string) {
  const source = name?.trim() || email
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// Initials avatars get a pale colour that stays the same for the same person.
const avatarTones: Tone[] = ["blue", "orange", "teal", "violet", "amber", "green"]

function toneFor(email: string) {
  let hash = 0
  for (const char of email) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return avatarTones[hash % avatarTones.length]
}

export function UserAvatar({
  name,
  email,
  image,
  size,
}: {
  name: string | null
  email: string
  image: string | null
  size?: "sm" | "default" | "lg"
}) {
  return (
    <Avatar size={size}>
      {/* Google profile photos refuse requests that send a Referer header. */}
      {image && <AvatarImage src={image} alt="" referrerPolicy="no-referrer" />}
      <AvatarFallback className={cn("font-medium", toneClasses[toneFor(email)])}>
        {initials(name, email)}
      </AvatarFallback>
    </Avatar>
  )
}
