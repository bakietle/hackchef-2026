import './globals.css'
export const metadata = {
  title: 'HackChef — ur meal mama',
  description: 'AI-powered weekly meal planning',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
