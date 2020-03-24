from django.db import models

class User(models.Model):
    genders = (
        (0, '未知'),
        (1, "男"),
        (2, "女"),
    )
    
    openid = models.CharField(max_length=64, db_index=True, primary_key=True, verbose_name='open_id', )
    nickname = models.CharField(max_length=20, verbose_name="用户昵称", null=True)
    gender = models.PositiveIntegerField(default=0, choices=genders, verbose_name="性别")
    avatarurl = models.CharField(max_length=255, default='', null=True, blank=True, verbose_name='头像')
    province = models.CharField(max_length=20, null=True, verbose_name='省')
    city = models.CharField(max_length=20, null=True, verbose_name='城市')
    session_key = models.CharField(max_length=64, verbose_name='session_key', null=True)
    cookie_key = models.CharField(max_length=64, verbose_name='cookie_key', null=True)


    def __str__(self):
        return self.openid
    
    class Meta:
        verbose_name = verbose_name_plural = '用户'


class WishBottle(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="作者", related_name="writer")
    picker = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="捡到的人", related_name="picker", null=True, blank=True)
    time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    content = models.TextField(max_length=255, default='', verbose_name='内容')

    def __str__(self):
        return self.content

    class Meta:
        ordering = ["-time"]
        verbose_name = verbose_name_plural = '心愿瓶'


# class WishReply(models.Model):
#     wishbottle = models.ForeignKey(WishBottle, on_delete=models.CASCADE, verbose_name="心愿瓶")
#     replyer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="回复者")
#     time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
#     content = models.TextField(max_length=255, default='', verbose_name='内容')

#     def __str__(self):
#         return self.content

#     class Meta:
#         ordering = ["-time"]
#         verbose_name = verbose_name_plural = '心愿瓶回复'

class TreeHole(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="作者")
    likes = models.PositiveIntegerField(default=0, verbose_name="赞")
    time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    replynum = models.IntegerField(default=0, verbose_name='回复数')
    title = models.CharField(max_length=50, verbose_name='标题')
    pic = models.CharField(max_length=255, verbose_name='图片', null=True, blank=True,)
    content = models.TextField(max_length=255, default='', verbose_name="内容")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-time"]
        verbose_name = verbose_name_plural = '树洞'

class TreeHoleReply(models.Model):
    treehole_id = models.ForeignKey(TreeHole, on_delete=models.CASCADE, verbose_name="树洞")
    answered_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="回复者")
    time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    content = models.TextField(max_length=255, default='', verbose_name="内容")

    def __str__(self):
        return self.content

    class Meta:
        ordering = ["-time"]
        verbose_name = verbose_name_plural = '树洞回复'

# class SysMsg(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
#     flag = models.BooleanField(default=False, verbose_name='已读')
#     time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
#     content = models.TextField(default="", max_length=255, verbose_name='内容')

#     def __str__(self):
#         return self.content

#     class Meta:
#         ordering = ["-time"]
#         verbose_name = verbose_name_plural = '系统消息'

class Like(models.Model):
    open_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户', related_name='liker')
    treehole_id = models.ForeignKey(TreeHole, on_delete=models.CASCADE, verbose_name='树洞编号')
    time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    # writer_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='作者', related_name='beliked', null=True, blank=True)

    def __str__(self):
        return str(self.time)

    class Meta:
        ordering = ["-time"]
        verbose_name = verbose_name_plural = '赞'

class Collect(models.Model):
    open_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户', related_name='collecter')
    treehole_id = models.ForeignKey(TreeHole, on_delete=models.CASCADE, verbose_name='树洞编号')
    time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    # writer_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='作者', related_name='becollected', null=True, blank=True)

    def __str__(self):
        return str(self.time)

    class Meta:
        ordering = ["-time"]
        verbose_name = verbose_name_plural = '收藏'