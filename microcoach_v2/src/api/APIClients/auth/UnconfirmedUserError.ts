/**
 * The email/password were right, but the account never confirmed its sign-up
 * code. Amplify reports this as a successful signIn whose next step is
 * CONFIRM_SIGN_UP rather than throwing, so it is raised here to keep it apart
 * from "no profile" — the user needs a fresh code, not the sign-up form.
 */
export class UnconfirmedUserError extends Error {
  constructor() {
    super('UNCONFIRMED_USER');
    this.name = 'UnconfirmedUserError';
  }
}
