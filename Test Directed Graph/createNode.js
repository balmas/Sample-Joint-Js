
var PORT_WIDTH = 90;
const PORT_HEIGHT = 20;
const PORT_GAP = 20;

//Thing to consider -> later
joint.routers.randomWalk = function(vertices, args, linkView) {

    var NUM_BOUNCES = args.numBounces || 1;
    vertices = joint.util.toArray(vertices).map(g.Point);
    for (var i = 0; i < NUM_BOUNCES; i++) {

        var sourceCorner = linkView.sourceBBox.center();
        var targetCorner = linkView.targetBBox.center();

        var randomPoint = g.Point.random(sourceCorner.x, targetCorner.x, sourceCorner.y, targetCorner.y);
        vertices.push(randomPoint)
    }

    return vertices;
}


function makeLink(from,to) {
    const link = new joint.shapes.standard.Link({
       source: { id: from.id},
       target: { id: to.id },
       attr:{
        '.connection': { stroke: 'red', 'stroke-dasharray': '5,5' }
       }
     });
     // see https://resources.jointjs.com/docs/jointjs/v3.7/joint.html#routers
     // I haven't tried the other algorithms but it might be worth experimenting
     // with them all to see which works best
     link.router('metro',{
        margin:0,
        perpendicular:false,
     });
     link.connector('normal');
     link.set('hidden', true);
    return link
 }

function createStage(id, name){
    const node = new joint.shapes.standard.Rectangle({
        id: id,
        /*position: {
          x: 250,
          y: 500
        },*/
        size: {
          width: '450',
          height: 45
        },
        attrs: {
          label: {
            fontWeight: "bold",
            fontSize: 10,
            fontFamily: "sans-serif",
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 5,
            paintOrder: "stroke",
            text: name,
           },
           body: {
            strokeWidth: 2,
            fill: "grey",
            cursor: "grab"
          },
        },
        ports: {
          groups: {
            rdaf: {
              markup: [
                {
                  tagName: "rect",
                  selector: "portBody"
                },
                {
                  tagName: "text",
                  selector: "portLabel"
                }
              ],
              attrs: {
                portBody: {
                  x: 0,
                  y: -PORT_HEIGHT / 2,
                  width: "calc(w)",
                  height: "calc(h)",
                  fill: "yellow",
                  stroke: "#333333",
                  strokeWidth: 2,
                  //magnet: "active", //this allows the user to drag an connect ports
                  cursor: "grab",
                },
                portLabel: {
                  x: "calc(0.5*w)",
                  textAnchor: "middle",
                  textVerticalAnchor: "middle",
                  pointerEvents: "none",
                  fontWeight: "bold",
                  fontSize: 12,
                  fontFamily: "sans-serif"
                },
              },
              size: { width: PORT_WIDTH, height: PORT_HEIGHT },
              position: "absolute"
            },
          },
          items: []
        }
      });
      //node.set('hidden', true);
      return node
}


function createTopics(id, name){
  const textWidth = name.length * 10; // Approximate width based on font size and average character width
  const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      //position: {
      //  x: 250,
      //  y: 500
      //},
      size: {
        width: width,
        height: 65
      },
      attrs: {
        label: {
          fontWeight: "bold",
          fontSize: 15,
          fontFamily: "sans-serif",
          fill: "#ffffff",
          stroke: "#333333",
          strokeWidth: 5,
          paintOrder: "stroke",
          text: name,
         },
         body: {
          strokeWidth: 2,
          fill: "#4d80b3",
          cursor: "grab"
        },
      },
      ports:{
        items: []
      }
    });
    node.set('hidden', true);
    return node
 }


 function createConsiderations(id, name){

  const textWidth = name.length * 10; // Approximate width based on font size and average character width
  const width = Math.max(textWidth, 200); // Ensure a minimum width to accommodate shorter text
  const node =  new joint.shapes.standard.Rectangle({
      id: id,
      //position: {
      //  x: 250,
      //  y: 500
      //},
      size: {
        width: width,
        height: 65
      },
      attrs: {
        label: {
          //fontWeight: "bold",
          fontSize: 15,
          fontFamily: "sans-serif",
          fill: "black",
          stroke: "#333333",
          paintOrder: "stroke",
          text: name,
         },
         body: {
          strokeWidth: 2,
          fill: "white",
          cursor: "grab"
        },
      },
      ports:{
        id: "Considerations",
        items: []
      }
    });
    node.set('hidden', true);
    return node
 }


 function createOutcomes(id, name){
    const textWidth = name.length * 10; // Approximate width based on font size and average character width
    const width = Math.max(textWidth, 100); // Ensure a minimum width to accommodate shorter text
    const node =  new joint.shapes.standard.Rectangle({
        id: id,
        //position: {
        //  x: 250,
        //  y: 500
        //},
        size: {
          width: width,
          height: 65
        },
        attrs: {
          label: {
            fontWeight: "bold",
            fontSize: 15,
            fontFamily: "sans-serif",
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 5,
            paintOrder: "stroke",
            text: name,
           },
           body: {
            strokeWidth: 2,
            fill: "#4d80b3",
            cursor: "grab"
          },
        },
        ports:{
          id: "Outcomes",
          items: []
        }
      });
      node.set('hidden', true);
      return node
}



function setPorts(el, ports) {
    let width = 0;
    const rdafPorts = ports.map((port, index) => {
      const x = index * (PORT_WIDTH + PORT_GAP);
      width = x + PORT_WIDTH;
      return {
        id: `${port}`,
        group: "rdaf",
        attrs: {
          portLabel: {
            text: `${port}`,
            
          }
        },
        args: {
          x: "90%",
          y: "50%"
        },
      };
    });
    if (rdafPorts.length > 0) {
      width += PORT_GAP;
    }
  
    width += 2 * PORT_WIDTH;
  
    el.prop(["ports", "items"], [...rdafPorts], {
      rewrite: true
    });
  
  }



//Creates The ports on the Elements
function createPort(id,group) {
  var port = {
    id: id,
    label: {
      position: {
        name: 'left'
      },
      markup: [{
         tagName: 'text',
            selector: 'label'
        }]
    },
    attrs: {
        portBody: {
            magnet: true,
            width: 0,
            height: 0,
            x:240,
            y: 0,
            fill:  '#03071E'
        },
    },
    markup: [{
        tagName: 'rect',
        selector: 'portBody'
    }],
    x:"90%",
    y:"50%"
  };
  return port
}
