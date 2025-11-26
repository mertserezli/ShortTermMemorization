// passwordStrength.js

export const passwordStrengthColorMap = {
  'Very Weak': '#d32f2f', // red
  Weak: '#f57c00', // orange
  Moderate: '#fbc02d', // yellow
  Strong: '#388e3c', // green
  'Very Strong': '#2e7d32', // dark green
};

export const passwordStrengthHintMap = {
  'Very Weak': 'Try adding uppercase letters, numbers, and symbols.',
  Weak: 'Include more character types for better security.',
  Moderate: 'Good start! Add symbols or longer length.',
  Strong: 'Strong password. Consider making it even longer.',
  'Very Strong': 'Excellent! Your password is very secure.',
};

export function evaluatePasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  switch (score) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Moderate';
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return '';
  }
}

export function getPasswordStrengthProgressValue(strength) {
  switch (strength) {
    case 'Very Weak':
      return 20;
    case 'Weak':
      return 40;
    case 'Moderate':
      return 60;
    case 'Strong':
      return 80;
    case 'Very Strong':
      return 100;
    default:
      return 0;
  }
}
