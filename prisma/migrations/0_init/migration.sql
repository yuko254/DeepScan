BEGIN;

-- CREATE LANGUAGE plpgsql;
-- CREATE EXTENSION pgagent;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule(
--     'cleanup-stale-device-tokens',     -- job name
--     '0 3 * * 0',                       -- cron schedule: every Sunday at 3:00 AM
--     $$DELETE FROM public.device_tokens WHERE last_used < NOW() - INTERVAL '60 days'$$
-- );

CREATE TABLE IF NOT EXISTS public.locations (
    location_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    place_id VARCHAR(255) -- Google Places ID or similar
);

CREATE TABLE IF NOT EXISTS public.roles
(
	role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.users
(
    user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	role_id BIGINT DEFAULT 2,
    username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(60) NOT NULL,
	FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE SET NULL
);
CREATE INDEX idx_users_username_trgm ON public.users USING gin (username gin_trgm_ops);

CREATE TABLE IF NOT EXISTS public.profiles
(
    profile_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL UNIQUE,
	is_private BOOLEAN DEFAULT false,
    bio TEXT,
    avatar TEXT,
	birth_location uuid,
	current_location uuid,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	phone_number VARCHAR(20),
	birth_date DATE,
	created_at timestamptz DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (birth_location) REFERENCES public.locations(location_id) ON DELETE SET NULL,
	FOREIGN KEY (current_location) REFERENCES public.locations(location_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.reports
(
    report_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id uuid,
    reported_item_id uuid NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    reason text,
    status VARCHAR(50),
    created_at timestamptz DEFAULT now(),
	FOREIGN KEY (reporter_id) REFERENCES public.users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.categories
(
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.posts
(
    post_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    category_id BIGINT,
	location_id uuid,
	text_content text,
	created_at timestamptz DEFAULT now(),
	updated_at timestamptz,
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL,
	FOREIGN KEY (location_id) REFERENCES public.locations(location_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.saved_posts
(
    saved_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    post_id uuid,
    saved_at timestamptz DEFAULT now(),
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE SET NULL
);
-- Ensure a user can save a specific post only once (when post_id is known)
CREATE UNIQUE INDEX idx_unique_user_post ON public.saved_posts (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE INDEX idx_saves_post_id ON public.saved_posts(post_id);
-- indices for faster lookups of all saved posts by user or all users who saved a post
CREATE INDEX idx_saved_posts_user_id ON public.saved_posts(user_id);
CREATE INDEX idx_saved_posts_post_id ON public.saved_posts(post_id);

CREATE TABLE IF NOT EXISTS public.scan_history
(
    scan_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    "timestamp" timestamptz DEFAULT now(),
    metadata text,
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.stories
(
    story_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    expires_at timestamptz,
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.follows
(
    follower_id uuid,
    following_id uuid,
    created_at timestamptz DEFAULT now(),
	PRIMARY KEY (follower_id, following_id),
	FOREIGN KEY (follower_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (following_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);
-- Index for queries like "Who follows me?" / "Who is following user X?"
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

CREATE TABLE IF NOT EXISTS public.blocks
(
    blocker_id uuid,
    blocked_id uuid,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
	CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);
-- Essential for reverse lookups (who blocked me?)
CREATE INDEX idx_blocks_blocked_id ON public.blocks (blocked_id);

CREATE TABLE IF NOT EXISTS public.chats
(
    chat_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255),
    is_group_chat boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_participants
(
    user_id uuid,
    chat_id uuid,
    joined_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, chat_id),
    FOREIGN KEY (chat_id) REFERENCES public.chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);
-- Index for fast lookup of all chats a user is in
CREATE INDEX idx_chat_participants_chat_id ON public.chat_participants(chat_id);

CREATE TABLE IF NOT EXISTS public.messages
(
    message_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id uuid NOT NULL,
    sender_id uuid,
    text_content text,
    sent_at timestamptz DEFAULT now(),
    FOREIGN KEY (chat_id) REFERENCES public.chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE SET NULL
);
-- Indexes for common queries
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_sent_at ON public.messages(sent_at);  -- For sorting by time

CREATE TABLE IF NOT EXISTS public.notifications
(
    notification_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id uuid NOT NULL,
    target_id uuid NOT NULL, -- the ID of the post/comment/user etc.
    type VARCHAR(20),
    message text,
	delivered_at timestamptz DEFAULT now(),
    read_at timestamptz,
	FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.media
(
    media_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    storage_path text NOT NULL,
    media_type VARCHAR(50),
    post_id uuid,
    story_id uuid,
    scan_id uuid,
	FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE,
	FOREIGN KEY (story_id) REFERENCES public.stories(story_id) ON DELETE CASCADE,
	FOREIGN KEY (scan_id) REFERENCES public.scan_history(scan_id) ON DELETE CASCADE
);

    CREATE TABLE IF NOT EXISTS public.post_blocks
    (
        block_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id uuid NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'image', 'video')),
        position INT NOT NULL,
        content JSONB NOT NULL,
        media_id uuid, -- Only used when type = 'image' or 'video'
        created_at timestamptz DEFAULT now(),
        FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (media_id) REFERENCES public.media(media_id) ON DELETE SET NULL,
        CONSTRAINT unique_post_block_position UNIQUE (post_id, position)
    );
    CREATE INDEX idx_post_blocks_post_id_position ON public.post_blocks(post_id, position);
    CREATE INDEX idx_post_blocks_type ON public.post_blocks(type);

CREATE TABLE IF NOT EXISTS public.comments (
    comment_id   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content      text NOT NULL,
    user_id      uuid,
    post_id      uuid NOT NULL,
    parent_id    uuid, -- NULL for top-level comments, else points to another comment_id
    created_at   timestamptz DEFAULT now(),
    updated_at   timestamptz,
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE
);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);

CREATE TABLE IF NOT EXISTS public.post_likes (
    user_id uuid,
    post_id uuid,
	created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
    user_id uuid,
    comment_id uuid,
	created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.story_views (
    story_id uuid,
    viewer_id uuid,
    viewed_at timestamptz DEFAULT now(),
    PRIMARY KEY (story_id, viewer_id),
    FOREIGN KEY (story_id) REFERENCES public.stories(story_id) ON DELETE CASCADE,
    FOREIGN KEY (viewer_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.hashtags (
    hashtag_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- without the '#' symbol
    post_count INT DEFAULT 0,
    created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_hashtags_name_trgm ON public.hashtags USING gin (name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS public.post_hashtags (
    post_id uuid NOT NULL,
    hashtag_id uuid NOT NULL,
	created_at timestamptz DEFAULT now(),
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES public.hashtags(hashtag_id) ON DELETE CASCADE
);
CREATE INDEX idx_post_hashtags_hashtag_id ON public.post_hashtags(hashtag_id);

CREATE TABLE IF NOT EXISTS public.mentions (
    mention_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    mentioned_user_id uuid NOT NULL,
    post_id uuid,
    comment_id uuid,
    created_at timestamptz DEFAULT now(),
    FOREIGN KEY (mentioned_user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE,
    CONSTRAINT mention_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS public.device_tokens (
    token_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    token TEXT NOT NULL,                -- The actual push token
    device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('ios', 'android', 'web')),
    app_version VARCHAR(20),                  -- track app version
    last_used timestamptz DEFAULT now(),    -- For cleaning up stale tokens
    created_at timestamptz DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, token)                    -- A user may have multiple devices, but no duplicate tokens
);
-- Index for finding all tokens of a user
CREATE INDEX idx_device_tokens_user_id ON public.device_tokens(user_id);
-- Index for cleaning expired tokens
CREATE INDEX idx_device_tokens_last_used ON public.device_tokens(last_used);

END;

-- Create a function that checks participant count before insert
CREATE OR REPLACE FUNCTION check_direct_chat_participant_limit()
RETURNS TRIGGER AS $$
DECLARE
    is_group BOOLEAN;
    participant_count INT;
BEGIN
    -- Get the chat type
    SELECT is_group_chat INTO is_group
    FROM public.chats
    WHERE chat_id = NEW.chat_id;

    -- If it's a direct chat, check current participant count
    IF is_group = FALSE THEN
        SELECT COUNT(*) INTO participant_count
        FROM public.chat_participants
        WHERE chat_id = NEW.chat_id;

        -- If already 2 participants (or more, defensively), reject
        IF participant_count >= 2 THEN
            RAISE EXCEPTION 'Direct chats cannot have more than 2 participants. Chat % already has % participants.',
                NEW.chat_id, participant_count;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the chat_participants table
CREATE TRIGGER enforce_direct_chat_limit
    BEFORE INSERT ON public.chat_participants
    FOR EACH ROW
    EXECUTE FUNCTION check_direct_chat_participant_limit();