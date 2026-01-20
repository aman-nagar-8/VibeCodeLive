import { Suspense } from 'react';
import VerifyEmailClient from './verifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification…</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
