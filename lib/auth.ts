import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db("mentorlagbe")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  // usePlural keeps BetterAuth in sync with the Express models:
  // users / sessions / accounts / verifications (Mongoose maps User -> "users").
  // Without it BetterAuth writes a singular "user" collection and the server can
  // never find the account behind a JWT.
  database: mongodbAdapter(db, { usePlural: true }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "student", input: true },
      phone: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
      plan: { type: "string", defaultValue: "free" },
    },
  },
  session: { expiresIn: 60 * 60 * 24 * 30 },
  plugins: [
    jwt(), 
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  }
})