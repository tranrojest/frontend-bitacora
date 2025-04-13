// app/layout.tsx
import MuiProvider from "../MUI/MuiProvider";
import { SessionProvider } from "next-auth/react";
import RootWrapper from "./RootWrapper";
import { AlertProvider } from "@/context/AlertContext";

export const metadata = {
  title: "Bitácora Vehicular",
  description: "Gestión de vehículos y servicios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <MuiProvider>
            <AlertProvider>
              <RootWrapper>{children}</RootWrapper>
            </AlertProvider>
          </MuiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
