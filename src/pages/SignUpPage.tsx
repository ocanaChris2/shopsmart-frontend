import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm }         from 'react-hook-form';
import { zodResolver }     from '@hookform/resolvers/zod';
import { z }               from 'zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast }           from 'sonner';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';
import { useAuth }         from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/apiClient';

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z
  .object({
    display_name:     z.string().min(2, 'Name must be at least 2 characters'),
    email:            z.string().email('Invalid email address'),
    tenant_name:      z.string().min(2, 'Workspace name must be at least 2 characters'),
    password:         z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords don't match",
    path:    ['confirm_password'],
  });

type FormValues = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm,  setShowConfirm]          = useState(false);

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard';

  const form = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: {
      display_name: '', email: '', tenant_name: '', password: '', confirm_password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerUser({
        display_name: values.display_name,
        email:        values.email,
        password:     values.password,
        tenant_name:  values.tenant_name,
      });
      toast.success('Account created — welcome aboard!');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed. Please try again.'));
    }
  };

  if (isAuthenticated) return <Navigate to={from} replace />;

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {import.meta.env.VITE_APP_NAME ?? 'ShopSmart ERP'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account and workspace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* Full name */}
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Jane Smith"
                        autoComplete="name"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workspace name */}
              <FormField
                control={form.control}
                name="tenant_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Acme Corp"
                        autoComplete="organization"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 characters"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword
                            ? <EyeOff className="h-4 w-4" />
                            : <Eye    className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm password */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Repeat your password"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm
                            ? <EyeOff className="h-4 w-4" />
                            : <Eye    className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground px-4">
          By creating an account you agree to our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
