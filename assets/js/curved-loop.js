(function(){
  function init(el){
    const tp = el.querySelector('textPath');
    if(!tp) return;
    const spacing = tp.getComputedTextLength() || 800;
    let off = -spacing;
    const speed = 1.5;
    function step(){
      off += speed;
      if (off > 0) off -= spacing;
      tp.setAttribute('startOffset', off + 'px');
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.curved-loop-svg').forEach(init);
  });
})();
