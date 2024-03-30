"use client"

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Bottombar() {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    
                    return(
                        <div className="text-gray-1">
                            <Link 
                                href={link.route}
                                key={link.label}
                                className={`leftsidebar_link ${isActive && 'bg-white'}`}
                            >
                                <Image 
                                    src={link.imgURL} 
                                    alt={link.label} 
                                    width={24} 
                                    height={24} 
                                />
                                <p className=" text-subtle-medium text-dark-1 max-sm:hidden">
                                    {link.label.split(/\s+./)[0]}
                                </p>
                            </Link>
                    </div>
                )})}
            </div>
        </section>
    )
}

export default Bottombar;