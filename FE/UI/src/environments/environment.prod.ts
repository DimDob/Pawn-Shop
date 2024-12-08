export const environment = {
  production: true,
  host: process.env["NG_APP_HOST"] || "https://pawn-shop-2uwd.onrender.com",
  stripe: {
    publishableKey: process.env["NG_APP_STRIPE_PUBLISHABLE_KEY"] || "pk_test_51QIbSJEiHz0Qd84krtOOWXUeSOTGcyYtYln2jseDriIQcKGFLDMSU0PrNTYUzaygkG9bWb85qeBjCgAnLNjBVP6W000Awpy5fJ"
  },
  google: {
    clientId: process.env["NG_APP_GOOGLE_CLIENT_ID"] || "330278508587-to2kfidhb611106vcpehancribb7li0t.apps.googleusercontent.com"
  }
}; 
