import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  BigInt: { input: string; output: string; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
};

export type BlockedUsersResult = {
  __typename?: 'BlockedUsersResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  users: Array<Users>;
};

export type CommentsResult = {
  __typename?: 'CommentsResult';
  comments: Array<Comments>;
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
};

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

export type Feed = {
  __typename?: 'Feed';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  posts: Array<Posts>;
  stories: Array<StoryGroup>;
};

export enum FollowRequestStatus {
  Accepted = 'accepted',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type FollowRequestsResult = {
  __typename?: 'FollowRequestsResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  requests: Array<Follow_Requests>;
};

export type FollowResult = {
  __typename?: 'FollowResult';
  status: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FollowersResult = {
  __typename?: 'FollowersResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  users: Array<Users>;
};

export type FollowingResult = {
  __typename?: 'FollowingResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  users: Array<Users>;
};

export enum MediaType {
  Image = 'image',
  Video = 'video'
}

export type MessagesResult = {
  __typename?: 'MessagesResult';
  messages: Array<Messages>;
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  acceptFollowRequest: Scalars['Boolean']['output'];
  addChatParticipants: Chat_Participants;
  blockUser: Scalars['Boolean']['output'];
  cancelFollowRequest: Scalars['Boolean']['output'];
  createCategory: Categories;
  createCity: Cities;
  createComment: Comments;
  createContent: Contents;
  createCountry: Countries;
  createDirectChat: Chats;
  createGroupChat: Chats;
  createLocation: Locations;
  createReport: Reports;
  createTag: Tags;
  deleteCategory: Scalars['Boolean']['output'];
  deleteChat: Scalars['Boolean']['output'];
  deleteCity: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteContent: Scalars['Boolean']['output'];
  deleteCountry: Scalars['Boolean']['output'];
  deleteLocation: Scalars['Boolean']['output'];
  deleteMessage: Scalars['Boolean']['output'];
  deleteReport: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  followUser: FollowResult;
  leaveChat: Scalars['Boolean']['output'];
  markNotificationRead: Scalars['Boolean']['output'];
  registerDeviceToken: Device_Tokens;
  rejectFollowRequest: Scalars['Boolean']['output'];
  removeChatParticipant: Scalars['Boolean']['output'];
  sendMessage: Messages;
  toggleLikeComment: Scalars['Boolean']['output'];
  toggleLikePost: Scalars['Boolean']['output'];
  toggleSavePost: Scalars['Boolean']['output'];
  unblockUser: Scalars['Boolean']['output'];
  unfollowUser: Scalars['Boolean']['output'];
  unregisterAllDeviceTokens: Scalars['Boolean']['output'];
  unregisterDeviceToken: Scalars['Boolean']['output'];
  updateCategory: Categories;
  updateChat: Chats;
  updateCity: Cities;
  updateComment: Comments;
  updateContent: Contents;
  updateCountry: Countries;
  updateDeviceToken: Device_Tokens;
  updateLocation: Locations;
  updateMessage: Messages;
  updateTag: Tags;
  viewStory: StoryViewResult;
};


export type MutationAcceptFollowRequestArgs = {
  requesterId: Scalars['ID']['input'];
};


export type MutationAddChatParticipantsArgs = {
  chatId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
};


export type MutationBlockUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCancelFollowRequestArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  data: CategoriesCreateInput;
};


export type MutationCreateCityArgs = {
  data: CitiesCreateInput;
};


export type MutationCreateCommentArgs = {
  data: CommentsCreateInput;
};


export type MutationCreateContentArgs = {
  data: ContentsCreateInput;
};


export type MutationCreateCountryArgs = {
  data: CountriesCreateInput;
};


export type MutationCreateDirectChatArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateGroupChatArgs = {
  participantIds: Array<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateLocationArgs = {
  data: LocationsCreateInput;
};


export type MutationCreateReportArgs = {
  data: ReportsCreateInput;
};


export type MutationCreateTagArgs = {
  data: TagsCreateInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChatArgs = {
  chatId: Scalars['ID']['input'];
};


export type MutationDeleteCityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['ID']['input'];
};


export type MutationDeleteReportArgs = {
  reportId: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationFollowUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationLeaveChatArgs = {
  chatId: Scalars['ID']['input'];
};


export type MutationMarkNotificationReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationRegisterDeviceTokenArgs = {
  data: Device_TokensCreateInput;
};


export type MutationRejectFollowRequestArgs = {
  requesterId: Scalars['ID']['input'];
};


export type MutationRemoveChatParticipantArgs = {
  chatId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationSendMessageArgs = {
  chatId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};


export type MutationToggleLikeCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationToggleLikePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationToggleSavePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUnblockUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUnfollowUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUnregisterDeviceTokenArgs = {
  tokenId: Scalars['ID']['input'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoriesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateChatArgs = {
  data: ChatsUpdateInput;
};


export type MutationUpdateCityArgs = {
  data: CitiesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  data: CommentsUpdateInput;
};


export type MutationUpdateContentArgs = {
  data: ContentsUpdateInput;
};


export type MutationUpdateCountryArgs = {
  data: CountriesUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateDeviceTokenArgs = {
  data: Device_TokensUpdateInput;
};


export type MutationUpdateLocationArgs = {
  data: LocationsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateMessageArgs = {
  data: MessagesUpdateInput;
};


export type MutationUpdateTagArgs = {
  data: TagsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationViewStoryArgs = {
  storyId: Scalars['ID']['input'];
};

export enum NotificationType {
  Comment = 'comment',
  Like = 'like',
  Mention = 'mention',
  Message = 'message',
  Reply = 'reply',
  System = 'system'
}

export type NotificationsResult = {
  __typename?: 'NotificationsResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  notifications: Array<Notifications>;
};

export type ProfilePreview = {
  __typename?: 'ProfilePreview';
  avatar?: Maybe<Scalars['String']['output']>;
  first_name: Scalars['String']['output'];
  last_name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  blockedUsers: BlockedUsersResult;
  categories: Array<Categories>;
  chat?: Maybe<Chats>;
  chatMessages: MessagesResult;
  cities: Array<Cities>;
  comment?: Maybe<Comments>;
  commentReplies: CommentsResult;
  countries: Array<Countries>;
  deviceToken?: Maybe<Device_Tokens>;
  feed: Feed;
  followRequestStatus: FollowRequestStatus;
  followers: FollowersResult;
  following: FollowingResult;
  hashtags: Array<Hashtags>;
  location?: Maybe<Locations>;
  me: Users;
  myChats: Array<Chats>;
  myDeviceTokens: Array<Device_Tokens>;
  myFollowRequests: FollowRequestsResult;
  myReports: ReportsResult;
  notification?: Maybe<Notifications>;
  notifications: NotificationsResult;
  post?: Maybe<Posts>;
  postComments: CommentsResult;
  report?: Maybe<Reports>;
  scan?: Maybe<Scans>;
  tags: Array<Tags>;
  user: Users;
  userPosts: UserPostsResult;
  userSavedPosts: UserPostsResult;
  userScans: UserScansResult;
  users: UsersResult;
};


export type QueryBlockedUsersArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCategoriesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryChatArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChatMessagesArgs = {
  chatId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCitiesArgs = {
  countryId?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentRepliesArgs = {
  commentId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCountriesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeviceTokenArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFeedArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFollowRequestStatusArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryFollowersArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryFollowingArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryHashtagsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyFollowRequestsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyReportsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNotificationsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostCommentsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserPostsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryUserSavedPostsArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryUserScansArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum ReportStatus {
  Dismissed = 'dismissed',
  Pending = 'pending',
  Resolved = 'resolved',
  Reviewed = 'reviewed'
}

export enum ReportType {
  Comment = 'comment',
  Post = 'post',
  Profile = 'profile',
  Story = 'story'
}

export type ReportsResult = {
  __typename?: 'ReportsResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  reports: Array<Reports>;
};

export enum Role {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}

export type SearchUser = {
  __typename?: 'SearchUser';
  profile: ProfilePreview;
  user_id: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type StoryGroup = {
  __typename?: 'StoryGroup';
  stories: Array<Stories>;
  user: Users;
};

export type StoryViewResult = {
  __typename?: 'StoryViewResult';
  storyId: Scalars['ID']['output'];
  viewCount: Scalars['Int']['output'];
  viewed: Scalars['Boolean']['output'];
};

export type UserPostsResult = {
  __typename?: 'UserPostsResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  posts: Array<Posts>;
};

export type UserScansResult = {
  __typename?: 'UserScansResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  scans: Array<Scans>;
};

export type UsersResult = {
  __typename?: 'UsersResult';
  nextCursor?: Maybe<Scalars['DateTime']['output']>;
  users: Array<SearchUser>;
};

export enum Visibility {
  Followers = 'followers',
  Private = 'private',
  Public = 'public'
}

export type Categories = {
  __typename?: 'categories';
  category_id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CategoriesCreateInput = {
  name: Scalars['String']['input'];
};

export type CategoriesUpdateInput = {
  category_id: Scalars['Int']['input'];
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
  title?: Maybe<Scalars['String']['output']>;
};

export type ChatsCreateInput = {
  chatParticipants?: InputMaybe<Array<Chat_ParticipantsCreateInput>>;
  is_group_chat: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ChatsUpdateInput = {
  chat_id: Scalars['String']['input'];
  is_group_chat?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Cities = {
  __typename?: 'cities';
  city_id: Scalars['Int']['output'];
  country_id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CitiesCreateInput = {
  country_id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CitiesUpdateInput = {
  city_id: Scalars['Int']['input'];
  country_id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Comments = {
  __typename?: 'comments';
  comment_id: Scalars['String']['output'];
  comment_parent?: Maybe<Comments>;
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  isLiked: Scalars['Boolean']['output'];
  isMine: Scalars['Boolean']['output'];
  is_deleted: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
  post: Posts;
  replies: Array<Maybe<Comments>>;
  updated_at: Scalars['DateTime']['output'];
  user: Users;
};

export type CommentsCreateInput = {
  comment_parent_id?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  post_id: Scalars['String']['input'];
};

export type CommentsUpdateInput = {
  comment_id: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
};

export type Contents = {
  __typename?: 'contents';
  content_id: Scalars['String']['output'];
  content_map: Scalars['JSON']['output'];
  created_at: Scalars['DateTime']['output'];
  is_deleted: Scalars['Boolean']['output'];
  post?: Maybe<Posts>;
  scan?: Maybe<Scans>;
  story?: Maybe<Stories>;
  type: ContentType;
  updated_at: Scalars['DateTime']['output'];
  user: Users;
  visibility: Visibility;
};

export type ContentsCreateInput = {
  content_map: Scalars['JSON']['input'];
  post?: InputMaybe<PostsCreateInput>;
  scan?: InputMaybe<ScansCreateInput>;
  story?: InputMaybe<StoriesCreateInput>;
  type: ContentType;
  visibility: Visibility;
};

export type ContentsUpdateInput = {
  content_id: Scalars['String']['input'];
  content_map?: InputMaybe<Scalars['JSON']['input']>;
  post?: InputMaybe<PostsUpdateInput>;
  scan?: InputMaybe<ScansUpdateInput>;
  type?: InputMaybe<ContentType>;
  visibility?: InputMaybe<Visibility>;
};

export type Countries = {
  __typename?: 'countries';
  cities: Array<Maybe<Cities>>;
  country_id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CountriesCreateInput = {
  cities?: InputMaybe<Array<CitiesCreateInput>>;
  name: Scalars['String']['input'];
};

export type CountriesUpdateInput = {
  cities?: InputMaybe<Array<CitiesUpdateInput>>;
  country_id: Scalars['Int']['input'];
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
  token_id: Scalars['String']['input'];
};

export type Follow_Requests = {
  __typename?: 'follow_requests';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['BigInt']['output'];
  requester: Users;
  status: FollowRequestStatus;
  target: Users;
};

export type Hashtags = {
  __typename?: 'hashtags';
  created_at: Scalars['DateTime']['output'];
  hashtag_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Locations = {
  __typename?: 'locations';
  city?: Maybe<Cities>;
  country: Countries;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
  location_id: Scalars['String']['output'];
  place_id?: Maybe<Scalars['String']['output']>;
};

export type LocationsCreateInput = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  country_id: Scalars['Int']['input'];
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  place_id?: InputMaybe<Scalars['String']['input']>;
};

export type LocationsUpdateInput = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  country_id?: InputMaybe<Scalars['Int']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  location_id: Scalars['String']['input'];
  place_id?: InputMaybe<Scalars['String']['input']>;
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
  message_id: Scalars['String']['input'];
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

export type Posts = {
  __typename?: 'posts';
  category?: Maybe<Categories>;
  category_id?: Maybe<Scalars['Int']['output']>;
  commentsCount: Scalars['Int']['output'];
  content: Contents;
  isLiked: Scalars['Boolean']['output'];
  isSaved: Scalars['Boolean']['output'];
  likesCount: Scalars['Int']['output'];
  location?: Maybe<Locations>;
  savesCount: Scalars['Int']['output'];
  tags?: Maybe<Array<Tags>>;
};

export type PostsCreateInput = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<LocationsCreateInput>;
  tagsIDs?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PostsUpdateInput = {
  category_id?: InputMaybe<Scalars['Int']['input']>;
  content_id: Scalars['String']['input'];
  location?: InputMaybe<LocationsUpdateInput>;
  tagsIDs?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Profiles = {
  __typename?: 'profiles';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birth_date?: Maybe<Scalars['DateTime']['output']>;
  birth_location?: Maybe<Locations>;
  created_at: Scalars['DateTime']['output'];
  current_location?: Maybe<Locations>;
  first_name: Scalars['String']['output'];
  is_private?: Maybe<Scalars['Boolean']['output']>;
  last_name: Scalars['String']['output'];
  phone_number?: Maybe<Scalars['String']['output']>;
  profile_id: Scalars['String']['output'];
};

export type ProfilesCreateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_location?: InputMaybe<LocationsCreateInput>;
  current_location?: InputMaybe<LocationsCreateInput>;
  first_name: Scalars['String']['input'];
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

export type ProfilesUpdateInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_location?: InputMaybe<LocationsUpdateInput>;
  current_location?: InputMaybe<LocationsUpdateInput>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  profile_id: Scalars['String']['input'];
};

export type Report_Targets = {
  __typename?: 'report_targets';
  comment?: Maybe<Comments>;
  post?: Maybe<Posts>;
  profile?: Maybe<Profiles>;
  reports: Array<Maybe<Reports>>;
  story?: Maybe<Stories>;
  target_id: Scalars['String']['output'];
};

export type Reports = {
  __typename?: 'reports';
  created_at: Scalars['DateTime']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  report_id: Scalars['String']['output'];
  report_target: Report_Targets;
  report_target_id: Scalars['String']['output'];
  reporter?: Maybe<Users>;
  resolved_at?: Maybe<Scalars['DateTime']['output']>;
  resolver?: Maybe<Users>;
  status: ReportStatus;
};

export type ReportsCreateInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  report_target_id: Scalars['String']['input'];
  type: ReportType;
};

export type Roles = {
  __typename?: 'roles';
  role_id: Scalars['Int']['output'];
  role_name: Role;
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
  content_id: Scalars['String']['input'];
  location?: InputMaybe<LocationsUpdateInput>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
};

export type Stories = {
  __typename?: 'stories';
  content: Contents;
  expires_at?: Maybe<Scalars['DateTime']['output']>;
  hasViewed: Scalars['Boolean']['output'];
  viewCount: Scalars['Int']['output'];
};

export type StoriesCreateInput = {
  expires_at?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Tags = {
  __typename?: 'tags';
  name: Scalars['String']['output'];
  tag_id: Scalars['Int']['output'];
};

export type TagsCreateInput = {
  name: Scalars['String']['input'];
};

export type TagsUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  tag_id: Scalars['Int']['input'];
};

export type Users = {
  __typename?: 'users';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  followersCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  isBlocked: Scalars['Boolean']['output'];
  isFollowing: Scalars['Boolean']['output'];
  isMe: Scalars['Boolean']['output'];
  is_active: Scalars['Boolean']['output'];
  is_banned: Scalars['Boolean']['output'];
  profile?: Maybe<Profiles>;
  role?: Maybe<Roles>;
  updated_at: Scalars['DateTime']['output'];
  user_id: Scalars['String']['output'];
  username: Scalars['String']['output'];
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
  BlockedUsersResult: ResolverTypeWrapper<BlockedUsersResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CommentsResult: ResolverTypeWrapper<CommentsResult>;
  ContentType: ContentType;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeviceType: DeviceType;
  Feed: ResolverTypeWrapper<Feed>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FollowRequestStatus: FollowRequestStatus;
  FollowRequestsResult: ResolverTypeWrapper<FollowRequestsResult>;
  FollowResult: ResolverTypeWrapper<FollowResult>;
  FollowersResult: ResolverTypeWrapper<FollowersResult>;
  FollowingResult: ResolverTypeWrapper<FollowingResult>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  MediaType: MediaType;
  MessagesResult: ResolverTypeWrapper<MessagesResult>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NotificationType: NotificationType;
  NotificationsResult: ResolverTypeWrapper<NotificationsResult>;
  ProfilePreview: ResolverTypeWrapper<ProfilePreview>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ReportStatus: ReportStatus;
  ReportType: ReportType;
  ReportsResult: ResolverTypeWrapper<ReportsResult>;
  Role: Role;
  SearchUser: ResolverTypeWrapper<SearchUser>;
  StoryGroup: ResolverTypeWrapper<StoryGroup>;
  StoryViewResult: ResolverTypeWrapper<StoryViewResult>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UserPostsResult: ResolverTypeWrapper<UserPostsResult>;
  UserScansResult: ResolverTypeWrapper<UserScansResult>;
  UsersResult: ResolverTypeWrapper<UsersResult>;
  Visibility: Visibility;
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
  comments: ResolverTypeWrapper<Comments>;
  commentsCreateInput: CommentsCreateInput;
  commentsUpdateInput: CommentsUpdateInput;
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
  hashtags: ResolverTypeWrapper<Hashtags>;
  locations: ResolverTypeWrapper<Locations>;
  locationsCreateInput: LocationsCreateInput;
  locationsUpdateInput: LocationsUpdateInput;
  messages: ResolverTypeWrapper<Messages>;
  messagesCreateInput: MessagesCreateInput;
  messagesUpdateInput: MessagesUpdateInput;
  notification_targets: ResolverTypeWrapper<Notification_Targets>;
  notifications: ResolverTypeWrapper<Notifications>;
  posts: ResolverTypeWrapper<Posts>;
  postsCreateInput: PostsCreateInput;
  postsUpdateInput: PostsUpdateInput;
  profiles: ResolverTypeWrapper<Profiles>;
  profilesCreateInput: ProfilesCreateInput;
  profilesUpdateInput: ProfilesUpdateInput;
  report_targets: ResolverTypeWrapper<Report_Targets>;
  reports: ResolverTypeWrapper<Reports>;
  reportsCreateInput: ReportsCreateInput;
  roles: ResolverTypeWrapper<Roles>;
  scans: ResolverTypeWrapper<Scans>;
  scansCreateInput: ScansCreateInput;
  scansUpdateInput: ScansUpdateInput;
  stories: ResolverTypeWrapper<Stories>;
  storiesCreateInput: StoriesCreateInput;
  tags: ResolverTypeWrapper<Tags>;
  tagsCreateInput: TagsCreateInput;
  tagsUpdateInput: TagsUpdateInput;
  users: ResolverTypeWrapper<Users>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt']['output'];
  BlockedUsersResult: BlockedUsersResult;
  Boolean: Scalars['Boolean']['output'];
  CommentsResult: CommentsResult;
  DateTime: Scalars['DateTime']['output'];
  Feed: Feed;
  Float: Scalars['Float']['output'];
  FollowRequestsResult: FollowRequestsResult;
  FollowResult: FollowResult;
  FollowersResult: FollowersResult;
  FollowingResult: FollowingResult;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  MessagesResult: MessagesResult;
  Mutation: Record<PropertyKey, never>;
  NotificationsResult: NotificationsResult;
  ProfilePreview: ProfilePreview;
  Query: Record<PropertyKey, never>;
  ReportsResult: ReportsResult;
  SearchUser: SearchUser;
  StoryGroup: StoryGroup;
  StoryViewResult: StoryViewResult;
  String: Scalars['String']['output'];
  UserPostsResult: UserPostsResult;
  UserScansResult: UserScansResult;
  UsersResult: UsersResult;
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
  comments: Comments;
  commentsCreateInput: CommentsCreateInput;
  commentsUpdateInput: CommentsUpdateInput;
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
  hashtags: Hashtags;
  locations: Locations;
  locationsCreateInput: LocationsCreateInput;
  locationsUpdateInput: LocationsUpdateInput;
  messages: Messages;
  messagesCreateInput: MessagesCreateInput;
  messagesUpdateInput: MessagesUpdateInput;
  notification_targets: Notification_Targets;
  notifications: Notifications;
  posts: Posts;
  postsCreateInput: PostsCreateInput;
  postsUpdateInput: PostsUpdateInput;
  profiles: Profiles;
  profilesCreateInput: ProfilesCreateInput;
  profilesUpdateInput: ProfilesUpdateInput;
  report_targets: Report_Targets;
  reports: Reports;
  reportsCreateInput: ReportsCreateInput;
  roles: Roles;
  scans: Scans;
  scansCreateInput: ScansCreateInput;
  scansUpdateInput: ScansUpdateInput;
  stories: Stories;
  storiesCreateInput: StoriesCreateInput;
  tags: Tags;
  tagsCreateInput: TagsCreateInput;
  tagsUpdateInput: TagsUpdateInput;
  users: Users;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BlockedUsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockedUsersResult'] = ResolversParentTypes['BlockedUsersResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['users']>, ParentType, ContextType>;
};

export type CommentsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentsResult'] = ResolversParentTypes['CommentsResult']> = {
  comments?: Resolver<Array<ResolversTypes['comments']>, ParentType, ContextType>;
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FeedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Feed'] = ResolversParentTypes['Feed']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['posts']>, ParentType, ContextType>;
  stories?: Resolver<Array<ResolversTypes['StoryGroup']>, ParentType, ContextType>;
};

export type FollowRequestsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowRequestsResult'] = ResolversParentTypes['FollowRequestsResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  requests?: Resolver<Array<ResolversTypes['follow_requests']>, ParentType, ContextType>;
};

export type FollowResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowResult'] = ResolversParentTypes['FollowResult']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type FollowersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowersResult'] = ResolversParentTypes['FollowersResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['users']>, ParentType, ContextType>;
};

export type FollowingResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowingResult'] = ResolversParentTypes['FollowingResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['users']>, ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MessagesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesResult'] = ResolversParentTypes['MessagesResult']> = {
  messages?: Resolver<Array<ResolversTypes['messages']>, ParentType, ContextType>;
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  acceptFollowRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAcceptFollowRequestArgs, 'requesterId'>>;
  addChatParticipants?: Resolver<ResolversTypes['chat_participants'], ParentType, ContextType, RequireFields<MutationAddChatParticipantsArgs, 'chatId' | 'userIds'>>;
  blockUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationBlockUserArgs, 'userId'>>;
  cancelFollowRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCancelFollowRequestArgs, 'userId'>>;
  createCategory?: Resolver<ResolversTypes['categories'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'data'>>;
  createCity?: Resolver<ResolversTypes['cities'], ParentType, ContextType, RequireFields<MutationCreateCityArgs, 'data'>>;
  createComment?: Resolver<ResolversTypes['comments'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'data'>>;
  createContent?: Resolver<ResolversTypes['contents'], ParentType, ContextType, RequireFields<MutationCreateContentArgs, 'data'>>;
  createCountry?: Resolver<ResolversTypes['countries'], ParentType, ContextType, RequireFields<MutationCreateCountryArgs, 'data'>>;
  createDirectChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationCreateDirectChatArgs, 'userId'>>;
  createGroupChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationCreateGroupChatArgs, 'participantIds'>>;
  createLocation?: Resolver<ResolversTypes['locations'], ParentType, ContextType, RequireFields<MutationCreateLocationArgs, 'data'>>;
  createReport?: Resolver<ResolversTypes['reports'], ParentType, ContextType, RequireFields<MutationCreateReportArgs, 'data'>>;
  createTag?: Resolver<ResolversTypes['tags'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'data'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteChat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteChatArgs, 'chatId'>>;
  deleteCity?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCityArgs, 'id'>>;
  deleteComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'commentId'>>;
  deleteContent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  deleteCountry?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCountryArgs, 'id'>>;
  deleteLocation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteLocationArgs, 'id'>>;
  deleteMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'messageId'>>;
  deleteReport?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteReportArgs, 'reportId'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  followUser?: Resolver<ResolversTypes['FollowResult'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'userId'>>;
  leaveChat?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLeaveChatArgs, 'chatId'>>;
  markNotificationRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMarkNotificationReadArgs, 'notificationId'>>;
  registerDeviceToken?: Resolver<ResolversTypes['device_tokens'], ParentType, ContextType, RequireFields<MutationRegisterDeviceTokenArgs, 'data'>>;
  rejectFollowRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRejectFollowRequestArgs, 'requesterId'>>;
  removeChatParticipant?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveChatParticipantArgs, 'chatId' | 'userId'>>;
  sendMessage?: Resolver<ResolversTypes['messages'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'chatId' | 'text'>>;
  toggleLikeComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationToggleLikeCommentArgs, 'commentId'>>;
  toggleLikePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationToggleLikePostArgs, 'postId'>>;
  toggleSavePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationToggleSavePostArgs, 'postId'>>;
  unblockUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnblockUserArgs, 'userId'>>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'userId'>>;
  unregisterAllDeviceTokens?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unregisterDeviceToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnregisterDeviceTokenArgs, 'tokenId'>>;
  updateCategory?: Resolver<ResolversTypes['categories'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'data' | 'id'>>;
  updateChat?: Resolver<ResolversTypes['chats'], ParentType, ContextType, RequireFields<MutationUpdateChatArgs, 'data'>>;
  updateCity?: Resolver<ResolversTypes['cities'], ParentType, ContextType, RequireFields<MutationUpdateCityArgs, 'data' | 'id'>>;
  updateComment?: Resolver<ResolversTypes['comments'], ParentType, ContextType, RequireFields<MutationUpdateCommentArgs, 'data'>>;
  updateContent?: Resolver<ResolversTypes['contents'], ParentType, ContextType, RequireFields<MutationUpdateContentArgs, 'data'>>;
  updateCountry?: Resolver<ResolversTypes['countries'], ParentType, ContextType, RequireFields<MutationUpdateCountryArgs, 'data' | 'id'>>;
  updateDeviceToken?: Resolver<ResolversTypes['device_tokens'], ParentType, ContextType, RequireFields<MutationUpdateDeviceTokenArgs, 'data'>>;
  updateLocation?: Resolver<ResolversTypes['locations'], ParentType, ContextType, RequireFields<MutationUpdateLocationArgs, 'data' | 'id'>>;
  updateMessage?: Resolver<ResolversTypes['messages'], ParentType, ContextType, RequireFields<MutationUpdateMessageArgs, 'data'>>;
  updateTag?: Resolver<ResolversTypes['tags'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'data' | 'id'>>;
  viewStory?: Resolver<ResolversTypes['StoryViewResult'], ParentType, ContextType, RequireFields<MutationViewStoryArgs, 'storyId'>>;
};

export type NotificationsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationsResult'] = ResolversParentTypes['NotificationsResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  notifications?: Resolver<Array<ResolversTypes['notifications']>, ParentType, ContextType>;
};

export type ProfilePreviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfilePreview'] = ResolversParentTypes['ProfilePreview']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blockedUsers?: Resolver<ResolversTypes['BlockedUsersResult'], ParentType, ContextType, RequireFields<QueryBlockedUsersArgs, 'limit'>>;
  categories?: Resolver<Array<ResolversTypes['categories']>, ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  chat?: Resolver<Maybe<ResolversTypes['chats']>, ParentType, ContextType, RequireFields<QueryChatArgs, 'id'>>;
  chatMessages?: Resolver<ResolversTypes['MessagesResult'], ParentType, ContextType, RequireFields<QueryChatMessagesArgs, 'chatId'>>;
  cities?: Resolver<Array<ResolversTypes['cities']>, ParentType, ContextType, Partial<QueryCitiesArgs>>;
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType, RequireFields<QueryCommentArgs, 'id'>>;
  commentReplies?: Resolver<ResolversTypes['CommentsResult'], ParentType, ContextType, RequireFields<QueryCommentRepliesArgs, 'commentId' | 'limit'>>;
  countries?: Resolver<Array<ResolversTypes['countries']>, ParentType, ContextType, Partial<QueryCountriesArgs>>;
  deviceToken?: Resolver<Maybe<ResolversTypes['device_tokens']>, ParentType, ContextType, RequireFields<QueryDeviceTokenArgs, 'id'>>;
  feed?: Resolver<ResolversTypes['Feed'], ParentType, ContextType, RequireFields<QueryFeedArgs, 'limit'>>;
  followRequestStatus?: Resolver<ResolversTypes['FollowRequestStatus'], ParentType, ContextType, RequireFields<QueryFollowRequestStatusArgs, 'userId'>>;
  followers?: Resolver<ResolversTypes['FollowersResult'], ParentType, ContextType, RequireFields<QueryFollowersArgs, 'limit' | 'userId'>>;
  following?: Resolver<ResolversTypes['FollowingResult'], ParentType, ContextType, RequireFields<QueryFollowingArgs, 'limit' | 'userId'>>;
  hashtags?: Resolver<Array<ResolversTypes['hashtags']>, ParentType, ContextType, Partial<QueryHashtagsArgs>>;
  location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType, RequireFields<QueryLocationArgs, 'id'>>;
  me?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  myChats?: Resolver<Array<ResolversTypes['chats']>, ParentType, ContextType>;
  myDeviceTokens?: Resolver<Array<ResolversTypes['device_tokens']>, ParentType, ContextType>;
  myFollowRequests?: Resolver<ResolversTypes['FollowRequestsResult'], ParentType, ContextType, RequireFields<QueryMyFollowRequestsArgs, 'limit'>>;
  myReports?: Resolver<ResolversTypes['ReportsResult'], ParentType, ContextType, RequireFields<QueryMyReportsArgs, 'limit'>>;
  notification?: Resolver<Maybe<ResolversTypes['notifications']>, ParentType, ContextType, RequireFields<QueryNotificationArgs, 'id'>>;
  notifications?: Resolver<ResolversTypes['NotificationsResult'], ParentType, ContextType, RequireFields<QueryNotificationsArgs, 'limit'>>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  postComments?: Resolver<ResolversTypes['CommentsResult'], ParentType, ContextType, RequireFields<QueryPostCommentsArgs, 'limit' | 'postId'>>;
  report?: Resolver<Maybe<ResolversTypes['reports']>, ParentType, ContextType, RequireFields<QueryReportArgs, 'id'>>;
  scan?: Resolver<Maybe<ResolversTypes['scans']>, ParentType, ContextType, RequireFields<QueryScanArgs, 'id'>>;
  tags?: Resolver<Array<ResolversTypes['tags']>, ParentType, ContextType, Partial<QueryTagsArgs>>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userPosts?: Resolver<ResolversTypes['UserPostsResult'], ParentType, ContextType, RequireFields<QueryUserPostsArgs, 'limit' | 'userId'>>;
  userSavedPosts?: Resolver<ResolversTypes['UserPostsResult'], ParentType, ContextType, RequireFields<QueryUserSavedPostsArgs, 'limit' | 'userId'>>;
  userScans?: Resolver<ResolversTypes['UserScansResult'], ParentType, ContextType, RequireFields<QueryUserScansArgs, 'limit' | 'userId'>>;
  users?: Resolver<ResolversTypes['UsersResult'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'limit'>>;
};

export type ReportsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReportsResult'] = ResolversParentTypes['ReportsResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  reports?: Resolver<Array<ResolversTypes['reports']>, ParentType, ContextType>;
};

export type SearchUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchUser'] = ResolversParentTypes['SearchUser']> = {
  profile?: Resolver<ResolversTypes['ProfilePreview'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type StoryGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoryGroup'] = ResolversParentTypes['StoryGroup']> = {
  stories?: Resolver<Array<ResolversTypes['stories']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type StoryViewResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoryViewResult'] = ResolversParentTypes['StoryViewResult']> = {
  storyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  viewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  viewed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type UserPostsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPostsResult'] = ResolversParentTypes['UserPostsResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['posts']>, ParentType, ContextType>;
};

export type UserScansResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserScansResult'] = ResolversParentTypes['UserScansResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  scans?: Resolver<Array<ResolversTypes['scans']>, ParentType, ContextType>;
};

export type UsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = {
  nextCursor?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['SearchUser']>, ParentType, ContextType>;
};

export type CategoriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['categories'] = ResolversParentTypes['categories']> = {
  category_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CitiesResolvers<ContextType = any, ParentType extends ResolversParentTypes['cities'] = ResolversParentTypes['cities']> = {
  city_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  country_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CommentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['comments'] = ResolversParentTypes['comments']> = {
  comment_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment_parent?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isMine?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['posts'], ParentType, ContextType>;
  replies?: Resolver<Array<Maybe<ResolversTypes['comments']>>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
};

export type ContentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['contents'] = ResolversParentTypes['contents']> = {
  content_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content_map?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  is_deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  scan?: Resolver<Maybe<ResolversTypes['scans']>, ParentType, ContextType>;
  story?: Resolver<Maybe<ResolversTypes['stories']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ContentType'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['users'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['Visibility'], ParentType, ContextType>;
};

export type CountriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['countries'] = ResolversParentTypes['countries']> = {
  cities?: Resolver<Array<Maybe<ResolversTypes['cities']>>, ParentType, ContextType>;
  country_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type HashtagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['hashtags'] = ResolversParentTypes['hashtags']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hashtag_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type LocationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['locations'] = ResolversParentTypes['locations']> = {
  city?: Resolver<Maybe<ResolversTypes['cities']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['countries'], ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  location_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  place_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type PostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['posts'] = ResolversParentTypes['posts']> = {
  category?: Resolver<Maybe<ResolversTypes['categories']>, ParentType, ContextType>;
  category_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  commentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['contents'], ParentType, ContextType>;
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSaved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  likesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  savesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['tags']>>, ParentType, ContextType>;
};

export type ProfilesResolvers<ContextType = any, ParentType extends ResolversParentTypes['profiles'] = ResolversParentTypes['profiles']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  birth_date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  birth_location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  current_location?: Resolver<Maybe<ResolversTypes['locations']>, ParentType, ContextType>;
  first_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_private?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  last_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Report_TargetsResolvers<ContextType = any, ParentType extends ResolversParentTypes['report_targets'] = ResolversParentTypes['report_targets']> = {
  comment?: Resolver<Maybe<ResolversTypes['comments']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['posts']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['profiles']>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['reports']>>, ParentType, ContextType>;
  story?: Resolver<Maybe<ResolversTypes['stories']>, ParentType, ContextType>;
  target_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ReportsResolvers<ContextType = any, ParentType extends ResolversParentTypes['reports'] = ResolversParentTypes['reports']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  report_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  report_target?: Resolver<ResolversTypes['report_targets'], ParentType, ContextType>;
  report_target_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reporter?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
  resolved_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  resolver?: Resolver<Maybe<ResolversTypes['users']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReportStatus'], ParentType, ContextType>;
};

export type RolesResolvers<ContextType = any, ParentType extends ResolversParentTypes['roles'] = ResolversParentTypes['roles']> = {
  role_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role_name?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
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
  hasViewed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  viewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['tags'] = ResolversParentTypes['tags']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tag_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type UsersResolvers<ContextType = any, ParentType extends ResolversParentTypes['users'] = ResolversParentTypes['users']> = {
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followersCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isBlocked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isMe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_banned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['profiles']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['roles']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  BlockedUsersResult?: BlockedUsersResultResolvers<ContextType>;
  CommentsResult?: CommentsResultResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Feed?: FeedResolvers<ContextType>;
  FollowRequestsResult?: FollowRequestsResultResolvers<ContextType>;
  FollowResult?: FollowResultResolvers<ContextType>;
  FollowersResult?: FollowersResultResolvers<ContextType>;
  FollowingResult?: FollowingResultResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  MessagesResult?: MessagesResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotificationsResult?: NotificationsResultResolvers<ContextType>;
  ProfilePreview?: ProfilePreviewResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReportsResult?: ReportsResultResolvers<ContextType>;
  SearchUser?: SearchUserResolvers<ContextType>;
  StoryGroup?: StoryGroupResolvers<ContextType>;
  StoryViewResult?: StoryViewResultResolvers<ContextType>;
  UserPostsResult?: UserPostsResultResolvers<ContextType>;
  UserScansResult?: UserScansResultResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
  categories?: CategoriesResolvers<ContextType>;
  chat_participants?: Chat_ParticipantsResolvers<ContextType>;
  chats?: ChatsResolvers<ContextType>;
  cities?: CitiesResolvers<ContextType>;
  comments?: CommentsResolvers<ContextType>;
  contents?: ContentsResolvers<ContextType>;
  countries?: CountriesResolvers<ContextType>;
  device_tokens?: Device_TokensResolvers<ContextType>;
  follow_requests?: Follow_RequestsResolvers<ContextType>;
  hashtags?: HashtagsResolvers<ContextType>;
  locations?: LocationsResolvers<ContextType>;
  messages?: MessagesResolvers<ContextType>;
  notification_targets?: Notification_TargetsResolvers<ContextType>;
  notifications?: NotificationsResolvers<ContextType>;
  posts?: PostsResolvers<ContextType>;
  profiles?: ProfilesResolvers<ContextType>;
  report_targets?: Report_TargetsResolvers<ContextType>;
  reports?: ReportsResolvers<ContextType>;
  roles?: RolesResolvers<ContextType>;
  scans?: ScansResolvers<ContextType>;
  stories?: StoriesResolvers<ContextType>;
  tags?: TagsResolvers<ContextType>;
  users?: UsersResolvers<ContextType>;
};

