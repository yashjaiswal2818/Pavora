import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKit, kits } from "@/lib/kits";
import { KitShell } from "@/components/kit/KitShell";

export function generateStaticParams() {
  return kits.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return { title: "Theme kit — Pavora" };
  return {
    title: `${kit.name} — Pavora theme kit`,
    description: kit.tagline,
  };
}

export default async function ThemeDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) notFound();
  return <KitShell kit={kit} />;
}
