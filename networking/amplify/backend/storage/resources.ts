import { defineStorage } from '@aws-amplify/backend';

export const userDataBucket = defineStorage({
  name: 'user-data-bucket',
  access: (allow) => ({
    'assets/photos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read','write']),
    ]
  })
});

export const reportingDataBucket = defineStorage({
  name: 'reporting-data-bucket',
  access: (allow) => ({
   'reportingData/logs/*': [
     allow.groups(['admins']).to(['read','write']),
   ],
   'reportingData/performance/*': [
     allow.groups(['admins']).to(['read','write']),
   ]
 })
});