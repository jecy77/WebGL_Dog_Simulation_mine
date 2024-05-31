"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var lightPosition = vec4(-1.0, -1.0, 3.0, 0.0 );
var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );

// 골든 리트리버 색 https://encycolorpedia.kr/f1af09
var materialAmbient = vec4(0.9451, 0.6863, 0.0353, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 10.0;

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 11;
var leftEarId = 12;
var rightEarId = 13;

var torsoHeight = 2.8;
var torsoWidth = 3.5;
var upperArmHeight = 1.0;
var lowerArmHeight = 1.0;
var upperArmWidth  = 0.7;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.7;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 1.0;
var upperLegHeight = 0.7;
var headHeight = 1.3;
var headWidth = 1.3;
var tailHeight = 2.0;
var tailWidth = 0.5;
var earHeight = 0.6;
var earWidth = 0.5;

var numNodes = 10;
var numAngles = 11;
var numNodes = 14;

//var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0];
var theta = [225, -10, 0, 0, 0, 0, 5, -10, 5, -10, 0, 0, 0, 0];

//var stack = [];
var stack = [];
//var figure = [];
var figure = [];

var torsoX = 0, torsoY = 0, torsoZ = 0, torsoX2 = 0, torsoY2 = 0, torsoZ2 = 0, torsota = 0, torsoR2 = 0;
var flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false, flag6 = false, flag7 = false, flag8 = false;
var flag9 = false, flag10 = false, flag11 = false, flag12 = false, flag13 = false, flag14 = false; 
var check = false, check2 = true, check3 = true, check4 = true, check5 = true, check6 = true, check7 = true;
var count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0, count6 = 0, count7 = 0, count8 = 0, count9 = 0, count10 = 0;
var armta1 = 0, armta2 = 0, armta3 = 0, torsoR = 0, lowerArmta2 = 0, lowerArmta1 = 0, dogUpperArmta = 0, lowerArmta3 = 0;
var tailta = 0, turn23 = 12, turn24 = -1;
var turn1 = 3, turn2 = -1, turn3 = 30, turn4 = -1, turn5 = 20, turn6 = -1, turn7 = 20, turn8 = -1, turn9 = 20, turn10 = -1, turn22 = -1;
var turn11 = 20, turn12 = -1, turn13 = 15, turn14 = -1, turn15 = 10, turn16 = -1, turn17 = 10, turn18 = -1, turn19 = 10, turn20 = -1, turn21 = 12;

//for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer, nBuffer;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var isCapturing = false;
var capturedMotion = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m2 = mat4();

    switch(Id) {

    case torsoId:

	m2 = rotate(theta[torsoId], 0, 1, 0 );
	m2 = mult(m2, rotate(torsoR, 1, 0, 0));
	m2 = mult(m2, rotate(torsoR2, 0, 0, 1));
	m2 = mult(m2, translate(torsoX2, torsoY2, torsoZ2));
	figure[torsoId] = createNode( m2, torso2, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m2 = translate(0.5*torsoWidth, torsoHeight, 0.0);
	m2 = mult(m2, rotate(theta[head1Id], 1, 0, 0))
	m2 = mult(m2, rotate(theta[head2Id], 0, 1, 0));

    figure[headId] = createNode( m2, head2, leftUpperArmId, leftEarId);
    break;

	case leftEarId:
	m2 = translate(0, headHeight, 0.0);
    figure[leftEarId] = createNode( m2, leftear, rightEarId, null );
    break;

	case rightEarId:
	m2 = translate(1.2*headWidth, headHeight, 0.0);
    figure[rightEarId] = createNode( m2, rightear, null, null );
    break;


    case leftUpperArmId:

    m2 = translate(0.5*torsoWidth, 0.0, -0.5*torsoWidth);
	m2 = mult(m2, rotate(theta[leftUpperArmId], 0, 0, 1));
	m2 = mult(m2, rotate(dogUpperArmta, 0, 0, 1));
    figure[leftUpperArmId] = createNode( m2, leftUpperArm2, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m2 = translate(0.5*torsoWidth, 0.0, 0.5*torsoWidth);
	m2 = mult(m2, rotate(theta[rightUpperArmId], 0, 0, 1));
    figure[rightUpperArmId] = createNode( m2, rightUpperArm2, leftUpperLegId, rightLowerArmId );
    break;

   case leftUpperLegId:

    m2 = translate(-0.5*torsoWidth, 0.0, -0.5*torsoWidth);
	m2 = mult(m2 , rotate(theta[leftUpperLegId], 0, 0, 1));
    figure[leftUpperLegId] = createNode( m2, leftUpperLeg2, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m2 = translate(-0.5*torsoWidth, 0.0, 0.5*torsoWidth);
	m2 = mult(m2, rotate(theta[rightUpperLegId], 0, 0, 1));
    figure[rightUpperLegId] = createNode( m2, rightUpperLeg2, tailId, rightLowerLegId );
    break;

    case leftLowerArmId:

    m2 = translate(0.0, -upperArmHeight, 0.0);
    m2 = mult(m2, rotate(theta[leftLowerArmId], 0, 0, 1));
    figure[leftLowerArmId] = createNode( m2, leftLowerArm2, null, null );
    break;

    case rightLowerArmId:

    m2 = translate(0.0, -upperArmHeight, 0.0);
    m2 = mult(m2, rotate(theta[rightLowerArmId], 0, 0, 1));
    figure[rightLowerArmId] = createNode( m2, rightLowerArm2, null, null );
    break;

    case leftLowerLegId:

    m2 = translate(0.2, -upperLegHeight, 0.0);
    m2 = mult(m2, rotate(theta[leftLowerLegId], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m2, leftLowerLeg2, null, null );
    break;

    case rightLowerLegId:

    m2 = translate(0.0, -upperLegHeight, 0.0);
    m2 = mult(m2, rotate(theta[rightLowerLegId], 0, 0, 1));
    figure[rightLowerLegId] = createNode( m2, rightLowerLeg2, null, null );
    break;

	case tailId:

    
	
	m2 = translate(-(torsoWidth/1.75), 0.8*torsoHeight, 0);
    m2 = mult(m2, rotate(theta[tailId], 1, 0, 0));
	m2 = mult(m2, rotate(tailta, 0, 0, 1));
    figure[tailId] = createNode( m2, tail, null, null );
    break;
    }

}


function traverse2(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse2(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse2(figure[Id].sibling);
}

function torso2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );

    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
	
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.5 * headWidth, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm2() {

    instanceMatrix = mult(modelViewMatrix, translate(-0.5 * upperArmWidth, -0.5 * upperArmHeight, 0.5 * upperArmWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm2() {

    instanceMatrix = mult(modelViewMatrix, translate(-0.5 * lowerArmWidth, -0.5 * lowerArmHeight, 0.5 * lowerArmWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm2() {

    instanceMatrix = mult(modelViewMatrix, translate(-0.5 * upperArmWidth, -0.5 * upperArmHeight, -0.5 * upperArmWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm2() {

    instanceMatrix = mult(modelViewMatrix, translate(-0.5 * lowerArmWidth, -0.5 * lowerArmHeight, -0.5 * lowerArmWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.5 * upperLegWidth, -0.5 * upperLegHeight, 0.5 * upperLegWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight+0.2, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg2() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.5 * lowerLegWidth, -0.5 * lowerLegHeight, 0.5 * lowerLegWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.5 * upperLegWidth, -0.5 * upperLegHeight, -0.5 * upperLegWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight+0.2, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.5 * lowerLegWidth, -0.5 * lowerLegHeight, -0.5 * lowerLegWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(-0.5 * tailWidth, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftear() {
	instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0.5 * earHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function rightear() {
	instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0.5 * earHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);
	 
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     
	 pointsArray.push(vertices[d]);
     normalsArray.push(normal);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.8);

	gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
//    modelViewMatrix = mat4();

//    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

	
	document.getElementById("slider0").onchange = function(event) {
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };

    
  document.getElementById("slider0").oninput = function (event) {
    theta[torsoId] = event.target.value;
    initNodes(torsoId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider1").oninput = function (event) {
    theta[head1Id] = event.target.value;
    initNodes(head1Id);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("slider2").oninput = function (event) {
    theta[leftUpperArmId] = event.target.value;
    initNodes(leftUpperArmId);
  };
  document.getElementById("slider3").oninput = function (event) {
    theta[leftLowerArmId] = event.target.value;
    initNodes(leftLowerArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("slider4").oninput = function (event) {
    theta[rightUpperArmId] = event.target.value;
    initNodes(rightUpperArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider5").oninput = function (event) {
    theta[rightLowerArmId] = event.target.value;
    initNodes(rightLowerArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider6").oninput = function (event) {
    theta[leftUpperLegId] = event.target.value;
    initNodes(leftUpperLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider7").oninput = function (event) {
    theta[leftLowerLegId] = event.target.value;
    initNodes(leftLowerLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider8").oninput = function (event) {
    theta[rightUpperLegId] = event.target.value;
    initNodes(rightUpperLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider9").oninput = function (event) {
    theta[rightLowerLegId] = event.target.value;
    initNodes(rightLowerLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("slider10").oninput = function (event) {
    theta[head2Id] = event.target.value;
    initNodes(head2Id);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("motioncapture_start").onclick = function () {
    isCapturing = true;
    console.log("Capturing started");
  };
  
  document.getElementById("motioncapture_stop").onclick = function () {
    isCapturing = false;
    console.log("Capturing stopped");
  };

  document.getElementById("motioncapture_print").onclick = function () {
    console.log(JSON.stringify(capturedMotion));
  };

  document.getElementById("motioncapture_play").onclick = function () {
    console.log("Playing captured motion");
    if (capturedMotion.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        theta = capturedMotion[index];
        for (let i = 0; i < numNodes; i++) initNodes(i);
        index++;
        if (index >= capturedMotion.length) {
          clearInterval(interval);
        }
      }, 100); // Change the interval time as needed
    }
  };
  
  document.getElementById("motioncapture_reset").oninput = function (event) {
    capturedMotion = [];
    console.log("Resetting captured motion");
  };
  
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);	
	
    //for(i=0; i<numNodes; i++) initNodes(i);
	for(i=0; i<numNodes; i++) initNodes(i);
	render();
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		modelViewMatrix = translate(-5.0, -3.0, 3.0);
		if(flag1 && count1 <= 40){
			torsoX += 0.3;
			
			torsoX2 += 0.2;
			
			
			
			count1++;
		}
		
			
		
		if(flag1 && count1 == 41){
			flag12 = false, flag13 = false, count9 = 0, turn21 = 12, turn22 = -1;
			theta[leftUpperLegId] = 180;
			theta[rightUpperLegId] = 180;
			theta[rightLowerLegId] = 0;
			theta[leftLowerLegId] = 0;
			if(theta[rightUpperArmId] >= 140){
				theta[rightUpperArmId] -= 2;
				theta[leftUpperArmId] -= 2;
			}
			
			if(theta[rightUpperArmId] == 138){
				if(armta2 <= 4){
					armta1 -= 2;
					armta2 += 2;
					
				}
				
				
				if(armta2 >= 4){
					flag14 = true;
					if(torsoX2 >= -7){
						//torsoZ2 -= 0.2;
						torsoX2 += 0.2;
					}
					else{
						flag14 = false;
					}
				}
				
			}
			
		}
		if(flag2){
			if(count3 <= 22){
				torsoX += 0.2;
			
				count3++;
			}
			if(count3 == 23){
				flag12 = false, flag13 = false, count9 = 0, turn21 = 12, turn22 = -1;
				theta[leftUpperLegId] = 180;
				theta[rightUpperLegId] = 180;
				theta[rightLowerLegId] = 0;
				theta[leftLowerLegId] = 0;
				if(armta2 <= 8){
					armta1 -= 2;
					armta2 += 2;
					
				}
				
			}
			if(armta2 == 10){
			if(turn1 <= 3){					
					torsoX2 -= 0.2;	
					turn1 --;
					if(turn1 == 0){
						turn1 = 4;
						turn2 = 0;
					}
				}
				if(turn2 >= 0){
					torsoX2 += 0.2;
					turn2 ++;
					if(turn2 == 3){
						turn2 = -1;
						turn1 = 4;
					}
				}
			}	
		}
		if(flag3){
			if(theta[leftLowerLegId] <= 115){
				theta[leftLowerLegId] += 2;
				theta[rightLowerLegId] += 2;
				
			}
			if(theta[rightUpperLegId] >= 79){
				
				theta[rightUpperLegId] -= 2;
				theta[leftUpperLegId] -= 2;
			}
			
			if(torsoY >= -3.4){
				//torsoY -= 0.2;
				count4++;
			}
			
			if(count4 == 17){
				//orsoX = 13.0;
				if(torsota <= 40)
					torsota += 2;
			}
			if(!flag4){
				armta2 -= 40;
				flag4 = true;
			}
			if(theta[rightUpperArmId] >= 56)
					theta[rightUpperArmId] -= 2;
			
			if(turn3 <= 30 && theta[rightUpperArmId] == 54){					
					
					
					armta2 += 1;	
					turn3 --;
					if(turn3 == 0){
						turn3 = 31;
						turn4 = 0;
						flag5 = true;
					}
			}
				if(turn4 >= 0){
					//armta1 += 0.2;
					armta2 -= 1;
					turn4 ++;
					if(turn4 == 30){
						turn4 = -1;
						turn3 = 30;
					}
				}
			if(turn5 <= 20 && flag5){
				theta[tailId] -= 2;
			
				turn5 --;
				if(turn5 == 0){
					turn5 = 21;
					turn6 = 0;
				}
			}
		
			if(turn6 >= 0){
				theta[tailId] += 2;
			
				turn6 ++;
				if(turn6 == 20){
					turn6 = -1;
					turn5 = 20;
				}
			}
			if(turn7 <= 20 && flag5){
				theta[head2Id] += 2;
			
				turn7 --;
				if(turn7 == 0){
					turn7 = 21;
					turn8 = 0;
				}
			}		
			if(turn8 >= 0){
				theta[head2Id] -= 2;
			
				turn8 ++;
				if(turn8 == 20){
					turn8 = -1;
					turn7 = 20;
				}
			}
			if(turn9 <= 20 && flag5){
				torsoR += 1;
			
				turn9 --;
				if(turn9 == 0){
					turn9 = 21;
					turn10 = 0;
				}
			}		
			if(turn10 >= 0){
				torsoR -= 1;
			
				turn10 ++;
				if(turn10 == 20){
					turn10 = -1;
					turn9 = 20;
				}
			}
		}
		if(flag6){
			
			theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0];
			theta = [225, -10, 0, 0, 0, 0, 5, -10, 5, -10, 0, 0, 0, 0];
			torsoY = 0, torsoZ = 0, torsoY2 = 0, torsoZ2 = 0, torsota = 0;
			armta1 = 0, armta2 = 0, armta3 = 0, torsoR = 0;
			turn5 = 20, turn6 = -1, turn7 = 20, turn8 = -1;
			if(torsoX >= 7){
				torsoX -= 0.2;
			}
		
		}
		if(flag7){
			if(theta[torsoId] >= 15){
				theta[torsoId] -= 2;
			}
			if(theta[rightUpperArmId] >= 140){
				theta[rightUpperArmId] -= 2;
				theta[leftUpperArmId] -= 2;
			}
			if(lowerArmta2 <= 92){
				lowerArmta2 += 2;
			}
			if(lowerArmta1 >= -78){
				lowerArmta1 -= 2;
			}	
		}
		if(flag8){
			flag14 = true;
			if(torsoX2 <= -1){
				torsoX2 += 0.2;
			}
			else{
				flag14 = false;
				if(check6){
					theta[leftUpperLegId] = 5;
					theta[rightUpperLegId] = 5;
					theta[leftUpperArmId] = 0;
					theta[rightUpperArmId] = 0;
					count10 = 0, turn23 = 12, turn24 = -1;
					check6 = false;
				}
				if(turn5 <= 20 ){
			theta[tailId] -= 2;
			
			turn5 --;
			if(turn5 == 0){
				turn5 = 21;
				turn6 = 0;
			}
		}
		
			if(turn6 >= 0){
				theta[tailId] += 2;
			
				turn6 ++;
				if(turn6 == 20){
					turn6 = -1;
					turn5 = 20;
					check = true;
				}
			}
			
			if(turn7 <= 20 ){
				theta[head2Id] -= 1;
			
				turn7 --;
				if(turn7 == 0){
					turn7 = 21;
					turn8 = 0;
				}
			}		
			if(turn8 >= 0){
				theta[head2Id] += 1;
			
				turn8 ++;
				if(turn8 == 20){
					turn8 = -1;
					turn7 = 20;
				}
			}
			}
			if(check){
				if(theta[torsoId] >= -61){
					theta[torsoId] -= 2;
				}
				else{
					flag14 = true;
					if(torsoX2 <= 5){
						torsoX2 += 0.2;
					}
					else{
						flag14 = false;
						if(check7){
							theta[leftUpperLegId] = 5;
							theta[rightUpperLegId] = 5;
							theta[leftUpperArmId] = 0;
							theta[rightUpperArmId] = 0;
							count10 = 0, turn23 = 12, turn24 = -1;
							check7 = false;
						}
						if(theta[rightUpperArmId] >= -38){
							theta[rightUpperArmId] -= 2;
						}
						else{
							if(turn11 <= 20){					
								theta[rightLowerArmId] -= 2;	
								turn11 --;
								if(turn11 == 0){
									turn11 = 21;
									turn12 = 0;
								}
							}
							if(turn12 >= 0){
								theta[rightLowerArmId] += 2;
								turn12 ++;
								if(turn12 == 20){
									turn12 = -1;
									turn11 = 20;
								}
							}
						}
						if(dogUpperArmta <= 78){
							dogUpperArmta += 2;
						}
						else{
							if(turn13 <= 15){					
								theta[leftLowerArmId] -= 2;	
								turn13 --;
								if(turn13 == 0){
									turn13 = 16;
									turn14 = 0;
								}
							}
							if(turn14 >= 0){
								theta[leftLowerArmId] += 2;
								turn14 ++;
								if(turn14 == 15){
									turn14 = -1;
									turn13 = 15;
								}
							}
						}
					}
				}
			}
			
		}
		if(flag9){
			if(theta[rightUpperLegId] <= 228 && flag8){
				theta[rightUpperLegId] += 2;
			}
			else{
				flag8 = false;
				

				if(check2){
					//theta = [225, -10, 0, 0, 0, 0, 5, -10, 5, -10, 0, 0];
					dogUpperArmta = 0;
					check2 = false;
				}
				else{
					if(torsoX2 >= -2){
						torsoX2 -= 0.2;
						theta[torsoId] += 5;

					}
					else{
						if(theta[torsoId] <= 49){
							theta[torsoId] += 2;
						}
					}
				}
				
			}
			if(!flag8){
				if(theta[rightUpperLegId] >= 182){
					theta[rightUpperLegId] -= 2;
				}
			}
		}
		if(flag10){
			if(theta[leftLowerLegId] <= 18){
				theta[leftLowerLegId] += 2;
			}
			if(turn15 <= 10){					
				theta[leftUpperLegId] -= 2;	
				turn15 --;
				if(turn15 == 0){
					turn15 = 11;
					turn16 = 0;
				}
			}
			if(turn16 >= 0){
				theta[leftUpperLegId] += 2;
				turn16 ++;
				if(turn16 == 10){
					turn16 = -1;
					turn15 = 10;
				}
			}
			if(lowerArmta1 <= -2){
				lowerArmta1 += 2;
			}
			
			if(theta[leftLowerArmId] >= -78){
					theta[leftLowerArmId] -= 2;
			}
			if(count5 <= 9){
				theta[leftUpperLegId] += 2;
				theta[rightUpperLegId] += 2;
				theta[leftUpperArmId] -= 2;
				theta[rightUpperArmId] -= 2;
				tailta += 3;
				count5++;
			}
			else{
				if(turn17 <= 10){					
					theta[leftUpperLegId] -= 4;	
					turn17 --;
					if(turn17 == 0){
						turn17 = 11;
						turn18 = 0;
					}
				}
				if(turn18 >= 0){
					theta[leftUpperLegId] += 4;
					turn18 ++;
					if(turn18 == 10){
						turn18 = -1;
						turn17 = 10;
					}
				}
			}
		}
		if(flag11){
			
			
			if(torsoX2 <= 4){
				torsoX2 += 0.2;
			}
			else{
				check3 = false;
				if(check5){
					theta[leftUpperLegId] = 5;
					theta[rightUpperLegId] = 5;
					theta[leftUpperArmId] = 0;
					theta[rightUpperArmId] = 0;
					check5 = false;
				}
				if(theta[head2Id] >= -28){
					theta[head2Id] -= 2;
				}
				else{
					if(theta[leftUpperArmId] >= 120 && check4){
						theta[leftUpperArmId] -= 12;
					}
					else{
						
						check4 = false;
						
						if(count7 <= 9){
							theta[leftUpperLegId] += 2;
							theta[rightUpperLegId] += 2;
							theta[leftUpperArmId] -= 2;
							theta[rightUpperArmId] -= 2;
							
							count7++;
						}
						if(torsoR2 <= 174){
							torsoR2 += 2;
						}
						else{
							if(torsoR <= 70){
								torsoR += 2;
							}
						}
			
					}
					if(!check4){
						
							if(theta[leftUpperLegId] >= 88){
								theta[leftUpperLegId] -= 2;
							}
							if(theta[rightUpperLegId] >= 78){
								theta[rightUpperLegId] -= 2;
							}
							if(theta[rightLowerLegId] <= 68){
								theta[rightLowerLegId] += 2;
							}
							if(theta[leftLowerLegId] <= 68){
								theta[leftLowerLegId] += 2;
							}
							if(torsoY >= -2){
								torsoY -= 1;
							}
							if(torsota >= -9){
								torsota -= 1;
							}
							if(theta[leftUpperArmId] <= 148){
								theta[leftUpperArmId] += 2;
							}
							if(theta[leftLowerArmId] <= -2){
								theta[leftLowerArmId] += 2;
							}
							if(lowerArmta2 >= 64){
								lowerArmta2 -= 2;
							}
							if(lowerArmta1 >= -22){
								lowerArmta1 -= 2;
							}
							else{
								if(turn19 <= 10){					
									lowerArmta2 -= 1;	
									turn19 --;
									if(turn19 == 0){
										turn19 = 11;
										turn20 = 0;
									}
								}
								if(turn20 >= 0){
									lowerArmta2 += 2;
									turn20 ++;
									if(turn20 == 10){
										turn20 = -1;
										turn19 = 10;
									}
								}
							}
						
					}
				}
			}
			if(count6 % 2 == 0 && check3){
					theta[leftUpperArmId] = -10;
					theta[rightUpperArmId] = -10;
					theta[leftUpperLegId] = -10;
					theta[rightUpperLegId] = -10;
				}
			else if(count6 % 2 != 0 && check3){
					theta[leftUpperArmId] = 10;
					theta[rightUpperArmId] = 10;
					theta[leftUpperLegId] = 10;
					theta[rightUpperLegId] = 10;
			}
			count6++;
		}
		if(flag12){
			if(!flag13){
				theta[leftUpperLegId] = -200;
				theta[rightUpperLegId] = -200;
				theta[rightLowerLegId] = 30;
				theta[leftLowerLegId] = 30;
				flag13 = true;
			}
			if(count9 <= 5){
				
					theta[rightUpperLegId] += 5;	
					theta[leftUpperLegId] -= 5;	
					count9++;
				
			}
			else{
				if(turn21 <= 12){
					theta[rightUpperLegId] -= 5;	
					theta[leftUpperLegId] += 5;	
					turn21 --;
					if(turn21 == 0){
						turn21 = 13;
						turn22 = 0;
					}
				}
				if(turn22 >= 0){
					theta[leftUpperLegId] -= 5;
					theta[rightUpperLegId] += 5;
			
					turn22 ++;
					if(turn22 == 12){
						turn22 = -1;
						turn21 = 12;
					}
				}
			}
		}
		if(flag14){
			if(count10 <= 5){
				
					theta[rightUpperLegId] += 5;	
					theta[leftUpperLegId] -= 5;	
					theta[leftUpperArmId] += 5;
					theta[rightUpperArmId] -= 5;
					count10++;
			}
			else{
				if(turn23 <= 12){
					theta[rightUpperLegId] -= 5;	
					theta[leftUpperLegId] += 5;	
					theta[leftUpperArmId] += 5;
					theta[rightUpperArmId] -= 5;	
					turn23 --;
					if(turn23 == 0){
						turn23 = 13;
						turn24 = 0;
					}
				}
				if(turn24 >= 0){
					theta[rightUpperLegId] += 5;	
					theta[leftUpperLegId] -= 5;	
					theta[leftUpperArmId] -= 5;
					theta[rightUpperArmId] += 5;
			
					turn24 ++;
					if(turn24 == 12){
						turn24 = -1;
						turn23 = 12;
					}
				}
			}
		}
		//for(i=0; i<numNodes; i++) initNodes(i);
		for(i=0; i<numNodes; i++) initNodes(i);
		//traverse(torsoId);
		modelViewMatrix = translate(3.0, 0, 0.0);
		traverse2(torsoId);
        requestAnimFrame(render);
}
