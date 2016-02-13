/**************************************************************************************
 * 帧动画
 */

function TFa() {
}

TFa.prototype.setConf = function(obj) {
  /*
  var confListMust = [
    'time',
    'imagePos', //数组，按顺序写上每一个的值
    'animationId'
  ];
  */
  var timer;
  var time = obj.time;
  var imagePos = obj.imagePos;
  var frameNum = imagePos.length;
  var animation = $('#' + obj.animationId);
  var newStart = obj.newStart || 0;
  var newStop = obj.newStop || frameNum - 1;

  //需要考虑动画是不是一直按指定的顺序循环播放
  //有更复杂的情况：先出一段，后面一直循环(可以考虑惰性加载)

  //可以考虑到其他动画上

  TFa.prototype.play = function(callback) {
    var start = 0;
    var stop = newStart || frameNum - 1;
    var i = start;

    var insertCall = function() {
      if(callback) {
        callback();
      }
    };
    var intervalFunc = function() {
      animation.css({'background-position': imagePos[i]});
      //循环
      i++;
      if(i > stop) {
        i = newStart;
        insertCall();
        //惰性加载
        //改的只是当前对象的，但我明明改的是 prototype 为什么不是改所有 （虽然只改当前对象的是好事）
        intervalFunc = function() {
          animation.css({'background-position': imagePos[i]});
          i++;
          if(i > newStop) {
            i = newStart;
          }
        }
      }
    };
    timer = window.setInterval(function() {
      intervalFunc();
    }, time);
  };

  TFa.prototype.stop = function() {
    window.clearInterval(timer);
  };
};

exports.TFa = TFa;
