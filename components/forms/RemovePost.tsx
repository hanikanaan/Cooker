"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { removePost } from "@/lib/actions/post.actions";

interface Props { 
    postId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isComment?: boolean;
}

function RemovePost({
    postId,
    currentUserId,
    authorId,
    parentId,
    isComment
} : Props ) {
    const path = usePathname();
    const router = useRouter();

    if (currentUserId !== authorId) return null;

    return (
        <Image 
            src='/assets/delete.svg'
            alt='delete'
            width={24}
            height={24}
            className='cursor-point object-contain'
            onClick={
                async () => {
                    await removePost(
                        JSON.parse(postId),
                        path
                    );
                    if (!parentId || !isComment ) {
                        router.push("/");
                    };
                }
            }
        />
    )
}

export default RemovePost;