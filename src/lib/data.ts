export type NavLink = {
  label: string;
  href: string;
  soon?: boolean;
};

export const navLinks: NavLink[] = [
  { label: "CSSS", href: "/csss" },
  { label: "OPAM", href: "/opam" },
  { label: "PPDT", href: "#ppdt", soon: true },
  { label: "Mentorship", href: "#mentorship", soon: true },
];
