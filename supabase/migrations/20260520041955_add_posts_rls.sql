-- Enable RLS on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "allow_public_read" ON public.posts;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.posts;
DROP POLICY IF EXISTS "allow_owner_update" ON public.posts;
DROP POLICY IF EXISTS "allow_owner_delete" ON public.posts;

-- 1) SELECT: Anyone can read posts
CREATE POLICY "allow_public_read"
ON public.posts FOR SELECT
USING (true);

-- 2) INSERT: Only authenticated users can create posts with their own user_id
CREATE POLICY "allow_authenticated_insert"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3) UPDATE: Only post owners can update their posts
CREATE POLICY "allow_owner_update"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4) DELETE: Only post owners can delete their posts
CREATE POLICY "allow_owner_delete"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);
