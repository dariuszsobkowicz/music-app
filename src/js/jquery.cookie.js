(function ($, window, document, undefined) {

    $.fn.cookieAlert = function (userOptions) {

        if (window.localStorage.getItem("cookieAccepted") === "1") return this;

        $.fn.cookieAlert.defaultOptions = {
            message: "Test Message",
            containerClass: "container"
        };

        const options = $.extend({}, $.fn.cookieAlert.defaultOptions, userOptions);

        function cookieContainer () {
            return `<div class="alert alert-info fade show fixed-bottom" role="alert" style="border-radius: 0; margin-bottom: 0">
                        <div class=${ options.containerClass }>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span id="btn-cookie" aria-hidden="true">&times;</span>
                        </button>
                        ${ options.message }
                        </div>
                    </div>`
        }

        this.prepend(cookieContainer());

        $("#btn-cookie").on("click", function () {
            window.localStorage.setItem("cookieAccepted", 1);
        });

        return this;

    }

})(jQuery, window, document);
