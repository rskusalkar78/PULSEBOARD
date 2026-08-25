import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/authSchemas';
import { Input, PasswordInput, Checkbox, Button, Alert, AlertDescription } from '@/components/ui';

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

export function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    const result = await registerAuth(data);
    if (result.error) {
      setAuthError(result.error);
    } else {
      setRegisteredSuccess(true);
      setTimeout(() => {
        navigate('/verify-email', { state: { email: data.email } });
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
        <p className="text-xs text-slate-400">
          Get started with executive analytics and performance monitoring.
        </p>
      </div>

      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      {registeredSuccess && (
        <Alert variant="success" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}>
          <AlertDescription>
            Account created successfully! Redirecting to email verification...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          {...register('fullName')}
          id="register-fullname"
          label="Full Name"
          placeholder="Alex Morgan"
          leftAddon={<UserIcon className="w-4 h-4" />}
          error={errors.fullName?.message}
          disabled={isSubmitting || registeredSuccess}
          required
        />

        <Input
          {...register('email')}
          id="register-email"
          type="email"
          label="Work Email"
          placeholder="alex.morgan@pulseboard.io"
          leftAddon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          disabled={isSubmitting || registeredSuccess}
          required
        />

        <div className="space-y-1.5">
          <PasswordInput
            {...register('password')}
            id="register-password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting || registeredSuccess}
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
          id="register-confirm-password"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting || registeredSuccess}
          required
        />

        <div className="pt-1">
          <Checkbox
            {...register('termsAccepted')}
            id="terms-accepted"
            label={
              <span>
                I agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="text-indigo-400 hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="text-indigo-400 hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            }
            error={errors.termsAccepted?.message}
            disabled={isSubmitting || registeredSuccess}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting || registeredSuccess}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400"
        >
          Create Account
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
