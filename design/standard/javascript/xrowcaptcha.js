var select, xrowCaptchaSuccess = false;

jQuery(document).ready(function($) {
    $(function(){
        $('#noScriptPrompt').hide();
        $('#nosubmit').css("visibility","visible");
    });
    var formLength = $("form").length;
    $("form").each(function(index) {
        var actionURL = '';
        var showCaptcha = true;
        var formElement = $(this);
        if(typeof formElement.attr('action') !== 'undefined') {
            var actionURL = formElement.attr('action');
            if(actionURL.indexOf('http') >= 0) {
                if(actionURL.indexOf(window.location.hostname) < 0)
                    showCaptcha = false;
            }
        }

        if(showCaptcha === true) {
            if (typeof includeObjects !== 'undefined') {
                for(var i = 0; i < includeObjects.length; i++) {
                    if(actionURL.indexOf(includeObjects[i]) >= 0) {
                        showCaptcha = true;
                        break;
                    }
                    else {
                        showCaptcha = false;
                    }
                }
            }
            else if (typeof excludeObjects !== 'undefined') {
                for(var i = 0; i < excludeObjects.length; i++) {
                    if(actionURL.indexOf(excludeObjects[i]) < 0) {
                        showCaptcha = false;
                        break;
                    }
                }
            }
            else
            {
                /* SHOW NO GENERAL PAGE CAPTCHA WHEN THERE ARE NO EX- OR INCLUDES AT ALL
                   COULD BE IMPROVED BECAUSE NOW ITS NOT POSSIBLE TO SHOW CAPTCHA EVERYWHERE
                   ANOTHER SETTING OPTION COULD SOLVE THE PROBLEM
                */
                showCaptcha = false;
            }
        }

        if((showCaptcha == true && actionURL !== '' ) || $('.xrow-captcha', formElement).length > 0 ) { 
            if(!($('.xrow-captcha', formElement).length > 0) || formLength > 0) { 
                formElement.delegate("input:submit", 'click', function(event)  {
                    if( document.xrowCaptchaSuccess ) {
                        $('.log2').hide();
                        $('.log1').show();
                        return true;
                    }
                    else {
                        $('.log2').show();
                        $('.log1').hide();
                        return false;
                    }
                    return false;
                });
                if(!(formElement.children('.xrow-captcha').length > 0)) {
                    formElement.prepend('<div class="xrow-captcha"></div>');
                }
                $('.xrow-captcha', formElement).each(function() {
                    var element = $(this);
                    $.ez('xrowcaptcha::loadCaptcha', {}, function(data) {
                        if ( data.error_text ) {
                            element.html('<div class="error">' + data.error_text + '<div>');
                        }
                        else {
                            if(data.content == '') {
                                document.xrowCaptchaSuccess = true; 
                                element.html(data.content);
                            }
                            else {
                                document.xrowCaptchaSuccess = false; 
                                element.html(data.content);
                            }
                        }
                    });
                });
                formLength--;
            }
            else {
                formElement.delegate("input:submit", 'click', function(event) {
                    if(document.xrowCaptchaSuccess) {
                        $('.log2').hide();
                        $('.log1').show();
                        return true;
                    }
                    else {
                        $('.log2').show();
                        $('.log1').hide();
                        return false;
                    }
                    return false;
                });
                $('.xrow-captcha', formElement).each(function(index) {
                    var id = $(this).attr('id');
                    var element = $(this);
                    $.ez('xrowcaptcha::loadCaptcha', {}, function(data) {
                        if ( data.error_text ) {
                            element.html('<div class="error">' + data.error_text + '<div>');
                        }
                        else {
                            if(data.content == '') {
                                document.xrowCaptchaSuccess = true; 
                                element.html(data.content);
                            }
                            else {
                                document.xrowCaptchaSuccess = false; 
                                element.html(data.content);
                            }
                        }
                    });
                });
            }
        }
    });

    $('.xrow-captcha').on('click','#code',function(event) {
        var hash = $(this).data( 'hash' );
        $.ez('xrowcaptcha::reloadChallange', {'hash' : hash}, function(result) {
            $('.ca_challange').html(result.content);
            $("#solution").attr("value",'');
            $(".log1").hide();
            $(".log2").hide();
        });
    });

    $('.xrow-captcha').on('blur', '#solution',function(event) {
        var inputresult = parseInt($("#solution").val());
        var hash_cap = $("input[name='xrowCaptchaHash']").attr("value");
        $.ez('xrowcaptcha::compareResult', {'inputresult':inputresult, 'hash_cap':hash_cap}, function(result) {
            select = result.content;
            if(select) {
                document.xrowCaptchaSuccess = true;
                $('.log2').hide();
                $('.log1').show();
                return true;
            }
            else {
                $('.log2').show();
                $('.log1').hide();
                return false;
            }
        });
    });
});