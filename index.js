document.addEventListener("DOMContentLoaded", function(){
    var element = document.getElementById("text-roller");
    var text_roller = new TextRoller(element);
    text_roller.start();
});

var TextRoller = (function(){

    //Helper functions
    function getWidth(element){
        var rect = element.getBoundingClientRect();
        return rect.right - rect.left;
    }

    function TextRoller(box, speed = 80){
        var inner_element = box.children && box.children[0] || null;
        if(!inner_element) throw "No child node found";

        inner_element.style.position = "relative";

        this.position = 0;
        this.speed = speed;
        this.box_width = getWidth(box);
        this.inner_element_width = getWidth(inner_element);
        this.box = box;
        this.inner_element = inner_element.cloneNode(true);
        setUpChildrens.call(this);
    }

    //Private functions
    function refreshWidths(){
        this.box_width = getWidth(this.box);
        this.inner_element_width = getWidth(this.box.children[0]);
    }

    function calculateNumElements(){
        return Math.ceil(this.box_width/this.inner_element_width)+1;
    }

    function setUpChildrens(){
        var qty = calculateNumElements.call(this);
        if(qty > this.box.children.length){
            for(var i = this.box.children.length; i < qty; i++)
                this.box.appendChild(this.inner_element.cloneNode(true));
        }else if(qty < this.box.children.length){
            for(var i = qty; i < this.box.children.length; i++)
                this.box.removeChild(this.box.lastChild);
        }
    }

    function nextFrame(delta){
        var self = this;
        refreshWidths.call(this);
        setUpChildrens.call(this);
        Array.prototype.forEach.call(this.box.children, function(el){
            el.style.left = -self.position + "px";
        });
        this.position += this.speed*delta/1000;
        if(this.position >= this.inner_element_width) this.position = this.position % this.inner_element_width;
    }

    TextRoller.prototype = {

        start: function(){
            this._running = true;
            var self = this;
            var last_time = null;
            var loop_func = function(){
                if(!self._running) return;
                var now = Date.now();
                var delta = last_time === null ? 0 : now - last_time;
                nextFrame.call(self, delta);
                last_time = now;
                window.requestAnimationFrame(loop_func);
            };
            window.requestAnimationFrame(loop_func);
        },

        stop: function(){
            this._running = false;
        }

    };

    return TextRoller;
})();