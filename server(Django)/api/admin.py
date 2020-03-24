from django.contrib import admin
from .import models

# Register your models here.
@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        'openid', 'nickname', 'gender', 'province',
        'province', 'city'
    ]

@admin.register(models.WishBottle)
class WishBottle(admin.ModelAdmin):
    list_display = [
        'writer', 'picker', 'content', 'time',
    ]

# @admin.register(models.WishReply)
# class WishReply(admin.ModelAdmin):
#     list_display = [
#         'wishbottle', 'replyer', 'content', 'time',
#     ]

@admin.register(models.TreeHole)
class TreeHole(admin.ModelAdmin):
    list_display = [
        'writer', 'title', 'likes', 'replynum', 'time'
    ]

@admin.register(models.TreeHoleReply)
class TreeHoleReply(admin.ModelAdmin):
    list_display = [
        'treehole_id', 'answered_id', 'content', 'time'
    ]

# @admin.register(models.SysMsg)
# class SysMsg(admin.ModelAdmin):
#     list_display = [
#         'user', 'content', 'time'
#     ]

@admin.register(models.Like)
class Like(admin.ModelAdmin):
    list_display = [
        'open_id', 'treehole_id', 'time'
    ]

@admin.register(models.Collect)
class Collect(admin.ModelAdmin):
    list_display = [
        'open_id', 'treehole_id', 'time'
    ]
# admin.site.register(models.User)
# admin.site.register(models.WishBottle)
# admin.site.register(models.WishReply)
# admin.site.register(models.TreeHole)
# admin.site.register(models.TreeHoleReply)
# admin.site.register(models.SysMsg)
# admin.site.register(models.Collect)
# admin.site.register(models.Like)