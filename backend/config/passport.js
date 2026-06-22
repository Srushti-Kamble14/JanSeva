// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import prisma from "./prisma.js";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0]?.value;

//         let user = await prisma.user.findUnique({
//           where: { email },
//         });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               email,
//               fullName: profile.displayName,
//               googleId: profile.id,
             
//             },
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// export default passport;
console.log("PASSPORT FILE LOADED");

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";

console.log("GOOGLE_CLIENT_ID:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GOOGLE VERIFY HIT");
      console.log("EMAIL:", profile.emails?.[0]?.value);

      try {
        const email = profile.emails?.[0]?.value;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("EXISTING USER:", user?.id);

        if (!user) {
          console.log("CREATING USER");

          user = await prisma.user.create({
            data: {
              email,
              fullName: profile.displayName,
              googleId: profile.id,
            },
          });

          console.log("USER CREATED:", user.id);
        }

        console.log("DONE SUCCESS");

        return done(null, user);
      } catch (error) {
        console.log("GOOGLE ERROR:");
        console.log(error);

        return done(error, null);
      }
    }
  )
);

export default passport;