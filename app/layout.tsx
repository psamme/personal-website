import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title: "Sam Evans — Builder",
    description:
      "Sam Evans is an incoming Dartmouth freshman building across language, software, learning, and startups.",
    openGraph: {
      title: "Sam Evans — Builder",
      description:
        "Words, spelling, software, learning, and the projects that connect them.",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "Sam Evans — Builder" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sam Evans — Builder",
      description:
        "Words, spelling, software, learning, and the projects that connect them.",
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
      <body>{children}</body>
    </html>
  );
}
