import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Analytics from "./Analytics";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "Sam Evans",
    description:
      "Sam Evans is an incoming Dartmouth freshman building across language, software, learning, and startups.",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: "Sam Evans",
      description:
        "words - software - startups",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Sam Evans" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sam Evans",
      description:
        "words - software - startups",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
