if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('/fogon-cliente/dev-sw.js?dev-sw', {
    scope: '/fogon-cliente/',
    type: 'classic',
  })
