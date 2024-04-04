"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
    pageNumber: number;
    isNext: boolean;
    path: string;
}

function Pagination({ pageNumber, isNext, path } : Props ) {
    const router = useRouter();

    const handleNav = ( type : string ) => {
        let nextPage = pageNumber;
        
        if ( type === 'prev' ) {
            nextPage = Math.max(1, pageNumber - 1);
        } else if ( type === 'next' ) {
            nextPage = pageNumber + 1;
        }
        
        if ( nextPage > 1 ) {
            router.push(`/${path}?page=${nextPage}`);
        } else {
            router.push(`${path}`)
        }
    };

    if ( !isNext && pageNumber === 1 ) return null;

    return (
        <div className="pagination">
            <Button 
                onClick={() => handleNav("prev")}
                disabled={pageNumber === 1}
                className='!text-small-regular text-light-2'
            >
                Previous
            </Button>
            <p className='text-small-semibold text-light-1'>{pageNumber}</p>
            <Button
                onClick={() => handleNav("next")}
                disabled={!isNext}
                className='!text-small-regular text-light-2'
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination;