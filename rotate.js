// t,e,n
"use strict";

// Browser test
var UA = window.navigator.userAgent.toLowerCase(); // wordContainer
var ua = navigator.userAgent; // h
var isMobile = /iphone|nokia|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|cldc|midp|wap|mobile/i.test(UA) && !/pc=1/.test(location.search); // u
var isWeiXin = "micromessenger" == UA.match(/MicroMessenger/i); // p
var isWeiBo = (UA.match(/WeiBo/i), "newsapp" == UA.match(/newsapp/i)); // m
var isQQ = "qq" == UA.match(/QQ/i); // g
var isAndroid = -1 < ua.indexOf("Android") || -1 < ua.indexOf("Adr"); // f
var isMac = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OSstage/); // v
var isPhoneX = /iphone/gi.test(navigator.userAgent) && (812 == screen.height && 375 == screen.width || 896 == screen.height && screen.width); 
  
// getUrl
function getUrl(t) {
  return "https://static.ws.126.net/163/f2e/news/one_hundred/static/" + t
}

// 页面url
var pageUrl = 'https://www.wangyidadagh.com/163/html/news/one_hundred/index.html'; // _

var M;
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var Container = PIXI.Container;
var Loader = (PIXI.autoDetectRenderer, PIXI.loader); // I
var Resources = PIXI.loader.resources;
var Sprite = (PIXI.Texture, PIXI.Text, PIXI.Sprite); // N
var CanvasRenderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight, {
    backgroundColor: 16711673,
    antialias: true,
    resolution: 1
  })
var Stage = new PIXI.Container;

var circles = getUrl("circles4.json"); // L: 点击弹出的气泡图片sprite
var slide = getUrl("slide2.json"); // w: 左右滑动提示图片sprite
// 旋转文字：共100句，最短3个字，最长14个字
var rotateText = ["看极光", "一次无计划的旅程", "勇敢告白一次", "写信给未来的自己", "去爱豆的演唱会", "看完1000部电影", "毫无顾忌地大醉一场", "潜水", "认真道别一次", "完整地看一次日出/日落", "拿到驾照", "开一家店（网店也算）", "拥有一个死党", "经济独立", "会一种乐器", "拍一次全家福", "打卡书籍/影视中的经典地标", "得一次第一名", "献血", "看完1000本书", "拥有自己的房子", "（曾经/正在）和宠物一同生活", "遇到过令你心动的人", "高空跳伞", "创业（无论成败）", "有一道拿手好菜", "一个人去旅行", "拥有马甲线/腹肌", "与网友成为现实中的朋友", "上一次电视", "看一场流星雨", "去世界级赛事现场", "和喜欢的人用同一个耳机听歌", "为梦想疯狂一次", "种一棵树（含蚂蚁森林）", "培养一个兴趣爱好", "去喜欢的国家生活一段时间", "保存着一份孩子气", "拥有10年以上的挚友", "写一本书", "做爱心志愿者", "完成制订的减肥/健身计划", "去西藏", "作为选手参加一次大型赛事", "对家人说我爱你", "去一次音乐节", "见证自己的蜕变", "精通一门外语", "把房子装饰成喜欢的样子", "随手帮助陌生人", "定期存钱（金额不限）", "毕业旅行", "登记器官/遗体捐献", "用第一笔工资给家人买礼物", "体验乡间生活", "亲手种出食物并吃掉", "学会一支舞", "看一场灿烂的烟火", "邀请亲友参加自己的毕业典礼", "近距离接触偶像", "和喜欢的人恋爱", "观鲸", "在星空下露营", "在到过的地方寄明信片给自己 ", "拿一次奖学金", "实现家人的心愿", "珍藏一件凝聚情感的物品", "结识不同国籍的朋友", "发表一次演讲", "拥有一段刻骨铭心的爱情", "对伴侣认真说一次我爱你", "陪家人去旅行", "冲洗重要的照片，整理成相册", "赚到人生的第一个100万", "记录生活（含社交平台）", "拍一次写真", "见证好朋友的婚礼", "拍幼时和长大的对比照", "组一支乐队", "试着原谅一个人", "重回童年居住的地方", "去中国各省市打卡", "带父母重拍婚纱照", "送自己一个贵到模糊的礼物", "谈一场校园恋爱", "带家人体检", "打卡七大洲", "拜访恩师", "去不同的城市生活", "当爸爸/妈妈", "定期自我总结", "将一个浪漫的想法变成现实", "和伴侣一起看鬼片", "立一份遗嘱", "和愧对的人道歉", "学会理财", "参加大型的倒计时跨年", "与朋友彻夜谈心", "接纳自己，与自己和解", "学会断舍离"];

var circleHeight // 圆环可滚动区域高度
var circleNumber // 圆环最大圈数值
var ct = 300 // 300 半径 = 屏幕高度 + 这个高度
var lt = 450 // 450 内半径，底部距离
var dt = 150 // 150 外半径，顶部距离
var ut = 80 // 80 圆环间距？
var ht = [] // ?
var cacheChosen = [] // 已经缓存的点击选择的圆形图片和文字图片，方便生成海报
var mt = 0.3 // ?
var vt = false // ?
var wt = false // ?
var _t = -1.8 // ?
var speed = 0.001 // 滚动速度 0.001

// 滚动代理
var scrollDistance = 0; // 滚动距离
var scrollStart = 5000; // 滚动位置
var scrollerObj = scrollerObj = new Scroller(function (left, top, zoom) {
  scrollDistance = left - scrollStart
  scrollStart = left
  if (!vt && wt) {
    if (_t > -1.8) {
      _t = -1.8
      return 
    }
    wt = false
    void scrollerObj.scrollTo(50000, 0, false);
    if (Math.abs(scrollDistance) < 1) {
      wt = false
      scrollerObj.scrollTo(50000, 0, false);
    } else {
      _t -= scrollDistance / 1000 * 1.5
    }
  }
  if (vt) {
    _t -= scrollDistance / 1000 * 1.5
    if (_t > -1.8) {
      _t = -1.8
    }
  }
}, {
  zooming: false,
  animating: true,
  bouncing: false,
  animationDuration: 250
});

var scrollContainer // 滚动容器
var textWrapContainer // 文字包裹容器
var textContainer // 文字容器
var rotateStart = false // 选择是否开始

// canvas appendTo #main
document.getElementById("main").append(CanvasRenderer.view);

// load后，加载资源
window.onload = function () {
  Loader.add(circles).add(slide).on("progress", function(t, e) {
    console.log('loader progress:', parseInt(t.progress));
  }).load(init);
};

// 加载资源后初始化
function init() {
  winWidth = window.innerWidth, 
  winHeight = window.innerHeight, 
  // 滚动代理容器
  scrollContainer = new PIXI.Container;
  var t = createRectangle({
    color: 15790320,
    width: 750,
    height: winHeight,
    x: 0,
    y: 0
  });
  scrollContainer.addChild(t)
  scrollContainer.interactive = true
  scrollContainer.buttonMode = true
  scrollContainer.on("touchstart", touchstart)
    .on("touchmove", touchmove)
    .on("touchend", touchend)
    .on("tap", function () {
      // if ($(".select_main").hasClass("show")) {
      //   speed = 0.001
      //   $(".select_main").removeClass("show")
      //   $(".num_rect").hide()
      // }
  }), 
  scrollerObj.setDimensions(750, winHeight, 100000, winHeight) // clientWidth, clientHeight, contentWidth, contentHeight
  scrollerObj.scrollTo(50000, 0, false)
  Stage.addChild(scrollContainer)
  CanvasRenderer.render(Stage)

  // 1: ready
  textWrapContainer = new PIXI.Container;
  textContainer = new PIXI.Container;

  // TODO: 圆环路数，依据屏幕的高度1-9圈?
  (function _what() {
    circleHeight = winHeight - dt - lt; // 1334-150-450=734
    circleNumber = Math.floor(circleHeight / (30 + ut)); // 30+80
    // 偶数
    var t = []
    for (var e = 0; e <= circleNumber / 2; e++) {
      t.push(2 * e); // t: [0,2,4,6]
    }
    // 奇数
    var n = []; // [1,3,5]
    for (e = 0; e < circleNumber / 2; e++) {
      n.push(2 * e + 1);
    }
    for (var i = 0; i < 40; i++) {
      var a;
      if (i % 2 == 0) {
        a = JSON.parse(JSON.stringify(t));
      } else {
        a = JSON.parse(JSON.stringify(n));
      }
      a = a.sort(randomValue).sort(randomValue)
      ht = ht.concat(a) // 140-200个随机数
    }
  })();

  // 处理100个旋转文字
  var textIndex = 0;
  var textInterval = setInterval(function () {
    handleText(textIndex);
    CanvasRenderer.render(Stage);
    ++textIndex;
    if (textIndex == 100) {
      clearInterval(textInterval);
      handleText(101); // 101个是干嘛？
    }
  }, 10);

  textWrapContainer.addChild(textContainer);
  
  // 添加到滑动容器
  scrollContainer.addChild(textWrapContainer);

  // 2: go
  // 隐藏loading
  // 启动raf
  animate();

  rotateStart = true;

}

// 触摸开始
function touchstart(t) {
  var e = t.data.originalEvent;
  scrollerObj.doTouchStart(e.touches, e.timeStamp);
  wt = vt = true
}

// 触摸移动
function touchmove(t) {
  var e = t.data.originalEvent;
  scrollerObj.doTouchMove(e.touches, e.timeStamp, e.scale)
}

// 触摸结束
function touchend(t) {
  vt = false;
  var e = t.data.originalEvent;
  scrollerObj.doTouchEnd(e.timeStamp);
}

// TODO: 关键方法：遍历文字，形成圆形 s
function handleText(textIndex) {
  var finishText; // 最后的文字
  var text = rotateText[textIndex]; // 文字 e
  text = (textIndex + 1) + "." + text; // 加上数字编号

  var innerContainer = new Container; // 总的一个容器
  innerContainer.textData = rotateText[textIndex]
  innerContainer.index = textIndex
  innerContainer.gameStep = 0 // ?
  innerContainer.rotation = Math.PI / 2;

  var n = innerContainer.roadIndex = ht[textIndex] // 圆环路数0-9之一，依据屏幕高度
  var i = 30 + ut // 30+80
  var a = ct + lt + n * i - ut + i
  var r = {
    x: 375,
    y: winHeight + ct
  };

  innerContainer.speed = 1;
  innerContainer.position.set(r.x, r.y);
  innerContainer.pivot.set(0, a);

  var c = Math.asin(32 / a); // 角度?
  var l = 0;

  // 遍历完成文字后
  if (textIndex == 101) {
    text = "你已经看完100件事咯~"
    finishText = "接下来，从头开始浏览"
    a = ct + winHeight / 2 + 100
    r = {
      x: 375,
      y: winHeight + ct
    }
    innerContainer.position.set(r.x, r.y)
    innerContainer.pivot.set(0, a)
    c = Math.asin(32 / a)
  }

  for (var wordContainer = innerContainer.wordBox = new Container, h = 0; h < text.length; h++) {
    var u = new Container;
    var p = new PIXI.Text(text[h], {
      fontSize: 30,
      fill: ["#000000"]
    });
    var m = text.charCodeAt(h);
    var g = 0;

    g = 0 == h ? 0 : 1 == h && textIndex <= 100 ? .6 * c : 1 <= m && m <= 126 || 65376 <= m && m <= 65439 ? "/" == text[h] ? 1.5 * c : innerContainer.wordBox.children[h - 1].wordStep == c ? 1.2 * c : .6 * c : innerContainer.wordBox.children[h - 1].wordStep == .6 * c || innerContainer.wordBox.children[h - 1].wordStep == 1.5 * c ? .8 * c : c, l += u.wordStep = g, u.rotation = l, u.startRotation = l, u.pivot.set(14, a), u.position.set(14, a);

    var f = createRectangle({
      color: 15790320,
      width: 38,
      height: 70,
      x: 0,
      y: -20
    });
    f.alpha = 0
    u.addChild(f, p)
    wordContainer.allRotation = l
    wordContainer.addChild(u)
  }

  // 超过100，结束时
  if (101 == textIndex) {
    var wordContainer2 = innerContainer.wordBox2 = new Container;
    l -= innerContainer.wordBox.allRotation + .02;
    for (var w = 0; w < finishText.length; w++) {
      var _;
      var x = new Container
      var b = new PIXI.Text(finishText[w], {
        fontSize: 30,
        fill: ["#000000"]
      });
      text.charCodeAt(w);
      _ = c
      l += x.wordStep = _
      x.rotation = l
      x.startRotation = l
      x.pivot.set(14, a)
      x.position.set(14, a + 50);
      var S = createRectangle({
        color: 15790320,
        width: 38,
        height: 70,
        x: 0,
        y: -20
      });
      S.alpha = 0
      x.addChild(S, b)
      wordContainer2.addChild(x)
    }
    innerContainer.addChild(wordContainer2)
  }

  innerContainer.addChild(wordContainer);
  innerContainer.allRotation = l;
  mt += 1 / 12;
  innerContainer.startStemp = mt;
  textContainer.addChild(innerContainer);
  if (textIndex == 101) {
    mt += .6
    innerContainer.startStemp = mt
    void(mt += 1 / 3)
    return
  }
  
  // 大于1
  if (textIndex > 0) {
    if (Math.abs(ht[textIndex - 2] - ht[textIndex]) <= 1) {
      var C = innerContainer.startStemp + innerContainer.allRotation / 2 - textContainer.children[textIndex - 2].startStemp - textContainer.children[textIndex - 2].allRotation / 2;
      C < .1 && (mt += C < 0 ? .25 - C : .25 + C, innerContainer.startStemp = mt)
    }
    if (Math.abs(ht[textIndex - 1] - ht[textIndex]) <= 1) {
      var T = innerContainer.startStemp + innerContainer.allRotation / 2 - textContainer.children[textIndex - 1].startStemp - textContainer.children[textIndex - 1].allRotation / 2;
      T < 0 && (mt += 1 / 8 - T, innerContainer.startStemp = mt)
    }
    Math.abs(ht[textIndex - 1] - ht[textIndex]) <= 2 && (mt += 1 / 8, innerContainer.startStemp = mt);
    for (var y = textIndex - 1; 0 <= y; y--)
      if (ht[y] == ht[textIndex]) {
        var E = textContainer.children[textIndex].startStemp - textContainer.children[y].startStemp - textContainer.children[y].allRotation;
        E < 0 ? (mt += 1 / 12 - E, innerContainer.startStemp = mt) : E < .2 && (mt += 1 / 12, innerContainer.startStemp = mt);
        break
      }
  }

  // 圆形container：包括背景和图片
  var circleSprite = innerContainer.circle = new Container;
  circleSprite.visible = false;

  // 圆形图片sprite
  var circleImgSprite = new Sprite(Resources[circles].textures[textIndex + 1 + ".png"]);
  circleImgSprite.pivot.set(circleImgSprite.width / 2, circleImgSprite.height / 2);
  circleImgSprite.position.set(circleImgSprite.width / 2, circleImgSprite.height / 2);

  // 圆形背景sprite
  var circleBgSprite = new Sprite(Resources[circles].textures["bg.png"]);
  circleBgSprite.visible = false;
  circleBgSprite.position.set(circleImgSprite.width / 2 - 5, circleImgSprite.height / 2 + 9); // 造投影
  circleBgSprite.pivot.set(circleImgSprite.width / 2, circleImgSprite.height / 2);

  // 添加到圆形container
  circleSprite.addChild(circleBgSprite, circleImgSprite);
  circleSprite.pivot.set(circleImgSprite.width / 2, circleImgSprite.height / 2 + a);
  circleSprite.position.set(5, a);
  circleSprite.rotation = l / 2; // ?
  
  innerContainer.addChild(circleSprite);
  innerContainer.chosen = false;
  innerContainer.interactive = true;
  innerContainer.buttonMode = true;
  innerContainer.on("touchstart", function (t) {
    var e = t.data.originalEvent;
    innerContainer.startX = e.touches[0].pageX
    innerContainer.touch = true
    innerContainer.xValue = 0
  }).on("touchmove", function (t) {
    if (innerContainer.touch) {
      var e = t.data.originalEvent;
      innerContainer.xValue = Math.abs(e.touches[0].pageX - innerContainer.startX)
    }
  }).on("touchend", function (t) {
    if (innerContainer.touch) {
      if (innerContainer.xValue <= 30) {
        innerContainer.tween1 && innerContainer.tween1.stop()
        innerContainer.tween2 && innerContainer.tween2.stop()
        if (innerContainer.chosen) {
          innerContainer.hideCircle()
        } else {
          innerContainer.showCircle()
          // 播放点击文字声音
          // $("#text")[0].currentTime = 0
          // $("#text")[0].play() 
        }
      }
    }
  })

  // 显示圆形
  innerContainer.showCircle = function () {

    innerContainer.chosen = true

    // 主要为了缓存的目的，方便生成海报
    var exist = false; // 是否已经存在
    cacheChosen.forEach(function (t) {
      if (t == textIndex) {
        exist = true
      }
    })
    // 缓存圆形图片和文字图片，生成海报用
    if (!exist) {
      var cacheImage = document.createElement("img");
      cacheImage.src = getUrl("end_circle2/" + (textIndex + 1) + ".png")
      document.getElementById("loading_img").appendChild(cacheImage);
      var cacheText = document.createElement("img");
      cacheText.src = getUrl("end_text2/" + (textIndex + 1) + ".png")
      document.getElementById("loading_img").appendChild(cacheText)
      cacheChosen.push(textIndex)
    }

    circleSprite.visible = true // 显示圆形容器
    innerContainer.wordBox.visible = false // 隐藏文字
    circleImgSprite.scale.set(0); // 圆形图片缩小为0
    
    // 圆形显示动画
    var i = innerContainer.tween1 = new TWEEN.Tween({
        scale: 0
      }).to({
        scale: 1.2
      }, 200).onUpdate(function (t, e) {
        circleImgSprite.scale.set(t.scale)
      }).start();
    var a = innerContainer.tween2 = new TWEEN.Tween({
        scale: 1.2
      }).to({
        scale: 1
      }, 100).onUpdate(function (t, e) {
        circleImgSprite.scale.set(t.scale)
        circleBgSprite.scale.set(e)
      }).onStart(function () {
        circleBgSprite.visible = true
      });
    i.chain(a) // 动画序列

    // $(".toEnd_btn").show() // 显示确认选择按钮
  }
  
  // 隐藏圆形
  innerContainer.hideCircle = function () {

    innerContainer.chosen = false

    var t = innerContainer.tween2 = new TWEEN.Tween({
      scale: 1.2
    }).to({
      scale: 0
    }, 200).onUpdate(function (t, e) {
      circleImgSprite.scale.set(t.scale)
    }).onComplete(function () {
      circleSprite.visible = false
      innerContainer.wordBox.visible = true // 显示文字
    });

    (innerContainer.tween1 = new TWEEN.Tween({
      scale: 1
    }).to({
      scale: 1.2
    }, 100).onUpdate(function (t, e) {
      circleImgSprite.scale.set(t.scale)
      circleBgSprite.scale.set(1 - e)
    }).onComplete(function () {
      circleBgSprite.visible = false
    }).start()).chain(t)

  }

}

// 创建矩形
function createRectangle(opts) {
  var rect = new PIXI.Graphics();
  rect.beginFill(opts.color);
  rect.drawRect(0, 0, opts.width, opts.height);
  rect.position.set(opts.x ? opts.x : 0, opts.y ? opts.y : 0);
  rect.endFill();
  return rect;
}

// 随机值: 取-1或1
function randomValue() {
  return .5 < Math.random() ? -1 : 1
}

// TODO: 动画循环
function animate() {
  if (rotateStart) {
    if (textContainer) {
      if (!wt) {
        _t -= speed;
      }
      textContainer.children.forEach(function (t, e) {
        var n;
        if (- _t >= t.gameStep * mt + t.startStemp + mt / 2) {
          t.gameStep += 1 
        } else if (-_t < t.gameStep * mt + t.startStemp - mt / 2 && 0 < t.gameStep) {
          t.gameStep -= 1
        }
        if ((n = _t + t.gameStep * mt) <= -t.startStemp && n + t.startStemp > -Math.PI - t.allRotation) {
          t.rotation = Math.PI / 2 + (n + t.startStemp)
        } else {
          if (n + t.startStemp <= -Math.PI - t.allRotation) {
            t.rotation = -Math.PI - t.allRotation
          } else {
            t.rotation = Math.PI / 2;
          }
        }
      })
    }
    CanvasRenderer.render(Stage);
  }
  TWEEN.update();
  requestAnimationFrame(animate);
}
