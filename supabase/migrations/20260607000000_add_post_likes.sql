ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS like_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_post_like_count(post_id_input uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_like_count integer;
BEGIN
  UPDATE public.posts
  SET like_count = like_count + 1
  WHERE id = post_id_input
  RETURNING like_count INTO updated_like_count;

  IF updated_like_count IS NULL THEN
    RAISE EXCEPTION 'post_not_found';
  END IF;

  RETURN updated_like_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_like_count(uuid) TO anon, authenticated;
