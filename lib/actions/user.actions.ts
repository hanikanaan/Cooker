"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose"
import Post from "../models/post.model";
import { FilterQuery, SortOrder } from "mongoose";


interface Params{
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}


export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params): Promise<void> {
    connectToDb();
    try{    
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDb();

        return await User.findOne({id: userId})//.populate({path: 'interests', model: "Interest"})
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}


export async function fetchUserPosts(userId: string) {
    try {
        connectToDb();
        const posts = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                populate: {
                    path: 'children',
                    model: Post,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            }
        )

        return posts
    } catch (error: any) {
        throw new Error("Failed to fetch user's posts");
        
    }
}

export async function fetchUserReplies(userId: string) {
    try {
        connectToDb();
        const replies = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                populate: {
                    path: 'children',
                    model: Post,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            }
        )

        return replies
    } catch (error: any) {
        throw new Error("Failed to fetch user's replies");
        
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 10, 
    sortBy = "desc"
} : {
    userId: string;
    searchString?: string;
    pageNumber? :number;
    pageSize?: number;
    sortBy?: SortOrder
}) {
    try {
        connectToDb();
        const skips = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() != '') {
            query.$or = [
                {username: { $regex: regex } },
                { name: { $regex: regex }}
            ]
        }

        const sortOptions = { createdAt: sortBy };
        const usersQuery = User.find(query).sort(sortOptions).skip(skips).limit(pageSize);
        const userCount = await User.countDocuments(query);
        const users = await usersQuery.exec();

        const isNext = userCount > skips + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
        
    }
}

export async function getNotifications(userId: string) {
    try {
        connectToDb();

        const userPosts = await Post.find({author: userId});

        const childPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children);
        }, [])
        
        const replies = await Post.find({
            _id: { $in: childPostIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;

    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`);
        
    }
}
