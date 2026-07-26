import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://evolvepsychiatry.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
