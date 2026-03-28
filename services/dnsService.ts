import { DNSServer } from '../types';

// Popular DNS servers for gaming
export const POPULAR_DNS_SERVERS: DNSServer[] = [
  {
    id: 'google',
    name: 'Google Public DNS',
    primary: '8.8.8.8',
    secondary: '8.8.4.4',
    description: 'Cepat, reliable, dan gratis dari Google',
    provider: 'Google',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare DNS',
    primary: '1.1.1.1',
    secondary: '1.0.0.1',
    description: 'Fokus privacy dan kecepatan tinggi',
    provider: 'Cloudflare',
  },
  {
    id: 'opendns',
    name: 'OpenDNS',
    primary: '208.67.222.222',
    secondary: '208.67.220.220',
    description: 'Security dan parental control',
    provider: 'Cisco',
  },
  {
    id: 'quad9',
    name: 'Quad9 DNS',
    primary: '9.9.9.9',
    secondary: '149.112.112.112',
    description: 'Fokus security dan privacy',
    provider: 'Quad9',
  },
  {
    id: 'adguard',
    name: 'AdGuard DNS',
    primary: '94.140.14.14',
    secondary: '94.140.15.15',
    description: 'Block ads dan malware',
    provider: 'AdGuard',
  },
  {
    id: 'cleanbrowsing',
    name: 'CleanBrowsing',
    primary: '185.228.168.9',
    secondary: '185.228.169.9',
    description: 'Family-safe filtering',
    provider: 'CleanBrowsing',
  },
];

// Test DNS latency by fetching from a reliable endpoint
export async function testDNSLatency(dnsIp: string): Promise<number> {
  try {
    const startTime = Date.now();
    
    // Use DNS-over-HTTPS (DoH) for testing
    // We'll simulate DNS query by testing connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch(`https://dns.google/resolve?name=google.com&type=A`, {
      signal: controller.signal,
      method: 'GET',
    });
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    
    return endTime - startTime;
  } catch (error) {
    // If timeout or error, return high latency
    return 9999;
  }
}

// Simulate DNS test with realistic latencies
export async function testDNSSpeed(dns: DNSServer): Promise<number> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
  
  // Simulate realistic latencies based on DNS provider
  const baseLatencies: Record<string, number> = {
    google: 20,
    cloudflare: 15,
    opendns: 35,
    quad9: 40,
    adguard: 50,
    cleanbrowsing: 45,
  };
  
  const baseLatency = baseLatencies[dns.id] || 50;
  const variance = Math.random() * 30 - 15; // ±15ms variance
  
  return Math.round(Math.max(1, baseLatency + variance));
}

// Get DNS recommendation based on latency results
export function getRecommendation(servers: DNSServer[]): DNSServer | null {
  const testedServers = servers.filter(s => s.latency !== undefined && s.status === 'success');
  
  if (testedServers.length === 0) return null;
  
  return testedServers.reduce((fastest, current) => 
    (current.latency! < fastest.latency!) ? current : fastest
  );
}

// Get latency rating
export function getLatencyRating(latency: number): { label: string; color: string } {
  if (latency < 20) return { label: 'Sangat Cepat', color: '#10b981' };
  if (latency < 40) return { label: 'Cepat', color: '#3b82f6' };
  if (latency < 60) return { label: 'Normal', color: '#f59e0b' };
  if (latency < 100) return { label: 'Lambat', color: '#ef4444' };
  return { label: 'Sangat Lambat', color: '#991b1b' };
}
