// Vercel entry point: Vercel ei file ta serverless function hisebe chalay.
// Local e chalate `npm run dev` (src/index.js) use koro.
import { createApp } from "../src/app.js";
import { seedData } from "../src/store/seed.js";

seedData();
export default createApp();
