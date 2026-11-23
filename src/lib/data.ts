export type NavLink = {
  label: string;
  href: string;
  soon?: boolean;
};

export const navLinks: NavLink[] = [
  { label: "CSSS", href: "/csss" },
  { label: "OPAM", href: "/opam" },
  { label: "SSB", href: "/ssb" },
  { label: "Dossier", href: "/dossier" },
  { label: "Mentorship", href: "#mentorship", soon: true },
];
