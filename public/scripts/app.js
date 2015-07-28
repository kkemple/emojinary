/* global $, emojify */

(function () {
  $(function () {
    $('body').on('click', '.close-message', function(e) {
      e.preventDefault();

      $(e.target)
        .parent()
          .remove();
    });

    emojify.setConfig({
      emojify_tag_type: 'div',
      only_crawl_id: null,
      img_dir: 'images/emoji',
      ignored_tags: {
        'SCRIPT': 1,
        'TEXTAREA': 1,
        'A': 1,
        'PRE': 1,
        'CODE': 1
      }
    });

    emojify.run();
  });
})();
