import { useContext } from 'react';
import { BoostContext } from '../contexts/BoostContext';

export function useBoostContext() {
  const context = useContext(BoostContext);
  if (!context) {
    throw new Error('useBoostContext must be used within BoostProvider');
  }
  return context;
}
