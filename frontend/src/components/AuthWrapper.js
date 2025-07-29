'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../store/authSlice';

export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}