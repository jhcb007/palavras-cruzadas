var _ID_ALUNO;
var _PONTUACAO;
var _ID_FACEBOOK;
var _NOME;
var _url = "http://35.185.110.128:8080/api/alunos";

(function ($) {
    // plugin namespace
    $.fn.puzzle = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    }

    // plugin defaults
    $.fn.puzzle.defaults = {
        cols: 20,
        rows: 20,
        words: [],
        canvasClass: 'canvas',
        normalClass: 'letra',
        highlightClass: 'highlight',
        foundClass: 'found',
        helperClass: 'box',
        letters: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,X,Z,0,1,2,3,4,5,6,7,8,9'.split(','),
        letterWidth: 25,
        letterHeight: 25,
        useHelper: true
    }


    // direcoes possiveis
    var WEST = 0;
    var EAST = 180;

    var NORTHEAST = 135;
    var NORTH = 90;
    var NORTHWEST = 45;

    var SOUTHWEST = -45;
    var SOUTH = -90;
    var SOUTHEAST = -135;

    // opcoes do seletor
    var opt;
    // elemento inicial
    var elementStart;
    // elemento final
    var elementEnd;
    // palavra selecionada
    var selectedWord;
    // palavras do puzzle
    var words = [];

    // auxiliar visual para selecao de palavras
    var helperOuterBox = null;
    var helper = null;

    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    // Metodos privados
    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/

    //--------------------------------------------
    // Recupera o helper visual
    //--------------------------------------------
    function getHelper() {
        if (!helperOuterBox) {
            helperOuterBox = $('<div></div>').appendTo(document.body);
            helperOuterBox.css({
                zIndex: 100000,
                position: 'absolute',
                width: opt.letterWidth,
                height: opt.letterHeight
            });

            helper = $('<div></div>').appendTo(helperOuterBox);
            helper.addClass(opt.helperClass);
        }

        return helperOuterBox;
    }

    //--------------------------------------------
    // metodo interno para pegar o nome da celula
    // pela coluna e linha do canvas atual
    //--------------------------------------------
    function getCellId(canvas, row, col) {
        return $(canvas).data('id') + '-cell-' + row + '-' + col;
    }

    //--------------------------------------------
    // cria os quadrados conforme
    // a configuracao (monta a grade)
    //--------------------------------------------
    function createItems(canvas) {
        for (var row = 0; row < opt.rows; row++) {
            for (var col = 0; col < opt.cols; col++) {
                var item = $('<div class="' + opt.normalClass + '"></div>').appendTo(canvas);
                item.attr('id', getCellId(canvas, row, col))

                    .css({
                        left: col * opt.letterWidth
                        , top: row * opt.letterHeight
                    }).data('position', {
                    row: row
                    , col: col
                    , x: col * opt.letterWidth
                    , y: row * opt.letterHeight
                });
            }
        }
        $('.' + opt.normalClass).on('dragstart selectstart', function (evt) {
            evt.preventDefault();
            return false;
        })
        $(canvas).width(opt.letterWidth * opt.cols)
            .height(opt.letterHeight * opt.rows);
    }

    //--------------------------------------------
    // recupera a celula conforme
    // a posicao do mouse
    //--------------------------------------------
    function getCurrentCellByMousePosition(canvas, evt) {
        var col = Math.floor((evt.pageX - $(canvas).offset().left) / opt.letterWidth);
        var row = Math.floor((evt.pageY - $(canvas).offset().top) / opt.letterHeight);
        return $('#' + getCellId(canvas, row, col));
    }

    //--------------------------------------------
    // aplica um CSS nos itens selecionados
    //--------------------------------------------
    function paintLetters(p1, p2, cssClass, canvas) {
        var col = p1.col;
        var row = p1.row;
        var endCol = p2.col;
        var endRow = p2.row;
        var last = false;

        var a = Math.atan2(p1.y - p2.y, p1.x - p2.x);
        var d = Math.round(a * (180 / Math.PI));

        selectedWord = '';

        while (true) {
            var item = $('#' + getCellId(canvas, row, col));
            item.addClass(cssClass);

            selectedWord += item.html();

            if (last) {
                break;
            }

            switch (d) {
                case WEST:
                    col--;
                    break;
                case EAST:
                    col++;
                    break;
                case NORTH:
                    row--;
                    break;
                case SOUTH:
                    row++;
                    break;
                case NORTHWEST:
                    col--;
                    row--;
                    break;
                case SOUTHWEST:
                    col--;
                    row++;
                    break;
                case SOUTHEAST:
                    row++;
                    col++;
                    break;
                case NORTHEAST:
                    col++;
                    row--;
                    break;
            }

            if ((col == p2.col && row == p2.row) || col > opt.cols || row > opt.rows || row < 0 || col < 0) {
                last = true;
                continue;
            }
        }
    }

    //--------------------------------------------
    // processa a tentativa do usuario
    //--------------------------------------------
    function guess(canvas) {
        var reversed;
        reversed = selectedWord.split('').reverse().join('');
        var original = selectedWord.split('').join('');
        var idx = -1;

        if (elementEnd.length > 0) {
            if ((idx = words.indexOf(selectedWord)) > -1 || (idx = words.indexOf(reversed)) > -1) {
                words.splice(idx, 1);
                $('.' + opt.highlightClass).addClass(opt.foundClass);
                var dados = {
                    _id: _ID_ALUNO,
                    pontuacao: _PONTUACAO,
                    resposta: original
                }
                $.ajax({
                    type: 'PUT',
                    url: _url,
                    data: JSON.stringify(dados), // or JSON.stringify ({name: 'jonas'}),
                    success: function (data) {
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
                $(canvas).trigger('right');
            } else {
                $(canvas).trigger('wrong');
            }
        }

        $('.' + opt.highlightClass).removeClass(opt.highlightClass);
        elementEnd = elementStart = null;
    }

    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    // Event Handlers
    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    //--------------------------------------------
    // quando o usuario clicar em um item
    //--------------------------------------------
    function canvas_mouseDownHandler(evt) {
        $(this).trigger('selectionStart');
        elementStart = getCurrentCellByMousePosition(this, evt).addClass(opt.highlightClass);
        elementEnd = null;

        if (opt.useHelper) {
            var p = elementStart.data('position');
            getHelper().css({
                left: $(this).offset().left + p.x
                , top: $(this).offset().top + p.y
                , WebkitTransform: 'rotate(0deg)'
                , '-moz-transform': 'rotate(0deg)'
            }).show().find('> div').width(opt.letterWidth);
        }

        evt.preventDefault();
        return false;
    }

    //--------------------------------------------
    // quando o usuario soltar o mouse
    //--------------------------------------------
    function canvas_mouseUpHandler(evt) {
        $(this).trigger('selectionEnd');
        elementEnd = getCurrentCellByMousePosition(this, evt);

        guess(this);
        evt.stopPropagation();

        if (opt.useHelper) {
            getHelper().hide();
        }

        return false;
    }

    //--------------------------------------------
    // enquanto o usuario estiver movendo o mouse
    //--------------------------------------------
    function canvas_mouseMoveHandler(evt) {
        if (elementStart) {
            elementEnd = getCurrentCellByMousePosition(this, evt);

            if (elementEnd.length > 0 && elementEnd[0] == elementStart[0]) {
                return;
            }

            if (elementStart) {
                var p1 = $(elementStart).data('position');
                var p2 = $(elementEnd).data('position');

                if (!p1 || !p2) {
                    return;
                }

                if (opt.useHelper) {
                    var o = $(this).offset();
                    var distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) + opt.letterWidth;
                    var angle = Math.atan2(p1.x - p2.x, p1.y - p2.y);
                    var degree = ((angle * (180 / Math.PI)) * -1) - 90;

                    getHelper().find('> div').width(distance);
                    getHelper().css({
                        WebkitTransform: 'rotate(' + degree + 'deg)',
                        '-moz-transform': 'rotate(' + degree + 'deg)'
                    });
                }

                var a = Math.atan2(p1.y - p2.y, p1.x - p2.x);
                var d = Math.round(a * (180 / Math.PI));

                if (d % 45 == 0) {
                    $('.' + opt.highlightClass).removeClass(opt.highlightClass);
                    paintLetters(p1, p2, opt.highlightClass, this);
                }
            }
        }
    }

    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    // Metodos publicos
    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    var methods = {
        /////////////////////////////////////
        // Construtor
        /////////////////////////////////////
        init: function (options) {
            opt = $.extend({}, $.fn.puzzle.defaults, options);

            return this.each(function () {
                $(this).data('id', 'puzzle_' + (new String(new Date().getTime())).replace('.', '_'))
                    .mousedown($.proxy(canvas_mouseDownHandler, this))
                    .mouseup($.proxy(canvas_mouseUpHandler, this))
                    .addClass(opt.canvasClass)
                ;

                $(document.body).mousemove($.proxy(canvas_mouseMoveHandler, this))
                    .mouseup($.proxy(canvas_mouseUpHandler, this))
                    .on('dragstart selectstart', function (evt) {
                        evt.preventDefault();
                        return false;
                    });

                createItems(this);

                if (opt.words.length > 0) {
                    $.each(opt.words, $.proxy(function (idx, value) {
                        $(this).puzzle('addWord', value);
                    }, this));

                    $(this).puzzle('paint');
                }

            });
        },

        /////////////////////////////////////
        // popula os elementos com letras
        // deve ser chamado
        // depois de adicionar as palavras
        /////////////////////////////////////
        paint: function () {
            for (var row = 0; row < opt.rows; row++) {
                for (var col = 0; col < opt.cols; col++) {
                    var item = $('#' + getCellId(this, row, col));
                    if (item.html() == '') {
                        var idx = Math.min(Math.round(Math.random() * (opt.letters.length - 1)), opt.letters.length - 1);
                        item.html(opt.letters[idx]);
                    }
                }
            }
            return this;
        },

        /////////////////////////////////////
        // adiciona uma palavra
        /////////////////////////////////////
        addWord: function (word) {
            words.push(word);

            var col = 0, row = 0, direction, lastCol = 0, lastRow = 0;

            while (true) {
                var col = lastCol = Math.round(Math.random() * (opt.cols - 1));
                var row = lastRow = Math.round(Math.random() * (opt.rows - 1));
                var direction = (Math.round(Math.random() * 8) * 45) - 180;

                if (direction == -180) {
                    direction = 0;
                }

                switch (direction) {
                    case WEST:
                        lastCol = col - word.length;
                        break;
                    case EAST:
                        lastCol = col + word.length;
                        break;
                    case NORTH:
                        lastRow = row - word.length;
                        break;
                    case SOUTH:
                        lastRow = row + word.length;
                        break;
                    case NORTHWEST:
                        lastCol = col - word.length;
                        lastRow = row - word.length;
                        break;
                    case SOUTHWEST:
                        lastCol = col - word.length;
                        lastRow = row + word.length;
                        break;
                    case SOUTHEAST:
                        lastCol = col + word.length;
                        lastRow = row + word.length;
                        break;
                    case NORTHEAST:
                        lastCol = col + word.length;
                        lastRow = row - word.length;
                        ;
                        break;
                }

                // testando se intercala com alguma palavra...
                var pode = true;
                var currCol = col;
                var currRow = row;
                for (var i = 0; i < word.length; i++) {
                    var letter = word.substr(i, 1);
                    var cell = $('#' + getCellId(this, currRow, currCol));
                    var found = cell.html();

                    if (found != '' && found != letter) {
                        pode = false;
                        break;
                    }

                    switch (direction) {
                        case WEST:
                            currCol--;
                            break;
                        case EAST:
                            currCol++;
                            break;
                        case NORTH:
                            currRow--;
                            break;
                        case SOUTH:
                            currRow++;
                            break;
                        case NORTHWEST:
                            currCol--;
                            currRow--;
                            break;
                        case SOUTHWEST:
                            currCol--;
                            currRow++;
                            break;
                        case SOUTHEAST:
                            currRow++;
                            currCol++;
                            break;
                        case NORTHEAST:
                            currCol++;
                            currRow--;
                            break;
                    }
                }

                if (pode && lastCol >= 0 && lastCol < opt.cols && lastRow >= 0 && lastRow < opt.rows) {
                    break;
                }
            }

            for (var i = 0; i < word.length; i++) {
                var letter = word.substr(i, 1);
                var cell = $('#' + getCellId(this, row, col));
                cell.html(letter);

                switch (direction) {
                    case WEST:
                        col--;
                        break;
                    case EAST:
                        col++;
                        break;
                    case NORTH:
                        row--;
                        break;
                    case SOUTH:
                        row++;
                        break;
                    case NORTHWEST:
                        col--;
                        row--;
                        break;
                    case SOUTHWEST:
                        col--;
                        row++;
                        break;
                    case SOUTHEAST:
                        row++;
                        col++;
                        break;
                    case NORTHEAST:
                        col++;
                        row--;
                        break;
                }
            }

            return this;
        },
        /////////////////////////////////////
        // pega as palavras adicionadas
        /////////////////////////////////////
        getWords: function () {
            return words;
        }
    }
})(jQuery);