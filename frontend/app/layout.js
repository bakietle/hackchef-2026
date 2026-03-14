 
import './globals.css'
 
export const metadata = {
  title: 'HackChef — your meal mama',
  description: 'AI-powered weekly meal planning for students',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
 
