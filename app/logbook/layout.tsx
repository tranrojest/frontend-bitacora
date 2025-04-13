import TopBar from "@/components/appBar/AppBar";
import { Box, Container } from "@mui/material";
import { AlertProvider } from "@/context/AlertContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AlertProvider>
        <TopBar />
        {children}
      </AlertProvider>
    </>
  );
}
