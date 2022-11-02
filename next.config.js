module.exports = {
  env: {
    //   "BASE_URL": "http://localhost:3000",
    BASE_URL: 'https://drop-shop.vercel.app',
    MONGODB_URL:
      'mongodb+srv://0:0@cluster0.ufs0l.mongodb.net/dropshop?retryWrites=true&w=majority',
    ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
    REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
    STRIPE_PUBLISHABLE_KEY:
      'pk_test_51KaWdCEY7SjSewVOmmZffrk0Cr3v2KjWnhA1ZVMQNl8Q6jEBIGtmy6IlIEwp4U96hJFcl4ocpwHbQVBAKnHlj01T00bFv0fBr0',
    STRIPE_SECRET_KEY:
      'sk_test_51KaWdCEY7SjSewVOGyL52VdtVSWhEzYTyBMjFEdqEwwBZZrfns8TaXZvlE0Aw4PCxOZIA8az6iDApzRQ3zuDXGn9009uZFXSrp',
    STRIPE_WEBHOOK_SECRET: 'whsec_yDaOkjhEJYLSIB303ufNNdGivnjc2L2S',
  },
  reactStrictMode: true,
}
