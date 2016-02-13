/**
 * 加载动画
 * author: Mingtao Fu
 * @param
 * animationId: (string) 动画元素的 id.
 */

//若动画既是帧动画，又是加载动画，使用时需要对方法使用代理

function TLoad() {
}

TLoad.prototype.setConf = function(obj) {
  var animation = $('#' + obj.animationId);

  this.listen = function(callback) {
    $(window).load(function() {
      animation.hide();
      if(callback){
        callback();
      }
    });
  }
};

exports.TLoad = TLoad;
