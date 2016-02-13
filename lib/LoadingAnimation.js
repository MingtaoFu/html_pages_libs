/**************************************************************************************
 * 加载动画
 */
//在本例中，github image 既是帧动画，又是加载动画，所以使用时需要对方法使用代理
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
