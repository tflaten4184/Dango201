from typing import Any, Dict
from django.contrib.auth.models import User
from django.views.generic import DetailView

from feed.models import Post

class ProfileDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "profiles/detail.html"
    model = User
    context_object_name = "user" # for alias in template (user.username instead of object.username)
    slug_field = "username"
    slug_url_kwarg = "username"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        user = self.get_object()
        context =  super().get_context_data(**kwargs)
        context["total_posts"] = Post.objects.filter(author=user).count()
        # TODO: Total Followers
        # context["total_followers"] = Follower.objects.filter(subject?=user).count() # Replace subject with the field we end up using in Follower

        return context