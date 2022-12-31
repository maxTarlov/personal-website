$(document).ready(function(){

    const email = ["nobots", "tarlov.dev"].join("@");

    function handle_interaction() {
        $(this).attr("href", email);
        $(this).attr("title", email);
    }

    $("a[href='mailto:bots@tarlov.dev").one("mouseover focus", handle_interaction);
});