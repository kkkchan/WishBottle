from django.urls import path, include
from rest_framework.documentation import include_docs_urls
# from rest_framework_jwt.views import obtain_jwt_token
from . import views


urlpatterns = [
    path('login', views.login),
    path('userInfo', views.userInfo),
    path('getData', views.getData),
    path('getAllMessage', views.getAllMessage),
    path('getTreeHole', views.getTreeHole),
    path('setTreeHole', views.setTreeHole),
    path('delTreeHole', views.delTreeHole),
    path('getTreeReply', views.getTreeReply),
    path('setTreeReply', views.setTreeReply),
    path('doCollectAndLike', views.doCollectAndLike),
    path('getMyTreeHole', views.getMyTreeHole),
    path('getMyComment', views.getMyComment),
    path('delComment', views.delComment),
    path('getMyCollectAndLike', views.getMyCollectAndLike),
    path('getMyWishBottle', views.getMyWishBottle),
    path('getWishBottle', views.getWishBottle),
    path('setWishBottle', views.setWishBottle),
    path('delWishBottle', views.delWishBottle),
    path('checkNewMessage', views.checkNewMessage),
]