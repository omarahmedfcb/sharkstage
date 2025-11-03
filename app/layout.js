import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/Chatbot";
import StoreProvider from "./StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SharkStage",
  description: "Business investment platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {children}
          <Chatbot />
        </StoreProvider>
      </body>
    </html>
  );
}
