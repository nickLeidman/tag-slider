##Initialization

!WARNING! Plugin is in development! 
For now features are extremely limited. 
Stand by for updates ;)

###html

```
<ul class="your-class">
    <li>test tag</li>
    <li>test tag 2</li>
    <li>test tag 3</li>
    <li>test tag 4</li>
    <li>test tag 5</li>
    <li>test tag 6</li>
    <li>test tag 7</li>
    <li>test tag 8</li>
</ul>

<script src="[jquery]"></script>
<script src="[tag-slider.js]"></script>
```

###js
```
$('.your-class').tagSlider({options});
```

##Options

###initialTag

Initial tag id to select

values: (number); default: 0 

###tagClass

tag button class

values: (string); default: 'tagSlider__tag' 

###prevArrowContent

values: (string); default: '<' 

###nextArrowContent

values: (string); default: '>' 

###easing

jQuery easing for animation

values: (jQuery easing); default: 'swing' 