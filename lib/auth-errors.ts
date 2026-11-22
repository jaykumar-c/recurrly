export function getAuthErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const code = error.code || (error.errors && error.errors[0]?.code);

  switch (code) {
    case "form_identifier_not_found":
      return "No account found with this email. Please check your email or create an account.";
    case "form_password_incorrect":
      return "Incorrect password. Please try again.";
    case "form_identifier_exists":
      return "An account with this email already exists. Please sign in instead.";
    case "form_password_length_too_short":
      return "Password must be at least 15 characters long.";
    case "form_password_pwned":
      return "This password is too common or compromised. Please choose a more secure password.";
    case "form_code_incorrect":
      return "The verification code is incorrect. Please check your email and try again.";
    case "verification_expired":
      return "The verification code has expired. Please request a new code.";
    case "verification_failed":
      return "Verification failed. Please request a new code.";
    case "too_many_requests":
      return "Too many attempts. Please wait a few moments and try again.";
    case "network_error":
      return "Network connection problem. Please check your internet connection.";
    default:
      break;
  }

  const rawMsg =
    error.longMessage ||
    error.message ||
    (error.errors && (error.errors[0]?.longMessage || error.errors[0]?.message));

  if (typeof rawMsg === "string" && rawMsg.trim().length > 0) {
    return rawMsg
      .replace(/clerk/gi, "Recurly")
      .replace(/FAPI/g, "Authentication service");
  }

  return "Authentication failed. Please verify your details and try again.";
}
