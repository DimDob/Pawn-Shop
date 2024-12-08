export const environment = {
  production: true,
  host: process.env["HOST"] || "https://pawn-shop-2uwd.onrender.com",
  stripe: {
    publishableKey: process.env["STRIPE_PUBLISHABLE_KEY"]
  },
  google: {
    clientId: process.env["GOOGLE_CLIENT_ID"]
  }
};
