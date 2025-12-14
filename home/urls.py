from django.urls import path
from . import views

app_name = "home"
urlpatterns = [
    path("", views.index, name="home_page"), 
    path("", views.index, name="index"),
    path("settings/", views.settings, name="settings"),
    path("settings/update-profile/", views.update_profile, name="update_profile"),
    path("settings/delete-account/", views.delete_account, name="delete_account"),
]