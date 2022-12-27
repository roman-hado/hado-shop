/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = function(a) { var n, e = [],
        i = a(window),
        t = !1;

    function c() { var t = i.width();
        t !== n && (n = t, a.each(e, function(n, e) { a.each(e.data, function(a, n) { n.currentActive && !d(n.range[0], n.range[1]) && (n.currentActive = !1, "function" == typeof n.disableCallback && n.disableCallback()) }), a.each(e.data, function(a, n) {!n.currentActive && d(n.range[0], n.range[1]) && (n.currentActive = !0, "function" == typeof n.enableCallback && n.enableCallback()) }) })) }

    function d(a, e) { var i, c, d, o = ""; return a > 0 && (o += "(min-width: " + a + "px)"), e < 1 / 0 && (o += (o ? " and " : "") + "(max-width: " + e + "px)"), i = o, c = a, d = e, window.matchMedia && t ? matchMedia(i).matches : window.styleMedia ? styleMedia.matchMedium(i) : window.media ? media.matchMedium(i) : n >= c && n <= d } return window.matchMedia && (window.Window && window.matchMedia === Window.prototype.matchMedia ? t = !0 : window.matchMedia.toString().indexOf("native") > -1 && (t = !0)), i.bind("load resize orientationchange", c), { addRange: function(i) { var t = { data: {} };
            a.each(i, function(a, n) { var e, i;
                t.data[a] = { range: (e = a, i = e.split(".."), [parseInt(i[0], 10) || -1 / 0, parseInt(i[1], 10) || 1 / 0].sort(function(a, n) { return a - n })), enableCallback: n.on, disableCallback: n.off } }), e.push(t), n = null, c() } } }(jQuery);


/*
 * Simple Mobile Navigation
 */
! function(t) {
    function i(i) { this.options = t.extend({ container: null, hideOnClickOutside: !1, menuActiveClass: "nav-active", menuOpener: ".nav-opener", menuDrop: ".nav-drop", toggleEvent: "click", outsideClickEvent: "click touchstart pointerdown MSPointerDown" }, i), this.initStructure(), this.attachEvents() } i.prototype = { initStructure: function() { this.page = t("html"), this.container = t(this.options.container), this.opener = this.container.find(this.options.menuOpener), this.drop = this.container.find(this.options.menuDrop) }, attachEvents: function() { var i = this;
            e && (e(), e = null), this.outsideClickHandler = function(e) { if (i.isOpened()) { var n = t(e.target);
                    n.closest(i.opener).length || n.closest(i.drop).length || i.hide() } }, this.openerClickHandler = function(t) { t.preventDefault(), i.toggle() }, this.opener.on(this.options.toggleEvent, this.openerClickHandler) }, isOpened: function() { return this.container.hasClass(this.options.menuActiveClass) }, show: function() { this.container.addClass(this.options.menuActiveClass), this.options.hideOnClickOutside && this.page.on(this.options.outsideClickEvent, this.outsideClickHandler) }, hide: function() { this.container.removeClass(this.options.menuActiveClass), this.options.hideOnClickOutside && this.page.off(this.options.outsideClickEvent, this.outsideClickHandler) }, toggle: function() { this.isOpened() ? this.hide() : this.show() }, destroy: function() { this.container.removeClass(this.options.menuActiveClass), this.opener.off(this.options.toggleEvent, this.clickHandler), this.page.off(this.options.outsideClickEvent, this.outsideClickHandler) } }; var e = function() { var i, e, n = t(window),
            o = t("html"),
            s = "resize-active",
            a = function() { i = !1, o.removeClass(s) };
        n.on("resize orientationchange", function() { i || (i = !0, o.addClass(s)), clearTimeout(e), e = setTimeout(a, 500) }) };
    t.fn.mobileNav = function(e) { var n = Array.prototype.slice.call(arguments),
            o = n[0]; return this.each(function() { var s = jQuery(this),
                a = s.data("MobileNav"); "object" == typeof e || void 0 === e ? s.data("MobileNav", new i(t.extend({ container: this }, e))) : "string" == typeof o && a && "function" == typeof a[o] && (n.shift(), a[o].apply(a, n)) }) } }(jQuery);

/*
 * jQuery Accordion plugin
 */
'use strict';
var accHiddenClass = 'js-acc-hidden';

function SlideAccordion(options) {
    this.options = $.extend(true, {
        allowClickWhenExpanded: false,
        activeClass: 'active',
        opener: '.opener',
        slider: '.slide',
        animSpeed: 300,
        collapsible: true,
        event: 'click',
        scrollToActiveItem: {
            enable: false,
            breakpoint: 767, // max-width
            animSpeed: 600,
            extraOffset: null
        }
    }, options);
    this.init();
}

SlideAccordion.prototype = {
    init: function() {
        if (this.options.holder) {
            this.findElements();
            this.setStateOnInit();
            this.attachEvents();
            this.makeCallback('onInit');
        }
    },

    findElements: function() {
        this.$holder = $(this.options.holder).data('SlideAccordion', this);
        this.$items = this.$holder.find(':has(' + this.options.slider + ')');
    },

    setStateOnInit: function() {
        var self = this;

        this.$items.each(function() {
            if (!$(this).hasClass(self.options.activeClass)) {
                $(this).find(self.options.slider).addClass(accHiddenClass);
            }
        });
    },

    attachEvents: function() {
        var self = this;

        this.accordionToggle = function(e) {
            var $item = jQuery(this).closest(self.$items);
            var $actiItem = self.getActiveItem($item);

            if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
                e.preventDefault();
                self.toggle($item, $actiItem);
            }
        };

        this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
    },

    toggle: function($item, $prevItem) {
        if (!$item.hasClass(this.options.activeClass)) {
            this.show($item);
        } else if (this.options.collapsible) {
            this.hide($item);
        }

        if (!$item.is($prevItem) && $prevItem.length) {
            this.hide($prevItem);
        }

        this.makeCallback('beforeToggle');
    },

    show: function($item) {
        var $slider = $item.find(this.options.slider);

        $item.addClass(this.options.activeClass);
        $slider.stop().hide().removeClass(accHiddenClass).slideDown({
            duration: this.options.animSpeed,
            complete: function() {
                $slider.removeAttr('style');
                if (
                    this.options.scrollToActiveItem.enable &&
                    window.innerWidth <= this.options.scrollToActiveItem.breakpoint
                ) {
                    this.goToItem($item);
                }
                this.makeCallback('onShow', $item);
            }.bind(this)
        });

        this.makeCallback('beforeShow', $item);
    },

    hide: function($item) {
        var $slider = $item.find(this.options.slider);

        $item.removeClass(this.options.activeClass);
        $slider.stop().show().slideUp({
            duration: this.options.animSpeed,
            complete: function() {
                $slider.addClass(accHiddenClass);
                $slider.removeAttr('style');
                this.makeCallback('onHide', $item);
            }.bind(this)
        });

        this.makeCallback('beforeHide', $item);
    },

    goToItem: function($item) {
        var itemOffset = $item.offset().top;

        if (itemOffset < $(window).scrollTop()) {
            // handle extra offset
            if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
                itemOffset -= this.options.scrollToActiveItem.extraOffset;
            } else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
                itemOffset -= this.options.scrollToActiveItem.extraOffset();
            }

            $('body, html').animate({
                scrollTop: itemOffset
            }, this.options.scrollToActiveItem.animSpeed);
        }
    },

    getActiveItem: function($item) {
        return $item.siblings().filter('.' + this.options.activeClass);
    },

    makeCallback: function(name) {
        if (typeof this.options[name] === 'function') {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            this.options[name].apply(this, args);
        }
    },

    destroy: function() {
        this.$holder.removeData('SlideAccordion');
        this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
        this.$items.removeClass(this.options.activeClass).each(function(i, item) {
            $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
        }.bind(this));
        this.makeCallback('onDestroy');
    }
};

$.fn.slideAccordion = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function() {
        var $holder = jQuery(this);
        var instance = $holder.data('SlideAccordion');

        if (typeof opt === 'object' || typeof opt === 'undefined') {
            new SlideAccordion($.extend(true, {
                holder: this
            }, opt));
        } else if (typeof method === 'string' && instance) {
            if (typeof instance[method] === 'function') {
                args.shift();
                instance[method].apply(instance, args);
            }
        }
    });
};

(function() {
    var tabStyleSheet = $('<style type="text/css">')[0];
    var tabStyleRule = '.' + accHiddenClass;
    tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
    if (tabStyleSheet.styleSheet) {
        tabStyleSheet.styleSheet.cssText = tabStyleRule;
    } else {
        tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
    }
    $('head').append(tabStyleSheet);
}());

/*
 * jQuery Tabs plugin
 */
function Tabset($holder, options) {
    this.$holder = $holder;
    this.options = options;

    this.init();
}

Tabset.prototype = {
    init: function() {
        this.$tabLinks = this.$holder.find(this.options.tabLinks);

        this.setStartActiveIndex();
        this.setActiveTab();

        if (this.options.autoHeight) {
            this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
        }

        this.makeCallback('onInit', this);
    },

    setStartActiveIndex: function() {
        var $classTargets = this.getClassTarget(this.$tabLinks);
        var $activeLink = $classTargets.filter('.' + this.options.activeClass);
        var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
        var activeIndex;

        if (this.options.checkHash && $hashLink.length) {
            $activeLink = $hashLink;
        }

        activeIndex = $classTargets.index($activeLink);

        this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
    },

    setActiveTab: function() {
        var self = this;

        this.$tabLinks.each(function(i, link) {
            var $link = $(link);
            var $classTarget = self.getClassTarget($link);
            var $tab = $($link.attr(self.options.attrib));

            if (i !== self.activeTabIndex) {
                $classTarget.removeClass(self.options.activeClass);
                $tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
            } else {
                $classTarget.addClass(self.options.activeClass);
                $tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
            }

            self.attachTabLink($link, i);
        });
    },

    attachTabLink: function($link, i) {
        var self = this;

        $link.on(this.options.event + '.tabset', function(e) {
            e.preventDefault();

            if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
                self.activeTabIndex = i;
                self.switchTabs();
            }
            if (self.options.checkHash) {
                location.hash = jQuery(this).attr('href').split('#')[1]
            }
        });
    },

    resizeHolder: function(height) {
        var self = this;

        if (height) {
            this.$tabHolder.height(height);
            setTimeout(function() {
                self.$tabHolder.addClass('transition');
            }, 10);
        } else {
            self.$tabHolder.removeClass('transition').height('');
        }
    },

    switchTabs: function() {
        var self = this;

        var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
        var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

        var $prevTab = this.getTab($prevLink);
        var $nextTab = this.getTab($nextLink);

        $prevTab.removeClass(this.options.activeClass);

        if (self.haveTabHolder()) {
            this.resizeHolder($prevTab.outerHeight());
        }

        setTimeout(function() {
            self.getClassTarget($prevLink).removeClass(self.options.activeClass);

            $prevTab.addClass(self.options.tabHiddenClass);
            $nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

            self.getClassTarget($nextLink).addClass(self.options.activeClass);

            if (self.haveTabHolder()) {
                self.resizeHolder($nextTab.outerHeight());

                setTimeout(function() {
                    self.resizeHolder();
                    self.prevTabIndex = self.activeTabIndex;
                    self.makeCallback('onChange', self);
                }, self.options.animSpeed);
            } else {
                self.prevTabIndex = self.activeTabIndex;
            }
        }, this.options.autoHeight ? this.options.animSpeed : 1);
    },

    getClassTarget: function($link) {
        return this.options.addToParent ? $link.parent() : $link;
    },

    getActiveTab: function() {
        return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
    },

    getTab: function($link) {
        return $($link.attr(this.options.attrib));
    },

    haveTabHolder: function() {
        return this.$tabHolder && this.$tabHolder.length;
    },

    destroy: function() {
        var self = this;

        this.$tabLinks.off('.tabset').each(function() {
            var $link = $(this);

            self.getClassTarget($link).removeClass(self.options.activeClass);
            $($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
        });

        this.$holder.removeData('Tabset');
    },

    makeCallback: function(name) {
        if (typeof this.options[name] === 'function') {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            this.options[name].apply(this, args);
        }
    }
};

$.fn.tabset = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    var options = $.extend({
        activeClass: 'active',
        addToParent: false,
        autoHeight: false,
        checkHash: false,
        defaultTab: true,
        animSpeed: 500,
        tabLinks: 'a',
        attrib: 'href',
        event: 'click',
        tabHiddenClass: 'js-tab-hidden'
    }, opt);
    options.autoHeight = options.autoHeight;

    return this.each(function() {
        var $holder = jQuery(this);
        var instance = $holder.data('Tabset');

        if (typeof opt === 'object' || typeof opt === 'undefined') {
            $holder.data('Tabset', new Tabset($holder, options));
        } else if (typeof method === 'string' && instance) {
            if (typeof instance[method] === 'function') {
                args.shift();
                instance[method].apply(instance, args);
            }
        }
    });
};

/*
 * JQuery popup
 */
function ContentPopup(opt) {
  this.options = $.extend({
    holder: null,
    popup: '.popup',
    btnOpen: '.open',
    btnClose: '.close',
    openClass: 'popup-active',
    clickEvent: 'click',
    mode: 'click',
    hideOnClickLink: true,
    hideOnClickOutside: true,
    delay: 50
  }, opt);
  if (this.options.holder) {
    this.holder = $(this.options.holder);
    this.init();
  }
}
ContentPopup.prototype = {
  init: function() {
    this.findElements();
    this.attachEvents();
  },
  findElements: function() {
    this.popup = this.holder.find(this.options.popup);
    this.btnOpen = this.holder.find(this.options.btnOpen);
    this.btnClose = this.holder.find(this.options.btnClose);
  },
  attachEvents: function() {
    // handle popup openers
    var self = this;
    this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

    if (this.clickMode) {
      // handle click mode
      this.btnOpen.bind(self.options.clickEvent + '.popup', function(e) {
        if (self.holder.hasClass(self.options.openClass)) {
          if (self.options.hideOnClickLink) {
            self.hidePopup();
          }
        } else {
          self.showPopup();
        }
        e.preventDefault();
      });

      // prepare outside click handler
      this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
    } else {
      // handle hover mode
      var timer, delayedFunc = function(func) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          func.call(self);
        }, self.options.delay);
      };
      this.btnOpen.on('mouseover.popup', function() {
        delayedFunc(self.showPopup);
      }).on('mouseout.popup', function() {
        delayedFunc(self.hidePopup);
      });
      this.popup.on('mouseover.popup', function() {
        delayedFunc(self.showPopup);
      }).on('mouseout.popup', function() {
        delayedFunc(self.hidePopup);
      });
    }

    // handle close buttons
    this.btnClose.on(self.options.clickEvent + '.popup', function(e) {
      self.hidePopup();
      e.preventDefault();
    });
  },
  outsideClickHandler: function(e) {
    // hide popup if clicked outside
    var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
    if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
      this.hidePopup();
    }
  },
  showPopup: function() {
    // reveal popup
    this.holder.addClass(this.options.openClass);
    this.popup.css({
      display: 'block'
    });

    // outside click handler
    if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
      this.outsideHandlerActive = true;
      $(document).on('click touchstart', this.outsideClickHandler);
    }
  },
  hidePopup: function() {
    // hide popup
    this.holder.removeClass(this.options.openClass);
    this.popup.css({
      display: 'none'
    });

    // outside click handler
    if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
      this.outsideHandlerActive = false;
      $(document).off('click touchstart', this.outsideClickHandler);
    }
  },
  bind: function(f, scope, forceArgs) {
    return function() {
      return f.apply(scope, forceArgs ? [forceArgs] : arguments);
    };
  },
  destroy: function() {
    this.popup.removeAttr('style');
    this.holder.removeClass(this.options.openClass);
    this.btnOpen.add(this.btnClose).add(this.popup).off('.popup');
    $(document).off('click touchstart', this.outsideClickHandler);
  }
};

// detect touch devices
var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

// jQuery plugin interface
$.fn.contentPopup = function(opt) {
  var args = Array.prototype.slice.call(arguments);
  var method = args[0];

  return this.each(function() {
    var $holder = jQuery(this);
    var instance = $holder.data('ContentPopup');

    if (typeof opt === 'object' || typeof opt === 'undefined') {
      $holder.data('ContentPopup', new ContentPopup($.extend({
        holder: this
      }, opt)));
    } else if (typeof method === 'string' && instance) {
      if (typeof instance[method] === 'function') {
        args.shift();
        instance[method].apply(instance, args);
      }
    }
  });
};

/*
 * jQuery Open/Close plugin
 */
!function(e){function t(t){this.options=e.extend({addClassBeforeAnimation:!0,hideOnClickOutside:!1,activeClass:"active",opener:".opener",slider:".slide",animSpeed:400,effect:"fade",event:"click"},t),this.init()}t.prototype={init:function(){this.options.holder&&(this.findElements(),this.attachEvents(),this.makeCallback("onInit",this))},findElements:function(){this.holder=e(this.options.holder),this.opener=this.holder.find(this.options.opener),this.slider=this.holder.find(this.options.slider)},attachEvents:function(){var t=this;this.eventHandler=function(e){e.preventDefault(),t.slider.hasClass(s)?t.showSlide():t.hideSlide()},t.opener.on(t.options.event,this.eventHandler),"hover"===t.options.event&&(t.opener.on("mouseenter",function(){t.holder.hasClass(t.options.activeClass)||t.showSlide()}),t.holder.on("mouseleave",function(){t.hideSlide()})),t.outsideClickHandler=function(o){if(t.options.hideOnClickOutside){var i=e(o.target);i.is(t.holder)||i.closest(t.holder).length||t.hideSlide()}},this.holder.hasClass(this.options.activeClass)?e(document).on("click touchstart",t.outsideClickHandler):this.slider.addClass(s)},showSlide:function(){var t=this;t.options.addClassBeforeAnimation&&t.holder.addClass(t.options.activeClass),t.slider.removeClass(s),e(document).on("click touchstart",t.outsideClickHandler),t.makeCallback("animStart",!0),n[t.options.effect].show({box:t.slider,speed:t.options.animSpeed,complete:function(){t.options.addClassBeforeAnimation||t.holder.addClass(t.options.activeClass),t.makeCallback("animEnd",!0)}})},hideSlide:function(){var t=this;t.options.addClassBeforeAnimation&&t.holder.removeClass(t.options.activeClass),e(document).off("click touchstart",t.outsideClickHandler),t.makeCallback("animStart",!1),n[t.options.effect].hide({box:t.slider,speed:t.options.animSpeed,complete:function(){t.options.addClassBeforeAnimation||t.holder.removeClass(t.options.activeClass),t.slider.addClass(s),t.makeCallback("animEnd",!1)}})},destroy:function(){this.slider.removeClass(s).css({display:""}),this.opener.off(this.options.event,this.eventHandler),this.holder.removeClass(this.options.activeClass).removeData("OpenClose"),e(document).off("click touchstart",this.outsideClickHandler)},makeCallback:function(e){if("function"==typeof this.options[e]){var t=Array.prototype.slice.call(arguments);t.shift(),this.options[e].apply(this,t)}}};var o,i,s="js-slide-hidden";o=e('<style type="text/css">')[0],i="."+s,i+="{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}",o.styleSheet?o.styleSheet.cssText=i:o.appendChild(document.createTextNode(i)),e("head").append(o);var n={slide:{show:function(e){e.box.stop(!0).hide().slideDown(e.speed,e.complete)},hide:function(e){e.box.stop(!0).slideUp(e.speed,e.complete)}},fade:{show:function(e){e.box.stop(!0).hide().fadeIn(e.speed,e.complete)},hide:function(e){e.box.stop(!0).fadeOut(e.speed,e.complete)}},none:{show:function(e){e.box.hide().show(0,e.complete)},hide:function(e){e.box.hide(0,e.complete)}}};e.fn.openClose=function(o){var i=Array.prototype.slice.call(arguments),s=i[0];return this.each(function(){var n=jQuery(this),a=n.data("OpenClose");"object"==typeof o||void 0===o?n.data("OpenClose",new t(e.extend({holder:this},o))):"string"==typeof s&&a&&"function"==typeof a[s]&&(i.shift(),a[s].apply(a,i))})}}(jQuery);
