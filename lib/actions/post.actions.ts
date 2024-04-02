"use server"

import { connectToDb } from "../mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { connect } from "http2";
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createPost({
    text, author, communityId, path
} : Params) {

    try {
        connectToDb();

        const createdPost = await Post.create({
            text,
            author,
            community: null
        });
    
        await User.findByIdAndUpdate(author, {
            $push: { posts: createdPost._id }
        })
    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating post: ${error.message}`)
    }

}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDb();

    const skips = (pageNumber - 1) * pageSize

    const allPosts = Post.find({ parentId: { $in: [null, undefined]}})
        .sort({ createdAt: 'desc' })
        .skip(skips).limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({ 
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })
    
    const totalPostCount = await Post.countDocuments({ parentId: { $in: [null, undefined] }})

    const posts = await allPosts.exec();

    const isNext = totalPostCount > skips + posts.length;

    return { posts, isNext }
}

export async function fetchPostById(id: string) {
    connectToDb();
    
    try {
        const post = await Post.findById(id).populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        }).populate({
            path: 'children',
            populate:[
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                }, 
                {
                    path: 'children',
                    model: 'Post',
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return post;
    } catch(error: any) {
        throw new Error(`Error fetching post: ${error.message}`);
        
    }
}

export async function addReplyToPost(
    postId: string,
    replyText: string,
    userId: string,
    path: string
) {
    connectToDb();
    
    try {
        const originalPost = await Post.findById(postId);
        
        if (!originalPost) { 
            throw new Error("Post not found");
        }

        const replyPost = new Post({
            text: replyText,
            author: userId,
            parentId: postId
        })
        const savedReplyPost = await replyPost.save();

        originalPost.children.push(savedReplyPost._id);

        await originalPost.save();

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error in replying to post: ${error.message}`);
    }
}

async function fetchThread(id: string): Promise<any[]> {
    const childPosts = await Post.find({ parentId: id });

    const thread = []
    for (const post of childPosts) {
        const replies = await fetchThread(post._id);
        thread.push(post, ...replies);
    }
    return thread;
}


export async function removePost(id: string, path: string) {
    try {
        connectToDb();
        const mainPost = await Post.findById(id).populate("author community");
        if (!mainPost) {
            throw new Error("Post not found");
        }
        const threads = await fetchThread(id);

        const threadReplyIds = [
            id,
            ...threads.map((thread) => thread._id)
        ];

        const uniqueAuthorIds = new Set(
            [
                ...threads.map((thread) => thread.author?._id?.toString()),
                mainPost.author?._id?.toString()
            ].filter((id) => id != undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...threads.map((thread) => thread.community?._id?.toString()),
                mainPost.community?._id?.toString()
            ].filter((id) => id != undefined)
        );

        await Post.deleteMany({ _id: { $in: threadReplyIds }});
        
        await User.updateMany(
            {_id: {$in: Array.from(uniqueAuthorIds)}},
            {$pull: {threads: {$in: threadReplyIds}}}
        );

        await Community.updateMany(
            {_id: {$in: Array.from(uniqueCommunityIds)}},
            {$pull: {threads: {$in: threadReplyIds}}}
        );

        revalidatePath(path);

    } catch (error: any) { 
        throw new Error(`Error in deleting the post: ${error.message}`);
    }
}
