'use strict';
 
(function(window) {

  if ( !document.addEventListener ) {
    window.lightSelect = function() {};
    return;
  }

  var lightSelect =  function(select) {

    var selector = select.selector || 'select',
        customClass = select.customClass || 'lightSelect',
        selects = document.querySelectorAll(selector),
        template = document.createElement('div'),
        markup = '<input class="' + customClass + '_hidden" type="hidden" name="" value="" /> \
                  <div class="' + customClass + '_in"> \
                    <span class="' + customClass + '_title"></span> \
                    <i class="' + customClass + '_arrow"></i> \
                  </div> \
                  <ul class="' + customClass + '_list"> \
                  </ul>',
        selectClassList, selectName, selectOption, tempElem, tempElemUl, tempElemLis, activeElem, completeElem,
        hasSelected = false;

        template.insertAdjacentHTML("afterBegin", markup);

    for (var i = 0, ilen = selects.length; i < ilen; i++) {

      tempElem = template.cloneNode(true);

      selectClassList = selects[i].className;
      selectName = selects[i].name;

      tempElem.className = customClass + ' ' + selectClassList;
      tempElem.querySelector( '.' + customClass + '_hidden' ).name = selectName;
      selectOption = selects[i].querySelectorAll( 'option' );
      tempElemUl = tempElem.querySelector( '.' + customClass + '_list' );

      for (var j = 0, jlen = selectOption.length; j < jlen; j++) {
        tempElemUl.insertAdjacentHTML("beforeEnd", '<li class="' + customClass + '_item" data-value="' + selectOption[j].value +'">' + selectOption[j].innerHTML + '</li> ');
        if ( selectOption[j].selected ) {
          hasSelected = true;
          tempElemUl.querySelector('li:last-child').className += ' is-active';
        }
      }

      if ( !hasSelected ) {
        tempElem.querySelector('.' + customClass + '_item:first-child').className += ' is-active';
      }

      activeElem = tempElem.querySelector('.' + customClass + '_item.is-active');

      tempElem.querySelector('.' + customClass + '_hidden').value = activeElem.getAttribute('data-value');
      tempElem.querySelector('.' + customClass + '_title').innerHTML = activeElem.innerHTML;

      tempElem.querySelector('.' + customClass + '_in').addEventListener('click', openSel, false);
      tempElem.querySelector('.' + customClass + '_list').addEventListener('click', selOption, false);

      completeElem = selects[i].parentNode.replaceChild(tempElem, selects[i]);

    }

    function openSel(event) {
      event.stopPropagation();
      var node = this;

      node = findParent(node);

      if ( node.className.indexOf('is-opened') < 0 ) {
        closeAll();
        node.className += ' is-opened';
      } else {
        node.className =  node.className.replace(/ is-opened/g, "");
      }
    }

    function selOption(event) {
      event.stopPropagation();

      if ( event.target.className.indexOf(customClass + '_item') < 0 ) return;

      var node = event.target,
          valueNode = node.getAttribute('data-value'),
          textNode = node.innerHTML,
          listLis = this.querySelectorAll('.' + customClass + '_item');



      for (var i = 0, len = listLis.length; i < len; i++) {
        if ( listLis[i].className.indexOf('is-active') >= 0 ) {
          listLis[i].className =  node.className.replace(/ is-active/g, "");
        }
      }

      node.className += ' is-active';

      node = findParent(node);

      node.querySelector('.' + customClass + '_hidden').value = valueNode;
      node.querySelector('.' + customClass + '_title').innerHTML = textNode;

      closeAll();
    }

    function closeAll() {
      var listNodes = document.querySelectorAll( '.' + customClass );

      for (var i = 0, len = listNodes.length; i < len; i++) {
        listNodes[i].className =  listNodes[i].className.replace(/ is-opened/g, "");
      }
    }

    function findParent(elem) {
      while ( elem.className.indexOf(customClass + ' ') < 0 ) {
        elem = elem.parentNode;
      }
      return elem;
    }

    document.addEventListener('click', closeAll);


    document.addEventListener('keyup', function(event) {
      if (event.keyCode !== 27) return;
      closeAll();
    });

  }

  window.lightSelect = lightSelect;

}(window));
