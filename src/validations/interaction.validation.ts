import { z } from 'zod';
import * as zod from './validation.js';

const idSchema = (field: string) => z.object({ [field]: zod.byId(field) });

// Post interactions
export const LikePostSchema = idSchema('postId');
export const UnlikePostSchema = idSchema('postId');
export const SavePostSchema = idSchema('postId');
export const UnsavePostSchema = idSchema('postId');

// Comment interactions
export const LikeCommentSchema = idSchema('commentId');
export const UnlikeCommentSchema = idSchema('commentId');

// Follow interactions
export const FollowUserSchema = idSchema('userId');
export const UnfollowUserSchema = idSchema('userId');
export const CancelFollowRequestSchema = idSchema('userId');

// Follow request interactions
export const AcceptFollowRequestSchema = idSchema('requesterId');
export const RejectFollowRequestSchema = idSchema('requesterId');

// Block interactions
export const BlockUserSchema = idSchema('userId');
export const UnblockUserSchema = idSchema('userId');

// Notification interactions
export const MarkNotificationReadSchema = idSchema('notificationId');
export const MarkAllNotificationsReadSchema = z.object({});