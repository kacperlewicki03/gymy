import i18n from "../i18n";

export function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return i18n.t("authErrors.invalidEmail");
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return i18n.t("authErrors.invalidCredentials");
    case "auth/email-already-in-use":
      return i18n.t("authErrors.emailInUse");
    case "auth/weak-password":
      return i18n.t("authErrors.weakPassword");
    case "auth/network-request-failed":
      return i18n.t("authErrors.networkFailed");
    case "auth/too-many-requests":
      return i18n.t("authErrors.tooManyRequests");
    default:
      return i18n.t("authErrors.unknown");
  }
}
