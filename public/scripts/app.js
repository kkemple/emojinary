/* global jQuery, emojify, StripeCheckout */

(function ($, window) {

  var stripe = StripeCheckout.configure({
    key: 'pk_test_3fp2fgX3FeTR1BHznzO3FRrm',
    image: '/images/emoji/moneybag.png',
    amount: 500,
    description: 'Emojinary! Pro'
  });

  var showMessage = function (message, isError) {
    var $body = $('body');
    var $message = $('<div/>', {
      'class': 'message ' + ((isError) ? 'error' : ''),
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

        showMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error, true);
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

        showMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error, true);
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

        showMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error, true);
        $('body').scrollTop(0);
      });
    });

    $('form.account-upgrade').on('submit', function (e) {
      e.preventDefault();

      var $form = $(this);
      var $button = $form.children('button[type="submit"]');

      $button.prop('disabled', true);

      stripe.open({
        token: function(token) {
          // Use the token to create the charge with a server-side script.
          // You can access the token ID with `token.id`
          $.ajax({
            url: $form.attr('action'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              team_id: $form.attr('data-id'),
              email: token.email,
              stripe_token: token.id
            })
          })
          .done(function (response) {
            stripe.close();
            $button.prop('disabled', false);

            showMessage(response);
            $('body').scrollTop(0);

            $form
              .parent()
              .toggleClass('inactive')
                .siblings('.downgrade')
                .toggleClass('inactive');

          })
          .fail(function (xhr) {
            $button.prop('disabled', false);
            stripe.close();

            showMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error, true);
            $('body').scrollTop(0);
          });
        }
      });
    });

    $('form.account-downgrade').on('submit', function (e) {
      e.preventDefault();

      var $form = $(this);
      var $button = $form.children('button[type="submit"]');

      $button.prop('disabled', true);

      $.ajax({
          url: $form.attr('action'),
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            team_id: $form.attr('data-id')
          })
        })
        .done(function (response) {
          $button.prop('disabled', false);

          showMessage(response);
          $('body').scrollTop(0);

          $form
            .parent()
            .toggleClass('inactive')
              .siblings('.upgrade')
              .toggleClass('inactive');
        })
        .fail(function (xhr) {
          $button.prop('disabled', false);
          stripe.close();

          showMessage(xhr.responseJSON.error + ': ' + xhr.responseJSON.error, true);
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
