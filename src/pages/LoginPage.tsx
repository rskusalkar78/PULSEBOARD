import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/authSchemas';
import { Input, PasswordInput, Checkbox, Button, Alert, AlertDescription } from '@/components/ui';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.morgan@pulseboard.io',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const result = await login(data);
    if (result.error) {
      setAuthError(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
        <p className="text-xs text-slate-400">
          Sign in to access your PulseBoard executive metrics workspace.
        </p>
      </div>

      {authError && (
        <Alert variant="danger" onClose={() => setAuthError(null)}>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          {...register('email')}
          id="login-email"
          type="email"
          label="Work Email"
          placeholder="alex.morgan@pulseboard.io"
          leftAddon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400">Default demo pass: password123</span>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            {...register('password')}
            id="login-password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            {...register('rememberMe')}
            id="remember-me"
            label="Remember this device"
            disabled={isSubmitting}
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
          Sign In to Dashboard
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>

        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          Enterprise-grade Auth Ready (Supabase & Security Standards)
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
