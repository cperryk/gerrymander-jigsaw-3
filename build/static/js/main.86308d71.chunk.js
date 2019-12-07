(this["webpackJsonpgerrymander-jigsaw-3"]=this["webpackJsonpgerrymander-jigsaw-3"]||[]).push([[0],{13:function(t,e,o){t.exports=o(20)},18:function(t,e,o){},19:function(t,e,o){},20:function(t,e,o){"use strict";o.r(e);var n=o(0),s=o.n(n),i=o(6),r=o.n(i),a=(o(18),o(1)),l=o(2),c=o(4),h=o(3),u=o(5),p=o(12),d=(o(19),o(9)),v=o(7),f=o(10),g=o.n(f),m=o(11),y=o.n(m),b=function(t){function e(t){var o;return Object(a.a)(this,e),(o=Object(c.a)(this,Object(h.a)(e).call(this,t))).myRef=void 0,o.originalPosition=void 0,o.solutionBounds=void 0,o.state={translate:[50,0],dragColor:"yellow",hoverColor:"rgb(100%, 100%, 44.1%)",color:o.props.color,dragging:!1},o.myRef=s.a.createRef(),o}return Object(u.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this,e=this.props.paths.map((function(e,o){return s.a.createElement("path",{d:e,stroke:"gray",strokeWidth:.2,fill:t.state.color,key:o,strokeLinecap:"square",strokeMiterlimit:4,cursor:t.props.solved?"normal":"move"})}));return s.a.createElement(y.a,{scale:1,onStart:this.handleDragStart.bind(this),onStop:this.handleDragStop.bind(this),disabled:this.props.solved},s.a.createElement("g",{onMouseOver:this.handleMouseOver.bind(this),onMouseOut:this.handleMouseOut.bind(this),ref:this.myRef},e))}},{key:"getPosition",value:function(){if("object"===typeof this.myRef&&this.myRef&&this.myRef.current){var t=this.myRef.current.getBoundingClientRect();return{x:t.left-window.scrollX,y:t.top-window.scrollY}}}},{key:"componentDidMount",value:function(){"object"===typeof this.myRef&&this.myRef&&this.myRef.current&&(this.originalPosition=this.getPosition(),this.solutionBounds={x1:this.originalPosition.x-this.props.tolerance,x2:this.originalPosition.x+this.props.tolerance,y1:this.originalPosition.y-this.props.tolerance,y2:this.originalPosition.y+this.props.tolerance})}},{key:"componentDidUpdate",value:function(){this.props.solved&&"object"===typeof this.myRef&&this.myRef.current.setAttribute("transform","")}},{key:"handleMouseOver",value:function(){this.props.solved||this.state.dragging||this.setState({color:this.state.hoverColor})}},{key:"handleMouseOut",value:function(){this.props.solved||this.state.dragging||this.setState({color:this.props.color})}},{key:"handleDragStart",value:function(){this.setState({dragging:!0,color:this.state.dragColor}),this.props.onDragStart()}},{key:"handleDragStop",value:function(){this.setState({dragging:!1,color:this.props.color}),this.props.onDragStop(this.isSolved())}},{key:"isSolved",value:function(){var t=this.getPosition(),e=t.x,o=t.y;return e>this.solutionBounds.x1&&e<this.solutionBounds.x2&&o>this.solutionBounds.y1&&o<this.solutionBounds.y2}}]),e}(s.a.PureComponent),k=function(t){function e(t){return Object(a.a)(this,e),Object(c.a)(this,Object(h.a)(e).call(this,t))}return Object(u.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this,e=this.props.paths.map((function(e,o){return s.a.createElement("path",{d:e,stroke:"{this.props.color}",strokeWidth:.5,fill:t.props.color,key:o})}));return s.a.createElement("g",null,e)}}]),e}(s.a.Component),O=function(t){function e(t){var o;Object(a.a)(this,e),(o=Object(c.a)(this,Object(h.a)(e).call(this,t))).solutions={};var n=g.a.scale("RdYlBu").domain([0,t.pathSets.length],t.pathSets.length,"quantiles");return o.state={pieces:t.pathSets.map((function(t,e){return{key:e,paths:t,color:n(e/t.length).hex()}})),solved:!1},o.solutions=o.props.pathSets.reduce((function(t,e,o){return t[o]=!1,t}),{}),o}return Object(u.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){var t=this,e=this.state.pieces.map((function(e,o){return s.a.createElement(b,{paths:e.paths,key:e.key,color:e.color,tolerance:30,onDragStart:function(){return t.handleDrag(o)},onDragStop:function(o){return t.handleDragStop(e.key,o)},solved:t.state.solved})}));return s.a.createElement("div",{className:"Puzzle"},s.a.createElement("svg",{width:1e3,height:1e3,viewBox:"0 0 1000 1000"},s.a.createElement(k,{color:"#e3e3e3",paths:[].concat(this.state.pieces.map((function(t){return t.paths})))}),e))}},{key:"movePieceToFront",value:function(t){t!==this.state.pieces.length-1&&this.setState({pieces:[].concat(Object(v.a)(this.state.pieces.slice(0,t)),Object(v.a)(this.state.pieces.slice(t+1,this.state.pieces.length)),[this.state.pieces[t]])})}},{key:"handleDrag",value:function(t){this.movePieceToFront(t)}},{key:"handleDragStop",value:function(t,e){this.solutions[t]=e,console.log(this.solutions),this.isAllSolved()&&(window.alert("solved!"),this.setState({solved:!0}))}},{key:"isAllSolved",value:function(){return Object.values(this.solutions).every((function(t){return!0===t}))}}]),e}(s.a.Component);var j=function(t){function e(t){var o;return Object(a.a)(this,e),(o=Object(c.a)(this,Object(h.a)(e).call(this,t))).state={districts:Object.entries(d).map((function(t){var e=Object(p.a)(t,2);return{key:e[0],paths:e[1]}}))},o}return Object(u.a)(e,t),Object(l.a)(e,[{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement(O,{pathSets:this.state.districts.map((function(t){return t.paths}))}))}}]),e}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(j,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))},9:function(t){t.exports=JSON.parse('{"WV-01":["M747.658 279.279l-5.364 5.242-2.132.854-4.268 5.576-6.525 2.77-2.275 2.969-4.331 8.325-6.504 7.395-5.997.934-5.636 5.266-.694 2.283-5.296 2.96-4.143 4.553-2.732 6.076-5.545 7.978-.222 4.35-4.694 5.23-3.85 7.943 1.9 2.696-.617 3.493 5.799 11.646-4.613 4.84-1.803.682.78 2.859-5.166 6.79-3.531 3.52-37.387-24.977-21.143-1.686-2.295.376-44.98-10.108 1.413-1.478.276-4.89-3.915-5.1-4.337-1.12-1.64 3.037-2.177.211-2.21 3.606-1.559 6.221-3.785 9.908-30.693 4.25 5.264-4.535-.372-4.903 1.707-.86-3.688-4.45-9.918.04-6.438-8.088-6.763-1.587-3.126-2.767-3.258 2.206-8.546-.522-24.341-5.596-2.54-1.138-12.858-.938-.466-1.218-6.186-1.634-4.679 2.323-2.184 2.447-4.497-.272-3.98 3.186-3.229 5.065-4.387-.87 1.87 14.172 18.032 16.935-4.126 1.069-1.595 2.075-4.315.318-.378-1.61-5.135 2.229-24.234 14.099-21.803 12.076-2.025-4.786-4.064-2.834-1.444.803-2.949-2.572-1.174-2.862 3.882-1.76 3.37-2.921 1.509-3.88-.795-8.821-.967-3.665 1.789-1.541-1.376-4.072 1.234-.574-3.089-3.744-1.474-.02-1.064-4.653-3.51.8-6.951-2.209-2.616-3.427-5.868.343-1.25 1.602-2.794-1.756-7.322.087-4.097.982-.59-3.425-3.305-.53 2.72-2.098-1.062-5.707-1.944-.08-1.967-4.064-1.944.475-4.712-3.697 2.98-.907-1.034-1.529 2.972-2.874-15.285 7.113-5.245.943-20.895 14.034-4.532 3.752-26.932-11.24.428-8.614-1.89-4.689 5.18-6.372 5.364-1.858-.819-4.725 2.932-2.716 3.605-.584 7.753.213 6.198 1.359 2.063-11.549 2.469-2.29 6.36-3.308 7.642-5.853 4.467.634 3.566 2.807 1.755 5.285 3.236 2.25 4.612-.66 12.483-6.521 4.69-.709 2.966.685 6.113-7.256 2.487-1.372 5.88-.958 5.458-6.838 4.911-4.68 7.585-5.9 14.717-10.152 8.598-.958 2.227-5.183.8-6.66 4.522-1.604.379-2.596-5.488-5.486.372-3.564 6.005-3.8-.144-6.995 5.495-3.59-.139-3.091-2.44-3.32 2.16-2.674 5.694 1.751.767-1.242-1.393-4.88 3.96-3.93-.31-5.66 1.809-7.071-1.25-4.304 4.612-3.882.026-6.293.884-2.682 5.93-7.284 1.064-4.894 2.752-3.488 3.59-1.705 1.235-4.905 2.437-4.175-2.096-4.872.845-3.558-4.223-3.394 3.54-2.177.098-5.506 2.664-5.458-3.77-4.983-1.543-5.481-6.402-6.152.707-2.913 5.75-4.603 4.613-.865 3.578 1.793 9.38-3.992.016 121.47-.073 27.542 72.02.009 36.192.103 61.15-.059-.358 30.762h-.569l-.326 30.438h-.276l-.13 22.47 2.774.362 7.371-3.97 5.955-6.381 5.523-1.718 1.257-2.586 5.075-1.693 3.985.821 1.331-3.853 4.571-2.604-.392-2.948 6.827-1.016 2.786-4.079 1.978.544 4.808-5.369.91 2.042 3.47-1.909-.108-1.959 2.732-.218-.299-2.02 3.028-3.123-.82-2.348 2.795.914 5.883-1.945 2.139 2.532 12.528 4.467-.155-3.83 3.914-3.629 2.781-.059 6.076-5.63 4.53-6.289 6.12-1.266-2.03-3.429 2.707-3.124 1.87.514-.635-3.67 5.832-3.41-1.897 4.349 4.714-.739 2.394 2.003-7.21 2.041 1.73 2.254 3.423 1.29 2.021-1.149 1.457 3.679 5.775 2.956 5.204 1.739z"],"WV-02":["M219.563 385.93l3.153.68 4.924-2.584 2.21-3.232.135-3.031 2.106-2.428 2.807-.402 6.518 3.769 2.92-1.718-4.173-5.1 2.854-8.176-7.7-7.196.617-3.963 5.247.91 4.597-2.762 26.932 11.24 4.532-3.752 20.895-14.034 5.245-.943 15.285-7.113-2.972 2.874 1.034 1.529-2.98.907 4.712 3.697 1.944-.475 1.967 4.064 1.944.08 1.063 5.707-2.72 2.099 3.304.529.59 3.425 4.097-.982 7.322-.087 2.794 1.756 1.25-1.602 5.868-.343 2.616 3.427 6.951 2.209 3.51-.8 1.064 4.653 1.474.02 3.089 3.744-1.234.574 1.376 4.072-1.79 1.54.968 3.666.795 8.821-1.509 3.88-3.37 2.922-3.882 1.759 1.174 2.862 2.95 2.572 1.443-.803 4.064 2.834 2.025 4.786 21.803-12.076 24.234-14.1 5.135-2.229.378 1.611 4.315-.318 1.595-2.075 4.126-1.069-18.033-16.935-1.87-14.172 4.388.87 3.228-5.065 3.98-3.186 4.498.272 2.184-2.447 4.679-2.323 6.186 1.634.466 1.218 12.858.938 2.54 1.138 24.34 5.596 8.547.522 3.258-2.206 3.126 2.767 6.763 1.587 6.438 8.087 9.918-.039 3.688 4.45-1.707.86.372 4.903-5.264 4.536 30.693-4.25 3.785-9.909 1.56-6.22 2.209-3.607 2.176-.21 1.64-3.038 4.338 1.12 3.915 5.1-.276 4.89-1.413 1.478 44.98 10.108 2.295-.376 21.143 1.686 37.387 24.976 3.531-3.52 5.165-6.79-.78-2.858 1.804-.682 4.613-4.84-5.799-11.646.617-3.493-1.9-2.696 3.85-7.942 4.694-5.23.222-4.35 5.545-7.979 2.732-6.076 4.143-4.554 5.296-2.96.694-2.282 5.636-5.266 5.997-.934 6.504-7.395 4.331-8.325 2.275-2.969 6.525-2.77 4.268-5.576 2.132-.854 5.364-5.242 5.584-.722 9.276 3.26 7.235-.869 8.568 1.3 1.383-4.72 2.95.75.48-1.74 3.527.38-6.023-4.015 1.82-2.735 5.707 2.04 1.716-1.89-3.764-2.103-2.055-2.824 2.07-.561 6.003 2.454 1.694-3.5 3.133.445.32-2.073 11.186 3.25 2.916.195 1.788-3.38 4.908-3.658-.564-2.196 3.961-.086 3.28-2.998 12.17 2.107 4.922 2.154 6.747 5.386 4.003 5.139 5.63.704 3.992-1.074 2.12 3.122 1.006-4.96 1.553 2.083 5.656 1.22.545-2.995 7.653 1.568 1.34 2.448-2.017 4.34-5.892.137-1.297 1.875 3.593 2.783-.295 2.786 3.932-.131 2.69-1.74-.047 1.995-3.251 2.967 8.127 1.463 2.278-1.534 2.608.982-4.862 1.819 2.755 2.95-3.187 1.248 1.955 1.426-2.396 1.033 1.317 1.664 6.442 1.191 2.725 5.77-2.773.917 1.211 4.69-1.601 3.138 5.547 2.503-4.166 3.815-3.92 9.458-4.395 6.043-1.076 4.118-3.745 6.804-33.247-21.453-20.36-12.83-16.99-11.52-13.692-8.397.06 6.237-2.053 2.45 2.622 3.854-3.842 4.794 4.533 1.527-3.424 5.217-9.646 9.794 3.209 2.209-.961 2.063-5.371 5.38 5.677 4.97-3.832 2.392-5.292 6.396-3.014.57-6.18 4.554-9.003 8.09 3.482 2.263-8.315 8.684-3.053-2.924-4.245 2.35-5.501 6.956-5.801 3.327-.147-5.068-3.549 1.42-3.275 4.346-4.702 2.503-5.382 8.794-7.814 11.043-20.259-14.149-1.974 4.157-2.177 1.072-1.575 4.369-4.175.86.552 2.129-3.41 4.077-3.282 7.341 1.365 2.566-1.397 4.386-6.19 1.023-4.564 8.446.082 1.446-4.126 6.627-3.541 4.385-.769 5.134-4.786 3.748-8.198 7.972-3.532 1.443-26.698-7.367-7.281-12.456-2.502-2.761-18.225-6.595 4.839-5.07-2.446-2.205 2.67-3.583-2.968-.61 1.478-2.728-5.571-1.819-2.794 1.332v2.778l-3.12-.212-2.013-3.183-4.679 1.007.26-4.467-2.713-4.304-3.638-1.023-4.19 4.791.665 1.072-5.141 10.683-2.704 1.304.698 3.46-2.323 4.06-1.148 5.355-26.777 14.86-14.377-2.402-20.888 13.887 10.003-22.241-15.614-27.53-6.202 1.718-2.079-2.716.078-2.59-3.662-2.21-11.944-.07-3.022.674-1.963-2.001-8.336 15.206-23.087 19.323-10.65-1.668-5.6 1.82-1.537-2.576-4.06-2.61-15.584 8.209 9.09 2.06 1.274 2.568-15.25 10.352-51.997 24.543-13.567 13.512-2.606 1.935-8.093 32.406-5.442-.714-3.93.893-3.347-1.803.877-2.209-2.046-2.584 1.045-2.994-4.904-6.55-2.467 1.085-5.229-2.498.551-3.373 2.95-2.563-4.946-1.169 1.047-1.97-4.8-.868-3.4-2.741-1.93-3.272-7.513-1.743-.641-2.995 1.4-2.807-7.011.426-1.454-1.486-4.84.987-1.823 3.741-2.86-1.098-1.626-3.66-3.13-.51-.254 2.658-4.062.962 1.376 4.446-3.066-.936-1.995-5.873 5.033-.106-2.765-3.27 2.629-.898-.608-7.334-1.866-3.641-2.015-.938-2.597 1.494-6.359-.231-4.779-1.762-12.438 9.18-4.01-.467-5.261-2.986.935-7.624-1.184-10.783-2.303-33.188 17.667-8.02 29.716-3.814-6.603-5.51 3.611-2.979-18.125-21.152-.94-2.458z"],"WV-03":["M219.563 385.93l.941 2.46 18.125 21.151-3.611 2.98 6.603 5.509-29.716 3.815-17.667 8.019 2.303 33.188 1.184 10.783-.935 7.624 5.26 2.986 4.01.466 12.439-9.179 4.78 1.762 6.358.23 2.597-1.493 2.015.938 1.866 3.641.608 7.334-2.629.898 2.765 3.27-5.033.106 1.995 5.873 3.066.936-1.376-4.446 4.062-.962.255-2.657 3.129.509 1.627 3.66 2.859 1.098 1.823-3.74 4.84-.988 1.454 1.486 7.01-.426-1.399 2.807.641 2.995 7.513 1.743 1.93 3.272 3.4 2.741 4.8.868-1.047 1.97 4.946 1.17-2.95 2.562-.55 3.373 5.228 2.498 2.467-1.084 4.904 6.549-1.045 2.994 2.046 2.584-.877 2.21 3.347 1.802 3.93-.893 5.442.714 8.093-32.406 2.606-1.935 13.567-13.512 51.997-24.543 15.25-10.352-1.275-2.568-9.089-2.06 15.583-8.21 4.061 2.611 1.538 2.576 5.6-1.82 10.65 1.668 23.086-19.323 8.336-15.206 1.963 2.001 3.022-.675 11.944.071 3.662 2.21-.078 2.59 2.079 2.716 6.202-1.717 15.614 27.529-10.003 22.24 20.888-13.886 14.377 2.402 26.777-14.86 1.148-5.354 2.323-4.061-.698-3.46 2.704-1.304 5.141-10.683-.666-1.072 4.19-4.791 3.64 1.023 2.712 4.304-.26 4.467 4.679-1.007 2.014 3.183 3.119.212v-2.778l2.794-1.332 5.57 1.82-1.477 2.728 2.967.609-2.67 3.583 2.447 2.206-4.84 5.07-2.24 3.426-1.641 6.773 1.77 2.145-2.972.795-2.794 3.8 1.283 9.061-2.755 2.552-4.07 6.88.99 1.55-3.006 1.602-3.302-.414-1.406 3.409-3.81 1.957-2.204 2.996 2.382 2.405.863 3.667-4.017 2.613-5.13 1.878-8.442 7.627-2.597.752-.69 5.462-4.253 3.77.957 3.242 2.05.726-4.554 4.346-5.161 10.755-2.658 3.478-7.456 5.732-4.24 2.479-10.953 9.681-3.29 1.217-3.927 6.072-5.236 4.541-1.767 2.835 2.045 2.644-5.048 1.225-2.402 4.901 1.745 1.383-7.165 6.179 2.723 5.637 1.936 1.782 7.548 2.98-6.162 5.24-11.303 5.066 2.617 2.936-2.91 1.623 3.405 1.44 4.38-.997-2.827 4.1-5.239 2.36-5.652 1.44.596.793-18.262 9.267-3.13-1.97.307-3.683-2.99-3.886-6.603 1.317-7.824 4.45-17.055 8.373-10.538 3.615-2.291-3.61-8.488-4.835-3.754-.847-.52 2.882-3.328 4.53 5.49 6.015-8.298 5.183-7.693 3.107-4.222.719-.926-1.76-9.356 1.954-12.248 1.909-8.842 2.536-9.433 4.55-15.43-10.469-6.831-6.231-1.998 3.098-3.913 1.296-2.942 6.078-3.33-.138-6.982 3.726-3.042-1.12-1.373 3.934-6.028 2.118-2.63 2.29-19.098.841-6.095-4.432-3.705-1.542-1.23-4.115-2.54-1.968-6.745-1.657-2.655 1.056-5.51-1.346-.149-3.065-3.939-4.09-8.086-4.693-1.198-2.91 1.152-2.483-3.344-8.42-3.022-.148-3.947-2.326-.105-3.582 2.49-.266 8.316-4.808-2.983.089-.206-2.938-3.778-.42-.14-1.977-6.053 2.083-6.07-2.117.065 2.874-3.255-1.276-1.434-2.948-9.754.33-1.83-2.266 3.28-1.538-1.235-2.782-4.02.121-1.213-4.45-2.029.323.324-4.601-2.722.349.833 2.45-3.796.68-1.137-2.635-3.687-3.27-2.879.766-6.055-3.445-.365-3.971-1.721-.855-1.798-4.123-2.444-1.324 3.334-3.87-3.41-.059-.825-1.862-7.939-6.718-2.343.9.409-2.804-2.03-2.413-1.512-6.637-2.777-2.372-4.81-2.208-.492 2.354-1.588-4.052-2.394-.445-.251-2.576 4.14-2.634-1.956-2.022 3.18-1.924-2.994-.098-1.151-2.413-4.553-.586-1.3-3.887-4.133-7.21-5.325-3.227-.269-2.654-8.383-5.205-.284-5.208 4.501-.07 1.952-4.173.145-3.274-2.288-2.788.876-1.855 3.422.058 1.853-2.965-1.106-5.94 1.557-2.492-4.24-4.73.808-4.902-1.018-2.218.486-4.701 4.007 2.037 6.827-.007 20.255-5.55 2.458.812 7.977-1.071 2.703-1.352 3.212-7.64 2.104-13.43 2.761-2.387 4.597-.78 3.866 1.153 5.425-.584 1.868-1.43.845-3.606-3.054-8.836 1.365-4.612-2.667-7.95-2.88-1.726-.106-4.44 4.239-3.16 4.808-1.542 2.713-2.574.916-3.986-.64-5.37 5.117-5.604 3.67-7.049 6.092-2.989 2.534-5.051 4.694-.666 1.966 1.153 2.843 4.84 4.225-.544 2.966 1.36 5.294 8.12.104 1.992-4.34 3.913 2.928 3.712z"]}')}},[[13,1,2]]]);
//# sourceMappingURL=main.86308d71.chunk.js.map