import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../schemas/authSchemas';

describe('authSchemas', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('valid email');
      }
    });

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates a strong registration payload', () => {
      const result = registerSchema.safeParse({
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        termsAccepted: true,
      });
      expect(result.success).toBe(true);
    });

    it('fails when confirmPassword does not match password', () => {
      const result = registerSchema.safeParse({
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
        termsAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.message.includes('do not match'))).toBe(true);
      }
    });

    it('fails when terms are not accepted', () => {
      const result = registerSchema.safeParse({
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        termsAccepted: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'test@domain.com' });
      expect(result.success).toBe(true);
    });

    it('rejects empty email', () => {
      const result = forgotPasswordSchema.safeParse({ email: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('validates matching strong new passwords', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('verifyEmailSchema', () => {
    it('validates 6-digit code', () => {
      const result = verifyEmailSchema.safeParse({ code: '123456' });
      expect(result.success).toBe(true);
    });

    it('rejects non-numeric or incorrect length code', () => {
      const result = verifyEmailSchema.safeParse({ code: 'abc' });
      expect(result.success).toBe(false);
    });
  });
});
