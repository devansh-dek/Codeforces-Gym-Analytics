import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codeforces Gym Analytics - Contest Replay Dashboard",
  description: "Visualize and analyze Codeforces Gym contests with timeline replay, moment detection, and livestream-optimized UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
      </body>
    </html>
  );
}
