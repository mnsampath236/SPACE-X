var mod_pagespeed_s3ayZPZZPF = "// Sticky Plugin v1.0.4 for jQuery\n// =============\n// Author: Anthony Garand\n// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)\n// Improvements by Leonardo C. Daronco (daronco)\n// Created: 02/14/2011\n// Date: 07/20/2015\n// Website: http://stickyjs.com/\n// Description: Makes an element on the page stick on the screen as you scroll\n//              It will only set the 'top' and 'position' of your element, you\n//              might need to adjust the width in some cases.\n\n(function (factory) {\n    if (typeof define === 'function' && define.amd) {\n        // AMD. Register as an anonymous module.\n        define(['jquery'], factory);\n    } else if (typeof module === 'object' && module.exports) {\n        // Node/CommonJS\n        module.exports = factory(require('jquery'));\n    } else {\n        // Browser globals\n        factory(jQuery);\n    }\n}(function ($) {\n    var slice = Array.prototype.slice; // save ref to original slice()\n    var splice = Array.prototype.splice; // save ref to original slice()\n\n  var defaults = {\n      topSpacing: 0,\n      bottomSpacing: 0,\n      className: 'is-sticky',\n      wrapperClassName: 'sticky-wrapper',\n      center: false,\n      getWidthFrom: '',\n      widthFromWrapper: true, // works only when .getWidthFrom is empty\n      responsiveWidth: false,\n      zIndex: 'inherit'\n    },\n    $window = $(window),\n    $document = $(document),\n    sticked = [],\n    windowHeight = $window.height(),\n    scroller = function() {\n      var scrollTop = $window.scrollTop(),\n        documentHeight = $document.height(),\n        dwh = documentHeight - windowHeight,\n        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;\n\n      for (var i = 0, l = sticked.length; i < l; i++) {\n        var s = sticked[i],\n          elementTop = s.stickyWrapper.offset().top,\n          etse = elementTop - s.topSpacing - extra;\n\n        //update height in case of dynamic content\n        s.stickyWrapper.css('height', s.stickyElement.outerHeight());\n\n        if (scrollTop <= etse) {\n          if (s.currentTop !== null) {\n            s.stickyElement\n              .css({\n                'width': '',\n                'position': '',\n                'top': '',\n                'z-index': ''\n              });\n            s.stickyElement.parent().removeClass(s.className);\n            s.stickyElement.trigger('sticky-end', [s]);\n            s.currentTop = null;\n          }\n        }\n        else {\n          var newTop = documentHeight - s.stickyElement.outerHeight()\n            - s.topSpacing - s.bottomSpacing - scrollTop - extra;\n          if (newTop < 0) {\n            newTop = newTop + s.topSpacing;\n          } else {\n            newTop = s.topSpacing;\n          }\n          if (s.currentTop !== newTop) {\n            var newWidth;\n            if (s.getWidthFrom) {\n                padding =  s.stickyElement.innerWidth() - s.stickyElement.width();\n                newWidth = $(s.getWidthFrom).width() - padding || null;\n            } else if (s.widthFromWrapper) {\n                newWidth = s.stickyWrapper.width();\n            }\n            if (newWidth == null) {\n                newWidth = s.stickyElement.width();\n            }\n            s.stickyElement\n              .css('width', newWidth)\n              .css('position', 'fixed')\n              .css('top', newTop)\n              .css('z-index', s.zIndex);\n\n            s.stickyElement.parent().addClass(s.className);\n\n            if (s.currentTop === null) {\n              s.stickyElement.trigger('sticky-start', [s]);\n            } else {\n              // sticky is started but it have to be repositioned\n              s.stickyElement.trigger('sticky-update', [s]);\n            }\n\n            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {\n              // just reached bottom || just started to stick but bottom is already reached\n              s.stickyElement.trigger('sticky-bottom-reached', [s]);\n            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {\n              // sticky is started && sticked at topSpacing && overflowing from top just finished\n              s.stickyElement.trigger('sticky-bottom-unreached', [s]);\n            }\n\n            s.currentTop = newTop;\n          }\n\n          // Check if sticky has reached end of container and stop sticking\n          var stickyWrapperContainer = s.stickyWrapper.parent();\n          var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);\n\n          if( unstick ) {\n            s.stickyElement\n              .css('position', 'absolute')\n              .css('top', '')\n              .css('bottom', 0)\n              .css('z-index', '');\n          } else {\n            s.stickyElement\n              .css('position', 'fixed')\n              .css('top', newTop)\n              .css('bottom', '')\n              .css('z-index', s.zIndex);\n          }\n        }\n      }\n    },\n    resizer = function() {\n      windowHeight = $window.height();\n\n      for (var i = 0, l = sticked.length; i < l; i++) {\n        var s = sticked[i];\n        var newWidth = null;\n        if (s.getWidthFrom) {\n            if (s.responsiveWidth) {\n                newWidth = $(s.getWidthFrom).width();\n            }\n        } else if(s.widthFromWrapper) {\n            newWidth = s.stickyWrapper.width();\n        }\n        if (newWidth != null) {\n            s.stickyElement.css('width', newWidth);\n        }\n      }\n    },\n    methods = {\n      init: function(options) {\n        return this.each(function() {\n          var o = $.extend({}, defaults, options);\n          var stickyElement = $(this);\n\n          var stickyId = stickyElement.attr('id');\n          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;\n          var wrapper = $('<div></div>')\n            .attr('id', wrapperId)\n            .addClass(o.wrapperClassName);\n\n          stickyElement.wrapAll(function() {\n            if ($(this).parent(\"#\" + wrapperId).length == 0) {\n                    return wrapper;\n            }\n});\n\n          var stickyWrapper = stickyElement.parent();\n\n          if (o.center) {\n            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:\"auto\",marginRight:\"auto\"});\n          }\n\n          if (stickyElement.css(\"float\") === \"right\") {\n            stickyElement.css({\"float\":\"none\"}).parent().css({\"float\":\"right\"});\n          }\n\n          o.stickyElement = stickyElement;\n          o.stickyWrapper = stickyWrapper;\n          o.currentTop    = null;\n\n          sticked.push(o);\n\n          methods.setWrapperHeight(this);\n          methods.setupChangeListeners(this);\n        });\n      },\n\n      setWrapperHeight: function(stickyElement) {\n        var element = $(stickyElement);\n        var stickyWrapper = element.parent();\n        if (stickyWrapper) {\n          stickyWrapper.css('height', element.outerHeight());\n        }\n      },\n\n      setupChangeListeners: function(stickyElement) {\n        if (window.MutationObserver) {\n          var mutationObserver = new window.MutationObserver(function(mutations) {\n            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {\n              methods.setWrapperHeight(stickyElement);\n            }\n          });\n          mutationObserver.observe(stickyElement, {subtree: true, childList: true});\n        } else {\n          if (window.addEventListener) {\n            stickyElement.addEventListener('DOMNodeInserted', function() {\n              methods.setWrapperHeight(stickyElement);\n            }, false);\n            stickyElement.addEventListener('DOMNodeRemoved', function() {\n              methods.setWrapperHeight(stickyElement);\n            }, false);\n          } else if (window.attachEvent) {\n            stickyElement.attachEvent('onDOMNodeInserted', function() {\n              methods.setWrapperHeight(stickyElement);\n            });\n            stickyElement.attachEvent('onDOMNodeRemoved', function() {\n              methods.setWrapperHeight(stickyElement);\n            });\n          }\n        }\n      },\n      update: scroller,\n      unstick: function(options) {\n        return this.each(function() {\n          var that = this;\n          var unstickyElement = $(that);\n\n          var removeIdx = -1;\n          var i = sticked.length;\n          while (i-- > 0) {\n            if (sticked[i].stickyElement.get(0) === that) {\n                splice.call(sticked,i,1);\n                removeIdx = i;\n            }\n          }\n          if(removeIdx !== -1) {\n            unstickyElement.unwrap();\n            unstickyElement\n              .css({\n                'width': '',\n                'position': '',\n                'top': '',\n                'float': '',\n                'z-index': ''\n              })\n            ;\n          }\n        });\n      }\n    };\n\n  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):\n  if (window.addEventListener) {\n    window.addEventListener('scroll', scroller, false);\n    window.addEventListener('resize', resizer, false);\n  } else if (window.attachEvent) {\n    window.attachEvent('onscroll', scroller);\n    window.attachEvent('onresize', resizer);\n  }\n\n  $.fn.sticky = function(method) {\n    if (methods[method]) {\n      return methods[method].apply(this, slice.call(arguments, 1));\n    } else if (typeof method === 'object' || !method ) {\n      return methods.init.apply( this, arguments );\n    } else {\n      $.error('Method ' + method + ' does not exist on jQuery.sticky');\n    }\n  };\n\n  $.fn.unstick = function(method) {\n    if (methods[method]) {\n      return methods[method].apply(this, slice.call(arguments, 1));\n    } else if (typeof method === 'object' || !method ) {\n      return methods.unstick.apply( this, arguments );\n    } else {\n      $.error('Method ' + method + ' does not exist on jQuery.sticky');\n    }\n  };\n  $(function() {\n    setTimeout(scroller, 0);\n  });\n}));";
var mod_pagespeed_A1Pakslbye = " AOS.init({\n 	duration: 800,\n 	easing: 'slide',\n 	once: true\n });\n\njQuery(document).ready(function($) {\n\n	\"use strict\";\n\n	\n\n	var siteMenuClone = function() {\n\n		$('.js-clone-nav').each(function() {\n			var $this = $(this);\n			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');\n		});\n\n\n		setTimeout(function() {\n			\n			var counter = 0;\n      $('.site-mobile-menu .has-children').each(function(){\n        var $this = $(this);\n        \n        $this.prepend('<span class=\"arrow-collapse collapsed\">');\n\n        $this.find('.arrow-collapse').attr({\n          'data-toggle' : 'collapse',\n          'data-target' : '#collapseItem' + counter,\n        });\n\n        $this.find('> ul').attr({\n          'class' : 'collapse',\n          'id' : 'collapseItem' + counter,\n        });\n\n        counter++;\n\n      });\n\n    }, 1000);\n\n		$('body').on('click', '.arrow-collapse', function(e) {\n      var $this = $(this);\n      if ( $this.closest('li').find('.collapse').hasClass('show') ) {\n        $this.removeClass('active');\n      } else {\n        $this.addClass('active');\n      }\n      e.preventDefault();  \n      \n    });\n\n		$(window).resize(function() {\n			var $this = $(this),\n				w = $this.width();\n\n			if ( w > 768 ) {\n				if ( $('body').hasClass('offcanvas-menu') ) {\n					$('body').removeClass('offcanvas-menu');\n				}\n			}\n		})\n\n		$('body').on('click', '.js-menu-toggle', function(e) {\n			var $this = $(this);\n			e.preventDefault();\n\n			if ( $('body').hasClass('offcanvas-menu') ) {\n				$('body').removeClass('offcanvas-menu');\n				$this.removeClass('active');\n			} else {\n				$('body').addClass('offcanvas-menu');\n				$this.addClass('active');\n			}\n		}) \n\n		// click outisde offcanvas\n		$(document).mouseup(function(e) {\n	    var container = $(\".site-mobile-menu\");\n	    if (!container.is(e.target) && container.has(e.target).length === 0) {\n	      if ( $('body').hasClass('offcanvas-menu') ) {\n					$('body').removeClass('offcanvas-menu');\n				}\n	    }\n		});\n	}; \n	siteMenuClone();\n\n\n	var sitePlusMinus = function() {\n		$('.js-btn-minus').on('click', function(e){\n			e.preventDefault();\n			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {\n				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);\n			} else {\n				$(this).closest('.input-group').find('.form-control').val(parseInt(0));\n			}\n		});\n		$('.js-btn-plus').on('click', function(e){\n			e.preventDefault();\n			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);\n		});\n	};\n	// sitePlusMinus();\n\n\n	var siteSliderRange = function() {\n    $( \"#slider-range\" ).slider({\n      range: true,\n      min: 0,\n      max: 100000,\n      values: [ 0, 15000 ],\n      slide: function( event, ui ) {\n        $( \"#amount\" ).val( \"$\" + ui.values[ 0 ] + \" - $\" + ui.values[ 1 ] );\n      }\n    });\n    $( \"#amount\" ).val( \"$\" + $( \"#slider-range\" ).slider( \"values\", 0 ) +\n      \" - $\" + $( \"#slider-range\" ).slider( \"values\", 1 ) );\n	};\n	siteSliderRange();\n\n\n	\n	var siteCarousel = function () {\n		if ( $('.nonloop-block-13').length > 0 ) {\n			$('.nonloop-block-13').owlCarousel({\n		    center: false,\n		    items: 1,\n		    loop: true,\n				stagePadding: 0,\n		    margin: 30,\n		    autoplay: true,\n		    nav: false,\n		    responsive:{\n	        600:{\n	        	margin: 30,\n	        	\n	          items: 2\n	        },\n	        1000:{\n	        	margin: 30,\n	        	stagePadding: 0,\n	        	\n	          items: 3\n	        },\n	        1200:{\n	        	margin: 30,\n	        	stagePadding: 0,\n	        	\n	          items: 4\n	        }\n		    }\n			});\n		}\n\n		$('.slide-one-item, .with-dots').owlCarousel({\n	    center: false,\n	    items: 1,\n	    loop: true,\n			stagePadding: 0,\n	    margin: 0,\n			autoplay: true,\n			smartSpeed: 1000,\n	    pauseOnHover: false,\n	    nav: false,\n	    dots: true,\n	    navText: ['<span class=\"icon-keyboard_arrow_left\">', '<span class=\"icon-keyboard_arrow_right\">']\n	  });\n\n	  $('.slide-one-item-alt').owlCarousel({\n	    center: false,\n	    items: 1,\n	    loop: true,\n			stagePadding: 0,\n			smartSpeed: 700,\n	    margin: 0,\n	    autoplay: true,\n	    pauseOnHover: false,\n\n	  });\n\n	  \n	  \n	  $('.custom-prev1').click(function(e) {\n	  	e.preventDefault();\n	  	$('.nonloop-block-13').trigger('prev.owl.carousel');\n	  });\n	  $('.custom-next1').click(function(e) {\n	  	e.preventDefault();\n	  	$('.nonloop-block-13').trigger('next.owl.carousel');\n	  });\n\n\n	  $('.custom-next').click(function(e) {\n	  	e.preventDefault();\n	  	$('.slide-one-item-alt').trigger('next.owl.carousel');\n	  });\n	  $('.custom-prev').click(function(e) {\n	  	e.preventDefault();\n	  	$('.slide-one-item-alt').trigger('prev.owl.carousel');\n	  });\n	  \n	};\n	siteCarousel();\n\n	\n\n	var siteCountDown = function() {\n\n		$('#date-countdown').countdown('2020/10/10', function(event) {\n		  var $this = $(this).html(event.strftime(''\n		    + '<span class=\"countdown-block\"><span class=\"label\">%w</span> weeks </span>'\n		    + '<span class=\"countdown-block\"><span class=\"label\">%d</span> days </span>'\n		    + '<span class=\"countdown-block\"><span class=\"label\">%H</span> hr </span>'\n		    + '<span class=\"countdown-block\"><span class=\"label\">%M</span> min </span>'\n		    + '<span class=\"countdown-block\"><span class=\"label\">%S</span> sec</span>'));\n		});\n				\n	};\n	siteCountDown();\n\n	var siteDatePicker = function() {\n\n		if ( $('.datepicker').length > 0 ) {\n			$('.datepicker').datepicker();\n		}\n\n	};\n	siteDatePicker();\n\n	var siteSticky = function() {\n		$(\".js-sticky-header\").sticky({topSpacing:0});\n	};\n	siteSticky();\n\n	// navigation\n  var OnePageNavigation = function() {\n    var navToggler = $('.site-menu-toggle');\n   	$(\"body\").on(\"click\", \".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a\", function(e) {\n      e.preventDefault();\n\n      var hash = this.hash;\n\n      $('html, body').animate({\n        'scrollTop': $(hash).offset().top\n      }, 600, 'easeInOutExpo');\n\n		});\n		\n		$('.gototop').on('click', function() {\n\n\n      $('html, body').animate({\n        'scrollTop': $('body').offset().top\n      }, 600, 'easeInOutExpo');\n		});\n  };\n  OnePageNavigation();\n\n  var siteScroll = function() {\n\n  	\n\n  	$(window).scroll(function() {\n\n  		var st = $(this).scrollTop();\n\n  		if (st > 100) {\n  			$('.js-sticky-header').addClass('shrink');\n  		} else {\n  			$('.js-sticky-header').removeClass('shrink');\n			}\n			\n\n			if (st > 200) {\n  			$('.gototop').addClass('active');\n  		} else {\n  			$('.gototop').removeClass('active');\n  		}\n\n  	}) \n\n  };\n  siteScroll();\n\n});";
