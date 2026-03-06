const express = require("express");
const userModel = require("../Models/userModel");
const { userAuth } = require("../Middlewares/userAuth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentRouter = express.Router();

paymentRouter.get("/subscribe", async (req, res) => {
  const { plan, userId } = req.query;
  if (!plan) return res.status(400).send("No Plan Found");

  if (plan.toLowerCase() === "free") {
    await userModel.findByIdAndUpdate(userId, {
      $set: {
        planType: "free",
        "subscription.status": "active",
        "subscription.planId": null,
        "subscription.subscriptionId": null,
        "customer.id": null,
      },
    });
    return res.redirect(`${process.env.BASE_URL_FRONTEND}/home`);
  }

  let priceId;
  switch (plan.toLowerCase()) {
    case "premium":
      priceId = "price_1SJCfhJmymflNNKhqEES2kks";
      break;
    default:
      return res.status(400).send("Invalid Plan");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.BASE_URL_BACKEND}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL_BACKEND}/payment/cancel`,
  });

  res.redirect(session.url);
});

paymentRouter.get("/success", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.redirect(`${process.env.BASE_URL_FRONTEND}/fail`);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });

    const subscription = session.subscription;
    const customer = session.customer;
    const userEmail = session.customer_details.email;

    await userModel.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          planType: "premium",
          "subscription.planId": subscription.items.data[0].price.id,
          "subscription.subscriptionId": subscription.id,
          "subscription.status": subscription.status,
          "customer.id": customer.id,
        },
      }
    );

    res.redirect(`${process.env.BASE_URL_FRONTEND}/success`);
  } catch (err) {
    console.error("Stripe Success Error:", err);
    res.redirect(`${process.env.BASE_URL_FRONTEND}/fail`);
  }
});

paymentRouter.get("/cancel", async (req, res) => {
  res.redirect(`${process.env.BASE_URL_FRONTEND}/fail`);
});

paymentRouter.get(
  "/manage/subscription/:customerId",
  userAuth,
  async (req, res) => {
    const user = req?.user;
    if (!user) res.redirect(`${process.env.BASE_URL_FRONTEND}/login`);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: req?.params?.customerId,
      return_url: `${process.env.BASE_URL_FRONTEND}/home`,
    });
    const url = portalSession.url;
    res.status(200).json({ message: "Success", url: url });
  }
);

module.exports = paymentRouter;
