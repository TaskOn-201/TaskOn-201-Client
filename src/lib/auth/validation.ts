export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+=\-`]).{8,15}$/;

export const EMAIL_PATTERN =
    /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

export function isValidPassword(password: string) {
    return PASSWORD_PATTERN.test(password);
}

export function isValidEmail(email: string) {
    return EMAIL_PATTERN.test(email);
}
