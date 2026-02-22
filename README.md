# IMPROV

## Firebase setup

This app uses the Firebase **Web SDK** in the frontend.

1. Copy `.env.example` to `.env`.
2. Fill the `VITE_FIREBASE_*` values for your Firebase project.

Required keys:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional:
- `VITE_FIREBASE_MEASUREMENT_ID` (Analytics)

If env keys are missing, the app logs a warning and falls back to the bundled demo Firebase config.

> Do not put Firebase Admin SDK service-account private keys in frontend code or Vite env files.
