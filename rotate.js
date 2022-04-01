"use strict";

// 设计稿宽度和文字大小
var designWidth = 750;
var designFontSize = 30;

// 文字背景图片
var statusNormal1 = 'img/status_normal-1.png';
var statusActive1 = 'img/status_active-1.png';
var statusNormal2 = 'img/status_normal-2.png';
var statusActive2 = 'img/status_active-2.png';
var statusNormal3 = 'img/status_normal-3.png';
var statusActive3 = 'img/status_active-3.png';

var mainDom = document.getElementById('main').getBoundingClientRect();
var mainWidth = designWidth;
var mainHeight = designWidth * mainDom.height / mainDom.width;

// 旋转文字
var rotateText = ["起风了","魔法满屋","手写的从前","恰似新上人来","春风十里不如你","重返世界尽头的咖啡馆","叶子已拿定绿色的主意","万物之生","好想去你的世界爱你","不要忘记我爱你","穿过寒冬","以年为单位的恋爱","我们的滚烫人生","天赐的声音","陪你一起好好吃饭","大约是爱","假日暖洋洋","勇往直前的我们","怦然心动","春日迟迟再出发","你好星期六","留白是表白","半岛铁盒","如你所想","从不打烊的太阳","一个人喜欢一个人","我不想如往常一样","超越无界","遇见你的那一天","不完美的秘密","反方向的钟","说了再见","修炼爱情","我是如此相信","一样的月光","明明就","后来的我们","一路向北","倒叙的生活","脱胎换骨","你是我的春天","睡个好觉","想看你笑的样子","与君初相识","抱住棒棒的自己","不要挑战人性","我是人间自在客","人间可爱","生有热烈藏与俗常","愿你温柔且坚可攻亦可守","在冬天感谢夏天","我想为你种棵树","外面真好","日日有好事","热闹人间半满生活","地球上最孤独的动物","一只猫的存在主义思考","当下即是生活","拉下百叶窗的午后","去乡下盖间房子","随风去野","那是一道心上的彩虹","相逢时节","你是我的荣耀","余生请多指教","人生海海","你是我的小确幸","救赎之路","被尘封的故事","飞向月球","最终幻想","失落城堡","英雄就是我","余烬风暴","山海镜花","夜之归途","点燃火炬","混沌银河","螺旋圆舞曲","万象物语","胭脂用尽时，桃花就开了","狂跳的心搅乱水中的浮云","沉在夜里 静而黑暗","春天是没有国籍的","东风掠过我脸边","趁春风不注意抓一束回家","如期而至的快乐","春天是发呆的季节","白云是世界的公民","像冒泡的汽水","黄昏的落日","草木蔓发，春山可望","雪化了是什么","夕阳会逃跑","除了春天禁止入内","早春不过一棵树","循环好心情","遇事不决可问春","风里夹着温柔","我与春风撞了个满怀","永远不要失去发芽的心情","爱的人正在路上","和春天交换秘密","你来的那天春天也来到","我抱着一个落日","用一场春雨来告别冬天","太阳很好，要你亲自去晒","把暖暖的阳光藏进被窝"];

var Container = PIXI.Container;
var Loader = PIXI.loader;
var Resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;
var CanvasRenderer = new PIXI.CanvasRenderer(mainWidth, mainHeight, {
    transparent: true,
    antialias: true,
    resolution: 1
  })
var Stage = new PIXI.Container;

var circleHeight // 圆环可滚动区域高度
var circleNumber // 圆环最大圈数值
var circleCenterY = 200 // 圆心的y坐标 = mainHeight + circleCenterY，越大看起来越不弯
var innerRadius = 700 // 内半径，距离圆心距离
var outerDistance = 170 // 外半径，距离顶部距离，影响圈数
var circleGap = 80 // 圆环之间的间距，越小，圈数越多，文字行距越小
var textDensity = 360 // 文字密集度，及同一圆环文字之间的间隔，越大越密
var circleNumberArray = [] // 圆环圈数随机数组
var cacheChosen = [] // 已经缓存的点击选择的圆形图片和文字图片，方便生成海报
var touching = false // 触摸过程中
var going = false // 滚动中
var mt = 0.3 // 开始滚动的左边位置
var _t = -1.8 // 加速度
var speed = 0.001 // 自动滚动速度 0.001
var textRandomShow = true // 随机显示，因文字长短不一，有可能不太好

// 滚动代理
var scrollDistance = 0; // 滚动距离
var scrollStart = 5000; // 滚动位置
var scrollerObj = new Scroller(function (left, top, zoom) {
  scrollDistance = left - scrollStart
  scrollStart = left
  if (!touching && going) {
    if (_t > -1.8) {
      _t = -1.8
      going = false
      scrollerObj.scrollTo(50000, 0, false);
      return 
    }
    if (Math.abs(scrollDistance) < 1) {
      going = false
      scrollerObj.scrollTo(50000, 0, false);
    } else {
      _t -= scrollDistance / 1000 * 1.5
    }
  }
  if (touching) {
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

// load后加载资源
window.onload = function () {
  Loader
  .add(statusNormal1).add(statusActive1)
  .add(statusNormal2).add(statusActive2)
  .add(statusNormal3).add(statusActive3)
  .load(init);
  Loader.onProgress.add((t, e) => {
    console.log('loader progress:', parseInt(t.progress));
  });
};

// 加载资源完成后初始化
function init(loader, resources) {
  // 滚动代理容器
  scrollContainer = new PIXI.Container;
  var rectGraphic = createRectangle({
    alpha: 0,
    width: mainWidth,
    height: mainHeight,
    x: 0,
    y: 0
  });
  scrollContainer.addChild(rectGraphic)

  scrollContainer.interactive = true
  scrollContainer.buttonMode = true
  scrollContainer.on("touchstart", touchstart).on("touchmove", touchmove).on("touchend", touchend); 
  scrollerObj.setDimensions(mainWidth, mainHeight, 100000, mainHeight);
  scrollerObj.scrollTo(50000, 0, false)
  Stage.addChild(scrollContainer)
  // TODO: 缩小看下整体
  // scrollContainer.position.x = 200;
  // scrollContainer.scale.set(0.4, 0.4);

  CanvasRenderer.render(Stage)

  textWrapContainer = new PIXI.Container;
  textContainer = new PIXI.Container;

  // 圆环路数，依据屏幕的高度1-n圈
  (function _what() {
    circleHeight = mainHeight - outerDistance - innerRadius; // 圆饼
    circleNumber = Math.floor(circleHeight / circleGap); // 圆环数
    console.log('circleNumber:', circleNumber);
    // 偶数数组
    var t = []
    for (var e = 0; e <= circleNumber / 2; e++) {
      t.push(2 * e); // [0,2,4,6]
    }
    // 奇数数组
    var n = []; // [1,3,5]
    for (e = 0; e < circleNumber / 2; e++) {
      n.push(2 * e + 1);
    }
    // 确保数组总数包含所有的文字数量
    for (var i = 0; i < Math.ceil(rotateText.length / 2); i++) {
      var a;
      if (i % 2 == 0) {
        a = JSON.parse(JSON.stringify(t));
      } else {
        a = JSON.parse(JSON.stringify(n));
      }
      if (textRandomShow) {
        a = a.sort(randomValue).sort(randomValue) // 随机排序，显示顺序
      }
      circleNumberArray = circleNumberArray.concat(a) // 偶数和奇数相隔的随机数数组
    }
  })();

  // 处理100个旋转文字
  var textIndex = 0;
  var textInterval = setInterval(function () {
    handleText(textIndex);
    CanvasRenderer.render(Stage);
    ++textIndex;
    if (textIndex == rotateText.length) {
      clearInterval(textInterval);
    }
  }, 10);

  textWrapContainer.addChild(textContainer);
  
  // 添加到滑动容器
  scrollContainer.addChild(textWrapContainer);

  // 启动raf
  animate();

  rotateStart = true;

}

// 触摸开始
function touchstart(t) {
  var e = t.data.originalEvent;
  scrollerObj.doTouchStart(e.touches, e.timeStamp);
  going = touching = true
}

// 触摸移动
function touchmove(t) {
  var e = t.data.originalEvent;
  scrollerObj.doTouchMove(e.touches, e.timeStamp, e.scale)
}

// 触摸结束
function touchend(t) {
  touching = false;
  var e = t.data.originalEvent;
  scrollerObj.doTouchEnd(e.timeStamp);
}

// 关键方法：遍历文字，形成圆形
function handleText(textIndex) {
  var finishText; // 最后的文字
  var text = rotateText[textIndex]; // 文字

  var innerContainer = new Container; // 总的一个容器
  innerContainer.textData = rotateText[textIndex] // 保存文字信息
  innerContainer.index = textIndex // 保存文字索引
  innerContainer.gameStep = 0 //
  // innerContainer.rotation = Math.PI / 2; // 旋转的角度

  innerContainer.roadIndex = circleNumberArray[textIndex] // 圆环路数
  var n = innerContainer.roadIndex // 和
  var a = circleCenterY + innerRadius + n * circleGap; // 半径 = 圆心 + 内半径 + 间隔
  var r = {
    x: mainWidth / 2,
    y: mainHeight + circleCenterY
  }; // innerContainer位置

  innerContainer.speed = 1;
  innerContainer.position.set(r.x, r.y); // 放圆心位置
  innerContainer.pivot.set(0, a); // 移动到旋转点（圈线）

  var c = Math.asin(designFontSize / a); // 文字之间的紧凑度，文字大小宽度
  var l = 0; // 弧度
  var wordContainer = innerContainer.wordBox = new Container;

  // 每个字符生成旋转
  for (var h = 0; h < text.length; h++) {
    var letterContainer = new Container;
    var letter = new PIXI.Text(text[h], {
      fontSize: designFontSize,
      fill: ["#000000"]
    });
    var charCode = text.charCodeAt(h);
    var g = 0;

    if (h == 0) {
      g = 0;
    } else {
      if (1 <= charCode && charCode <= 126 || 65376 <= charCode && charCode <= 65439) {
        if ("/" == text[h]) {
          g = c * 1.5;
        } else {
          if (innerContainer.wordBox.children[h - 1].wordStep == c) {
            g = c * 1.2;
          } else {
            g = 0.6 * c;
          }
        } 
      } else {
        if (innerContainer.wordBox.children[h - 1].wordStep == .6 * c || innerContainer.wordBox.children[h - 1].wordStep == 1.5 * c) {
          g = 0.8 * c;
        } else {
          g = c;
        }
      }
    } 
    
    letterContainer.wordStep = g
    l += letterContainer.wordStep
    letterContainer.rotation = l
    letterContainer.startRotation = l
    letterContainer.pivot.set(0, a)
    letterContainer.position.set(0, a)

    var letterRectangle = createRectangle({
      color: 0x00ff00,
      width: designFontSize, // 适配文字宽高
      height: designFontSize,
      x: 0,
      y: 0
    });
    letterRectangle.alpha = 0;
    letterContainer.zIndex = 2;
    letterContainer.addChild(letterRectangle, letter)
    wordContainer.allRotation = l
    wordContainer.addChild(letterContainer)
  }
  
  // 添加文字背景，需要根据文字长度，使用不同的背景图片
  if (textIndex <= rotateText.length) {
    var textLength = text.length;
    var normalTexture = text <= 4 ? statusNormal1 : text > 9 ? statusNormal3 : statusNormal2;
    var activeTexture = text <= 4 ? statusActive1 : text > 9 ? statusActive3 : statusActive2;
    var normalSprite = new Sprite(Resources[normalTexture].texture);
    var activeSprite = new Sprite(Resources[activeTexture].texture);
    normalSprite.width = wordContainer.width + designFontSize;
    activeSprite.width = wordContainer.width + designFontSize;
    normalSprite.x = -designFontSize / 2;
    activeSprite.x = -designFontSize / 2;
    normalSprite.y = -designFontSize / 3;
    activeSprite.y = -designFontSize / 3;
    normalSprite.rotation = l / 4;
    activeSprite.rotation = l / 4;
    activeSprite.visible = false;
    wordContainer.addChild(normalSprite);
    wordContainer.addChild(activeSprite);
    wordContainer.setChildIndex(normalSprite, 0);
    wordContainer.setChildIndex(activeSprite, 0);
  }

  wordContainer.pivot.x = wordContainer.width / 2; // pivot center
  innerContainer.addChild(wordContainer);
  innerContainer.pivot.x = -innerContainer.width / 2; // pivot center
  innerContainer.allRotation = l;
  mt += 1 / textDensity;
  innerContainer.startStemp = mt;
  textContainer.addChild(innerContainer);
  
  // 大于1时，计算语句之间的间距，防止重叠
  if (textIndex > 0) {
    if (Math.abs(circleNumberArray[textIndex - 2] - circleNumberArray[textIndex]) <= 1) {
      var C = innerContainer.startStemp + innerContainer.allRotation / 2 - textContainer.children[textIndex - 2].startStemp - textContainer.children[textIndex - 2].allRotation / 2;
      C < .1 && (mt += C < 0 ? .25 - C : .25 + C, innerContainer.startStemp = mt)
    }
    if (Math.abs(circleNumberArray[textIndex - 1] - circleNumberArray[textIndex]) <= 1) {
      var T = innerContainer.startStemp + innerContainer.allRotation / 2 - textContainer.children[textIndex - 1].startStemp - textContainer.children[textIndex - 1].allRotation / 2;
      T < 0 && (mt += 1 / 12 - T, innerContainer.startStemp = mt)
    }
    Math.abs(circleNumberArray[textIndex - 1] - circleNumberArray[textIndex]) <= 2 && (mt += 1 / 8, innerContainer.startStemp = mt);
    for (var y = textIndex - 1; 0 <= y; y--)
      if (circleNumberArray[y] == circleNumberArray[textIndex]) {
        var E = textContainer.children[textIndex].startStemp - textContainer.children[y].startStemp - textContainer.children[y].allRotation;
        E < 0 ? (mt += 1 / 12 - E, innerContainer.startStemp = mt) : E < .2 && (mt += 1 / 12, innerContainer.startStemp = mt);
        break
      }
  }
  
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
      if (innerContainer.xValue <= designFontSize) {
        innerContainer.tween1 && innerContainer.tween1.stop()
        innerContainer.tween2 && innerContainer.tween2.stop()
        if (innerContainer.chosen) {
          innerContainer.hideBackground()
        } else {
          innerContainer.showBackground()
          // 播放点击文字声音
        }
      }
    }
  })

  // 显示选中背景
  innerContainer.showBackground = function () {

    innerContainer.chosen = true

    activeSprite.visible = true // 显示圆形容器
    normalSprite.visible = false // 隐藏默认背景
    wordContainer.scale.set(0); // 圆形图片缩小为0

    console.log('show:', innerContainer.roadIndex, innerContainer.textData, innerContainer);
    
    // 圆形显示动画
    var i = innerContainer.tween1 = new TWEEN.Tween({
        scale: 0
      }).to({
        scale: 1.2
      }, 200).onUpdate(function (t, e) {
        wordContainer.scale.set(t.scale)
      }).start();
    var a = innerContainer.tween2 = new TWEEN.Tween({
        scale: 1.2
      }).to({
        scale: 1
      }, 100).onUpdate(function (t, e) {
        wordContainer.scale.set(t.scale)
      }).onStart(function () {
        activeSprite.visible = true
      });
    i.chain(a) // 动画序列

  }
  
  // 隐藏选中背景
  innerContainer.hideBackground = function () {

    innerContainer.chosen = false;

    console.log('hide:', innerContainer.roadIndex, innerContainer.textData, innerContainer);

    var t = innerContainer.tween2 = new TWEEN.Tween({
      scale: 1.3
    }).to({
      scale: 1
    }, 200).onUpdate(function (t, e) {
      wordContainer.scale.set(t.scale)
    }).onComplete(function () {
      activeSprite.visible = false
      normalSprite.visible = true
    });

    (innerContainer.tween1 = new TWEEN.Tween({
      scale: 1
    }).to({
      scale: 1.3
    }, 100).onUpdate(function (t, e) {
      wordContainer.scale.set(t.scale)
    }).onComplete(function () {
      activeSprite.visible = false
    }).start()).chain(t)

  }

}

// 创建矩形
function createRectangle(opts) {
  var rect = new PIXI.Graphics();
  rect.beginFill(opts.color, typeof opts.alpha !== 'undefined' ? opts.alpha : 1);
  rect.drawRect(0, 0, opts.width, opts.height);
  rect.position.set(opts.x ? opts.x : 0, opts.y ? opts.y : 0);
  rect.endFill();
  return rect;
}

// 随机值: 取-1或1
function randomValue() {
  return 0.5 < Math.random() ? -1 : 1
}

// 动画循环
function animate() {
  if (rotateStart && textContainer) {
    if (!going) {
      _t -= speed;
    }
    textContainer.children.forEach(function (item, index) {
      var n;
      if (- _t >= item.gameStep * mt + item.startStemp + mt / 2) {
        item.gameStep += 1 
      } else if (-_t < item.gameStep * mt + item.startStemp - mt / 2 && 0 < item.gameStep) {
        item.gameStep -= 1
      }
      if ((n = _t + item.gameStep * mt) <= -item.startStemp && n + item.startStemp > -Math.PI - item.allRotation) {
        item.rotation = Math.PI / 2 + (n + item.startStemp)
      } else if (n + item.startStemp <= -Math.PI - item.allRotation) {
        item.rotation = -Math.PI - item.allRotation
      } else {
        item.rotation = Math.PI / 2
      }
    })
    CanvasRenderer.render(Stage);
  }
  TWEEN.update();
  requestAnimationFrame(animate);
}
