import Image from "next/image";
import Link from "next/link";
import RemovePost from "../forms/RemovePost";
import Popup from 'reactjs-popup';


interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    }
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[];
    isComment?: boolean;
}

const PostCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
}: Props) => {

    return (
        <article className={`flex w-full flex-col rounded ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                                src={author.image} 
                                alt="profile picture" 
                                fill 
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div 
                            className="thread-card_bar"
                        />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2" style={{whiteSpace: "pre-wrap"}}>
                            {content}
                        </p>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image 
                                    src="/assets/heart.svg" 
                                    alt="heart" 
                                    width={24} 
                                    height={24} 
                                    className="cursor-pointer object-contain"
                                />
                                <Link href={`/post/${id}`}>
                                    <Image 
                                        src="/assets/reply.svg" 
                                        alt="heart" 
                                        width={28} 
                                        height={28} 
                                        className="cursor-pointer object-contain"
                                    />
                                </Link>
                                {/* <Image 
                                    src="/assets/repost.svg" 
                                    alt="heart" 
                                    width={24} 
                                    height={24} 
                                    className="cursor-pointer object-contain"
                                /> */}
                                { currentUserId === author.id ? (
                                        <RemovePost 
                                            postId={JSON.stringify(id)}
                                            currentUserId={currentUserId}
                                            authorId={author.id}
                                            parentId={parentId}
                                            isComment={isComment}
                                        />
                                    ) : (
                                        <>
                                        </>
                                    )
                                }
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/post/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} Replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostCard;