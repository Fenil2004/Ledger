// Utility functions for the application

// Create page URL (used by layout for navigation)
export function createPageUrl(pageName) {
  // Convert page name to route
  const routes = {
    'Dashboard': '/',
    'Parties': '/parties',
    'Reports': '/reports',
    'Admin': '/admin',
    'Home': '/'
  };
  
  return routes[pageName] || '/';
}

// Format currency
export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Format date
export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN');
}

// Format weight
export function formatWeight(weight) {
  return `${Number(weight).toLocaleString()} kg`;
}
