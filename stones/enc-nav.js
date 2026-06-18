// Encyclopedia random navigation — add new slugs here as pages are published.
(function () {
  var STONES = [
    'amethyst',
    'carnelian',
    'clear-quartz',
    'labradorite',
    'smoky-quartz'
  ];

  var current = document.documentElement.dataset.stoneSlug || '';

  var pool = STONES.filter(function (s) { return s !== current; });

  var btn = document.querySelector('.entry-nav-random');
  if (!btn || pool.length === 0) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = pick + '.html';
  });
})();
