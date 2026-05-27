import DataLoader from 'dataloader';
import { postService } from '../../services/content/post.service.js';
import { storyService } from '../../services/content/story.service.js';
import { commentService } from '../../services/interactions/comment.service.js';

export const createDataLoaders = (currentUserId?: string) => {
  const postLikesCountLoader = new DataLoader<string, number>(async (postIds) => {
    const map = await postService.getLikesCountBatch(postIds as string[]);
    return postIds.map(id => map.get(id) || 0);
  });

  const postCommentsCountLoader = new DataLoader<string, number>(async (postIds) => {
    const map = await postService.getCommentCountsBatch(postIds as string[]);
    return postIds.map(id => map.get(id) || 0);
  });

  const postSavesCountLoader = new DataLoader<string, number>(async (postIds) => {
    const map = await postService.getSaveCountsBatch(postIds as string[]);
    return postIds.map(id => map.get(id) || 0);
  });

  const postIsLikedLoader = new DataLoader<string, boolean>(async (postIds) => {
    if (!currentUserId) return postIds.map(() => false);
    const likedSet = await postService.getIsLikedBatch(postIds as string[], currentUserId);
    return postIds.map(id => likedSet.has(id));
  });

  const postIsSavedLoader = new DataLoader<string, boolean>(async (postIds) => {
    if (!currentUserId) return postIds.map(() => false);
    const savedSet = await postService.getIsSavedBatch(postIds as string[], currentUserId);
    return postIds.map(id => savedSet.has(id));
  });

  const storyViewCountLoader = new DataLoader<string, number>(async (storyIds) => {
    const map = await storyService.getViewCountsBatch(storyIds as string[]);
    return storyIds.map(id => map.get(id) || 0);
  });

  const storyHasViewedLoader = new DataLoader<string, boolean>(async (storyIds) => {
    if (!currentUserId) return storyIds.map(() => false);
    const viewedSet = await storyService.getHasViewedBatch(storyIds as string[], currentUserId);
    return storyIds.map(id => viewedSet.has(id));
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