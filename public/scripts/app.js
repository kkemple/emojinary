/* global jQuery, emojify */

(function ($, window) {

  var showErrorMessage = function (message) {
    var $body = $('body');
    var $message = $('<div/>', {
      'class': 'message error',
      text: message
    });
    var $closeMessage = $('<a/>', {
      'class': 'close-message',
      text: 'X'
    });

    $body.prepend($message.append($closeMessage));
  };

  $(function () {
    $('body').on('click', '.close-message', function(e) {
      e.preventDefault();

      $(e.target)
        .parent()
          .remove();
    });

    $('body').on('click', '.account > a', function(e) {
      e.preventDefault();

      var $accountBtn = $(this);
      var $accountContainer = $accountBtn.parent();
      var $accountMenu = $accountContainer.find('.account-menu');

      $accountMenu.toggleClass('inactive');
    });

    $('form.integration-token').on('submit', function (e) {
      e.preventDefault();

      var $form = $(this);
      var $input = $form.children('input[type="text"]');
      var $button = $form.children('button[type="submit"]');

      if ($input.val() === '') { return; }

      var origButtonText = $button.text();
      $button.text('Saving...');
      $button.prop('disabled', true);

      $.ajax({
        url: $form.attr('action'),
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
          token: $input.val(),
          team_id: $form.attr('data-id')
        })
      })
      .done(function () {
        $button.text('Token Saved!');
        $button.prop('disabled', false);

        window.setTimeout(function () {
          $button.text(origButtonText);
        }, 1000 * 5);
      })
      .fail(function (xhr) {
        $button.text(origButtonText);
        $button.prop('disabled', false);

        showErrorMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error);
        $('body').scrollTop(0);
      });
    });

    $('form.integration-webhook').on('submit', function (e) {
      e.preventDefault();

      var $form = $(this);
      var $input = $form.children('input[type="text"]');
      var $button = $form.children('button[type="submit"]');

      if ($input.val() === '') { return; }

      var origButtonText = $button.text();
      $button.text('Saving...');
      $button.prop('disabled', true);

      $.ajax({
        url: $form.attr('action'),
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
          url: $input.val(),
          team_id: $form.attr('data-id')
        })
      })
      .done(function () {
        $button.text('URL Saved!');
        $button.prop('disabled', false);

        window.setTimeout(function () {
          $button.text(origButtonText);
        }, 1000 * 5);
      })
      .fail(function (xhr) {
        $button.text(origButtonText);
        $button.prop('disabled', false);

        showErrorMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error);
        $('body').scrollTop(0);
      });
    });

    $('form.account-removal').on('submit', function (e) {
      e.preventDefault();

      if (!window.confirm('Are you sure you want to remove your account?')) {
        return;
      }

      var $form = $(this);
      var $input = $form.children('input[type="text"]');
      var $button = $form.children('button[type="submit"]');

      if ($input.val() === '') { return; }

      var origButtonText = $button.text();
      $button.text('Removing account...');
      $button.prop('disabled', true);

      $.ajax({
        url: $form.attr('action'),
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({
          team_id: $form.attr('data-id')
        })
      })
      .done(function () {
        window.location = window.location.origin;
      })
      .fail(function (xhr) {
        $button.text(origButtonText);
        $button.prop('disabled', false);

        showErrorMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error);
        $('body').scrollTop(0);
      });
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
})(jQuery, this, this.document);
