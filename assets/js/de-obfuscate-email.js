$(document).ready(function(){

    const email = ["nobots", "tarlov.dev"].join("@");
    const href = ["mailto", email].join("@");

    function handle_interaction() {
        $(this).attr("href", href);
        $(this).attr("title", email);
    }

    $("a[href='mailto:bots@tarlov.dev").one("mouseover focus", handle_interaction);
});
