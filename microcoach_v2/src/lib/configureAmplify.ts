import { Amplify } from 'aws-amplify';
// eslint-disable-next-line import/extensions
import awsExports from '../aws-exports';

// The frontend owns Amplify configuration for MicroCoach v2 (it holds the
// generated aws-exports for the new v2 auth app). Call once, before any auth
// request runs. See src/index.tsx.
export default function configureAmplify(): void {
  Amplify.configure(awsExports as Record<string, unknown>);
}
