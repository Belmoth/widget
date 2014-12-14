(function ($) {
  $.widget('custom.panel', {
    options: {
      header: '',
      tabs: [],
      menu: [],
      counters: [],
      url: '',
      close: false, //close button
      keyField: '',
      tips: false,
      json: ''
    },

    _getHeader: function () {
      if ( this.options.close ) {
        return '<div id="admin-header">' + this.options.header + '<div id="admin-close">X</div></div><div id="admin-content">';
      } else {
        return '<div id="admin-header">' + this.options.header + '</div><div id="admin-content">';
      }
    },

    _getTab: function ( i ) {
      var tabs = this.options.tabs
      ,   tab;
      
      ( i > 0 ) 
        ? tab = '<li class="admin-menu_link"                 data-content="' + 
              tabs[ i ].name + '">' + tabs[ i ].value

        : tab ='<li class="admin-menu_link admin-link-press" data-content="' + 
              tabs[ i ].name + '">' + tabs[ i ].value;

        if ( this.options.counters ) {
          var counters = this.options.counters;

          var len = counters.length;
          var name = tabs[ i ].name;

          for (var j = 0; j < len; j++ ) {
            if ( name === counters[ j ] ) {
              tab = tab + '<span class="el_count"></span>';
              break;
            }
          }
        }

        return tab = tab + '</li>';
    },

    _getContainers: function ( i ) {
      var tabs = this.options.tabs;
      return '<div class="tab_block ' + tabs[ i ].name + '"><div class="tab_block_container"><ul class="tab_block_menu">';
    },

    _getColumn: function ( i ) {
      var li, k, items, len, keyField;
      keyField = this.options.keyField;

      items = this.options.tabs[ i ].menu;
      len   = items.length;

      li = ''; 
      for ( var j = 0; j < len; j++ ) {
        k  = j  + 1;

        if ( items[ j ] === keyField ) {
          li = li + '<li class="item item-' + (j+1) + '">' + items[ j ] + 
                    '<p class="key_field">key field for filter</p></li>';
        } else {
          li = li + '<li class="item item-' + (j+1) + '">' + items[ j ] + '</li>';
        }
      }

      return li;
    },

    _getMenu: function () {
      var tabs = this.options.tabs
      ,   len  = tabs.length
      ,   menu = '<ul class="admin-menu">';

      for ( var i = 0; i < len; i++ ) {
        menu = menu + this._getTab( i );
      }

      menu = menu + '</ul>';
      return menu;
    },

    _getBody: function () {
      var len  = this.options.tabs.length
      ,   body = this._getMenu();
      
      for ( var i = 0; i < len; i++ ) {

        body = body
          + this._getContainers( i )
          + this._getColumn( i );

      ( this.options.keyField ) 
        ? body = body + '</ul><div class="tab_block_content filter-on"></div></div></div>'
        : body = body + '</ul><div class="tab_block_content"></div></div></div>'
      }

      return body;
    },

    _createDisc: function( obj ) {
      var filter, template, json, data, rendered;
      filter = obj.filter ? 'filter': '';

      json = obj.json;

      data = {
        filter:    filter,
        id:        json.id,
        app_num:   json.app_num,
        hash:      json.hash,
        disc:      json.discount_num,
        tel:       json.app_tel,
        time_send: json.time_send
      };

      template = $('#discounts').html();
      Mustache.parse(template);

      rendered = Mustache.render(template, data);
      return rendered;
    },

    _createReserv: function ( obj ) {
      var filter, template, json, data, rendered;
      filter = obj.filter ? 'filter': '';

      json = obj.json;
      data = {
        filter:    filter,
        id:        json.id,
        app_num:   json.app_num,
        order_num: json.order_num,
        date:      json.date,
        name:      json.name,
        people:    json.people,
        comment:   json.comment,
        address:   json.address,
        status:    json.status
      };

      template = $('#reservation').html();
      Mustache.parse(template);

      rendered = Mustache.render(template, data);
      return rendered;
    },

    _createDeliv: function ( obj ) {
      var filter, template, json, data, rendered;
      filter = obj.filter ? 'filter': '';

      json = obj.json

      data = {
        filter:    filter,
        id:        json.id,
        app_num:   json.app_num,
        order_num: json.order_num,
        address:   json.address,
        comment:   json.comment,
        phone:     json.phone,
        status:    json.status,
        date:      json.date
      };

      template = $('#delivery').html();
      Mustache.parse(template);

      rendered = Mustache.render(template, data);
      return rendered;
    },

    _createOrder: function ( obj ) {
      var filter
      ,   json       = obj.json
      ,   data
      ,   template
      ,   rendered
      ,   dishes     = '';

      filter = obj.filter ? 'filter': '';
      data = {
        filter:    filter,
        id:        json.id,
        app_num:   json.app_num,
        order_num: json.order_num,
        dishes:    dishes,
        count:     json.count,
        price:     json.price,
        address:   json.address
      };

      template = $('#order').html();
      Mustache.parse(template);

      rendered = Mustache.render(template, data);
      return rendered;
    },

    _resetClicked: function () {
      var clickedClass = 'admin-link-press';
      
      $(".admin-menu_link").each(function () {
        var $this = $(this);

        if ( $this.hasClass(clickedClass) ) {
          $this.removeClass( clickedClass );
        }
      });
    },

    _tabAddPressClass: function ( tab ) {
      var $tabs = $(".admin-menu_link");
      $tabs.removeClass("admin-link-press");
      tab.classList.add("admin-link-press");
    },
  
    _findTab: function (tabName) {
      var tabsName = this.options.tabs.map( function (tab) {
        return tab.name;
      });

      return tabsName.indexOf( tabName );
    },

    _getTabName: function ( tabName ) {
      var tabs  = this.options.tabs;
      var idTab = this._findTab ( tabName );

      return tabs[ idTab ];
    },

    _getCreateFunction: function ( tabName ) {
      var tabFunctions = {
        'tab_discount': this._createDisc,
        'tab_reservat': this._createReserv,
        'tab_delivery': this._createReserv,
        'tab_orders'  : this._createOrder
      }

      return tabFunctions[ tabName ].bind(this);
    },

    _showTabContent: function ( el ) {
      var dataElem = this._getDataWithClass( el )
      ,   $content = $( '.tab_block'+dataElem.elem_class )
      ,   tabName = dataElem.elem_content;

      this._tabAddPressClass( el );
      this._hideAllTabs();
      this._printPanel( tabName );

      $content.show();
    },

    _getDataWithClass: function ( el ) {
      var $el = $(el)
      ,   data_content = $el.data("content");

      return {
        elem_content: data_content,
        elem_class: "." + data_content
      }
    },
    
    _start: function ( json ) {
      var arrayRowsCount = json.rowsCount
      ,   table_data     = json.table_data;

      this._sortDataOnTabs( arrayRowsCount, table_data );
      this._printPanel( this.options.tabs[0].name ); //Open the first tab

      $(".tab_block:first").css("display", "block");
    },

    getData: function () {
      //we can get data from server or use data into
      //this.options.json
      var that   = this;
      var result =  this.options.json;

      if ( result ) {
        this._start( result );
      } else {
        $.ajax({
          type: "Post",
          url:  "/pages/admin.php",
          data: this.options.url,
          
          success: function (data) {
            /* 
              data = {
                rowsCount: [ 3, 4, 1, 1, 1 ], //for example
                table_data: { ... } 
              }

              'rowsCount' need that to explode data on tables.
              'table_data' will print in table. 
            */

            var json = JSON.parse(data);
             if ( json !== 0 ) {
              if ( json[0] != false ) {
                that._start( json );
              }
            }
          }
        });
      }
    },

    _sortDataOnTabs: function ( arrayRowsCount, table_data ) {
      var tab_num = elem = j = 0;
      var tabs    = this.options.tabs;

      for ( var i = 0, len = arrayRowsCount.length; i < len; i++ ) {
        while ( j < arrayRowsCount[ tab_num ] ) {
          tabs[ tab_num ].data.push( table_data[ elem ] );
          j++;
          elem++;
        }

        tab_num++;
        j = 0;
      }
    },

    _hideAllTabs: function () {
      var $tabs = $(".tab_block");
      $tabs.hide();
    },

    _printPanel: function ( tabName ) {
      var $context = "." + tabName
      ,   $content = $(".tab_block_content", $context)
      ,   tab = this._getTabName( tabName );

      if ( !tab.cacheDOM ) {
        var rows      = ""
        ,   createRow = this._getCreateFunction( tabName );

        for ( var i = 0, len = tab.data.length; i < len; i++ ) {
          tab.data[ i ].filter ? rows += createRow({ json: tab.data[ i ], filter: true })
                               : rows += createRow({ json: tab.data[ i ] });
        }

        $content.append( rows );
        tab.cacheDOM = $(".rows", $content);
        tab.data = [];
      }
    },

    _reset: function () {
      var tabs = this.options.tabs
      var len  = tabs.length;

      for ( var i = 0; i < len; i++ ) {
        tabs[ i ].data = [];
        tabs[ i ].cacheDOM = "";
      }

      if ( this.options.keyField ) { 
        var $el_count = $(".el_count");
        $el_count.html("");
      }

      var $filter = $(".tab_block_content");
      $filter.empty();

      var $admin_menu_link = $(".admin-menu_link");
      $admin_menu_link.removeClass("admin-link-press");

      $(".tab_block").css("display", "none");
      $(".admin-menu_link:first-child").addClass("admin-link-press");

      this._removeAllFilter();
    },

    _removeAllFilter: function () {
      var $el = $(".rows", ".tab_block_content.filter-on");
      var tabs = this.options.tabs;

      $el.each(function () {
        if ( $(this).hasClass("filter") ) {
          $(this).removeClass("filter");
        }
      });

      for ( var i = 1, len = tabs.length; i < len; i++ ) {
        if ( !tabs[ i ].cacheDOM ) {
          var $data_el = $(tabs[ i ].data);
          $data_el.each(function () {
            this.filter = false;
          });
        }
      }
    },

    _findDataTabByAppNum: function (app_num) {
        var that = this;
        var tabs = this.options.tabs;

        this.return = false;

        !this.app_num
            ? this.app_num = app_num
            : this.app_num != app_num
                ? this.app_num = app_num
                : this.return = true;

        if ( this.return ) return;

        that._removeAllFilter();

        var count;
        for ( var i = 0, len = tabs.length; i < len; i++ ) {
            count = 0;
            var tab_name = tabs[ i ].name;

            if ( !tabs[ i ].cacheDOM ) {
              var $data_el = $(tabs[ i ].data);
              $data_el.each(function () {
                if ( this.app_num == app_num ) {
                  this.filter = true;
                  count++;
                }
              });
            } else {
              var $el = tabs[ i ].cacheDOM;
              $el.each(function () {
                var text = $(this).find(".app_num").data("text");

                if ( text == app_num ) {
                  $(this).addClass("filter");
                  count++;
                }
              });
            }
            $(".admin-menu_link[data-content^='"+tab_name+"']").find(".el_count").html(count);
        }
    },

    _create: function() {
      var tabs    = this.options.tabs
      ,   len     = tabs.length
      ,   content = ''
      ,   clickedClass = 'admin-link-press'
      ,   that    = this;

      content = this._getHeader();
      content = content + this._getBody();

      this.element.append( content );
      $(".tab_block:first").css("display", "block");

      if ( this.options.close ) {
        var $admin_close = $("#admin-close");

        $admin_close.on('click', function () {
          that._reset();
          $("#admin").hide();
        })
      }

      if ( this.options.keyField ) {
        var $filter = $(".tab_block_content.filter-on");
        
        $filter.on("click", function (e) {
          var $el  = $( e.target )
          ,   $row = $el.parent()
          ,   app_num = $row.find(".app_num").data("text");
          
          that._findDataTabByAppNum( app_num );
        });
      }

      $(".admin-menu_link").on('click', function () {
        that._resetClicked();
        that._showTabContent( this );
        $(this).addClass( clickedClass );
      });
      this.getData();
    },

    _setOptions: function () {},
    _destroy: function () {}
  });
})(jQuery);