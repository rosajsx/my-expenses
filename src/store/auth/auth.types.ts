export interface SignInStore {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export interface SignUpStore {
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
  isPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
  setIsPasswordVisible: (isVisible: boolean) => void;
  setIsConfirmPasswordVisible: (isVisible: boolean) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}
