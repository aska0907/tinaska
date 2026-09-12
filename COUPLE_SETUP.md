# Login setup

No Firestore setup is required. Sign in with the existing Firebase email and
password account as usual.

The app no longer checks for `couples/tinaska`, member UIDs, or a separate
configuration document. Do not add passwords to the source code: Firebase
Authentication securely handles them when you sign in.
