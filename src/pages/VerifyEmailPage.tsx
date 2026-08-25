import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MailCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { verifyEmailSchema, type VerifyEmailFormData } from '@/features/auth/schemas/authSchemas';
import { Input, Button, Alert, AlertDescription } from '@/components/ui';

export function VerifyEmailPage() {
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = (location.state as { email?: string })?.email || 'alex.morgan@pulseboard.io';

  const [authError, setAuthError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '123456',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    setAuthError(null);
    const result = await verifyEmail(data.code, userEmail);
    if (result.error) {
      setAuthError(result.error);
    } else {
      setVerifiedSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setAuthError(null);
    setResendMessage(null);
    const result = await resendVerification(userEmail);
    if (result.error) {
      setAuthError(result.error);
    } else {
      setResendMessage(`A new verification code has been sent to ${userEmail}.`);
      setResendCooldown(30);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 border border-indigo-500/20">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Verify your email</h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          We sent a 6-digit confirmation code to{' '}
          <span className="font-semibold text-slate-200">{userEmail}</span>. Enter it below to
          complete setup.
        </p>
      </div>

      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {resendMessage && (
        <Alert variant="info" onClose={() => setResendMessage(null)}>
          <AlertDescription>{resendMessage}</AlertDescription>
        </Alert>
      )}

      {verifiedSuccess ? (
        <div className="space-y-4">
          <Alert variant="success" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}>
            <AlertDescription>
              Email verified successfully! Access granted to PulseBoard Workspace.
            </AlertDescription>
          </Alert>

          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500"
          >
            Continue to Dashboard
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">
              Tip: Enter any 6-digit code (e.g. 123456) for instant demo verification
            </span>
            <Input
              {...register('code')}
              id="verification-code"
              label="6-Digit Verification Code"
              placeholder="123456"
              maxLength={6}
              className="text-center tracking-widest font-mono text-lg"
              error={errors.code?.message}
              disabled={isSubmitting}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
          >
            Verify & Proceed
          </Button>

          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline disabled:text-slate-500 disabled:no-underline transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't get a code? Resend verification email"}
            </button>

            <Link
              to="/login"
              className="text-xs text-slate-400 hover:text-slate-300 hover:underline transition-colors mt-2"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default VerifyEmailPage;
