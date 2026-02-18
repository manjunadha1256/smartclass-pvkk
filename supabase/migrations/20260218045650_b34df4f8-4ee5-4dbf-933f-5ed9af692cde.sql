
-- Create storage bucket for quiz uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('quiz-uploads', 'quiz-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for quiz-uploads bucket
CREATE POLICY "Authenticated users can upload quiz files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quiz-uploads');

CREATE POLICY "Authenticated users can read quiz files"
ON storage.objects FOR SELECT
USING (bucket_id = 'quiz-uploads');

-- Create quizzes table to store generated quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_code TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  section TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quizzes by code"
ON public.quizzes FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (true);
