import { Manrope } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner"
import NextTopLoader from "nextjs-toploader";
import ClientProvider from "./ClientProvider";


const manropeSans = Manrope({
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Ecommerce Admin Panel",
  description: "Ecommerce Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manropeSans.variable} antialiased`}
      >
        <ClientProvider>
          <NextTopLoader
            zIndex={99}
            color={"var(--accent)"}
            shadow={false}
            showSpinner={false}
            id="next-progress"
          />
          <Toaster
            position="top-center"
            richColors
            expand
          />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
