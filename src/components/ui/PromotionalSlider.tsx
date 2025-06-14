import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PromotionalSlide {
  id: number;
  image: string;
  alt: string;
}

interface PromotionalSliderProps {
  slides: PromotionalSlide[];
  interval?: number;
  className?: string;
}

const PromotionalSlider = ({
  slides,
  interval = 5000,
  className,
}: PromotionalSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused || slides.length <= 1) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, interval);

    return () => clearInterval(intervalId);
  }, [api, isPaused, slides.length, interval]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full overflow-hidden rounded-xl">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105 shadow-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-gray-900/80 text-foreground hover:bg-gray" />
        <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-gray-900/80 text-foreground hover:bg-gray" />

        <CarouselDots
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
          dotClassName="bg-background/50 hover:bg-background/80"
          activeDotClassName="bg-primary shadow-md"
        />
      </Carousel>
    </div>
  );
};

export default PromotionalSlider;
