$(function() {
  "use strict";

  var $x = $('#x'),
    $y = $('#y'),
    $width = $('#w'),
    $height = $('#h'),
    $table = $('#matrix'),
    state = {
      selectedColor: null,
      painting: false,
      cols: null,
      rows: null,
      x: null,
      y: null,
      sprite: [

      ]
    };

  function initializeChangeListeners() {
    var onChange = function() {
      updateStateFromUi();
      renderTable();
    };
    $('#configs input').change(onChange);
    $('#groupbytes').click(onChange);
  }

  function initializeColorSelectorListeners() {
    var $tds = $('#colorselector').find('td');
    $tds.click(function() {
      $tds.removeClass('sel');
      $(this).addClass('sel');
      updateStateFromUi();
    });
    $('#fill').click(fillTable);
  }

  function fillTable() {
    for (var i = 0; i < state.rows; i++) {
      for (var j = 0; j < state.cols; j++) {
        state.sprite[i][j] = '' + state.selectedColor;
      }
    }
    renderTable();
  }

  function initializeTableListeners() {
    $table.mousedown(function() {
      state.painting = true;
    });
    function paint(e) {
      e.preventDefault();
      if (!state.painting || e.target.nodeName !== 'TD') {
        return;
      }
      var $td = $(e.target);
      $td.attr('class', getColorClass(state.selectedColor));
      var col = $td.data('col');
      var row = $td.data('row');
      state.sprite[row][col] = state.selectedColor;
      renderMachineCode();
    }
    $table.mouseover(paint);
    $table.mousedown(paint);
    $(document).on('mouseup', function() {
      state.painting = false;
    });
  }

  function updateStateFromUi() {
    state.x = Math.max(Math.min(320, $x.val()), 0);
    state.x -= (state.x % 4);
    state.y = Math.max(Math.min(200, $y.val()), 0);
    var cols = parseInt($width.val(), 10);
    var mod = cols % 4;
    if (mod) {
      cols += (4 - mod);
    }
    state.cols = Math.max(Math.min(40, cols), 1);
    state.rows = Math.max(Math.min(40, $height.val()), 1);
    state.selectedColor = $('#colorselector').find('td.sel').data('color');
    state.groupBytes = $('#groupbytes').is(':checked');
    state.sprite = fillSpriteArray(state.sprite, state.rows, state.cols, state.selectedColor);
  }

  function fillSpriteArray(sprite, rows, cols, defaultColor) {
    for (var i = 0; i < rows; i++) {
      if ('undefined' === typeof sprite[i]) {
        sprite[i] = [];
      }
      for (var j = 0; j < cols; j++) {
        if ('undefined' === typeof sprite[i][j]) {
          sprite[i][j] = defaultColor;
        }
      }
    }
    return sprite;
  }

  function renderTable() {
    var $row;
    $table.empty();
    for (var i = 0; i < state.rows; i++) {
      $row = $table.append($('<tr />'));
      for (var j = 0; j < state.cols; j++) {
        $row.append(
          $('<td />')
            .data({ col: j, row: i})
            .addClass(getColorClass(state.sprite[i][j]))
        );
      }
    }
    renderMachineCode();
  }

  function getColorClass(color) {
    return color ? 'color' + color : '';
  }

  function splitInLines(code) {
    var ret = '';
    var bytes = code.split(' ');
    var lineBytes;
    for (var i = 0; i < bytes.length; i += 16) {
      lineBytes = bytes.slice(i , i + 16);
      ret += lineBytes.join(' ') + "\n";
    }
    return ret;
  }

  function renderMachineCode() {
    var code = writeCode(state.x, state.y, state.cols, state.rows, state.sprite);
    if (state.groupBytes) {
      code = splitInLines(code);
    }
    $('#machinecode').text(code);
  }

  function init() {
    initializeChangeListeners();
    initializeColorSelectorListeners();
    initializeTableListeners();
    updateStateFromUi();
    renderTable();
  }

  init();

});
