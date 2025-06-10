import { Manrope } from "next/font/google";
import "../globals.css";
import Navbar1 from "./components/Navbar1";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from "./components/Loader";
import ClientProvider from "./ClientProvider";
import RedirectHandler from "./components/RedirectHandler";
import { Toaster } from "@/components/ui/sonner";
import { getProfile } from "../api-integeration/auth";

const manropeSans = Manrope({
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "T shirt Ecommerce website",
  description: "T shirt Ecommerce website",
};

export default async function RootLayout({ children }) {

  const user = await getProfile();

  return (
    <html lang="en">
      <body
        className={`${manropeSans.variable} antialiased`}
      >
        <ClientProvider>
          <Loader />
          <RedirectHandler />
          <Navbar1 user={user?.data} />
          <Toaster
            position="top-center"
            richColors
            expand
          />
          <main className="main">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}
