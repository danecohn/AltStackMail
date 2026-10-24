// Navigation only: this file never reads Tuta credentials, mailbox data or keys.
for(const link of document.querySelectorAll('#altstack-nav nav a'))if(location.pathname.startsWith(link.pathname))link.setAttribute('aria-current','page');
