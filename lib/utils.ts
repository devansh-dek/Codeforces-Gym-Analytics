// Utility functions

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'OK':
      return 'text-green-500';
    case 'WRONG_ANSWER':
      return 'text-red-500';
    case 'TIME_LIMIT_EXCEEDED':
      return 'text-yellow-500';
    case 'RUNTIME_ERROR':
      return 'text-orange-500';
    case 'COMPILATION_ERROR':
      return 'text-gray-500';
    default:
      return 'text-gray-400';
  }
}

export function getVerdictShort(verdict: string): string {
  const map: Record<string, string> = {
    'OK': 'AC',
    'WRONG_ANSWER': 'WA',
    'TIME_LIMIT_EXCEEDED': 'TLE',
    'MEMORY_LIMIT_EXCEEDED': 'MLE',
    'RUNTIME_ERROR': 'RE',
    'COMPILATION_ERROR': 'CE',
    'TESTING': '...',
  };
  return map[verdict] || verdict;
}

export function getProblemStatusIcon(solved: boolean, attempts: number): string {
  if (solved) {
    if (attempts === 0) return '✅';
    return `+${attempts} ✅`;
  }
  if (attempts > 0) return `−${attempts}`;
  return '—';
}

export function getProblemStatusColor(solved: boolean, attempts: number): string {
  if (solved) return 'bg-green-600 text-white';
  if (attempts > 0) return 'bg-red-600 text-white';
  return 'bg-gray-700 text-gray-400';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
