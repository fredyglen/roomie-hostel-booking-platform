type NotificationType = 'error' | 'success' | 'info' | 'warning';

export function notifyUser(message: string, type: NotificationType = 'info') {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('user-notification', { detail: { message, type } }));
  }
} 