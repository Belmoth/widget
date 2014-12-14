var Admin_panel = (function () {

  var open = function ( json ) {
    $( "#admin").panel(
      {
        header: 'Панель администратора',
        url: '',
        close: true,
        counters: [ 'tab_discount', 'tab_delivery', 'tab_reservat', 'tab_orders'], 
        keyField: '№ прила',
        tips: true,
        json: json,
        tabs: [
          {
            name: 'tab_discount',
            value: 'Скидки',
            menu: [ '№', '№ прила', 'hash', 'Код скидки', 'Телефон', 'Дата' ],
            data: [],
            cacheDOM: ''
          },
          {
            name: 'tab_delivery',
            value: 'Доставка',
            menu: [ '№', '№ прила', 'Номер заказа', 'Адрес доставки', 'Коммент', 'Телефон', 'Статус', 'Дата и время' ],
            data: [],
            cacheDOM: ''
          },
          {
            name: 'tab_reservat',
            value: 'Бронь',
            menu: [ '№', '№ прила', 'Номер заказа', 'Дата и время', 'Имя', 'Кол-во человек', 'Коммент', 'Адрес кафе', 'Статус' ],
            data: [],
            cacheDOM: ''
          },
          {
            name: 'tab_orders',
            value: 'Заказы',
            menu: [ '№', '№ прила', 'Номер заказа', 'Название блюда', 'Количество', 'Цена', 'Адрес' ],
            data: [],
            cacheDOM: ''
          }
        ]
      }
    );

    $("#admin").panel('getData');
    $("#admin").show();
  };

  return {
    open: open
  };
})();