// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapProvider from './BootstrapProvider'; // Adjust the path if needed

export const metadata = {
  title: 'My App',
  description: 'Next.js app with Bootstrap',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BootstrapProvider>
          {children}
        </BootstrapProvider>
      </body>
    </html>
  );
}
