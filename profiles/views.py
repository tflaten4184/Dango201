from typing import Any, Dict
from django import http
from django.contrib.auth.models import User
from django.views.generic import DetailView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseBadRequest

from feed.models import Post
from followers.models import Follower

class ProfileDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "profiles/detail.html"
    model = User
    context_object_name = "user" # for alias in template (user.username instead of object.username)
    slug_field = "username"
    slug_url_kwarg = "username"

    def dispatch(self, request, *args, **kwargs):

        self.request = request

        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        user = self.get_object()
        context =  super().get_context_data(**kwargs)
        context["total_posts"] = Post.objects.filter(author=user).count()
        # TODO: Total Followers
        # context["total_followers"] = Follower.objects.filter(subject?=user).count() # Replace subject with the field we end up using in Follower
        if self.request.user.is_authenticated:
            context['you_follow'] = Follower.objects.filter(following=user, followed_by=self.request.user).exists()

        return context
    
class FollowView(LoginRequiredMixin, View):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):

        data = request.POST.dict()
        if "action" not in data or "username" not in data:
            return HttpResponseBadRequest("Missing Data")
        
        try:
            other_user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            return HttpResponseBadRequest("Missing User")
        
        if data["action"] == "follow":
            print("in views.py, follow")
            # Follow
            follower, created = Follower.objects.get_or_create(
                followed_by=request.user,
                following=other_user
            )
        else:
            print("in views.py, unfollow")
            # Unfollow
            try:
                follower = Follower.objects.get(
                    followed_by=request.user,
                    following=other_user
                )
            except Follower.DoesNotExist:
                follower = None
            
            if follower:
                print("follower is:")
                print(follower)
                follower.delete()

        return JsonResponse({
            'success': True,
            'wording': "Unfollow" if data['action'] == "follow" else "Follow"
        })