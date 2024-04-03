"use client"

import { zodResolver } from '@hookform/resolvers/zod';
// import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { PostValidation, CommentValidation } from '@/lib/validations/post';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from 'zod'
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { createPost } from '@/lib/actions/post.actions';


interface Props { 
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    }
    btnTitle: string;
}



function CreatePost({ userId } : {userId: string}) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        await createPost({ 
            text: values.post, 
            author: userId,
            communityId: null,
            path: pathname
        });

        router.push('/')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>Content</FormLabel>
                                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                    <Textarea
                                        rows={4}
                                        {...field}
                                        placeholder="Say what you want to say..."
                                        className="resize-none"
                                    />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500 hover:#7878a3">Create Post</Button>
            </form>
        </Form>
    )
}

export default CreatePost;