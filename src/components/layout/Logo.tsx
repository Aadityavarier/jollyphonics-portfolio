import Image from "next/image";
import { LOGO_SIZE, LOGO_SRC, brand } from "@/content/brand";

interface Props {
  className?: string;
  preload?: boolean;
}

export function Logo({ className = "h-10 w-auto", preload = false }: Props) {
  return (
    <Image
      src={LOGO_SRC}
      alt={brand.name}
      width={LOGO_SIZE.width}
      height={LOGO_SIZE.height}
      preload={preload}
      unoptimized={LOGO_SRC.endsWith(".svg")}
      className={className}
    />
  );
}
