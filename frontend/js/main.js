
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
    });
})
.on("click", ".js-follow", function(e) {
    e.preventDefault();
    console.log("follow clicked");

    // Data available in template: data-username="{{ user.username }}" data-action="follow" data-url="{% url "profiles:follow" user.id %}"
    // Guess for how we'll implement this:
    // Get current user (follower)
    // Get target user (to follow)
    // Create a Follower object (relating the two users)
    // Use an AJAX request to update the "follow" button to "unfollow"

    const action = $(this).attr("data-action") // "action" can be follows or unfollows. In this case, follows.

    $.ajax({
        type: 'POST',
        url: $(this).data("url"), // POST request to create new Follower object
        data: {
            action: action,
            username: $(this).data("username"),
        },
        success: (data) => { 
            console.log(data);
            // Change button to indicate already following (data-action = "unfollow")
            // Return JSON data
            $(".js-follow-text").text(data.wording);

            if (action == "follow") {
                console.log("DEBUG", "follow");
                // change wording to "unfollow"
                $(this).attr("data-action", "unfollow");
            } else {
                console.log("DEBUG", "unfollow");
                // change wording to "follow"
                $(this).attr("data-action", "follow");
            }
        },
        error: (error) => {
            console.warn("error");
        }
    });
})
