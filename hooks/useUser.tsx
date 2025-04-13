'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { useSession } from 'next-auth/react';
import { getUserByEmail } from '@/app/actions/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRetried, setHasRetried] = useState(false);
  const { data: session } = useSession();

  const fetchUser = useCallback(async () => {

    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userEmail = session.user.email;
    const foundUser = await getUserByEmail(userEmail);
 

    if (!foundUser && !hasRetried) {
      setHasRetried(true);
      const retryUser = await getUserByEmail(session.user.email);
      if (retryUser) {
        setUser(retryUser);
      }
    } else {
      setUser(foundUser);
    }

    setLoading(false);
  }, [session?.user?.email, hasRetried]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser: fetchUser,
  };
};
