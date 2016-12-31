/*
* Function to check if the DOM is ready for manipulation
*/
'use strict';

var domReady = function domReady(callback) {
  document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback);
};

/*
* When the dom is ready, run these functions
*/
domReady(function () {
  /*
  * This just open and closes the select container
  */
  (function selectToggle() {
    d3.select('.select__option--default').on('click', function () {
      if (d3.select('.select-options-container').classed('select-options-container--open')) {
        d3.select('.select-options-container--open').classed('select-options-container--open', false);
      } else {
        d3.select('.select-options-container').classed('select-options-container--open', true);
      }
    });
  })();

  /*
  * If the select option is clicked, it'll trigger a click on the
  * actual select
  */
  (function selectOptions() {
    d3.select('.select-options-container').selectAll('.select__option').on('click', function () {
      selectedCategory = this.innerHTML;
      drawCategoryData(selectedCategory);

      d3.select('.select__option--default').html(this.innerHTML);

      d3.select('.select-options-container').classed('select-options-container--open', false);
    });
  })();
});