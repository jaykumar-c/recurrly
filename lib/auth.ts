import { en } from "@/locales/en";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import * as AuthSession from "expo-auth-session";

export interface ValidationResult<T> {
  isValid: boolean;
  errors: T;
}

export function validateSignIn(
  email: string,
  password: string
): ValidationResult<{ email?: string; password?: string }> {
  const errors: { email?: string; password?: string } = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = en.validation.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = en.validation.emailInvalid;
  }

  if (!password) {
    errors.password = en.validation.passwordRequired;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignUp(
  email: string,
  password: string
): ValidationResult<{ email?: string; password?: string }> {
  const errors: { email?: string; password?: string } = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = en.validation.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = en.validation.emailInvalid;
  }

  if (!password) {
    errors.password = en.validation.passwordRequired;
  } else if (password.length < 8) {
    errors.password = en.validation.passwordTooShort;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface AuthOperationResult {
  success: boolean;
  error?: string;
  isComplete?: boolean;
  needsVerification?: boolean;
}

export async function executePasswordSignIn(
  signIn: any,
  email: string,
  password: string,
  setActive?: (params: { session: string }) => Promise<void>
): Promise<AuthOperationResult> {
  try {
    const signInAttempt = await signIn.create({
      identifier: email.trim(),
      password,
    });

    if (signInAttempt.status === "complete") {
      if (setActive && signInAttempt.createdSessionId) {
        await setActive({ session: signInAttempt.createdSessionId });
      }
      return { success: true, isComplete: true };
    }

    if (signInAttempt.status === "needs_second_factor") {
      const emailFactor = signInAttempt.supportedSecondFactors?.find(
        (f: any) => f.strategy === "email_code"
      );
      if (emailFactor) {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
      }
      return { success: true, needsVerification: true };
    }

    if (signInAttempt.status === "needs_first_factor") {
      const emailFactor = signInAttempt.supportedFirstFactors?.find(
        (f: any) => f.strategy === "email_code"
      );
      if (emailFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
      }
      return { success: true, needsVerification: true };
    }

    return {
      success: false,
      error: en.validation.additionalVerificationRequired,
    };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeSignInVerifyOtp(
  signIn: any,
  code: string,
  setActive?: (params: { session: string }) => Promise<void>
): Promise<AuthOperationResult> {
  try {
    let result;
    if (signIn.status === "needs_second_factor") {
      result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code.trim(),
      });
    } else {
      result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });
    }

    if (result.status === "complete") {
      if (setActive && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }
      return { success: true, isComplete: true };
    }

    return {
      success: false,
      error: en.validation.additionalVerificationRequired,
    };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeResendSignInOtp(
  signIn: any
): Promise<AuthOperationResult> {
  try {
    if (signIn.status === "needs_second_factor") {
      await signIn.prepareSecondFactor({ strategy: "email_code" });
    } else if (signIn.status === "needs_first_factor") {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (f: any) => f.strategy === "email_code"
      );
      if (emailFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executePasswordSignUp(
  signUp: any,
  email: string,
  password: string
): Promise<AuthOperationResult> {
  try {
    await signUp.create({
      emailAddress: email.trim(),
      password,
    });

    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    return { success: true, needsVerification: true };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeVerifyEmailCode(
  signUp: any,
  code: string,
  setActive?: (params: { session: string }) => Promise<void>
): Promise<AuthOperationResult> {
  try {
    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code: code.trim(),
    });

    if (completeSignUp.status === "complete") {
      if (setActive && completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
      }
      return { success: true, isComplete: true };
    }

    return {
      success: false,
      error: en.validation.additionalVerificationRequired,
    };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeResendVerificationCode(
  signUp: any
): Promise<AuthOperationResult> {
  try {
    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeResetSignUp(_signUp: any): Promise<void> {
  // Graceful state reset hook
}

export async function executeGoogleAuth(
  startSSOFlow: (params: any) => Promise<any>
): Promise<AuthOperationResult> {
  try {
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: "oauth_google",
      redirectUrl: AuthSession.makeRedirectUri(),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });
      }
      return { success: true, isComplete: true };
    }

    return { success: false };
  } catch (err) {
    return { success: false, error: getAuthErrorMessage(err) };
  }
}

export async function executeSignOut(
  signOut: () => Promise<void>
): Promise<AuthOperationResult> {
  try {
    await signOut();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getAuthErrorMessage(err) || en.validation.signOutFailed,
    };
  }
}
