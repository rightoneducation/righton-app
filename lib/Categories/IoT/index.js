/* eslint-disable */

import AWS from 'aws-sdk';
import { Auth, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import getCurrentCredentials from '../Auth/Components/getCurrentCredentials';
import config from './config';
import debug from '../../../src/utils/debug';

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
        debug.log('Error when getting credentials in order to attach an Iot policy', error);
        reject(error);
      });
  })
);

/**
 * Subscribes to multiple MQTT Topics
 *
 * @param {array} || @param {string} topic string or [] of the topics that are being subscribed to
 * @param {fn} messageHandler the handler that should be called when a message is received
 */

let subscribedTopic = {};

export const IOTSubscribeToTopic = (topic, messageHandler, context) => {
  attachIotPolicy()
    .then(() => {
      subscribedTopic = PubSub.subscribe(topic, []).subscribe({
        next: (data) => {
          debug.log('Message received', JSON.stringify(data.value.msg));
          if (messageHandler) messageHandler(data, context);
        },
        error: error => debug.error('Error subscribing to topic', error),
        close: () => debug.log('Done'),
      });
    })
    .catch(error => debug.log('Error when trying to attach an Iot Policy: ', error));
};

export const unsubscribeFromTopic = () => {
  if (subscribedTopic && typeof subscribedTopic.unsubscribe === 'function') {
    subscribedTopic.unsubscribe();
  }
  subscribedTopic = {};
  debug.log('Unsubscribed from topic');
};

export const publishMessage = async (topic, message) => {
  await PubSub.publish(topic, { msg: message }).catch(e => debug.log('Error sending message', e));
  debug.log('Successfully sent message', message, 'to GameRoom:', topic);
};
