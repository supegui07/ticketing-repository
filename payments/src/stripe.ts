import Stripe from "stripe";
import { get } from "config";

export const stripe = new Stripe(get('stripe.secretKey'), {
  apiVersion: '2020-08-27'
})