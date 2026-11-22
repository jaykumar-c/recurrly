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
  } else if (password.length < 15) {
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
    if (typeof signIn?.create === "function") {
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
        if (typeof signIn.prepareSecondFactor === "function") {
          await signIn.prepareSecondFactor({ strategy: "email_code" });
        }
        return { success: true, needsVerification: true };
      }

      if (signInAttempt.status === "needs_first_factor") {
        const emailFactor = signInAttempt.supportedFirstFactors?.find(
          (f: any) => f.strategy === "email_code"
        );
        if (emailFactor && typeof signIn.prepareFirstFactor === "function") {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });
        }
        return { success: true, needsVerification: true };
      }
    } else if (typeof signIn?.password === "function") {
      const res = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
      if (signIn.status === "complete") {
        if (typeof signIn.finalize === "function") {
          await signIn.finalize();
        }
        return { success: true, isComplete: true };
      }
      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_first_factor"
      ) {
        if (
          signIn.verifications &&
          typeof signIn.verifications.sendEmailCode === "function"
        ) {
          await signIn.verifications.sendEmailCode();
        }
        return { success: true, needsVerification: true };
      }
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
    let result: any;
    let sessionId: string | null = null;
    let isComplete = false;

    if (
      typeof signIn?.attemptSecondFactor === "function" &&
      signIn.status === "needs_second_factor"
    ) {
      result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code.trim(),
      });
      if (result?.status === "complete") {
        isComplete = true;
        sessionId = result.createdSessionId;
      }
    } else if (typeof signIn?.attemptFirstFactor === "function") {
      result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });
      if (result?.status === "complete") {
        isComplete = true;
        sessionId = result.createdSessionId;
      }
    } else if (
      signIn?.verifications &&
      typeof signIn.verifications.verifyEmailCode === "function"
    ) {
      const res = await signIn.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
      if (typeof signIn.finalize === "function") {
        await signIn.finalize();
      }
      isComplete = true;
    }

    if (isComplete) {
      if (setActive && sessionId) {
        await setActive({ session: sessionId });
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
    if (signIn?.status === "needs_second_factor") {
      if (typeof signIn.prepareSecondFactor === "function") {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
      }
    } else if (signIn?.status === "needs_first_factor") {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (f: any) => f.strategy === "email_code"
      );
      if (emailFactor && typeof signIn.prepareFirstFactor === "function") {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailFactor.emailAddressId,
        });
      }
    } else if (
      signIn?.verifications &&
      typeof signIn.verifications.sendEmailCode === "function"
    ) {
      await signIn.verifications.sendEmailCode();
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
    if (typeof signUp?.create === "function") {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });
    } else if (typeof signUp?.password === "function") {
      const res = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
    }

    if (typeof signUp?.prepareEmailAddressVerification === "function") {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } else if (
      signUp?.verifications &&
      typeof signUp.verifications.sendEmailCode === "function"
    ) {
      const res = await signUp.verifications.sendEmailCode();
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
    }

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
    let sessionId: string | null = null;
    let isComplete = false;

    if (typeof signUp?.attemptEmailAddressVerification === "function") {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });
      if (attempt?.status === "complete") {
        isComplete = true;
        sessionId = attempt.createdSessionId;
      }
    } else if (
      signUp?.verifications &&
      typeof signUp.verifications.verifyEmailCode === "function"
    ) {
      const res = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
      if (typeof signUp.finalize === "function") {
        const finRes = await signUp.finalize();
        if (finRes?.error) {
          return { success: false, error: getAuthErrorMessage(finRes.error) };
        }
        isComplete = true;
      } else if (signUp.status === "complete") {
        isComplete = true;
        sessionId = signUp.createdSessionId;
      }
    }

    if (isComplete) {
      if (setActive && sessionId) {
        await setActive({ session: sessionId });
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
    if (typeof signUp?.prepareEmailAddressVerification === "function") {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } else if (
      signUp?.verifications &&
      typeof signUp.verifications.sendEmailCode === "function"
    ) {
      const res = await signUp.verifications.sendEmailCode();
      if (res?.error) {
        return { success: false, error: getAuthErrorMessage(res.error) };
      }
    }
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
