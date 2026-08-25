import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/authSchemas';
import { Input, Button, Alert, AlertDescription } from '@/components/ui';

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setAuthError(null);
    const result = await forgotPassword(data.email);
    if (result.error) {
      setAuthError(result.error);
    } else {
      setSubmittedEmail(data.email);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">Reset your password</h1>
        <p className="text-xs text-slate-400">
          Enter the email address linked to your account and we&apos;ll send you instructions to
          reset your password.
        </p>
      </div>

      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {submittedEmail ? (
        <div className="space-y-4">
          <Alert variant="success" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}>
            <AlertDescription>
              Instructions to reset your password have been sent to{' '}
              <strong className="text-slate-100">{submittedEmail}</strong>. Please check your inbox.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            fullWidth
            onClick={() => setSubmittedEmail(null)}
            className="text-xs text-slate-300 border-slate-700"
          >
            Didn&apos;t receive email? Try again
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            {...register('email')}
            id="forgot-email"
            type="email"
            label="Work Email"
            placeholder="alex.morgan@pulseboard.io"
            leftAddon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={isSubmitting}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
            className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
          >
            Send Reset Instructions
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
