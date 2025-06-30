import { Session } from '@supabase/supabase-js';

export interface AuthStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}
