import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { GetStartedDialog } from "@/components/auth/get-started-dialog";
import { Container } from "@/components/ui/container";
import {
  DiamondShape,
  HudRing,
  RankInsignia,
  TopoLines,
  TripleChevron,
} from "@/components/ui/decor";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="get-started"
      className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#f3f4eb_0%,#ecefdf_50%,#e4e7d8_100%)]"
    >
      <HeroBackdrop />
      <MobileVisual />
      <RightVisual />

      <Container className="relative z-20">
        <div className="flex max-w-[46rem] flex-col py-10 sm:py-16 lg:min-h-[760px] lg:justify-center lg:py-24">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-[2px] w-10 shrink-0 bg-crimson sm:w-16" />
            <p className="text-[0.7rem] font-semibold tracking-[0.25em] text-ink/80 uppercase sm:text-sm">
              Discipline
              <Dot />
              Guidance
              <Dot />
              Success
            </p>
          </div>

          <h1 className="mt-6 text-[clamp(2.3rem,5.6vw,4.75rem)] leading-[1.06] font-medium tracking-[-0.03em] text-ink">
            One Destination for
            <span className="mt-1 block font-extrabold tracking-[-0.04em] text-crimson">
              Complete SSB Preparation
            </span>
          </h1>

          <div className="mt-5 flex items-center gap-6 sm:mt-7">
            <p className="text-lg font-bold tracking-[0.2em] uppercase text-ink sm:text-2xl">
              NDA
              <Dot variant="exam" />
              CDS
              <Dot variant="exam" />
              AFCAT
            </p>
            <span
              aria-hidden
              className="hidden h-px w-24 bg-ink/30 sm:block lg:w-32"
            />
          </div>

          <p className="mt-5 text-xl font-normal text-ink sm:mt-7 sm:text-[1.6rem]">
            Start your SSB journey for free
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <GetStartedDialog
              className={buttonClasses(
                "primary",
                "lg",
                "w-full gap-2.5 sm:w-auto sm:min-w-[17.5rem]",
              )}
            >
              Get Started for Free
              <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.6} />
            </GetStartedDialog>
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <Link
                href="/csss"
                className={buttonClasses(
                  "outline",
                  "lg",
                  "w-full gap-2 sm:w-auto sm:min-w-[13.5rem]",
                )}
              >
                <FileText className="h-5 w-5" strokeWidth={1.8} />
                CSSS Test Free
              </Link>
              <Link
                href="#opam"
                className={buttonClasses(
                  "outline",
                  "lg",
                  "w-full gap-2 sm:w-auto sm:min-w-[13.5rem]",
                )}
              >
                <FileText className="h-5 w-5" strokeWidth={1.8} />
                OPAM Test Free
              </Link>
            </div>
          </div>

          <MicroNav className="mt-12 lg:hidden" />
        </div>
      </Container>

      <MicroNav className="pointer-events-none absolute bottom-9 left-[66px] z-20 hidden lg:flex" />

      <FloatingContact />
    </section>
  );
}

function Dot({ variant = "eyebrow" }: { variant?: "eyebrow" | "exam" }) {
  if (variant === "exam") {
    return (
      <span aria-hidden className="mx-3 inline-block align-middle text-crimson">
        •
      </span>
    );
  }
  return (
    <span aria-hidden className="mx-2 inline-block align-middle text-crimson">
      •
    </span>
  );
}

function MicroNav({ className }: { className?: string }) {
  const items = ["Learn", "Practice", "Improve", "Succeed"];
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span aria-hidden className="hidden h-12 w-[3px] bg-crimson lg:block" />
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold tracking-[0.25em] text-ink/60 uppercase sm:text-xs">
        {items.map((item, i) => (
          <Fragment key={item}>
            {i > 0 && <span aria-hidden className="h-3.5 w-px bg-ink/25" />}
            <span>{item}</span>
          </Fragment>
        ))}
      </p>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <TopoLines className="absolute top-[6%] left-[4%] hidden h-[68%] w-[58%] text-sage-deep/20 md:block" />

      <Image
        src="/fighter-jets.png"
        alt=""
        width={335}
        height={140}
        priority
        className="absolute top-[7%] left-[38%] hidden w-[22rem] opacity-60 mix-blend-multiply md:block"
      />

      <Image
        src="/mountains.png"
        alt=""
        width={380}
        height={120}
        className="absolute bottom-[26%] left-[24%] w-[22rem] opacity-40 mix-blend-multiply [mask-image:linear-gradient(to_right,transparent,#000_30%,#000_70%,transparent)] md:w-[26rem]"
      />

      <Image
        src="/india-gate.png"
        alt=""
        width={800}
        height={160}
        className="absolute bottom-0 left-0 w-[60%] opacity-55 mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_82%,transparent)] lg:w-[52%]"
      />

      <span className="absolute bottom-[18%] left-[34%] hidden h-px w-[42%] rotate-[-8deg] bg-white/70 lg:block" />
      <span className="absolute bottom-[26%] left-[38%] hidden h-px w-[46%] rotate-[-8deg] bg-white/60 lg:block" />
    </div>
  );
}

function RightVisual() {
  return (
    <div className="absolute inset-y-0 right-0 z-10 hidden w-[46%] lg:block">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-[92%] bg-[linear-gradient(150deg,#a9b08f_0%,#8a9271_42%,#6d7854_100%)] opacity-85 [clip-path:polygon(44%_0,100%_0,100%_100%,14%_100%)]" />
        <TopoLines className="absolute top-0 right-0 h-full w-full text-white/10" />
        <HudRing className="absolute top-[40%] left-[38%] h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 text-sage/50" />
      </div>

      <DiamondShape className="absolute top-[6%] left-[-6%] h-[92%] w-auto text-crimson-shape" />

      <TripleChevron className="absolute top-[22%] right-[4%] h-[13%] w-auto text-sage/60" />
      <RankInsignia className="absolute top-[47%] right-[15%] h-[15%] w-auto text-sage-deep/45" />

      <div className="absolute bottom-0 right-0 h-full">
        <div className="relative h-full aspect-[707/856]">
          <Image
            src="/soldier-cutout.png"
            alt="Cadet in ceremonial uniform with sword"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain object-bottom drop-shadow-[-10px_10px_24px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </div>
  );
}

function MobileVisual() {
  return (
    <div
      aria-hidden
      className="relative isolate h-[360px] overflow-hidden sm:h-[440px] lg:hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3f4eb_0%,#e4e7d8_100%)]" />
      <TopoLines className="absolute top-0 left-1/3 h-[70%] w-[80%] text-sage-deep/25" />

      <Image
        src="/fighter-jets.png"
        alt=""
        width={335}
        height={140}
        priority
        className="absolute top-8 left-6 w-40 opacity-60 mix-blend-multiply sm:w-52"
      />
      <Image
        src="/india-gate.png"
        alt=""
        width={800}
        height={160}
        className="absolute bottom-0 left-0 w-[80%] opacity-55 mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_80%,transparent)]"
      />

      <DiamondShape className="absolute top-[10%] left-1/2 h-[88%] w-auto -translate-x-1/2 text-crimson-shape" />

      <div className="absolute bottom-0 left-1/2 h-[94%] aspect-[707/856] -translate-x-1/2">
        <Image
          src="/soldier-cutout.png"
          alt="Cadet in ceremonial uniform with sword"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function FloatingContact() {
  return (
    <div className="fixed top-1/2 right-3 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-4">
      <a
        href="#whatsapp"
        aria-label="Chat on WhatsApp"
        className="transition-transform duration-200 hover:scale-110"
      >
        <Image
          src="/icon-whatsapp.png"
          alt=""
          width={60}
          height={60}
          className="h-12 w-12 sm:h-[60px] sm:w-[60px]"
        />
      </a>
      <a
        href="#telegram"
        aria-label="Join us on Telegram"
        className="transition-transform duration-200 hover:scale-110"
      >
        <Image
          src="/icon-telegram.png"
          alt=""
          width={60}
          height={60}
          className="h-12 w-12 sm:h-[60px] sm:w-[60px]"
        />
      </a>
    </div>
  );
}
