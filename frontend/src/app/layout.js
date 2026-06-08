import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "JanSeva AI - Government Schemes Portal",
  description: "Search 500+ government schemes in your language, get instant AI answers, and apply - all in one place.",
  keywords: "government schemes, JanSeva, AI, India, student scholarship, farmers, healthcare, startup seed fund",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorantGaramond.variable}`}>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
