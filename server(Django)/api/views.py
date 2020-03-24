# from .models import User
import requests, json, time, base64, random
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.db.models import Count
from .models import WishBottle, User, TreeHoleReply, TreeHole, Like, Collect
from .WXBizDataCrypt import WXBizDataCrypt
import itertools

appid = 'wx0da3b4a331fa60f6'
secret = 'c88958fecb91fd4c13ea66eec09e921a'

# class WishBottleViewSet(viewsets.ModelViewSet):
#     queryset = WishBottle.objects.all().order_by('-pk')
#     serializer_class = WishBottleSerializer

# 登录 ok
@csrf_exempt
def login(request):
    if request.method == 'GET':
        # data = json.loads(request.body)
        code = request.GET.get('code', None)
        if not code:
            return JsonResponse({'error': '缺少code'})
        
        url = "https://api.weixin.qq.com/sns/jscode2session?appid={0}&secret={1}&js_code={2}&grant_type=authorization_code".format(appid, secret, code)
        r = requests.get(url)
        res = json.loads(r.text)
        openid = res.get('openid', None)
        session_key = res.get('session_key', None)
        # print('openid', openid)
        # print('session_key', session_key)
        if not openid:
            return JsonResponse({'error': '微信调用失败'})
        try:
            user = User.objects.get(openid=openid)
            user.session_key = session_key
            user.save()
            # print('更改session_key为', session_key)
            # print(user.session_key)
        except Exception:
            cookie_key = str(time.time())
            user = User.objects.create(openid=openid, session_key=session_key, cookie_key=cookie_key)

        cookie_key = user.cookie_key
        res_data = {
            'cookiekey':cookie_key,
            'msg': 'login success',
        }
        return JsonResponse(res_data)

# 接收用户信息并存储 ok
@csrf_exempt
def userInfo(request):
    cookie_key = request.META.get('HTTP_COOKIE')
    try:
        user = User.objects.get(cookie_key=cookie_key)
    except Exception:
        return HttpResponse('不存在此用户信息')
    
    iv, encryptedData = request.POST.get('iv', None), request.POST.get('encryptedData', None)
    pc = WXBizDataCrypt(appid, user.session_key)
    userInfo = pc.decrypt(encryptedData, iv)  
    try:
        openid = userInfo.get('openId')
        user = User.objects.get(openid=openid)        
        user.gender = userInfo.get('gender')
        user.avatarurl = userInfo.get('avatarUrl')
        user.nickname = userInfo.get('nickName')
        user.province = userInfo.get('province')
        user.city = userInfo.get('city')
        user.save()
        return HttpResponse('接收用户信息成功')
    except Exception:
        return HttpResponse('接收用户信息失败')

# 返回服务器存储的信息 ok
@csrf_exempt
def getData(request):
    cookie_key = request.META.get('HTTP_COOKIE')
    try:
        user = User.objects.get(cookie_key=cookie_key)
        # print(user)
        res = {
            'nickname': user.nickname,
            'province': user.province,
            'city': user.city,
        }
        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204)

# 获取该用户写的树洞 ok
@csrf_exempt
def getMyTreeHole(request):
    cookie_key = request.META.get('HTTP_COOKIE')
    try:
        user = User.objects.get(cookie_key=cookie_key)
        treeholes = TreeHole.objects.filter(writer=user)
        res = {'jsonArray':[
            {'id': t.id,
            'nickname': t.writer.nickname,
            'writer_avatarUrl': t.writer.avatarurl,
            'title': t.title,
            'content': t.content,
            'likeNum': t.likes,
            'replyNum': t.replynum,
            'strPostDate': t.time.strftime(format='%Y-%m-%d %H:%M:%S'),} for t in treeholes
        ]}
        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204)

# 返回收藏或是赞过的内容 ok
@csrf_exempt
def getMyCollectAndLike(request):
    try:
        cookie_key = request.META.get('HTTP_COOKIE')

        user = User.objects.get(cookie_key=cookie_key)

        t_collect, t_like = Collect.objects.filter(open_id=user), Like.objects.filter(open_id=user)

        res = {
            'jsonArray_collect': [
                {'id': t.treehole_id.id,
                'nickname': t.treehole_id.writer.nickname,
                'writer_avatarUrl': t.treehole_id.writer.avatarurl,
                'title': t.treehole_id.title,
                'content': t.treehole_id.content,
                'likeNum': t.treehole_id.likes,
                'replyNum': t.treehole_id.replynum,
                'strPostDate': t.treehole_id.time.strftime(format='%Y-%m-%d %H:%M:%S'),} for t in t_collect  
            ],
            'jsonArray_like': [
                {'id': t.treehole_id.id,
                'nickname': t.treehole_id.writer.nickname,
                'writer_avatarUrl': t.treehole_id.writer.avatarurl,
                'title': t.treehole_id.title,
                'content': t.treehole_id.content,
                'likeNum': t.treehole_id.likes,
                'replyNum': t.treehole_id.replynum,
                'strPostDate': t.treehole_id.time.strftime(format='%Y-%m-%d %H:%M:%S'),} for t in t_like
            ],
        }

        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204)

# 返回消息 ok
@csrf_exempt
def getAllMessage(request):
    try:
        flag = request.GET.get('flag')
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        treeholes = TreeHole.objects.filter(writer=User.objects.get(cookie_key=cookie_key))
        if flag == '1': # Like
            likes = Like.objects.filter(id=-1)
            # try:
            for treehole in treeholes:
                likes = likes | Like.objects.filter(treehole_id=treehole)
            res = {'jsonArray':
                [{'avatarUrl':l.open_id.avatarurl,
                'nickName':l.open_id.nickname,
                'strPostDate':l.time.strftime(format='%Y-%m-%d %H:%M:%S'),
                'title':l.treehole_id.title, 
                } for l in likes]
            }
            return JsonResponse(res)
        else:
            replies = TreeHoleReply.objects.filter(id=-1)
            # try:
            for treehole in treeholes:
                replies = replies | TreeHoleReply.objects.filter(treehole_id=treehole) 
            res = {'jsonArray': 
                [{'avatarUrl': r.answered_id.avatarurl,
                'nickName': r.answered_id.nickname,
                'content': r.content,
                'strPostDate': r.time.strftime(format='%Y-%m-%d %H:%M:%S'),
                'title': r.treehole_id.title,
                'id': r.id,
                } for r in replies]
            }
        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204)

# 获取树洞信息 ok
@csrf_exempt 
def getTreeHole(request):
    try:
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        trees = TreeHole.objects.annotate(like_num=Count('like'), reply_num=Count('treeholereply'))
        for t in trees:
            t.likes = t.like_num
            t.replynum = t.reply_num
            t.save()
        res = {'jsonArray':[
            {'id': t.id,
            'nickName': t.writer.nickname,
            'writer_avatarUrl': t.writer.avatarurl,
            'title': t.title,
            'content': t.content,
            'likeNum': t.like_num,
            'replyNum': t.reply_num,
            'isMine': 1 if t.writer == user else 0,
            'strPostDate': t.time.strftime(format='%Y-%m-%d %H:%M:%S'),} for t in trees
        ]}
        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204,content='No such user')

# 新建树洞 ok
@csrf_exempt 
def setTreeHole(request):
    if request.method == 'POST':
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        data = json.loads(request.body)
        title = data.get('title')
        content = data.get('content')
        TreeHole.objects.create(writer=user, content=content, title=title)
        return HttpResponse(200)
    else:
        return HttpResponse(404)

# 新建树洞 ok
@csrf_exempt 
def delTreeHole(request):
    try:
        id = request.GET.get('id')
        TreeHole.objects.get(id=id).delete()
        return HttpResponse(200)
    except Exception:
        return HttpResponse(400)

# 返回树洞评论 ok
@csrf_exempt
def getTreeReply(request):
    try:
        id = request.GET.get('id')
        t = TreeHole.objects.get(id=id)
        replies = TreeHoleReply.objects.filter(treehole_id=t).order_by('time')
        # 返回数据
        res = {
            'treeHole':{
                'id': t.id,
                'nickName': t.writer.nickname,
                'writer_avatarUrl': t.writer.avatarurl,
                'title': t.title,
                'content': t.content,
                'likeNum': t.likes,
                'replyNum': t.replynum,
                'strPostDate': t.time.strftime(format='%Y-%m-%d %H:%M:%S')
            },
            'treeReplies':[
                {   
                    'id':rep.id,
                    'replier_avatarUrl':rep.answered_id.avatarurl,
                    'nickName':rep.answered_id.nickname,
                    'content':rep.content,
                    'strPostDate':rep.time.strftime(format='%Y-%m-%d %H:%M:%S')} for rep in replies
            ],
        }
        return JsonResponse(res)
    except Exception:
        return HttpResponse(status=204)

# 查询是否已收藏或点赞 ok
@csrf_exempt
def getMyComment(request):
    try: 
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        replies = TreeHoleReply.objects.all().filter(answered_id=user)
        res = {'jsonArray': 
                    [{'avatarUrl': r.answered_id.avatarurl,
                    'nickName': r.answered_id.nickname,
                    'content': r.content,
                    'strPostDate': r.time.strftime(format='%Y-%m-%d %H:%M:%S'),
                    'title': r.treehole_id.title,
                    'id': r.id,
                    } for r in replies]
                }
        return JsonResponse(res)
    except Exception:
        return HttpResponse(204)


# 查询是否已收藏或点赞 ok
@csrf_exempt
def doCollectAndLike(request):
    cookie_key = request.META.get('HTTP_COOKIE') 
    if request.GET.get('YoN', None):
        try:
            t = TreeHole.objects.get(id=request.GET.get('treeHoleId'))
            user = User.objects.get(cookie_key=cookie_key)
            flag = request.GET.get('flag') #str 0 or 1
            YoN = request.GET.get('YoN') # str true of false
            if flag == '1':
                if YoN == 'true':
                    Collect.objects.create(open_id=user, treehole_id=t)
                    return HttpResponse(200)
                else:
                    collect = Collect.objects.filter(open_id=user, treehole_id=t)
                    
                    collect.delete()
                    collect.save()
                    return HttpResponse(200)
            else:
                if YoN == 'true':
                    Like.objects.create(open_id=user, treehole_id=t)
                    return HttpResponse(200)
                else:
                    like = Like.objects.filter(open_id=user, treehole_id=t)
                    like.delete()
                    like.save()
                    return HttpResponse(200)
        except Exception:
            return HttpResponse(204)
    else:    
        try:
            user = User.objects.get(cookie_key=cookie_key)
            t = TreeHole.objects.get(id=request.GET.get('treeHoleId'))
            collect = Collect.objects.filter(treehole_id=t, open_id=user)
            like = Like.objects.filter(treehole_id=t, open_id=user)
            isCollect = 1 if collect else 0
            isLike = 1 if like else 0
            res = {
                'isCollect': isCollect,
                'isLike': isLike,
            }
            return JsonResponse(res)
        except Exception:
            return HttpResponse(status=204)

# 接收小程序新增的评论 ok
@csrf_exempt
def setTreeReply(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cookie_key = request.META.get('HTTP_COOKIE')
        treeholeid = data.get('treeholeid')
        content = data.get('content')
        user = User.objects.get(cookie_key=cookie_key)
        TreeHoleReply.objects.create(treehole_id=TreeHole.objects.get(id=treeholeid), answered_id=user, content=content)
        return HttpResponse(200)
    else:
        return HttpResponse(204)

# 查询新消息 ok
@csrf_exempt
def checkNewMessage(request):
    try:
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        trees = TreeHole.objects.filter(writer=user)
        likes = Like.objects.filter(id=-1)
        replies = TreeHoleReply.objects.filter(id=-1)
        for t in trees:
            likes = likes | Like.objects.filter(treehole_id=t)
            replies = replies | TreeHoleReply.objects.filter(treehole_id=t)
        res = {
            'likeNum': len(likes),
            'commentNum': len(replies),
        }
        return JsonResponse(res)
    except Exception:
        return HttpResponse(204)

# 查看我的心愿瓶
@csrf_exempt
def getMyWishBottle(request):
    cookie_key = request.META.get('HTTP_COOKIE')
    user = User.objects.get(cookie_key=cookie_key)
    wishbottles = WishBottle.objects.filter(writer=user)
    res = {
        'jsonArray':[{
            'id':w.id,
            'itemType':1,
            'content':w.content,
            'strPostDate':w.time.strftime(format='%Y-%m-%d %H:%M:%S'),
        } for w in wishbottles]
    }
    return JsonResponse(res)

# 捡心愿瓶
@csrf_exempt
def getWishBottle(request):
    cookie_key = request.META.get('HTTP_COOKIE')
    user = User.objects.get(cookie_key=cookie_key)
    wishs = WishBottle.objects.filter(picker=None).exclude(writer=user)
    if wishs:
        wish = random.choice(wishs)    
        res = {
            'id':wish.id,
            'itemType':1,
            'city': wish.writer.city,
            'province': wish.writer.province,
            'sex': wish.writer.gender,
            'avatarUrl': wish.writer.avatarurl,
            'content': wish.content,
            'nickName': wish.writer.nickname,
            'strPostDate': wish.time.strftime(format='%Y-%m-%d %H:%M:%S'),
        }
        return JsonResponse(res)
    else:
        return HttpResponse(204)


# 删除评论 ok
@csrf_exempt
def delComment(request):
    try:
        id = request.GET.get('id')
        TreeHoleReply.objects.get(id=id).delete()
        return HttpResponse(200)
    except Exception:
        return HttpResponse(400)

# 扔心愿瓶 ok
@csrf_exempt
def setWishBottle(request):
    if request.method == 'POST':
        cookie_key = request.META.get('HTTP_COOKIE')
        user = User.objects.get(cookie_key=cookie_key)
        content = json.loads(request.body)
        content = content.get('content')
        WishBottle.objects.create(writer=user, content=content)
        return HttpResponse(200)
    else:
        return HttpResponse(404)

# 删除心愿瓶 ok 
@csrf_exempt
def delWishBottle(request):
    id = request.GET.get('id')
    WishBottle.objects.get(id=id).delete()
    return HttpResponse(200)