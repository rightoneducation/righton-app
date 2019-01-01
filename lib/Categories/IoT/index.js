/* eslint-disable */

import AWS from 'aws-sdk';
import { Auth, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import getCurrentCredentials from '../Auth/Components/getCurrentCredentials';
import config from './config';

/**
 * Attaches the current user credentials to the AWSIoTProvider so
 * the signed in user has the ability to recieve data from subscribed
 * MQTT Topics.
 *
 * Resolves a promise if the credentials were received and the Provider
 * was successfully attached to the amplify class
 */
export const attachIotPolicy = () => (
  new Promise((resolve, reject) => {
    getCurrentCredentials()
      .then(async (credentials) => {
        PubSub.addPluggable(new AWSIoTProvider({
          ...config.pubSub,
        }));

        const iot = new AWS.Iot({
          ...config.pubSub,
          region: 'us-east-1',
          credentials: Auth.essentialCredentials(credentials)
        });

        const policyName = 'RightOn_IoT_Policy';
        const target = credentials._identityId;

        const { policies } = await iot.listAttachedPolicies({ target }).promise();

        if (!policies.find(policy => policy.policyName === policyName)) {
          await iot.attachPolicy({ policyName, target }).promise();
        }

        resolve();
      })
      .catch((error) => {
        console.log('Error when getting credentials in order to attach an Iot policy', error);
        reject(error);
      });
  })
);

/**
 * Subscribes to multiple MQTT Topics
 *
 * @param {array} || @param {string} topics string or [] of the topics that are being subscribed to
 * @param {fn} messageHandler the handler that should be called when a message is received
 */

let subscribedTopic = {};

export const IOTSubscribeToMultipleTopics = (topics, messageHandler) => {
  attachIotPolicy()
    .then(() => {
      subscribedTopic = PubSub.subscribe(topics, []).subscribe({
        next: (data) => {
          console.log('Message received', data);
          if (messageHandler) messageHandler(data);
        },
        error: error => console.error('Error subscribing to topic', error),
        close: () => console.log('Done'),
      });
    })
    .catch(error => console.log('Error when trying to attach an Iot Policy: ', error));
};

export const unsubscribeFromTopics = () => {
  subscribedTopic.unsubscribe();
  subscribedTopic = {};
  console.log('Unsubscribed from topic');
};

export const publishMessage = async (topics, message) => {
  await PubSub.publish(topics, { msg: message }).catch(e => console.log('Error sending message', e));
  console.log('Successfully sent message', message);
};
