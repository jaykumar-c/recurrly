/**
 * English (en) localization dictionary.
 * Follows standard i18n structure for scalable internationalization and type safety.
 */
export const en = {
  auth: {
    brandName: "Recurly",
    brandTagline: "SMART BILLING",
    signInTitle: "Welcome back",
    signInSubtitle: "Sign in to continue managing your subscriptions",
    signUpTitle: "Create account",
    signUpSubtitle: "Track, analyze, and optimize all your subscriptions",
    verifyTitle: "Verify your email",
    verifySubtitlePrefix: "We've sent a 6-digit verification code to\n",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholderSignIn: "Enter your password",
    passwordPlaceholderSignUp: "Create a password",
    passwordHelper: "Must be at least 8 characters long",
    codeLabel: "Verification Code",
    codePlaceholder: "Enter 6-digit code",
    signInAction: "Sign in",
    signUpAction: "Create account",
    verifyAction: "Verify & Continue",
    googleAction: "Continue with Google",
    dividerText: "Or continue with",
    newToBrand: "New to Recurly?",
    createAccountLink: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign in",
    termsNotice:
      "By continuing, you agree to Recurly's Terms of Service and Privacy Policy.",
    resendAction: "Didn't receive a code? Resend",
    resendingAction: "Resending...",
    resendCooldownPrefix: "Resend code in ",
    editEmailAction: "Edit email address",
  },
  onboarding: {
    title: "Gain Financial Clarity",
    subtitle: "Track, analyze and cancel with ease",
    getStarted: "Get Started",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
  },
  settings: {
    title: "Settings",
    verifiedStatus: "Verified Account",
    accountSection: "Account Details",
    emailLabel: "Email",
    statusLabel: "Member Status",
    activeStatus: "Active",
    securitySection: "Security & Support",
    authLabel: "Authentication",
    protectedStatus: "Protected",
    signOutAction: "Sign Out",
    signOutTitle: "Sign Out",
    signOutPrompt: "Are you sure you want to sign out of your Recurly account?",
    cancelAction: "Cancel",
    fallbackName: "Member",
    unregisteredEmail: "No email registered",
  },
  validation: {
    emailRequired: "Email address is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordTooShort: "Password must be at least 8 characters long",
    codeRequired: "Please enter the verification code",
    authInitializing: "Authentication service is initializing. Please try again.",
    additionalVerificationRequired:
      "Additional verification required. Please check your account.",
    signOutFailed: "Could not sign out. Please try again.",
  },
} as const;

export type LocaleDictionary = typeof en;
export default en;
