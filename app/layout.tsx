import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "DIM TEAM | Farbara i veleprodaja",
  description: "DIM TEAM maloprodaja i veleprodaja boja, lakova, fasada i alata."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr">
      <body>
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
