import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/authSchemas';
import { PasswordInput, Button, Alert, AlertDescription } from '@/components/ui';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  switch (score) {
    case 1:
    case 2:
      return { score, label: 'Weak', color: 'bg-rose-500' };
    case 3:
      return { score, label: 'Medium', color: 'bg-amber-500' };
    case 4:
      return { score, label: 'Strong', color: 'bg-emerald-500' };
    default:
      return { score: 0, label: '', color: 'bg-slate-700' };
  }
}

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setAuthError(null);
    const result = await resetPassword(data.password);
    if (result.error) {
      setAuthError(result.error);
    } else {
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Set new password</h1>
        <p className="text-xs text-slate-400">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {resetSuccess ? (
        <div className="space-y-4">
          <Alert variant="success" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}>
            <AlertDescription>
              Your password has been successfully reset! Redirecting to Sign In...
            </AlertDescription>
          </Alert>

          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/login')}
            className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500"
          >
            Sign In Now
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <PasswordInput
              {...register('password')}
              id="reset-password"
              label="New Password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={isSubmitting}
              required
            />

            {passwordValue && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Password strength</span>
                  <span className="font-medium text-slate-300">{strength.label}</span>
                </div>
                <div className="flex gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        step <= strength.score ? strength.color : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <PasswordInput
            {...register('confirmPassword')}
            id="reset-confirm-password"
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
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
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
          >
            Reset Password
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              Cancel and return to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordPage;
