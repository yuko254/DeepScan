import DataLoader from 'dataloader';
import { postService } from '../../services/content/post.service.js';
import { storyService } from '../../services/content/story.service.js';
import { commentService } from '../../services/interactions/comment.service.js';

export const createDataLoaders = (currentUserId?: string) => {
  const postLikesCountLoader = new DataLoader<string, number>(async (postIds) => {
    return postService.getLikesCountBatch(postIds as string[]);
  });

  const postCommentsCountLoader = new DataLoader<string, number>(async (postIds) => {
    return postService.getCommentCountsBatch(postIds as string[]);
  });

  const postSavesCountLoader = new DataLoader<string, number>(async (postIds) => {
    return postService.getSaveCountsBatch(postIds as string[]);
  });

  const postIsLikedLoader = new DataLoader<string, boolean>(async (postIds) => {
    if (!currentUserId) return postIds.map(() => false);
    return postService.getIsLikedBatch(postIds as string[], currentUserId);
  });

  const postIsSavedLoader = new DataLoader<string, boolean>(async (postIds) => {
    if (!currentUserId) return postIds.map(() => false);
    return postService.getIsSavedBatch(postIds as string[], currentUserId);
  });

  const storyViewCountLoader = new DataLoader<string, number>(async (storyIds) => {
    return storyService.getViewCountsBatch(storyIds as string[]);
  });

  const storyHasViewedLoader = new DataLoader<string, boolean>(async (storyIds) => {
    if (!currentUserId) return storyIds.map(() => false);
    return storyService.getHasViewedBatch(storyIds as string[], currentUserId);
  });

  const commentIsLikedLoader = new DataLoader<string, boolean>(async (commentIds) => {
    if (!currentUserId) return commentIds.map(() => false);
    return commentService.getIsLikedBatch(commentIds as string[], currentUserId);
  });

  const commentLikesCountLoader = new DataLoader<string, number>(async (commentIds) => {
    return commentService.getLikeCountsBatch(commentIds as string[]);
  });

  return {
    post: {
      likesCount: postLikesCountLoader,
      commentsCount: postCommentsCountLoader,
      savesCount: postSavesCountLoader,
      isLiked: postIsLikedLoader,
      isSaved: postIsSavedLoader
    },
    story: {
      viewCount: storyViewCountLoader,
      hasViewed: storyHasViewedLoader
    },
    comment: {
      isLiked: commentIsLikedLoader,
      likesCount: commentLikesCountLoader
    }
  };
};

export type DataLoaders = ReturnType<typeof createDataLoaders>;