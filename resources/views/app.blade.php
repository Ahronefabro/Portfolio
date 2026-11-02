<!DOCTYPE html>
<html lang="en" class="motion-safe:scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Portfolio of Ahrone B. Fabro, IT student and aspiring developer.">
  <!-- Link previews when the portfolio is shared in chat apps or job applications -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Ahrone B. Fabro | Portfolio">
  <meta property="og:description" content="Portfolio of Ahrone B. Fabro, IT student and aspiring developer.">
  <meta property="og:url" content="{{ url('/') }}">
  <meta property="og:image" content="{{ asset('images/profile.jpg') }}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231b2430'/%3E%3Ctext x='32' y='43' font-family='monospace' font-size='30' font-weight='700' text-anchor='middle' fill='%23fb923c'%3EAF%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- Runs before the page paints: sets up JS class, intro, and saved theme -->
  <script>
    (function () {
      const root = document.documentElement;
      root.classList.add('js');

      // Storage can be blocked in some browsers/previews, so never let it crash the page
      function read(store, key) {
        try { return window[store].getItem(key); } catch (err) { return null; }
      }
      function write(store, key, value) {
        try { window[store].setItem(key, value); } catch (err) {}
      }

      if (read('sessionStorage', 'introSeen')) root.classList.add('no-intro');
      else write('sessionStorage', 'introSeen', '1');

      const saved = read('localStorage', 'theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) root.classList.add('dark');
    })();
  </script>

  @viteReactRefresh
  @vite(['resources/css/app.css', 'resources/js/app.jsx'])
  @inertiaHead
</head>
<body class="bg-paper font-sans text-ink antialiased dark:bg-night dark:text-chalk">
  @inertia
</body>
</html>
