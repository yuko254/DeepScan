import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';

// ─── Chat ───
export const ChatIdParamSchema = z.strictObject({
  chat_id: IdSchema.uuid('chatId'),
});

export const MessageIdParamSchema = z.strictObject({
  message_id: IdSchema.uuid('messageId'),
});

// ─── Content ───
export const ContentIdParamSchema = z.strictObject({
  content_id: IdSchema.uuid('contentId'),
});

export const PostIdParamSchema = z.strictObject({
  post_id: IdSchema.uuid('postId'),
});

export const StoryIdParamSchema = z.strictObject({
  story_id: IdSchema.uuid('storyId'),
});

export const ScanIdParamSchema = z.strictObject({
  scan_id: IdSchema.uuid('scanId'),
});

// ─── Interactions ───
export const ReportIdParamSchema = z.strictObject({
  report_id: IdSchema.uuid('reportId'),
});

export const CommentIdParamSchema = z.strictObject({
  comment_id: IdSchema.uuid('commentId'),
});

export const FollowRequestIdParamSchema = z.strictObject({
  follow_request_id: IdSchema.number('followRequestId'),
});

// ─── Locations ───
export const LocationIdParamSchema = z.strictObject({
  location_id: IdSchema.uuid('locationId')
});

export const CountryIdParamSchema = z.strictObject({
  country_id: IdSchema.number('countryId')
});

export const CityIdParamSchema = z.strictObject({
  city_id: IdSchema.number('cityId')
});

// ─── Notification ───
export const NotificationIdParamSchema = z.strictObject({
  notification_id: IdSchema.uuid('NotificationId')
});

// ─── References ───
export const CategoryIdParamSchema = z.strictObject({
  category_id: IdSchema.number('categoryId'),
});

export const TagIdParamSchema = z.strictObject({
  tag_id: IdSchema.number('tagId'),
});

// ─── User ───
export const ProfileIdParamSchema = z.strictObject({
  profile_id: IdSchema.uuid('profileId'),
});

export const UserIdParamSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
});

export const RoleIdParamSchema = z.strictObject({
  role_id: IdSchema.number('roleId'),
});