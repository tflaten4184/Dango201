
$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
        function getCookie(name) {
            let cookieValue = null;


            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i += 1) {
                    const cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    },
});

// Applied to both "New Post" in navbar, and 'X' in model
$(document).on("click", ".js-toggle-modal", function(e) {
    e.preventDefault();
    console.log("Toggle post modal clicked");
    $(".js-modal").toggleClass("hidden");
});

$(document).on("click", ".js-submit", function(e) {
    e.preventDefault();
    console.log("Creating new post from button");
    const text = $(".js-post-text").val().trim();
    const $btn = $(this);

    console.log(text);

    if(!text.length) {
        return false;
    }

    $(".js-modal").addClass("hidden");
    $(".js-post-text").val("");

    $btn.prop("disabled", true).text("Posting!"); //  Disable the button and change the button's text
    $.ajax({
        type: 'POST',
        url: $(".js-post-text").data("post-url"), // POST request to create new Post object
        data: {
            text: text // Payload, contents of new Post
        },
        success: (dataHtml) => { 
            $(".js-modal").addClass("hidden"); 
            $("#posts-container").prepend(dataHtml); // Insert new posts as first child (newest will always be at top)
            $btn.prop("disabled", false).text("New Post"); // Enable the (hidden) modal button
            $(".js-post-text").val('');                    // and reset textarea for future use
        },
        error: (error) => {
            console.warn("error");
            $btn.prop("disabled", false).text("ERROR");
        }
    })

});
