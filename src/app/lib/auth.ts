import { Auth, OAuthCredential, OAuthProvider, UserCredential, getAuth, getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { FirebaseApp, initializeApp } from 'firebase/app';

const app: FirebaseApp = initializeApp({
  apiKey: "AIzaSyCGguEZsFUHupKw86JkheKosMBpN5Xc7ps",
  authDomain: "main-project-378600.firebaseapp.com",
  projectId: "main-project-378600",
  storageBucket: "main-project-378600.appspot.com",
  messagingSenderId: "342456383129",
  appId: "1:342456383129:web:c3a9bc1c020c47edff6a08"
})

const auth: Auth = getAuth(app);
const provider = new OAuthProvider("oidc.keycloak");

if (!localStorage.getItem("flag")) {
  localStorage.setItem("flag", "1")
  signInWithRedirect(auth, provider);
}

export function signIn(): Promise<OAuthCredential | null> {
  return new Promise((res, rej) => {
    getRedirectResult(auth)
      .then((result) => {
        // User is signed in.
        if (!result) {
          rej("there is no result")
          return;
        }
        const credential = OAuthProvider.credentialFromResult(result);
        // This gives you an access token for the OIDC provider. You can use it to directly interact with that provider
        localStorage.removeItem("flag")
        res(credential);
      })
      .catch((error) => {
        // // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = OAuthProvider.credentialFromError(error);
        // Handle / display error.
        // ...
        rej(credential);
      });
  });
}