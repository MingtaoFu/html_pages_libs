/**
 * 帧动画
 * 使用 CSS Sprite, 通过切换 background-position 实现背景切换
 * author: Mingtao Fu
 * @param
 * time: (int) 间隔时间(ms)
 * imagePos: (string array) 每一个元素都为 background-position 的属性值
 * frameNum: (int) 帧数
 * animationId: (string) 动画元素的 id.
 * newStart: (int) 新开始的位置, 是为了满足某些动画需要先执行部分动作在循环执行其他动作的需求
 * newStop: (int) 新结束的位置
 */

function TFa() {
}

TFa.prototype.setConf = function(obj) {
  var timer;
  var time = obj.time;
  var imagePos = obj.imagePos;
  var frameNum = imagePos.length;
  var animation = $('#' + obj.animationId);
  var newStart = obj.newStart || 0;
  var newStop = obj.newStop || frameNum - 1;

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
