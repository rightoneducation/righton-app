import { Auth } from 'aws-amplify';

export default () => (
  new Promise((resolve, reject) => {
    Auth.currentCredentials()
      .then(creds => resolve(creds))
      .catch(error => reject(error));
  })
);
