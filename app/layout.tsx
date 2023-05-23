import "./globals.css";

export const metadata = {
  title: "Globale-Ultraglobe",
  description: "ThreeJS-enabled globe with Google Maps 3D Tiles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
