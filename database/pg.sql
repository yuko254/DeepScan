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