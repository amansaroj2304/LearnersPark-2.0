import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-full.png"
      alt="Learners Park"
      width={325}
      height={75}
      priority
      className={className}
    />
  );
}
