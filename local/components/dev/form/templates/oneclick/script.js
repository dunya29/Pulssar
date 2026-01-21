$(document).ready(function(){
    $(document).on('submit','#form-addprice form',function(e){
        e.preventDefault();
        var name = $('#addprice-name').val();
        var phone = $('#addprice-phone').val();
        var email = $('#addprice-email').val();
        var quantity = $('#form-addprice .quantity').val();
        let offerid = 0;
        if($('.js-selectOfferItem').length>0){
            offerid = $('.js-selectOfferItem.active').data('id')
        }else{
            offerid = $('.product-item').data('product-id')
        }
        BX.ajax.runComponentAction('dev:form','oneclickbuy',{
            mode: 'class',
            data: {post: {
                'name':name,
                'phone':phone,
                'email':email,
                'offerid':offerid,
                'quantity':quantity,
            }},
        }).then(function(response){
            if(response.status === 'success' && response.data)
            {
                var form = $('#form-addprice form')[0];
                if(response.data.success)
                {
                    $(form).find(".modal-body").html("<p>Заказ № "+response.data.orderId+" успешно создан!</p>");
                    $(form).find(".modal-footer [type='submit']").remove();
                    setTimeout("$('#form-addprice').removeClass(\"open\");", 5000);
                }
                else
                {
                    if(response.data.msg){
                        $(form).find(".modal-body").append(response.data.msg);
                        setTimeout("$('#form-addprice').removeClass(\"open\");", 5000);
                    }
                }
            }
            else
            {
                alert('Возникла ошибка попробуйте позже.');
            }
        });
    });
    $(document).on("click",".js-productOneClickButton",function() {
        let previewName =  $('.js-productName').text();
        let previewImg =  $('.js-productPic img').attr('src');
        $('#form-addprice .desc_block_char_name').text(previewName);
        $('#form-addprice .modal-tovar-img').attr('src', previewImg);
        $('body').addClass("modal-open");
        $('#form-addprice').addClass("open");
    });
    $(document).on("click","#form-addprice #form-addprice-close",function() {
        $('body').removeClass("modal-open");
        $('#form-addprice').removeClass("open");
    });

// Убавляем кол-во по клику
    $('.quantity_inner .bt_minus').click(function(e) {
        e.preventDefault();
        let $input = $(this).parent().find('.quantity');
        let count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
    });
// Прибавляем кол-во по клику
    $('.quantity_inner .bt_plus').click(function(e) {
        e.preventDefault();
        let $input = $(this).parent().find('.quantity');
        let count = parseInt($input.val()) + 1;
        count = count > parseInt($input.data('max-count')) ? parseInt($input.data('max-count')) : count;
        $input.val(parseInt(count));
    });
// Убираем все лишнее и невозможное при изменении поля
    $('.quantity_inner .quantity').bind("change keyup input click", function(e) {
        e.preventDefault();
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
        if (this.value == "") {
            this.value = 1;
        }
        if (this.value > parseInt($(this).data('max-count'))) {
            this.value = parseInt($(this).data('max-count'));
        }
    });
});
