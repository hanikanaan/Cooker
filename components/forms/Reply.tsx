"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CommentValidation } from '@/lib/validations/post';
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import * as z from 'zod'
import Image from 'next/image';
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { addReplyToPost } from '@/lib/actions/post.actions';


interface Props {
    postId: string,
    currentUserImg: string,
    currentUserId: string
}

const Reply = ({
    postId, 
    currentUserImg, 
    currentUserId
} : Props) => {

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addReplyToPost(
            postId, 
            values.comment, 
            JSON.parse(currentUserId),
            pathname
        );

        form.reset();
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="reply-form"
            >
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-3 w-full'>
                            <FormLabel>
                                <Image 
                                    src={currentUserImg}
                                    alt="Profile picture"
                                    height={48}
                                    width={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    {...field}
                                    placeholder="Comment..."
                                    className="nofocus text-light-1 outline-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="reply-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Reply;