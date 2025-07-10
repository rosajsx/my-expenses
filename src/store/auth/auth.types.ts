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
