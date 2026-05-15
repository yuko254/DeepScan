import { type GraphQLResolveInfo, GraphQLScalarType, type GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: bigint; output: bigint; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
};

export enum BlockType {
  Media = 'media',
  Text = 'text'
}

export enum ContentType {
  Post = 'post',
  Scan = 'scan',
  Story = 'story'
}

export enum DeviceType {
  Android = 'android',
  Ios = 'ios',
  Web = 'web'
}

export enum FollowRequestStatus {
  Accepted = 'accepted',
  Pending = 'pending',
  Rejected = 'rejected'
}

export enum MediaType {
  Image = 'image',
  Video = 'video'
}

export type Mutation = {
  __typename?: 'Mutation';
  createBlock: Blocks;
  createCategory: Categories;
  createChat: Chats;
  createChatParticipant: Chat_Participants;
  createCity: Cities;
  createComment: Comments;
  createCommentLike: Comment_Likes;
  createContent: Contents;
  createCountry: Countries;
  createDeviceToken: Device_Tokens;
  createFollow: Follows;
  createFollowRequest: Follow_Requests;
  createLocation: Locations;
  createMessage: Messages;
  createPostLike: Post_Likes;
  createProfile: Profiles;
  createReport: Reports;
  createRole: Roles;
  createSavedPost: Saved_Posts;
  createStoryView: Story_Views;
  createTag: Tags;
  createUser: Users;
  deleteBlock: Blocks;
  deleteCategory: Categories;
  deleteChat: Chats;
  deleteChatParticipant: Chat_Participants;
  deleteCity: Cities;
  deleteComment: Comments;
  deleteCommentLike: Comment_Likes;
  deleteContent: Contents;
  deleteCountry: Countries;
  deleteDeviceToken: Device_Tokens;
  deleteFollow: Follows;
  deleteFollowRequest: Follow_Requests;
  deleteLocation: Locations;
  deleteMedia: Media;
  deleteMessage: Messages;
  deletePost: Posts;
  deletePostBlock: Post_Blocks;
  deletePostLike: Post_Likes;
  deleteProfile: Profiles;
  deleteReport: Reports;
  deleteReportTarget: Report_Targets;
  deleteRole: Roles;
  deleteSavedPost: Saved_Posts;
  deleteScan: Scans;
  deleteStory: Stories;
  deleteStoryView: Story_Views;
  deleteTag: Tags;
  deleteUser: Users;
  updateCategory: Categories;
  updateChat: Chats;
  updateCity: Cities;
  updateComment: Comments;
  updateContent: Contents;
  updateCountry: Countries;
  updateDeviceToken: Device_Tokens;
  updateFollowRequest: Follow_Requests;
  updateLocation: Locations;
  updateMessage: Messages;
  updateProfile: Profiles;
  updateRole: Roles;
  updateTag: Tags;
  updateUser: Users;
};


export type MutationCreateBlockArgs = {
  data: BlocksCreateInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoriesCreateInput;
};


export type MutationCreateChatArgs = {
  data: ChatsCreateInput;
};


export type MutationCreateChatParticipantArgs = {
  data: Chat_ParticipantsCreateInput;
};


export type MutationCreateCityArgs = {
  data: CitiesCreateInput;
};


export type MutationCreateCommentArgs = {
  data: CommentsCreateInput;
};


export type MutationCreateCommentLikeArgs = {
  data: Comment_LikesCreateInput;
};


export type MutationCreateContentArgs = {
  data: ContentsCreateInput;
};


export type MutationCreateCountryArgs = {
  data: CountriesCreateInput;
};


export type MutationCreateDeviceTokenArgs = {
  data: Device_TokensCreateInput;
};


export type MutationCreateFollowArgs = {
  data: FollowsCreateInput;
};


export type MutationCreateFollowRequestArgs = {
  data: Follow_RequestsCreateInput;
};


export type MutationCreateLocationArgs = {
  data: LocationsCreateInput;
};


export type MutationCreateMessageArgs = {
  data: MessagesCreateInput;
};


export type MutationCreatePostLikeArgs = {
  data: Post_LikesCreateInput;
};


export type MutationCreateProfileArgs = {
  data: ProfilesCreateInput;
};


export type MutationCreateReportArgs = {
  data: ReportsCreateInput;
};


export type MutationCreateRoleArgs = {
  data: RolesCreateInput;
};


export type MutationCreateSavedPostArgs = {
  data: Saved_PostsCreateInput;
};


export type MutationCreateStoryViewArgs = {
  data: Story_ViewsCreateInput;
};


export type MutationCreateTagArgs = {
  data: TagsCreateInput;
};


export type MutationCreateUserArgs = {
  data: UsersCreateInput;
};


export type MutationDeleteBlockArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChatArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChatParticipantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentLikeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeviceTokenArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowRequestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMediaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostBlockArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostLikeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProfileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReportArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReportTargetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSavedPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteScanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoryViewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoriesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateChatArgs = {
  data: ChatsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCityArgs = {
  data: CitiesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  data: CommentsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateContentArgs = {
  data: ContentsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCountryArgs = {
  data: CountriesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateDeviceTokenArgs = {
  data: Device_TokensUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateFollowRequestArgs = {
  data: Follow_RequestsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateLocationArgs = {
  data: LocationsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateMessageArgs = {
  data: MessagesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateProfileArgs = {
  data: ProfilesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRoleArgs = {
  data: RolesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTagArgs = {
  data: TagsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UsersUpdateInput;
  id: Scalars['ID']['input'];
};

export enum NotificationType {
  Comment = 'comment',
  Like = 'like',
  Mention = 'mention',
  Message = 'message',
  Reply = 'reply',
  System = 'system'
}

export type Query = {
  __typename?: 'Query';
  block?: Maybe<Blocks>;
  blocks: Array<Blocks>;
  categories: Array<Categories>;
  category?: Maybe<Categories>;
  chat?: Maybe<Chats>;
  chatParticipant?: Maybe<Chat_Participants>;
  chatParticipants: Array<Chat_Participants>;
  chats: Array<Chats>;
  cities: Array<Cities>;
  city?: Maybe<Cities>;
  comment?: Maybe<Comments>;
  commentHashtag?: Maybe<Comment_Hashtags>;
  commentHashtags: Array<Comment_Hashtags>;
  commentLike?: Maybe<Comment_Likes>;
  commentLikes: Array<Comment_Likes>;
  comments: Array<Comments>;
  content?: Maybe<Contents>;
  contentHashtag?: Maybe<Content_Hashtags>;
  contentHashtags: Array<Content_Hashtags>;
  contents: Array<Contents>;
  countries: Array<Countries>;
  country?: Maybe<Countries>;
  deviceToken?: Maybe<Device_Tokens>;
  deviceTokens: Array<Device_Tokens>;
  follow?: Maybe<Follows>;
  followRequest?: Maybe<Follow_Requests>;
  followRequests: Array<Follow_Requests>;
  follows: Array<Follows>;
  hashtag?: Maybe<Hashtags>;
  hashtags: Array<Hashtags>;
  location?: Maybe<Locations>;
  locations: Array<Locations>;
  media?: Maybe<Media>;
  mediaList: Array<Media>;
  mention?: Maybe<Mentions>;
  mentionTarget?: Maybe<Mention_Targets>;
  mentionTargets: Array<Mention_Targets>;
  mentions: Array<Mentions>;
  message?: Maybe<Messages>;
  messages: Array<Messages>;
  notification?: Maybe<Notifications>;
  notificationTarget?: Maybe<Notification_Targets>;
  notificationTargets: Array<Notification_Targets>;
  notifications: Array<Notifications>;
  post?: Maybe<Posts>;
  postBlock?: Maybe<Post_Blocks>;
  postBlocks: Array<Post_Blocks>;
  postLike?: Maybe<Post_Likes>;
  postLikes: Array<Post_Likes>;
  postTag?: Maybe<Post_Tags>;
  postTags: Array<Post_Tags>;
  posts: Array<Posts>;
  profile?: Maybe<Profiles>;
  profiles: Array<Profiles>;
  report?: Maybe<Reports>;
  reportTarget?: Maybe<Report_Targets>;
  reportTargets: Array<Report_Targets>;
  reports: Array<Reports>;
  role?: Maybe<Roles>;
  roles: Array<Roles>;
  savedPost?: Maybe<Saved_Posts>;
  savedPosts: Array<Saved_Posts>;
  scan?: Maybe<Scans>;
  scans: Array<Scans>;
  stories: Array<Stories>;
  story?: Maybe<Stories>;
  storyView?: Maybe<Story_Views>;
  storyViews: Array<Story_Views>;
  tag?: Maybe<Tags>;
  tags: Array<Tags>;
  user?: Maybe<Users>;
  users: Array<Users>;
};


export type QueryBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatParticipantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentHashtagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentLikeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContentHashtagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCountryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeviceTokenArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHashtagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMentionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMentionTargetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMessageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNotificationTargetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostLikeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProfileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportTargetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySavedPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoryViewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export enum ReportStatus {
  Dismissed = 'dismissed',
  Pending = 'pending',
  Resolved = 'resolved',
  Reviewed = 'reviewed'
}

export enum Role {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}

export enum Visibility {
  Followers = 'followers',
  Private = 'private',
  Public = 'public'
}

export type Blocks = {
  __typename?: 'blocks';
  blocked: Users;
  blocker: Users;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
};

export type BlocksCreateInput = {
  blocked_id: Scalars['String']['input'];
};

export type Categories = {
  __typename?: 'categories';
  category_id: Scalars['BigInt']['output'];
  name: Scalars['String']['output'];
  posts: Array<Maybe<Posts>>;
};

export type CategoriesCreateInput = {
  name: Scalars['String']['input'];
};

export type CategoriesUpdateInput = {
  category_id?: InputMaybe<Scalars['BigInt']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Chat_Participants = {
  __typename?: 'chat_participants';
  chat: Chats;
  id: Scalars['BigInt']['output'];
  joined_at: Scalars['DateTime']['output'];
  user?: Maybe<Users>;
};

export type Chat_ParticipantsCreateInput = {
  chat_id: Scalars['String']['input'];
};

export type Chats = {
  __typename?: 'chats';
  chat_id: Scalars['String']['output'];
  chat_participants: Array<Maybe<Chat_Participants>>;
  created_at: Scalars['DateTime']['output'];
  is_group_chat: Scalars['Boolean']['output'];
  messages: Array<Maybe<Messages>>;
  notificationTargets: Array<Maybe<Notification_Targets>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ChatsCreateInput = {
  chatParticipants?: InputMaybe<Array<Chat_ParticipantsCreateInput>>;
  is_group_chat: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ChatsUpdateInput = {
  chat_id?: InputMaybe<Scalars['String']['input']>;
  is_group_chat?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Cities = {
  __typename?: 'cities';
  city_id: Scalars['BigInt']['output'];
  country: Countries;
  country_id: Scalars['BigInt']['output'];
  locations: Array<Maybe<Locations>>;
  name: Scalars['String']['output'];
};

export type CitiesCreateInput = {
  country_id: Scalars['BigInt']['input'];
  name: Scalars['String']['input'];
};

export type CitiesUpdateInput = {
  city_id?: InputMaybe<Scalars['BigInt']['input']>;
  country_id?: InputMaybe<Scalars['BigInt']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Comment_Hashtags = {
  __typename?: 'comment_hashtags';
  comment: Comments;
  created_at: Scalars['DateTime']['output'];
  hashtag: Hashtags;
  id: Scalars['BigInt']['output'];
};

export type Comment_Likes = {
  __typename?: 'comment_likes';
  comment: Comments;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  user?: Maybe<Users>;
};

export type Comment_LikesCreateInput = {
  comment_id: Scalars['String']['input'];
};

export type Comments = {
  __typename?: 'comments';
  comment?: Maybe<Comments>;
  commentHashtags: Array<Maybe<Comment_Hashtags>>;
  comment_id: Scalars['String']['output'];
  comment_likes: Array<Maybe<Comment_Likes>>;
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  is_deleted: Scalars['Boolean']['output'];
  mentionTargets: Array<Maybe<Mention_Targets>>;
  notificationTargets: Array<Maybe<Notification_Targets>>;
  post: Posts;
  replies: Array<Maybe<Comments>>;
  reportTargets: Array<Maybe<Report_Targets>>;
  updated_at: Scalars['DateTime']['output'];
  user?: Maybe<Users>;
};

export type CommentsCreateInput = {
  comment_parent_id?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  post_id: Scalars['String']['input'];
};

export type CommentsUpdateInput = {
  comment_id?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
};

export type Content_Hashtags = {
  __typename?: 'content_hashtags';
  content: Contents;
  created_at: Scalars['DateTime']['output'];
  hashtag: Hashtags;
  id: Scalars['BigInt']['output'];
};

export type Contents = {
  __typename?: 'contents';
  contentHashtags: Array<Maybe<Content_Hashtags>>;
  content_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  media: Array<Maybe<Media>>;
  posts?: Maybe<Posts>;
  scans?: Maybe<Scans>;
  stories?: Maybe<Stories>;
  type: ContentType;
  updated_at: Scalars['DateTime']['output'];
  user: Users;
  visibility: Visibility;
};

export type ContentsCreateInput = {
  media?: InputMaybe<Array<MediaCreateInput>>;
  posts?: InputMaybe<PostsCreateInput>;
  scans?: InputMaybe<ScansCreateInput>;
  stories?: InputMaybe<StoriesCreateInput>;
  visibility: Visibility;
};

export type ContentsUpdateInput = {
  content_id?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<Array<MediaUpdateInput>>;
  posts?: InputMaybe<PostsUpdateInput>;
  scans?: InputMaybe<ScansUpdateInput>;
  stories?: InputMaybe<StoriesUpdateInput>;
  visibility?: InputMaybe<Visibility>;
};

export type Countries = {
  __typename?: 'countries';
  cities: Array<Maybe<Cities>>;
  country_id: Scalars['BigInt']['output'];
  locations: Array<Maybe<Locations>>;
  name: Scalars['String']['output'];
};

export type CountriesCreateInput = {
  cities?: InputMaybe<Array<CitiesCreateInput>>;
  name: Scalars['String']['input'];
};

export type CountriesUpdateInput = {
  cities?: InputMaybe<Array<CitiesUpdateInput>>;
  country_id?: InputMaybe<Scalars['BigInt']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Device_Tokens = {
  __typename?: 'device_tokens';
  app_version?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  device_type: DeviceType;
  last_used: Scalars['DateTime']['output'];
  token: Scalars['String']['output'];
  token_id: Scalars['String']['output'];
  user: Users;
};

export type Device_TokensCreateInput = {
  app_version?: InputMaybe<Scalars['String']['input']>;
  device_type: DeviceType;
  token: Scalars['String']['input'];
};

export type Device_TokensUpdateInput = {
  app_version?: InputMaybe<Scalars['String']['input']>;
  device_type?: InputMaybe<DeviceType>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
};

export type Follow_Requests = {
  __typename?: 'follow_requests';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  requester: Users;
  status: FollowRequestStatus;
  target: Users;
};

export type Follow_RequestsCreateInput = {
  target_id: Scalars['String']['input'];
};

export type Follow_RequestsUpdateInput = {
  id?: InputMaybe<Scalars['BigInt']['input']>;
  status?: InputMaybe<FollowRequestStatus>;
};

export type Follows = {
  __typename?: 'follows';
  created_at: Scalars['DateTime']['output'];
  follower: Users;
  following: Users;
  id: Scalars['BigInt']['output'];
};

export type FollowsCreateInput = {
  following_id: Scalars['String']['input'];
};

export type Hashtags = {
  __typename?: 'hashtags';
  commentHashtags: Array<Maybe<Comment_Hashtags>>;
  contentHashtags: Array<Maybe<Content_Hashtags>>;
  created_at: Scalars['DateTime']['output'];
  hashtag_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Locations = {
  __typename?: 'locations';
  birth_profiles: Array<Maybe<Profiles>>;
  city?: Maybe<Cities>;
  city_id?: Maybe<Scalars['BigInt']['output']>;
  country: Countries;
  country_id: Scalars['BigInt']['output'];
  current_profiles: Array<Maybe<Profiles>>;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
  location_id: Scalars['String']['output'];
  place_id?: Maybe<Scalars['String']['output']>;
  posts: Array<Maybe<Posts>>;
  scans: Array<Maybe<Scans>>;
};

export type LocationsCreateInput = {
  city?: InputMaybe<CitiesCreateInput>;
  city_id?: InputMaybe<Scalars['BigInt']['input']>;
  country?: InputMaybe<CountriesCreateInput>;
  country_id: Scalars['BigInt']['input'];
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  place_id?: InputMaybe<Scalars['String']['input']>;
};

export type LocationsUpdateInput = {
  city?: InputMaybe<CitiesUpdateInput>;
  city_id?: InputMaybe<Scalars['BigInt']['input']>;
  country?: InputMaybe<CountriesUpdateInput>;
  country_id?: InputMaybe<Scalars['BigInt']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  location_id?: InputMaybe<Scalars['String']['input']>;
  place_id?: InputMaybe<Scalars['String']['input']>;
};

export type Media = {
  __typename?: 'media';
  content?: Maybe<Contents>;
  media_id: Scalars['String']['output'];
  post_blocks: Array<Maybe<Post_Blocks>>;
  storage_path: Scalars['String']['output'];
  type: MediaType;
};

export type MediaCreateInput = {
  content_id?: InputMaybe<Scalars['String']['input']>;
  storage_path: Scalars['String']['input'];
  type: MediaType;
};

export type MediaUpdateInput = {
  media_id?: InputMaybe<Scalars['String']['input']>;
  storage_path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MediaType>;
};

export type Mention_Targets = {
  __typename?: 'mention_targets';
  comment?: Maybe<Comments>;
  mentions: Array<Maybe<Mentions>>;
  post?: Maybe<Posts>;
  target_id: Scalars['String']['output'];
};

export type Mentions = {
  __typename?: 'mentions';
  created_at: Scalars['DateTime']['output'];
  mention_id: Scalars['String']['output'];
  mention_target?: Maybe<Mention_Targets>;
  user: Users;
};

export type Messages = {
  __typename?: 'messages';
  chat: Chats;
  message_id: Scalars['String']['output'];
  sent_at: Scalars['DateTime']['output'];
  text_content?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Users>;
};

export type MessagesCreateInput = {
  chat_id: Scalars['String']['input'];
  text_content?: InputMaybe<Scalars['String']['input']>;
};

export type MessagesUpdateInput = {
  message_id?: InputMaybe<Scalars['String']['input']>;
  text_content?: InputMaybe<Scalars['String']['input']>;
};

export type Notification_Targets = {
  __typename?: 'notification_targets';
  chat?: Maybe<Chats>;
  comment?: Maybe<Comments>;
  notifications: Array<Maybe<Notifications>>;
  post?: Maybe<Posts>;
  target_id: Scalars['String']['output'];
};

export type Notifications = {
  __typename?: 'notifications';
  actor?: Maybe<Users>;
  delivered_at: Scalars['DateTime']['output'];
  message?: Maybe<Scalars['String']['output']>;
  notification_id: Scalars['String']['output'];
  notification_target?: Maybe<Notification_Targets>;
  read_at?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<NotificationType>;
  user: Users;
};

export type Post_Blocks = {
  __typename?: 'post_blocks';
  block_id: Scalars['String']['output'];
  content: Scalars['JSON']['output'];
  created_at: Scalars['DateTime']['output'];
  media?: Maybe<Media>;
  position: Scalars['BigInt']['output'];
  post: Posts;
  type: BlockType;
};

export type Post_BlocksCreateInput = {
  content: Scalars['JSON']['input'];
  media?: InputMaybe<MediaCreateInput>;
  position: Scalars['BigInt']['input'];
  post_id: Scalars['String']['input'];
  type: BlockType;
};

export type Post_BlocksUpdateInput = {
  block_id?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['JSON']['input']>;
  media?: InputMaybe<MediaUpdateInput>;
  position?: InputMaybe<Scalars['BigInt']['input']>;
  type?: InputMaybe<BlockType>;
};

export type Post_Likes = {
  __typename?: 'post_likes';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  post: Posts;
  user?: Maybe<Users>;
};

export type Post_LikesCreateInput = {
  post_id: Scalars['String']['input'];
};

export type Post_Tags = {
  __typename?: 'post_tags';
  id: Scalars['BigInt']['output'];
  post: Posts;
  tag: Tags;
  tag_id: Scalars['BigInt']['output'];
};

export type Posts = {
  __typename?: 'posts';
  category?: Maybe<Categories>;
  category_id?: Maybe<Scalars['BigInt']['output']>;
  comments: Array<Maybe<Comments>>;
  content: Contents;
  location?: Maybe<Locations>;
  mentionTargets: Array<Maybe<Mention_Targets>>;
  notificationTargets: Array<Maybe<Notification_Targets>>;
  postTags: Array<Maybe<Post_Tags>>;
  post_blocks: Array<Maybe<Post_Blocks>>;
  post_likes: Array<Maybe<Post_Likes>>;
  reportTargets: Array<Maybe<Report_Targets>>;
  saved_posts: Array<Maybe<Saved_Posts>>;
  text_content?: Maybe<Scalars['String']['output']>;
};

export type PostsCreateInput = {
  category_id?: InputMaybe<Scalars['BigInt']['input']>;
  location?: InputMaybe<LocationsCreateInput>;
  postBlocks?: InputMaybe<Array<Post_BlocksCreateInput>>;
};

export type PostsUpdateInput = {
  category_id?: InputMaybe<Scalars['BigInt']['input']>;
  content_id?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationsUpdateInput>;
  postBlocks?: InputMaybe<Array<Post_BlocksUpdateInput>>;
};

export type Profiles = {
  __typename?: 'profiles';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birth_date?: Maybe<Scalars['DateTime']['output']>;
  birth_location_details?: Maybe<Locations>;
  created_at: Scalars['DateTime']['output'];
  current_location_details?: Maybe<Locations>;
  first_name: Scalars['String']['output'];
  is_private?: Maybe<Scalars['Boolean']['output']>;
  last_name: Scalars['String']['output'];
  phone_number?: Maybe<Scalars['String']['output']>;
  profile_id: Scalars['String']['output'];
  user: Users;
};

export type ProfilesCreateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_location_details?: InputMaybe<LocationsCreateInput>;
  current_location_details?: InputMaybe<LocationsCreateInput>;
  first_name: Scalars['String']['input'];
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

export type ProfilesUpdateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_location_details?: InputMaybe<LocationsUpdateInput>;
  current_location_details?: InputMaybe<LocationsUpdateInput>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  profile_id?: InputMaybe<Scalars['String']['input']>;
};

export type Report_Targets = {
  __typename?: 'report_targets';
  comment?: Maybe<Comments>;
  post?: Maybe<Posts>;
  reports: Array<Maybe<Reports>>;
  story?: Maybe<Stories>;
  target_id: Scalars['String']['output'];
};

export type Report_TargetsCreateInput = {
  comment_id?: InputMaybe<Scalars['String']['input']>;
  post_id?: InputMaybe<Scalars['String']['input']>;
  story_id?: InputMaybe<Scalars['String']['input']>;
};

export type Reports = {
  __typename?: 'reports';
  created_at: Scalars['DateTime']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  report_id: Scalars['String']['output'];
  report_target: Report_Targets;
  resolved_at?: Maybe<Scalars['DateTime']['output']>;
  resolver?: Maybe<Users>;
  status: ReportStatus;
  user?: Maybe<Users>;
};

export type ReportsCreateInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  report_target?: InputMaybe<Report_TargetsCreateInput>;
};

export type Roles = {
  __typename?: 'roles';
  role_id: Scalars['BigInt']['output'];
  role_name: Role;
  users: Array<Maybe<Users>>;
};

export type RolesCreateInput = {
  role_name: Role;
};

export type RolesUpdateInput = {
  role_id?: InputMaybe<Scalars['BigInt']['input']>;
  role_name?: InputMaybe<Role>;
};

export type Saved_Posts = {
  __typename?: 'saved_posts';
  post?: Maybe<Posts>;
  saved_at: Scalars['DateTime']['output'];
  saved_id: Scalars['String']['output'];
  user: Users;
};

export type Saved_PostsCreateInput = {
  post_id: Scalars['String']['input'];
};

export type Scans = {
  __typename?: 'scans';
  content: Contents;
  location?: Maybe<Locations>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  timestamp: Scalars['DateTime']['output'];
};

export type ScansCreateInput = {
  location?: InputMaybe<LocationsCreateInput>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type ScansUpdateInput = {
  content_id?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<LocationsUpdateInput>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type Stories = {
  __typename?: 'stories';
  content: Contents;
  expires_at?: Maybe<Scalars['DateTime']['output']>;
  reportTargets: Array<Maybe<Report_Targets>>;
  story_views: Array<Maybe<Story_Views>>;
};

export type StoriesCreateInput = {
  expires_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type StoriesUpdateInput = {
  content_id?: InputMaybe<Scalars['String']['input']>;
  expires_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Story_Views = {
  __typename?: 'story_views';
  id: Scalars['BigInt']['output'];
  story: Stories;
  user?: Maybe<Users>;
  viewed_at: Scalars['DateTime']['output'];
};

export type Story_ViewsCreateInput = {
  story_id: Scalars['String']['input'];
};

export type Tags = {
  __typename?: 'tags';
  name: Scalars['String']['output'];
  post_tags: Array<Maybe<Post_Tags>>;
  tag_id: Scalars['BigInt']['output'];
};

export type TagsCreateInput = {
  name: Scalars['String']['input'];
};

export type TagsUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  tag_id?: InputMaybe<Scalars['BigInt']['input']>;
};

export type Users = {
  __typename?: 'users';
  blocked_bys: Array<Maybe<Blocks>>;
  blocked_users: Array<Maybe<Blocks>>;
  chat_participants: Array<Maybe<Chat_Participants>>;
  comment_likes: Array<Maybe<Comment_Likes>>;
  comments: Array<Maybe<Comments>>;
  contents: Array<Maybe<Contents>>;
  created_at: Scalars['DateTime']['output'];
  device_tokens: Array<Maybe<Device_Tokens>>;
  email: Scalars['String']['output'];
  follow_Requesters: Array<Maybe<Follow_Requests>>;
  follow_requests_targets: Array<Maybe<Follow_Requests>>;
  followers: Array<Maybe<Follows>>;
  following: Array<Maybe<Follows>>;
  is_active: Scalars['Boolean']['output'];
  is_banned: Scalars['Boolean']['output'];
  mentions: Array<Maybe<Mentions>>;
  messages: Array<Maybe<Messages>>;
  notification_actors: Array<Maybe<Notifications>>;
  notifications: Array<Maybe<Notifications>>;
  post_likes: Array<Maybe<Post_Likes>>;
  profile?: Maybe<Profiles>;
  report_resolvers: Array<Maybe<Reports>>;
  reports: Array<Maybe<Reports>>;
  role?: Maybe<Roles>;
  role_id?: Maybe<Scalars['BigInt']['output']>;
  saved_posts: Array<Maybe<Saved_Posts>>;
  story_views: Array<Maybe<Story_Views>>;
  updated_at: Scalars['DateTime']['output'];
  user_id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UsersCreateInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profile?: InputMaybe<ProfilesCreateInput>;
  username: Scalars['String']['input'];
};

export type UsersUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  profile?: InputMaybe<ProfilesUpdateInput>;
  user_id?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockType: BlockType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ContentType: ContentType;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeviceType: DeviceType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FollowRequestStatus: FollowRequestStatus;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  MediaType: MediaType;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NotificationType: NotificationType;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ReportStatus: ReportStatus;
  Role: Role;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Visibility: Visibility;
  blocks: ResolverTypeWrapper<Blocks>;
  blocksCreateInput: BlocksCreateInput;
  categories: ResolverTypeWrapper<Categories>;
  categoriesCreateInput: CategoriesCreateInput;
  categoriesUpdateInput: CategoriesUpdateInput;
  chat_participants: ResolverTypeWrapper<Chat_Participants>;
  chat_participantsCreateInput: Chat_ParticipantsCreateInput;
  chats: ResolverTypeWrapper<Chats>;
  chatsCreateInput: ChatsCreateInput;
  chatsUpdateInput: ChatsUpdateInput;
  cities: ResolverTypeWrapper<Cities>;
  citiesCreateInput: CitiesCreateInput;
  citiesUpdateInput: CitiesUpdateInput;
  comment_hashtags: ResolverTypeWrapper<Comment_Hashtags>;
  comment_likes: ResolverTypeWrapper<Comment_Likes>;
  comment_likesCreateInput: Comment_LikesCreateInput;
  comments: ResolverTypeWrapper<Comments>;
  commentsCreateInput: CommentsCreateInput;
  commentsUpdateInput: CommentsUpdateInput;
  content_hashtags: ResolverTypeWrapper<Content_Hashtags>;
  contents: ResolverTypeWrapper<Contents>;
  contentsCreateInput: ContentsCreateInput;
  contentsUpdateInput: ContentsUpdateInput;
  countries: ResolverTypeWrapper<Countries>;
  countriesCreateInput: CountriesCreateInput;
  countriesUpdateInput: CountriesUpdateInput;
  device_tokens: ResolverTypeWrapper<Device_Tokens>;
  device_tokensCreateInput: Device_TokensCreateInput;
  device_tokensUpdateInput: Device_TokensUpdateInput;
  follow_requests: ResolverTypeWrapper<Follow_Requests>;
  follow_requestsCreateInput: Follow_RequestsCreateInput;
  follow_requestsUpdateInput: Follow_RequestsUpdateInput;
  follows: ResolverTypeWrapper<Follows>;
  followsCreateInput: FollowsCreateInput;
  hashtags: ResolverTypeWrapper<Hashtags>;
  locations: ResolverTypeWrapper<Locations>;
  locationsCreateInput: LocationsCreateInput;
  locationsUpdateInput: LocationsUpdateInput;
  media: ResolverTypeWrapper<Media>;
  mediaCreateInput: MediaCreateInput;
  mediaUpdateInput: MediaUpdateInput;
  mention_targets: ResolverTypeWrapper<Mention_Targets>;
  mentions: ResolverTypeWrapper<Mentions>;
  messages: ResolverTypeWrapper<Messages>;
  messagesCreateInput: MessagesCreateInput;
  messagesUpdateInput: MessagesUpdateInput;
  notification_targets: ResolverTypeWrapper<Notification_Targets>;
  notifications: ResolverTypeWrapper<Notifications>;
  post_blocks: ResolverTypeWrapper<Post_Blocks>;
  post_blocksCreateInput: Post_BlocksCreateInput;
  post_blocksUpdateInput: Post_BlocksUpdateInput;
  post_likes: ResolverTypeWrapper<Post_Likes>;
  post_likesCreateInput: Post_LikesCreateInput;
  post_tags: ResolverTypeWrapper<Post_Tags>;
  posts: ResolverTypeWrapper<Posts>;
  postsCreateInput: PostsCreateInput;
  postsUpdateInput: PostsUpdateInput;
  profiles: ResolverTypeWrapper<Profiles>;
  profilesCreateInput: ProfilesCreateInput;
  profilesUpdateInput: ProfilesUpdateInput;
  report_targets: ResolverTypeWrapper<Report_Targets>;
  report_targetsCreateInput: Report_TargetsCreateInput;
  reports: ResolverTypeWrapper<Reports>;
  reportsCreateInput: ReportsCreateInput;
  roles: ResolverTypeWrapper<Roles>;
  rolesCreateInput: RolesCreateInput;
  rolesUpdateInput: RolesUpdateInput;
  saved_posts: ResolverTypeWrapper<Saved_Posts>;
  saved_postsCreateInput: Saved_PostsCreateInput;
  scans: ResolverTypeWrapper<Scans>;
  scansCreateInput: ScansCreateInput;
  scansUpdateInput: ScansUpdateInput;
  stories: ResolverTypeWrapper<Stories>;
  storiesCreateInput: StoriesCreateInput;
  storiesUpdateInput: StoriesUpdateInput;
  story_views: ResolverTypeWrapper<Story_Views>;
  story_viewsCreateInput: Story_ViewsCreateInput;
  tags: ResolverTypeWrapper<Tags>;
  tagsCreateInput: TagsCreateInput;
  tagsUpdateInput: TagsUpdateInput;
  users: ResolverTypeWrapper<Users>;
  usersCreateInput: UsersCreateInput;
  usersUpdateInput: UsersUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  blocks: Blocks;
  blocksCreateInput: BlocksCreateInput;
  categories: Categories;
  categoriesCreateInput: CategoriesCreateInput;
  categoriesUpdateInput: CategoriesUpdateInput;
  chat_participants: Chat_Participants;
  chat_participantsCreateInput: Chat_ParticipantsCreateInput;
  chats: Chats;
  chatsCreateInput: ChatsCreateInput;
  chatsUpdateInput: ChatsUpdateInput;
  cities: Cities;
  citiesCreateInput: CitiesCreateInput;
  citiesUpdateInput: CitiesUpdateInput;
  comment_hashtags: Comment_Hashtags;
  comment_likes: Comment_Likes;
  comment_likesCreateInput: Comment_LikesCreateInput;
  comments: Comments;
  commentsCreateInput: CommentsCreateInput;
  commentsUpdateInput: CommentsUpdateInput;
  content_hashtags: Content_Hashtags;
  contents: Contents;
  contentsCreateInput: ContentsCreateInput;
  contentsUpdateInput: ContentsUpdateInput;
  countries: Countries;
  countriesCreateInput: CountriesCreateInput;
  countriesUpdateInput: CountriesUpdateInput;
  device_tokens: Device_Tokens;
  device_tokensCreateInput: Device_TokensCreateInput;
  device_tokensUpdateInput: Device_TokensUpdateInput;
  follow_requests: Follow_Requests;
  follow_requestsCreateInput: Follow_RequestsCreateInput;
  follow_requestsUpdateInput: Follow_RequestsUpdateInput;
  follows: Follows;
  followsCreateInput: FollowsCreateInput;
  hashtags: Hashtags;
  locations: Locations;
  locationsCreateInput: LocationsCreateInput;
  locationsUpdateInput: LocationsUpdateInput;
  media: Media;
  mediaCreateInput: MediaCreateInput;
  mediaUpdateInput: MediaUpdateInput;
  mention_targets: Mention_Targets;
  mentions: Mentions;
  messages: Messages;
  messagesCreateInput: MessagesCreateInput;
  messagesUpdateInput: MessagesUpdateInput;
  notification_targets: Notification_Targets;
  notifications: Notifications;
  post_blocks: Post_Blocks;
  post_blocksCreateInput: Post_BlocksCreateInput;
  post_blocksUpdateInput: Post_BlocksUpdateInput;
  post_likes: Post_Likes;
  post_likesCreateInput: Post_LikesCreateInput;
  post_tags: Post_Tags;
  posts: Posts;
  postsCreateInput: PostsCreateInput;
  postsUpdateInput: PostsUpdateInput;
  profiles: Profiles;
  profilesCreateInput: ProfilesCreateInput;
  profilesUpdateInput: ProfilesUpdateInput;
  report_targets: Report_Targets;
  report_targetsCreateInput: Report_TargetsCreateInput;
  reports: Reports;
  reportsCreateInput: ReportsCreateInput;
  roles: Roles;
  rolesCreateInput: RolesCreateInput;
  rolesUpdateInput: RolesUpdateInput;
  saved_posts: Saved_Posts;
  saved_postsCreateInput: Saved_PostsCreateInput;
  scans: Scans;
  scansCreateInput: ScansCreateInput;
  scansUpdateInput: ScansUpdateInput;
  stories: Stories;
  storiesCreateInput: StoriesCreateInput;
  storiesUpdateInput: StoriesUpdateInput;
  story_views: Story_Views;
  story_viewsCreateInput: Story_ViewsCreateInput;
  tags: Tags;
  tagsCreateInput: TagsCreateInput;
  tagsUpdateInput: TagsUpdateInput;
  users: Users;
  usersCreateInput: UsersCreateInput;
  usersUpdateInput: UsersUpdateInput;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createBlock?: Resolver<ResolversTypes['blocks'], ParentType, ContextType, RequireFields<MutationCreateBlockArgs, 'data'>>;
  createCategory?: Resolver<ResolversTypes['categories'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'data'>>;
  createChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'data'>>;
  createChatParticipant?: Resolver<ResolversTypes['chat_participants'], ParentType, ContextType, RequireFields<MutationCreateChatParticipantArgs, 'data'>>;
  createCity?: Resolver<ResolversTypes['cities'], ParentType, ContextType, RequireFields<MutationCreateCityArgs, 'data'>>;
  createComment?: Resolver<ResolversTypes['comments'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'data'>>;
  createCommentLike?: Resolver<ResolversTypes['comment_likes'], ParentType, ContextType, RequireFields<MutationCreateCommentLikeArgs, 'data'>>;
  createContent?: Resolver<ResolversTypes['contents'], ParentType, ContextType, RequireFields<MutationCreateContentArgs, 'data'>>;
  createCountry?: Resolver<ResolversTypes['countries'], ParentType, ContextType, RequireFields<MutationCreateCountryArgs, 'data'>>;
  createDeviceToken?: Resolver<ResolversTypes['device_tokens'], ParentType, ContextType, RequireFields<MutationCreateDeviceTokenArgs, 'data'>>;
  createFollow?: Resolver<ResolversTypes['follows'], ParentType, ContextType, RequireFields<MutationCreateFollowArgs, 'data'>>;
  createFollowRequest?: Resolver<ResolversTypes['follow_requests'], ParentType, ContextType, RequireFields<MutationCreateFollowRequestArgs, 'data'>>;
  createLocation?: Resolver<ResolversTypes['locations'], ParentType, ContextType, RequireFields<MutationCreateLocationArgs, 'data'>>;
  createMessage?: Resolver<ResolversTypes['messages'], ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'data'>>;
  createPostLike?: Resolver<ResolversTypes['post_likes'], ParentType, ContextType, RequireFields<MutationCreatePostLikeArgs, 'data'>>;
  createProfile?: Resolver<ResolversTypes['profiles'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'data'>>;
  createReport?: Resolver<ResolversTypes['reports'], ParentType, ContextType, RequireFields<MutationCreateReportArgs, 'data'>>;
  createRole?: Resolver<ResolversTypes['roles'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'data'>>;
  createSavedPost?: Resolver<ResolversTypes['saved_posts'], ParentType, ContextType, RequireFields<MutationCreateSavedPostArgs, 'data'>>;
  createStoryView?: Resolver<ResolversTypes['story_views'], ParentType, ContextType, RequireFields<MutationCreateStoryViewArgs, 'data'>>;
  createTag?: Resolver<ResolversTypes['tags'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'data'>>;
  createUser?: Resolver<ResolversTypes['users'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  deleteBlock?: Resolver<ResolversTypes['blocks'], ParentType, ContextType, RequireFields<MutationDeleteBlockArgs, 'id'>>;
  deleteCategory?: Resolver<ResolversTypes['categories'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationDeleteChatArgs, 'id'>>;
  deleteChatParticipant?: Resolver<ResolversTypes['chat_participants'], ParentType, ContextType, RequireFields<MutationDeleteChatParticipantArgs, 'id'>>;
  deleteCity?: Resolver<ResolversTypes['cities'], ParentType, ContextType, RequireFields<MutationDeleteCityArgs, 'id'>>;
  deleteComment?: Resolver<ResolversTypes['comments'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'id'>>;
  deleteCommentLike?: Resolver<ResolversTypes['comment_likes'], ParentType, ContextType, RequireFields<MutationDeleteCommentLikeArgs, 'id'>>;
  deleteContent?: Resolver<ResolversTypes['contents'], ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  deleteCountry?: Resolver<ResolversTypes['countries'], ParentType, ContextType, RequireFields<MutationDeleteCountryArgs, 'id'>>;
  deleteDeviceToken?: Resolver<ResolversTypes['device_tokens'], ParentType, ContextType, RequireFields<MutationDeleteDeviceTokenArgs, 'id'>>;
  deleteFollow?: Resolver<ResolversTypes['follows'], ParentType, ContextType, RequireFields<MutationDeleteFollowArgs, 'id'>>;
  deleteFollowRequest?: Resolver<ResolversTypes['follow_requests'], ParentType, ContextType, RequireFields<MutationDeleteFollowRequestArgs, 'id'>>;
  deleteLocation?: Resolver<ResolversTypes['locations'], ParentType, ContextType, RequireFields<MutationDeleteLocationArgs, 'id'>>;
  deleteMedia?: Resolver<ResolversTypes['media'], ParentType, ContextType, RequireFields<MutationDeleteMediaArgs, 'id'>>;
  deleteMessage?: Resolver<ResolversTypes['messages'], ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'id'>>;
  deletePost?: Resolver<ResolversTypes['posts'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'id'>>;
  deletePostBlock?: Resolver<ResolversTypes['post_blocks'], ParentType, ContextType, RequireFields<MutationDeletePostBlockArgs, 'id'>>;
  deletePostLike?: Resolver<ResolversTypes['post_likes'], ParentType, ContextType, RequireFields<MutationDeletePostLikeArgs, 'id'>>;
  deleteProfile?: Resolver<ResolversTypes['profiles'], ParentType, ContextType, RequireFields<MutationDeleteProfileArgs, 'id'>>;
  deleteReport?: Resolver<ResolversTypes['reports'], ParentType, ContextType, RequireFields<MutationDeleteReportArgs, 'id'>>;
  deleteReportTarget?: Resolver<ResolversTypes['report_targets'], ParentType, ContextType, RequireFields<MutationDeleteReportTargetArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['roles'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteSavedPost?: Resolver<ResolversTypes['saved_posts'], ParentType, ContextType, RequireFields<MutationDeleteSavedPostArgs, 'id'>>;
  deleteScan?: Resolver<ResolversTypes['scans'], ParentType, ContextType, RequireFields<MutationDeleteScanArgs, 'id'>>;
  deleteStory?: Resolver<ResolversTypes['stories'], ParentType, ContextType, RequireFields<MutationDeleteStoryArgs, 'id'>>;
  deleteStoryView?: Resolver<ResolversTypes['story_views'], ParentType, ContextType, RequireFields<MutationDeleteStoryViewArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['tags'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['users'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  updateCategory?: Resolver<ResolversTypes['categories'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'data' | 'id'>>;
  updateChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationUpdateChatArgs, 'data' | 'id'>>;
  updateCity?: Resolver<ResolversTypes['cities'], ParentType, ContextType, RequireFields<MutationUpdateCityArgs, 'data' | 'id'>>;
  updateComment?: Resolver<ResolversTypes['comments'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'data' | 'id'>>;
  updateContent?: Resolver<ResolversTypes['contents'], ParentType, ContextType, RequireFields<MutationUpdateContentArgs, 'data' | 'id'>>;
  updateCountry?: Resolver<ResolversTypes['countries'], ParentType, ContextType, RequireFields<MutationUpdateCountryArgs, 'data' | 'id'>>;
  updateDeviceToken?: Resolver<ResolversTypes['device_tokens'], ParentType, ContextType, RequireFields<MutationUpdateDeviceTokenArgs, 'data' | 'id'>>;
  updateFollowRequest?: Resolver<ResolversTypes['follow_requests'], ParentType, ContextType, RequireFields<MutationUpdateFollowRequestArgs, 'data' | 'id'>>;
  updateLocation?: Resolver<ResolversTypes['locations'], ParentType, ContextType, RequireFields<MutationUpdateLocationArgs, 'data' | 'id'>>;
  updateMessage?: Resolver<ResolversTypes['messages'], ParentType, ContextType, RequireFields<MutationUpdateMessageArgs, 'data' | 'id'>>;
  updateProfile?: Resolver<ResolversTypes['profiles'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'data' | 'id'>>;
  updateRole?: Resolver<ResolversTypes['roles'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'data' | 'id'>>;
  updateTag?: Resolver<ResolversTypes['tags'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'data' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['users'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  block?: Resolver<Maybe<ResolversTypes['blocks']>, ParentType, ContextType, RequireFields<QueryBlockArgs, 'id'>>;
  blocks?: Resolver<Array<ResolversTypes['blocks']>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['categories']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['categories']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  chat?: Resolver<Maybe<ResolversTypes['chats']>, ParentType, ContextType, RequireFields<QueryChatArgs, 'id'>>;
  chatParticipant?: Resolver<Maybe<ResolversTypes['chat_participants']>, ParentType, ContextType, RequireFields<QueryChatParticipantArgs, 'id'>>;
  chatParticipants?: Resolver<Array<ResolversTypes['chat_participants']>, ParentType, ContextType>;
  chats?: Resolver<Array<ResolversTypes['chats']>, ParentType, ContextType>;
  cities?: Resolver<Array<ResolversTypes['cities']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['cities']>, ParentType, ContextType, RequireFields<QueryCityArgs, 'id'>>;
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType, RequireFields<QueryCommentArgs, 'id'>>;
  commentHashtag?: Resolver<Maybe<ResolversTypes['comment_hashtags']>, ParentType, ContextType, RequireFields<QueryCommentHashtagArgs, 'id'>>;
  commentHashtags?: Resolver<Array<ResolversTypes['comment_hashtags']>, ParentType, ContextType>;
  commentLike?: Resolver<Maybe<ResolversTypes['comment_likes']>, ParentType, ContextType, RequireFields<QueryCommentLikeArgs, 'id'>>;
  commentLikes?: Resolver<Array<ResolversTypes['comment_likes']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['comments']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['contents']>, ParentType, ContextType, RequireFields<QueryContentArgs, 'id'>>;
  contentHashtag?: Resolver<Maybe<ResolversTypes['content_hashtags']>, ParentType, ContextType, RequireFields<QueryContentHashtagArgs, 'id'>>;
  contentHashtags?: Resolver<Array<ResolversTypes['content_hashtags']>, ParentType, ContextType>;
  contents?: Resolver<Array<ResolversTypes['contents']>, ParentType, ContextType>;
  countries?: Resolver<Array<ResolversTypes['countries']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['countries']>, ParentType, ContextType, RequireFields<QueryCountryArgs, 'id'>>;
  deviceToken?: Resolver<Maybe<ResolversTypes['device_tokens']>, ParentType, ContextType, RequireFields<QueryDeviceTokenArgs, 'id'>>;
  deviceTokens?: Resolver<Array<ResolversTypes['device_tokens']>, ParentType, ContextType>;
  follow?: Resolver<Maybe<ResolversTypes['follows']>, ParentType, ContextType, RequireFields<QueryFollowArgs, 'id'>>;
  followRequest?: Resolver<Maybe<ResolversTypes['follow_requests']>, ParentType, ContextType, RequireFields<QueryFollowRequestArgs, 'id'>>;
  followRequests?: Resolver<Array<ResolversTypes['follow_requests']>, ParentType, ContextType>;
  follows?: Resolver<Array<ResolversTypes['follows']>, ParentType, ContextType>;
  hashtag?: Resolver<Maybe<ResolversTypes['hashtags']>, ParentType, ContextType, RequireFields<QueryHashtagArgs, 'id'>>;
  hashtags?: Resolver<Array<ResolversTypes['hashtags']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  locations?: Resolver<Array<ResolversTypes['locations']>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['media']>, ParentType, ContextType, RequireFields<QueryMediaArgs, 'id'>>;
  mediaList?: Resolver<Array<ResolversTypes['media']>, ParentType, ContextType>;
  mention?: Resolver<Maybe<ResolversTypes['mentions']>, ParentType, ContextType, RequireFields<QueryMentionArgs, 'id'>>;
  mentionTarget?: Resolver<Maybe<ResolversTypes['mention_targets']>, ParentType, ContextType, RequireFields<QueryMentionTargetArgs, 'id'>>;
  mentionTargets?: Resolver<Array<ResolversTypes['mention_targets']>, ParentType, ContextType>;
  mentions?: Resolver<Array<ResolversTypes['mentions']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['messages']>, ParentType, ContextType, RequireFields<QueryMessageArgs, 'id'>>;
  messages?: Resolver<Array<ResolversTypes['messages']>, ParentType, ContextType>;
  notification?: Resolver<Maybe<ResolversTypes['notifications']>, ParentType, ContextType, RequireFields<QueryNotificationArgs, 'id'>>;
  notificationTarget?: Resolver<Maybe<ResolversTypes['notification_targets']>, ParentType, ContextType, RequireFields<QueryNotificationTargetArgs, 'id'>>;
  notificationTargets?: Resolver<Array<ResolversTypes['notification_targets']>, ParentType, ContextType>;
  notifications?: Resolver<Array<ResolversTypes['notifications']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  postBlock?: Resolver<Maybe<ResolversTypes['post_blocks']>, ParentType, ContextType, RequireFields<QueryPostBlockArgs, 'id'>>;
  postBlocks?: Resolver<Array<ResolversTypes['post_blocks']>, ParentType, ContextType>;
  postLike?: Resolver<Maybe<ResolversTypes['post_likes']>, ParentType, ContextType, RequireFields<QueryPostLikeArgs, 'id'>>;
  postLikes?: Resolver<Array<ResolversTypes['post_likes']>, ParentType, ContextType>;
  postTag?: Resolver<Maybe<ResolversTypes['post_tags']>, ParentType, ContextType, RequireFields<QueryPostTagArgs, 'id'>>;
  postTags?: Resolver<Array<ResolversTypes['post_tags']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['posts']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['profiles']>, ParentType, ContextType, RequireFields<QueryProfileArgs, 'id'>>;
  profiles?: Resolver<Array<ResolversTypes['profiles']>, ParentType, ContextType>;
  report?: Resolver<Maybe<ResolversTypes['reports']>, ParentType, ContextType, RequireFields<QueryReportArgs, 'id'>>;
  reportTarget?: Resolver<Maybe<ResolversTypes['report_targets']>, ParentType, ContextType, RequireFields<QueryReportTargetArgs, 'id'>>;
  reportTargets?: Resolver<Array<ResolversTypes['report_targets']>, ParentType, ContextType>;
  reports?: Resolver<Array<ResolversTypes['reports']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['roles']>, ParentType, ContextType, RequireFields<QueryRoleArgs, 'id'>>;
  roles?: Resolver<Array<ResolversTypes['roles']>, ParentType, ContextType>;
  savedPost?: Resolver<Maybe<ResolversTypes['saved_posts']>, ParentType, ContextType, RequireFields<QuerySavedPostArgs, 'id'>>;
  savedPosts?: Resolver<Array<ResolversTypes['saved_posts']>, ParentType, ContextType>;
  scan?: Resolver<Maybe<ResolversTypes['scans']>, ParentType, ContextType, RequireFields<QueryScanArgs, 'id'>>;
  scans?: Resolver<Array<ResolversTypes['scans']>, ParentType, ContextType>;
  stories?: Resolver<Array<ResolversTypes['stories']>, ParentType, ContextType>;
  story?: Resolver<Maybe<ResolversTypes['stories']>, ParentType, ContextType, RequireFields<QueryStoryArgs, 'id'>>;
  storyView?: Resolver<Maybe<ResolversTypes['story_views']>, ParentType, ContextType, RequireFields<QueryStoryViewArgs, 'id'>>;
  storyViews?: Resolver<Array<ResolversTypes['story_views']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['tags']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<Array<ResolversTypes['tags']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['users']>, ParentType, ContextType>;
};

export type BlocksResolvers<ContextType = any, ParentType extends ResolversParentTypes['blocks'] = ResolversParentTypes['blocks']> = {
  blocked?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  blocker?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type CategoriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['categories'] = ResolversParentTypes['categories']> = {
  category_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<Maybe<ResolversTypes['posts']>>, ParentType, ContextType>;
};

export type Chat_ParticipantsResolvers<ContextType = any, ParentType extends ResolversParentTypes['chat_participants'] = ResolversParentTypes['chat_participants']> = {
  chat?: Resolver<ResolversTypes['chats'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  joined_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type ChatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['chats'] = ResolversParentTypes['chats']> = {
  chat_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chat_participants?: Resolver<Array<Maybe<ResolversTypes['chat_participants']>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  is_group_chat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  messages?: Resolver<Array<Maybe<ResolversTypes['messages']>>, ParentType, ContextType>;
  notificationTargets?: Resolver<Array<Maybe<ResolversTypes['notification_targets']>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CitiesResolvers<ContextType = any, ParentType extends ResolversParentTypes['cities'] = ResolversParentTypes['cities']> = {
  city_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['countries'], ParentType, ContextType>;
  country_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  locations?: Resolver<Array<Maybe<ResolversTypes['locations']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Comment_HashtagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['comment_hashtags'] = ResolversParentTypes['comment_hashtags']> = {
  comment?: Resolver<ResolversTypes['comments'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hashtag?: Resolver<ResolversTypes['hashtags'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type Comment_LikesResolvers<ContextType = any, ParentType extends ResolversParentTypes['comment_likes'] = ResolversParentTypes['comment_likes']> = {
  comment?: Resolver<ResolversTypes['comments'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type CommentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['comments'] = ResolversParentTypes['comments']> = {
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  commentHashtags?: Resolver<Array<Maybe<ResolversTypes['comment_hashtags']>>, ParentType, ContextType>;
  comment_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment_likes?: Resolver<Array<Maybe<ResolversTypes['comment_likes']>>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mentionTargets?: Resolver<Array<Maybe<ResolversTypes['mention_targets']>>, ParentType, ContextType>;
  notificationTargets?: Resolver<Array<Maybe<ResolversTypes['notification_targets']>>, ParentType, ContextType>;
  post?: Resolver<ResolversTypes['posts'], ParentType, ContextType>;
  replies?: Resolver<Array<Maybe<ResolversTypes['comments']>>, ParentType, ContextType>;
  reportTargets?: Resolver<Array<Maybe<ResolversTypes['report_targets']>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type Content_HashtagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['content_hashtags'] = ResolversParentTypes['content_hashtags']> = {
  content?: Resolver<ResolversTypes['contents'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hashtag?: Resolver<ResolversTypes['hashtags'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type ContentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['contents'] = ResolversParentTypes['contents']> = {
  contentHashtags?: Resolver<Array<Maybe<ResolversTypes['content_hashtags']>>, ParentType, ContextType>;
  content_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  media?: Resolver<Array<Maybe<ResolversTypes['media']>>, ParentType, ContextType>;
  posts?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  scans?: Resolver<Maybe<ResolversTypes['scans']>, ParentType, ContextType>;
  stories?: Resolver<Maybe<ResolversTypes['stories']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ContentType'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['Visibility'], ParentType, ContextType>;
};

export type CountriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['countries'] = ResolversParentTypes['countries']> = {
  cities?: Resolver<Array<Maybe<ResolversTypes['cities']>>, ParentType, ContextType>;
  country_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  locations?: Resolver<Array<Maybe<ResolversTypes['locations']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Device_TokensResolvers<ContextType = any, ParentType extends ResolversParentTypes['device_tokens'] = ResolversParentTypes['device_tokens']> = {
  app_version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  device_type?: Resolver<ResolversTypes['DeviceType'], ParentType, ContextType>;
  last_used?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type Follow_RequestsResolvers<ContextType = any, ParentType extends ResolversParentTypes['follow_requests'] = ResolversParentTypes['follow_requests']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  requester?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['FollowRequestStatus'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type FollowsResolvers<ContextType = any, ParentType extends ResolversParentTypes['follows'] = ResolversParentTypes['follows']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  follower?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  following?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type HashtagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['hashtags'] = ResolversParentTypes['hashtags']> = {
  commentHashtags?: Resolver<Array<Maybe<ResolversTypes['comment_hashtags']>>, ParentType, ContextType>;
  contentHashtags?: Resolver<Array<Maybe<ResolversTypes['content_hashtags']>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hashtag_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type LocationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['locations'] = ResolversParentTypes['locations']> = {
  birth_profiles?: Resolver<Array<Maybe<ResolversTypes['profiles']>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['cities']>, ParentType, ContextType>;
  city_id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['countries'], ParentType, ContextType>;
  country_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  current_profiles?: Resolver<Array<Maybe<ResolversTypes['profiles']>>, ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  location_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  place_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  posts?: Resolver<Array<Maybe<ResolversTypes['posts']>>, ParentType, ContextType>;
  scans?: Resolver<Array<Maybe<ResolversTypes['scans']>>, ParentType, ContextType>;
};

export type MediaResolvers<ContextType = any, ParentType extends ResolversParentTypes['media'] = ResolversParentTypes['media']> = {
  content?: Resolver<Maybe<ResolversTypes['contents']>, ParentType, ContextType>;
  media_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post_blocks?: Resolver<Array<Maybe<ResolversTypes['post_blocks']>>, ParentType, ContextType>;
  storage_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['MediaType'], ParentType, ContextType>;
};

export type Mention_TargetsResolvers<ContextType = any, ParentType extends ResolversParentTypes['mention_targets'] = ResolversParentTypes['mention_targets']> = {
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  mentions?: Resolver<Array<Maybe<ResolversTypes['mentions']>>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  target_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MentionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['mentions'] = ResolversParentTypes['mentions']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  mention_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mention_target?: Resolver<Maybe<ResolversTypes['mention_targets']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type MessagesResolvers<ContextType = any, ParentType extends ResolversParentTypes['messages'] = ResolversParentTypes['messages']> = {
  chat?: Resolver<ResolversTypes['chats'], ParentType, ContextType>;
  message_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sent_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  text_content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type Notification_TargetsResolvers<ContextType = any, ParentType extends ResolversParentTypes['notification_targets'] = ResolversParentTypes['notification_targets']> = {
  chat?: Resolver<Maybe<ResolversTypes['chats']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  notifications?: Resolver<Array<Maybe<ResolversTypes['notifications']>>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  target_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type NotificationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['notifications'] = ResolversParentTypes['notifications']> = {
  actor?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
  delivered_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notification_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notification_target?: Resolver<Maybe<ResolversTypes['notification_targets']>, ParentType, ContextType>;
  read_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['NotificationType']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type Post_BlocksResolvers<ContextType = any, ParentType extends ResolversParentTypes['post_blocks'] = ResolversParentTypes['post_blocks']> = {
  block_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['media']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['posts'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BlockType'], ParentType, ContextType>;
};

export type Post_LikesResolvers<ContextType = any, ParentType extends ResolversParentTypes['post_likes'] = ResolversParentTypes['post_likes']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['posts'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type Post_TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['post_tags'] = ResolversParentTypes['post_tags']> = {
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['posts'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['tags'], ParentType, ContextType>;
  tag_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type PostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['posts'] = ResolversParentTypes['posts']> = {
  category?: Resolver<Maybe<ResolversTypes['categories']>, ParentType, ContextType>;
  category_id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['comments']>>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['contents'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  mentionTargets?: Resolver<Array<Maybe<ResolversTypes['mention_targets']>>, ParentType, ContextType>;
  notificationTargets?: Resolver<Array<Maybe<ResolversTypes['notification_targets']>>, ParentType, ContextType>;
  postTags?: Resolver<Array<Maybe<ResolversTypes['post_tags']>>, ParentType, ContextType>;
  post_blocks?: Resolver<Array<Maybe<ResolversTypes['post_blocks']>>, ParentType, ContextType>;
  post_likes?: Resolver<Array<Maybe<ResolversTypes['post_likes']>>, ParentType, ContextType>;
  reportTargets?: Resolver<Array<Maybe<ResolversTypes['report_targets']>>, ParentType, ContextType>;
  saved_posts?: Resolver<Array<Maybe<ResolversTypes['saved_posts']>>, ParentType, ContextType>;
  text_content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ProfilesResolvers<ContextType = any, ParentType extends ResolversParentTypes['profiles'] = ResolversParentTypes['profiles']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birth_date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  birth_location_details?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  current_location_details?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  first_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_private?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type Report_TargetsResolvers<ContextType = any, ParentType extends ResolversParentTypes['report_targets'] = ResolversParentTypes['report_targets']> = {
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['reports']>>, ParentType, ContextType>;
  story?: Resolver<Maybe<ResolversTypes['stories']>, ParentType, ContextType>;
  target_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ReportsResolvers<ContextType = any, ParentType extends ResolversParentTypes['reports'] = ResolversParentTypes['reports']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  report_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  report_target?: Resolver<ResolversTypes['report_targets'], ParentType, ContextType>;
  resolved_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  resolver?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReportStatus'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
};

export type RolesResolvers<ContextType = any, ParentType extends ResolversParentTypes['roles'] = ResolversParentTypes['roles']> = {
  role_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  role_name?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  users?: Resolver<Array<Maybe<ResolversTypes['users']>>, ParentType, ContextType>;
};

export type Saved_PostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['saved_posts'] = ResolversParentTypes['saved_posts']> = {
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  saved_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  saved_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type ScansResolvers<ContextType = any, ParentType extends ResolversParentTypes['scans'] = ResolversParentTypes['scans']> = {
  content?: Resolver<ResolversTypes['contents'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type StoriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['stories'] = ResolversParentTypes['stories']> = {
  content?: Resolver<ResolversTypes['contents'], ParentType, ContextType>;
  expires_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  reportTargets?: Resolver<Array<Maybe<ResolversTypes['report_targets']>>, ParentType, ContextType>;
  story_views?: Resolver<Array<Maybe<ResolversTypes['story_views']>>, ParentType, ContextType>;
};

export type Story_ViewsResolvers<ContextType = any, ParentType extends ResolversParentTypes['story_views'] = ResolversParentTypes['story_views']> = {
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  story?: Resolver<ResolversTypes['stories'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
  viewed_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['tags'] = ResolversParentTypes['tags']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post_tags?: Resolver<Array<Maybe<ResolversTypes['post_tags']>>, ParentType, ContextType>;
  tag_id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
};

export type UsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['users'] = ResolversParentTypes['users']> = {
  blocked_bys?: Resolver<Array<Maybe<ResolversTypes['blocks']>>, ParentType, ContextType>;
  blocked_users?: Resolver<Array<Maybe<ResolversTypes['blocks']>>, ParentType, ContextType>;
  chat_participants?: Resolver<Array<Maybe<ResolversTypes['chat_participants']>>, ParentType, ContextType>;
  comment_likes?: Resolver<Array<Maybe<ResolversTypes['comment_likes']>>, ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['comments']>>, ParentType, ContextType>;
  contents?: Resolver<Array<Maybe<ResolversTypes['contents']>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  device_tokens?: Resolver<Array<Maybe<ResolversTypes['device_tokens']>>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  follow_Requesters?: Resolver<Array<Maybe<ResolversTypes['follow_requests']>>, ParentType, ContextType>;
  follow_requests_targets?: Resolver<Array<Maybe<ResolversTypes['follow_requests']>>, ParentType, ContextType>;
  followers?: Resolver<Array<Maybe<ResolversTypes['follows']>>, ParentType, ContextType>;
  following?: Resolver<Array<Maybe<ResolversTypes['follows']>>, ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_banned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mentions?: Resolver<Array<Maybe<ResolversTypes['mentions']>>, ParentType, ContextType>;
  messages?: Resolver<Array<Maybe<ResolversTypes['messages']>>, ParentType, ContextType>;
  notification_actors?: Resolver<Array<Maybe<ResolversTypes['notifications']>>, ParentType, ContextType>;
  notifications?: Resolver<Array<Maybe<ResolversTypes['notifications']>>, ParentType, ContextType>;
  post_likes?: Resolver<Array<Maybe<ResolversTypes['post_likes']>>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['profiles']>, ParentType, ContextType>;
  report_resolvers?: Resolver<Array<Maybe<ResolversTypes['reports']>>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['reports']>>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['roles']>, ParentType, ContextType>;
  role_id?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  saved_posts?: Resolver<Array<Maybe<ResolversTypes['saved_posts']>>, ParentType, ContextType>;
  story_views?: Resolver<Array<Maybe<ResolversTypes['story_views']>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  blocks?: BlocksResolvers<ContextType>;
  categories?: CategoriesResolvers<ContextType>;
  chat_participants?: Chat_ParticipantsResolvers<ContextType>;
  chats?: ChatsResolvers<ContextType>;
  cities?: CitiesResolvers<ContextType>;
  comment_hashtags?: Comment_HashtagsResolvers<ContextType>;
  comment_likes?: Comment_LikesResolvers<ContextType>;
  comments?: CommentsResolvers<ContextType>;
  content_hashtags?: Content_HashtagsResolvers<ContextType>;
  contents?: ContentsResolvers<ContextType>;
  countries?: CountriesResolvers<ContextType>;
  device_tokens?: Device_TokensResolvers<ContextType>;
  follow_requests?: Follow_RequestsResolvers<ContextType>;
  follows?: FollowsResolvers<ContextType>;
  hashtags?: HashtagsResolvers<ContextType>;
  locations?: LocationsResolvers<ContextType>;
  media?: MediaResolvers<ContextType>;
  mention_targets?: Mention_TargetsResolvers<ContextType>;
  mentions?: MentionsResolvers<ContextType>;
  messages?: MessagesResolvers<ContextType>;
  notification_targets?: Notification_TargetsResolvers<ContextType>;
  notifications?: NotificationsResolvers<ContextType>;
  post_blocks?: Post_BlocksResolvers<ContextType>;
  post_likes?: Post_LikesResolvers<ContextType>;
  post_tags?: Post_TagsResolvers<ContextType>;
  posts?: PostsResolvers<ContextType>;
  profiles?: ProfilesResolvers<ContextType>;
  report_targets?: Report_TargetsResolvers<ContextType>;
  reports?: ReportsResolvers<ContextType>;
  roles?: RolesResolvers<ContextType>;
  saved_posts?: Saved_PostsResolvers<ContextType>;
  scans?: ScansResolvers<ContextType>;
  stories?: StoriesResolvers<ContextType>;
  story_views?: Story_ViewsResolvers<ContextType>;
  tags?: TagsResolvers<ContextType>;
  users?: UsersResolvers<ContextType>;
};

