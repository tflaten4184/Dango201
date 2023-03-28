from django.urls import path

from . import views

app_name = "feed" # for namespacing urls

urlpatterns = [
    path("", views.HomePage.as_view(), name="index"),
    path("<int:pk>/", views.PostDetailView.as_view(), name="detail"),
]
