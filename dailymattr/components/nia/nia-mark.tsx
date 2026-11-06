import Image from "next/image"

import { cn } from "cn"

/** The radial blue→violet gradient behind every NIA avatar in the design. */
const markGradient =
  "radial-gradient(circle at 30% 25%, #7fa6ff 0%, #5c90ff 22.5%, #3979ff 45%, #5b6bf8 72.5%, #7c5cf0 100%)"

/**
 * Circular NIA avatar with its violet glow. `size` is the circle diameter and
 * `iconSize` the sparkle inside, both in px, exactly as the Figma nodes specify.
 */
export function NiaMark({
  size,
  iconSize,
  className,
}: {
  size: number
  iconSize: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full drop-shadow-[0px_0px_8px_rgba(124,92,240,0.7)]",
        className
      )}
      style={{ width: size, height: size, backgroundImage: markGradient }}
    >
      <Image
        src={iconSize >= 18 ? "/nia/spark-18.svg" : "/nia/spark-14.svg"}
        alt=""
        width={iconSize}
        height={iconSize}
        className="block"
      />
    </span>
  )
}
