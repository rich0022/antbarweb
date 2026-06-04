(function() {
  var widgets = document.querySelectorAll('[data-widget_type="posts.cards"]');
  widgets.forEach(function(widget) {
    var anchor = widget.querySelector('.e-load-more-anchor');
    var btn = widget.querySelector('.elementor-button-wrapper .elementor-button');
    var container = widget.querySelector('.elementor-posts-container');
    if (!anchor || !btn || !container) return;

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var nextPage = anchor.getAttribute('data-next-page');
      var maxPage = anchor.getAttribute('data-max-page');
      if (!nextPage) return;

      widget.classList.add('e-load-more-pagination-loading');

      fetch(nextPage)
        .then(function(r) { return r.text(); })
        .then(function(html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var articles = doc.querySelectorAll('.elementor-posts-container .elementor-post');
          articles.forEach(function(article) {
            container.appendChild(article);
          });

          var nextAnchor = doc.querySelector('.e-load-more-anchor');
          if (nextAnchor) {
            anchor.setAttribute('data-page', nextAnchor.getAttribute('data-page') || '');
            anchor.setAttribute('data-next-page', nextAnchor.getAttribute('data-next-page') || '');
          }

          var currentPage = anchor.getAttribute('data-page');
          if (currentPage === maxPage) {
            widget.classList.add('e-load-more-pagination-end');
          }

          widget.classList.remove('e-load-more-pagination-loading');
        })
        .catch(function() {
          widget.classList.remove('e-load-more-pagination-loading');
        });
    });
  });
})();
