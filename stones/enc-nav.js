// Encyclopedia random navigation — add new slugs here as pages are published.
(function () {
  var STONES = [
    'amazonite',
    'amethyst',
    'black-tourmaline',
    'carnelian',
    'citrine',
    'clear-quartz',
    'green-aventurine',
    'hematite',
    'labradorite',
    'malachite',
    'moonstone',
    'rainbow-fluorite',
    'rainbow-moonstone',
    'red-jasper',
    'rose-quartz',
    'selenite',
    'smoky-quartz',
    'sodalite',
    'sunstone',
    'tigers-eye',
    'unakite'
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
