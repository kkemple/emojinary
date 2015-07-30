import forEach from 'lodash.foreach';
import Promise from 'bluebird';
import stripeFactory from 'stripe';

import logger from './logger';

const stripe = stripeFactory(process.env.STRIPE_API_SECRET);

export default {
  subscribe (payload) {
    return new Promise((res, rej) => {
      stripe.customers
        .create({
          source: payload.token,
          email: payload.email,
          plan: process.env.STRIPE_PRO_PLAN
        }, (err, customer) => {
          if (err) {
            logger.error('error creating new stripe customer/subscription', {
              error: err,
              payload: payload
            });

            rej(err);
            return;
          }

          logger.info('new stripe customer/subscription created', {
            payload: payload,
            customer: customer
          });

          res(customer);
        });
    });
  },

  renew (id) {
    return new Promise((res, rej) => {
      stripe.customers
        .createSubscription(id, {
          plan: process.env.STRIPE_PRO_PLAN
        }, (err, subscription) => {
          if (err) {
            logger.error('error renewing subscription subscription', {
              error: err,
              stripe_id: id
            });

            rej(err);
            return;
          }

          logger.info('subscription renewed', {
            stripe_id: id,
            subscription: subscription
          });

          res(subscription);
        });
    });
  },

  cancel (id) {
    if (!id) {
      return Promise.resolve();
    }

    return new Promise((res, rej) => {
      stripe.customers
        .listSubscriptions(id, (err, subscriptions) => {
          var subId;

          if (err) {
            logger.error('error fetching subscriptions', {
              error: err,
              stripe_id: id
            });

            rej(err);
            return;
          }

          logger.info('subscriptions fetched for customer', {
            stripe_id: id,
            subscriptions: subscriptions.data
          });

          forEach(subscriptions.data, (s) => {
            if (s.plan.id === process.env.STRIPE_PRO_PLAN) {
              subId = s.id;
            }
          });

          if (subId) {
            stripe.customers
              .cancelSubscription(id, subId, (cancelErr, subscription) => {
                if (cancelErr) {
                  logger.error('error cancelling subscription', {
                    error: cancelErr,
                    stripe_id: id,
                    subscription_id: subId
                  });

                  rej(cancelErr);
                  return;
                }

                logger.info('subscription cancelled', {
                  stripe_id: id,
                  subscription: subscription
                });

                res(subscription);
              });
          } else {
            logger.info('no subscription to cancel', {
              stripe_id: id
            });

            res();
          }
        });
    });
  },

  remove (id) {
    return new Promise((res, rej) => {
      stripe.customers
        .del(id, (err, confirmation) => {
          if (err) {
            logger.error('error removing customer', {
              error: err,
              stripe_id: id
            });

            rej(err);
            return;
          }

          logger.info('stripe customer removed', {
            stripe_id: id,
            confirmation: confirmation
          });

          res();
        });
    });
  }
};
