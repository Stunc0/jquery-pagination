(function($){
$.fn.paginate = function (options) {
    var defaults = {
        paginateElement: 'li',
        hashPage: 'page',
        elementsPerPage: 10,
        effect: 'default',
        slideOffset: 200,
        firstButton: true,
        firstButtonText: '<<',
        lastButton: true,
        lastButtonText: '>>',
        prevButton: true,
        prevButtonText: '<',
        nextButton: true,
        nextButtonText: '>',
        nextLabel: 'Next',
        previousLabel: 'Previous',
        lastLabel: 'Last',
        firstLabel: 'First',
        nbPaginateElementDisplayed: 10,
        scrollToTop: false,
        scrollToTopElementId: null,
        scrollToTopTime: 2000
    }

    return this.each (function (instance) {

        var plugin = {};
        plugin.el = $(this);
        plugin.el.addClass('paginateList');

        plugin.settings = {
            pages: 0,
            objElements: Object,
            currentPage: 1
        }

        var getNbOfPages = function() {
            return Math.ceil(plugin.settings.objElements.length / plugin.settings.elementsPerPage);
        };

        var displayNav = function() {
            htmlNav = '<ul class="pagination">';

            if(plugin.settings.firstButton) {
                htmlNav += '<li class="first"><a href="#'+plugin.settings.hashPage+':1" title="' + plugin.settings.firstLabel + '" rel="1" class="first">'+plugin.settings.firstButtonText+'</a></li>';
            }

            if(plugin.settings.prevButton) {
                htmlNav += '<li class="prev"><a href="" title="' + plugin.settings.previousLabel + '" rel="" class="prev">'+plugin.settings.prevButtonText+'</a></li>';
            }

            for(i = 1;i <= plugin.settings.pages;i++) {
                htmlNav += '<li class="page" rel="'+i+'"><a href="#'+plugin.settings.hashPage+':'+i+'" title="Page '+i+'" rel="'+i+'" class="page" style="min-width:50px;">'+i+'</a></li>';
            };

            if(plugin.settings.nextButton) {
                htmlNav += '<li class="next"><a href="" title="' + plugin.settings.nextLabel + '" rel="" class="next">'+plugin.settings.nextButtonText+'</a></li>';
            }

            if(plugin.settings.lastButton) {
                htmlNav += '<li class="last"><a href="#'+plugin.settings.hashPage+':'+plugin.settings.pages+'" title="' + plugin.settings.lastLabel + '" rel="'+plugin.settings.pages+'" class="last">'+plugin.settings.lastButtonText+'</a></li>';
            }

            htmlNav += '</ul>';
            plugin.nav = $(htmlNav);
            plugin.nav.css({
                'width': plugin.el.width()
            });
            plugin.el.after(plugin.nav);

            var elSelector = '#' + plugin.el.get(0).id + ' + ';
            $(elSelector + ' .pagination li a.page,'
                + elSelector + ' .pagination li a.first,'
                + elSelector + ' .pagination li a.last').on('click', function(e) {
                e.preventDefault();
                displayPage($(this).attr('rel'));
            });

            $(elSelector + ' .pagination li a.prev').on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage > 1?parseInt(plugin.settings.currentPage) - 1:1;
                displayPage(page);
            });

            $(elSelector + ' .pagination li a.next').on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage < plugin.settings.pages?parseInt(plugin.settings.currentPage) + 1:plugin.settings.pages;
                displayPage(page);
            });
        };

        var displayPage = function(page, forceEffect) {
            if(plugin.settings.currentPage != page) {
                plugin.settings.currentPage = parseInt(page);
                offsetStart = (page - 1) * plugin.settings.elementsPerPage;
                offsetEnd = page * plugin.settings.elementsPerPage;
                if(typeof(forceEffect) != 'undefined') {
                    eval("transition_"+forceEffect+"("+offsetStart+", "+offsetEnd+")");
                }else {
                    eval("transition_"+plugin.settings.effect+"("+offsetStart+", "+offsetEnd+")");
                }

                plugin.nav.find('a.current').removeClass('current');
                plugin.nav.find('li.active').removeClass('active');
                plugin.nav.find('a.page:eq('+(page - 1)+')').addClass('current');
                plugin.nav.find('a.page:eq('+(page - 1)+')').parent().addClass('active');

                switch(plugin.settings.currentPage) {
                    case 1:
                        $('.pagination li a').removeClass('disabled');
                        $('.pagination li').removeClass('disabled');
                        $('.pagination li a.first, .pagination li a.prev').addClass('disabled');
                        $('.pagination li.first, .pagination li.prev').addClass('disabled');
                        break;
                    case plugin.settings.pages:
                        $('.pagination li a').removeClass('disabled');
                        $('.pagination li').removeClass('disabled');
                        $('.pagination li a.last, .pagination li a.next').addClass('disabled');
                        $('.pagination li.last, .pagination li.next').addClass('disabled');
                        break;
                    default:
                        $('.pagination li a').removeClass('disabled');
                        $('.pagination li').removeClass('disabled');
                        break;
                }

                //glissière des pages disponibles
                if(getNbOfPages() > plugin.settings.nbPaginateElementDisplayed){
                  var inf = page - (plugin.settings.nbPaginateElementDisplayed / 2) + 1;
                  var sup = parseInt(page) + (plugin.settings.nbPaginateElementDisplayed / 2);

                  if(inf > getNbOfPages() - plugin.settings.nbPaginateElementDisplayed){
                    inf = getNbOfPages() - plugin.settings.nbPaginateElementDisplayed + 1;
                  }

                  if(sup <= plugin.settings.nbPaginateElementDisplayed){
                    sup = plugin.settings.nbPaginateElementDisplayed;
                  }

                  for(i=1; i <= getNbOfPages(); i++) {
                    if(i < inf || i > sup){
                      $('.pagination li[rel=' + i + ']').hide();
                    } else {
                      $('.pagination li[rel=' + i + ']').show();
                    }
                  }
                }

                if(plugin.settings.scrollTop){

                }
                $('html, body').animate({
                    scrollTop: $("#" + plugin.settings.scrollToTopElementId).offset().top
                }, plugin.settings.scrollToTopTime);
            }
        };

        var transition_default = function(offsetStart, offsetEnd) {
            plugin.currentElements.hide();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.show();
        };

        var transition_fade = function(offsetStart, offsetEnd) {
            plugin.currentElements.fadeOut();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.fadeIn();
        };

        var transition_slide = function(offsetStart, offsetEnd) {
            plugin.currentElements.animate({
                'margin-left': plugin.settings.slideOffset * -1,
                'opacity': 0
            }, function() {
                $(this).remove();
            });

            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.animate({
                'margin-left': 0,
                'opacity': 1
            });
        };

        var transition_climb = function(offsetStart, offsetEnd) {
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': plugin.settings.slideOffset * -1,
                        'opacity': 0
                    }, function() {
                        $(this).remove();
                    });
                }, i * 200);
            });

            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': 0,
                        'opacity': 1
                    });
                }, i * 200);
            });
        };

        plugin.settings = $.extend({}, defaults, options);

        plugin.currentElements = $([]);
        plugin.settings.objElements = plugin.el.find(plugin.settings.paginateElement);
        plugin.settings.pages = getNbOfPages();
        if(plugin.settings.pages > 1) {
            plugin.el.html();

            // Here we go
            displayNav();

            page = 1;
            if(document.location.hash.indexOf('#'+plugin.settings.hashPage+':') != -1) {
                page = parseInt(document.location.hash.replace('#'+plugin.settings.hashPage+':', ''));
                if(page.length <= 0 || page < 1 || page > plugin.settings.pages) {
                    page = 1;
                }
            }

            displayPage(page, 'default');
        }
    });
};
})(jQuery);
