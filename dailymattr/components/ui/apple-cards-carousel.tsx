"use client";
// Adapted from Aceternity UI "Apple Cards Carousel"
// (ui.aceternity.com/components/apple-cards-carousel): theme tokens instead of fixed
// colours, lucide icons, and the dailymattr template-card look (tag, title, CTA).
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
  className?: string;
}

export type CarouselCard = {
  /** Image URL; leave empty for the placeholder fill. */
  src?: string;
  title: string;
  category: string;
  /** Label of the pill in the bottom-right corner. */
  cta?: string;
  /** Shown in the expanded modal. */
  content: React.ReactNode;
  /** Optional vertical (9:16) media; the modal then shows it edge to edge beside the text. */
  media?: React.ReactNode;
};


export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0, className }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollLeft = initialScroll;
  }, [initialScroll]);

  // The row stays where the user left it after a card closes (no auto-scroll).
  const handleCardClose = (index: number) => setCurrentIndex(index);

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className={cn("relative w-full", className)}>
        {/* Row clips the cards at its rounded edges (Figma radius 16); swipe/scroll to browse */}
        <div
          className="flex w-full overflow-x-scroll overflow-y-hidden overscroll-x-contain scroll-smooth rounded-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
        >
          <div className="flex flex-row justify-start gap-3">
            {items.map((item, index) => (
              // Fade only — a vertical slide here made the row scroll up and down.
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index, ease: "easeOut" }}
                key={"card" + index}
                className="rounded-[16px]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: CarouselCard;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    document.body.style.overflow = open ? "hidden" : "auto";
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => {
    if (open) handleClose();
  });

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Centred, at most 85% of the viewport height; scrolls (scrollbar hidden) only if it must */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-foreground/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className={cn(
                "relative z-[60] max-h-[85svh] w-full overflow-y-auto rounded-2xl bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                card.media ? "flex max-w-3xl flex-col sm:w-auto sm:flex-row" : "max-w-2xl p-5 md:p-7"
              )}
            >
              {card.media && (
                // Inset with rounded corners, like a phone screen, rather than edge to edge.
                <div className="shrink-0 p-3 pb-0 sm:pr-0 sm:pb-3">
                  <div className="mx-auto aspect-[9/16] h-[50svh] overflow-hidden rounded-[20px] bg-placeholder sm:h-[min(78svh,620px)]">
                    {card.media}
                  </div>
                </div>
              )}
              <div className={cn(card.media && "flex flex-col p-5 sm:w-80 md:p-7")}>
                <Button
                  size="icon-sm"
                  className={cn(
                    "flex shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/85",
                    card.media ? "absolute top-3 right-3 z-10" : "sticky top-4 right-0 ml-auto"
                  )}
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <X />
                </Button>
                <motion.p
                  layoutId={layout ? `category-${card.title}` : undefined}
                  className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                >
                  {card.category}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${card.title}` : undefined}
                  className="mt-2 text-xl font-semibold text-foreground md:text-3xl"
                >
                  {card.title}
                </motion.p>
                <div className={cn("pt-5", card.media && "flex flex-1 flex-col")}>{card.content}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="group relative z-10 flex h-[280px] w-[200px] flex-col items-start justify-between overflow-hidden rounded-[16px] bg-placeholder text-left md:h-80 md:w-[228px]"
      >
        {/* Portrait card, Figma proportion 299:420 kept at a 320px height */}
        <div className="pointer-events-none absolute inset-0 z-30 bg-linear-to-b from-foreground/55 via-transparent to-transparent" />
        <div className="relative z-40 p-3">
          <motion.p
            layoutId={layout ? `category-${card.title}` : undefined}
            className="inline-flex rounded-md bg-foreground/40 px-2 py-1 text-[9px] font-medium tracking-wider text-background uppercase backdrop-blur-sm"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-3 max-w-xs text-base leading-snug font-normal [text-wrap:balance] text-background md:text-lg"
          >
            {card.title}
          </motion.p>
        </div>
        {card.cta && (
          <span className="relative z-40 m-3 inline-flex items-center gap-2 self-end rounded-lg bg-background py-1.5 pr-1.5 pl-2.5 text-xs font-medium text-foreground transition-transform group-hover:-translate-y-0.5">
            {card.cta}
            <span className="flex size-5 items-center justify-center rounded-[5px] bg-foreground/10 text-foreground">
              <ArrowUpRight className="size-3" />
            </span>
          </span>
        )}
        {card.src && (
          <BlurImage
            src={card.src}
            alt={card.title}
            className="absolute inset-0 z-10 object-cover"
          />
        )}
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  src,
  className,
  alt,
}: {
  src: string;
  className?: string;
  alt?: string;
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      // A cached image can finish before hydration attaches onLoad, so check on mount too.
      ref={(img) => {
        if (img?.complete && img.naturalWidth > 0) setLoading(false);
      }}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt ?? ""}
    />
  );
};
