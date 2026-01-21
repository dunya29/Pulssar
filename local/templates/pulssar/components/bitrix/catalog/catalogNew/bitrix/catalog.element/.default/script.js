jQuery(document).ready(function($) {
    $('body').on('click', '.js-selectOfferItem', function(){
        let offerId = $(this).data('id')
        let param = $.param({
            'ID': offerId,
        })
        $.ajax({
            url: "/local/ajax/getSkuNew.php",
            type: "POST",
            dataType: "json",
            data: param,
            success: function (response) {
                console.log(response)
                if (response.photo) {
                    if (window.gotoMainImageByUrl) {
                        window.gotoMainImageByUrl(response.photo, { speed: 700, addIfMissing: true });
                    }
                }
                let eventData = {
                    newId: offerId
                };
                $('.js-productSpecifications').empty().html(response.charact)
                $('.js-productArticle').empty().text('Артикул: '+response.art)
                $('.js-priceBase').empty().append(response.price.PRINT_DISCOUNT_PRICE)
                if(response.price.PERCENT>0){
                    $('.js-priceDiscount')
                        .empty()
                        .append('<p class="product-item-discount-price">'+response.price.PRINT_BASE_PRICE+'</p>')
                        .append('<p class="product-item-discount-banner">-'+response.price.PERCENT+'%</p>')
                }else{
                    $('.js-priceDiscount').empty()
                }
                $('.js-qty-selector').attr('data-maxquantity', response.quantity)
                /*$('.js-qty-value').text('1')
                $('.js-qty-selector').removeClass('show')
                $('.js-add-btn').show()*/
                $('yandex-pay-badge').attr('amount', response.price.DISCOUNT_PRICE)
                BX.onCustomEvent('onCatalogElementChangeOffer', [eventData]);
            },
            error: function (jqXHR, exception) {
            }
        })
    })
    $('body').on('click', '.js-add-btn', function(){


    })
})
function addToCart(isAdded, quantity) {
    const result = { isAdded, quantity };
    let offerID = 0;
    if($('.js-selectOfferItem').length>0){
        offerID = $('.js-selectOfferItem.active').data('id')
    }else{
        offerID = $('.product-item').data('product-id')
    }
    if(offerID>0){
        let param = $.param({
            id: offerID,
            quant: quantity
        })
        $.ajax({
            url: '/local/ajax/add2basket.php',
            type: 'POST',
            dataType: 'json',
            data: param,
            success: function (data) {
                UIkit.notification({message: data.res, pos: 'top-right'});
                BX.onCustomEvent('OnBasketChange');
            },
            error: function(jqXHR, exception)
            {
                if (jqXHR.status === 0) {
                    console.log('НЕ подключен к интернету!');
                } else if (jqXHR.status == 404) {
                    console.log('НЕ найдена страница запроса [404])');
                } else if (jqXHR.status == 500) {
                    console.log('НЕ найден домен в запросе [500].');
                } else if (exception === 'parsererror') {
                    console.log("Ошибка в коде: \n"+jqXHR.responseText);
                } else if (exception === 'timeout') {
                    console.log('Не ответил на запрос.');
                } else if (exception === 'abort') {
                    console.log('Прерван запрос Ajax.');
                } else {
                    console.log('Неизвестная ошибка:\n' + jqXHR.responseText);
                }
            }
        })
    }
    return result;
}