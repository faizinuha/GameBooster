import { useState, useCallback } from 'react';
import { DNSServer } from '../types';
import { POPULAR_DNS_SERVERS, testDNSSpeed, getRecommendation } from '../services/dnsService';

export function useDNS() {
  const [servers, setServers] = useState<DNSServer[]>(POPULAR_DNS_SERVERS);
  const [isTesting, setIsTesting] = useState(false);
  const [recommended, setRecommended] = useState<DNSServer | null>(null);
  
  const testAllServers = useCallback(async () => {
    setIsTesting(true);
    setRecommended(null);
    
    // Reset all servers to testing state
    setServers(prev => prev.map(s => ({ ...s, status: 'testing' as const, latency: undefined })));
    
    try {
      // Test all servers in parallel
      const results = await Promise.all(
        POPULAR_DNS_SERVERS.map(async (server) => {
          try {
            const latency = await testDNSSpeed(server);
            return {
              ...server,
              latency,
              status: 'success' as const,
            };
          } catch (error) {
            return {
              ...server,
              latency: 9999,
              status: 'failed' as const,
            };
          }
        })
      );
      
      // Update servers with results
      setServers(results);
      
      // Get recommendation
      const best = getRecommendation(results);
      setRecommended(best);
    } catch (error) {
      console.error('DNS test failed:', error);
    } finally {
      setIsTesting(false);
    }
  }, []);
  
  const resetTests = useCallback(() => {
    setServers(POPULAR_DNS_SERVERS);
    setRecommended(null);
  }, []);
  
  return {
    servers,
    isTesting,
    recommended,
    testAllServers,
    resetTests,
  };
}
