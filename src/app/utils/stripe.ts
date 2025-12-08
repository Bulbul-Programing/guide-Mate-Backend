import Stripe from "stripe";
import { envVars } from "../envConfig";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY as string);

export default stripe;
