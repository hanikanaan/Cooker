import * as z from 'zod';

export const PostValidation = z.object({
    post: z.string().min(8),
    accountId: z.string().min(1)
})

export const CommentValidation = z.object({
    comment: z.string().min(2)
})