import SignupForm from '@/components/SignupForm';

function normalizeRedirectTarget(redirect?: string | string[]) {
  const value = Array.isArray(redirect) ? redirect[0] : redirect;
  return value && value.startsWith('/') ? value : '/posts';
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string | string[] }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectTarget = normalizeRedirectTarget(resolvedSearchParams?.redirect);

  return <SignupForm redirectTarget={redirectTarget} />;
}
