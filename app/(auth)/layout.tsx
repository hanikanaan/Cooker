import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'

export const metadata = {
    title: 'Finish Signing Up',
    description: 'Complete your profile to comment, upvote, and reply on recipes.'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {children: React.ReactNode}
) {
    return (
        // <div className="h-screen flex items-center justify-center">
            <ClerkProvider>
                <html lang="en">
                    <body className={`${inter.className} bg-gray-1`}>
                        <div className="w-full flex justify-center items-center min-h-screen">
                            {children}
                        </div>
                    </body>
                </html>
            </ClerkProvider>
        // </div>
    )
}