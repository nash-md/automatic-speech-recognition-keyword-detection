angular
  .module('app')
  .filter('HighlightLabel', function ($sce) {
    return function (text, labels) {
        for (const label of labels) {
          const pattern = new RegExp('(.*)(' + label + ')(.*)$', 'gi');

          if (pattern.test(text) === true) {
            text = text.replace(pattern, '$1<span class="badge badge-warning">$2</span>$3');
          }
        }
      return $sce.trustAsHtml(text);
    };
  });
