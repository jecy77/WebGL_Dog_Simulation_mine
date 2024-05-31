"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

var lightPosition = vec4(-1.0, -1.0, 3.0, 0.0);
var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 0.0, 1.0);

// 골든 리트리버 색 https://encycolorpedia.kr/f1af09
var materialAmbient = vec4(0.9451, 0.6863, 0.0353, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 10.0;

var torsoId = 0;
var headId = 1;
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

var torsoHeight = 2;
var torsoWidth = 4;
var upperArmHeight = 0.5;
var lowerArmHeight = 0.5;
var upperArmWidth = 1;
var lowerArmWidth = 1;
var upperLegWidth = 1;
var lowerLegWidth = 1;
var lowerLegHeight = 0.5;
var upperLegHeight = 0.5;
var headHeight = 1.8;
var headWidth = 2;
var tailHeight = 2.0;
var tailWidth = 0.5;
var earHeight = 2;
var earWidth = 0.5;

var numNodes = 10;
var numAngles = 11;
var numNodes = 14;

//var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0];
var theta = [225, 0, 0, 0, 0, 0, 5, -10, 5, -10, -80, 0, 0, 0];

//var stack = [];
var stack = [];
//var figure = [];
var figure = [];

var torsoX = 0,
  torsoY = 0,
  torsoZ = 0,
  torsoR2 = 0;
var flag1 = false,
  flag2 = false,
  flag3 = false,
  flag4 = false,
  flag5 = false,
  flag6 = false,
  flag7 = false,
  flag8 = false;
var flag9 = false,
  flag10 = false,
  flag11 = false,
  flag12 = false,
  flag13 = false,
  flag14 = false;
var check = false,
  check2 = true,
  check3 = true,
  check4 = true,
  check5 = true,
  check6 = true,
  check7 = true;
var count1 = 0,
  count2 = 0,
  count3 = 0,
  count4 = 0,
  count5 = 0,
  count6 = 0,
  count7 = 0,
  count8 = 0,
  count9 = 0,
  count10 = 0;
var armta1 = 0,
  armta2 = 0,
  armta3 = 0,
  torsoR = 0,
  lowerArmta2 = 0,
  lowerArmta1 = 0,
  dogUpperArmta = 0,
  lowerArmta3 = 0;
var tailta = 0,
  turn23 = 12,
  turn24 = -1;
var turn1 = 3,
  turn2 = -1,
  turn3 = 30,
  turn4 = -1,
  turn5 = 20,
  turn6 = -1,
  turn7 = 20,
  turn8 = -1,
  turn9 = 20,
  turn10 = -1,
  turn22 = -1;
var turn11 = 20,
  turn12 = -1,
  turn13 = 15,
  turn14 = -1,
  turn15 = 10,
  turn16 = -1,
  turn17 = 10,
  turn18 = -1,
  turn19 = 10,
  turn20 = -1,
  turn21 = 12;

//for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);

var vBuffer, nBuffer;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var isCapturing = false;
var capturedMotion = [];
var capturedMove = [];

var m2 = mat4();

//-------------------------------------------
function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}
//--------------------------------------------

function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  };
  return node;
}

function initNodes(Id) {
  m2 = mat4();

  switch (Id) {
    case torsoId:
      m2 = rotate(theta[torsoId], 0, 1, 0);
      m2 = mult(m2, rotate(torsoR, 1, 0, 0));
      m2 = mult(m2, rotate(torsoR2, 0, 0, 1));
      m2 = mult(m2, translate(torsoX, torsoY, torsoZ));
      figure[torsoId] = createNode(m2, torso2, null, headId);
      break;

    case headId:
    case head1Id:
    case head2Id:
      m2 = translate(0.5 * torsoWidth, 0.9 * torsoHeight, -1);
      m2 = mult(m2, rotate(theta[head1Id], 0, 0, 1));
      m2 = mult(m2, rotate(theta[head2Id], 0, 1, 0));

      figure[headId] = createNode(m2, head2, leftUpperArmId, leftEarId);
      break;

    case leftEarId:
      m2 = translate(0, headHeight, 0.5 * headWidth);
      figure[leftEarId] = createNode(m2, leftear, rightEarId, null);
      break;

    case rightEarId:
      m2 = translate(1.2 * headWidth, headHeight, 0.5 * headWidth);
      figure[rightEarId] = createNode(m2, rightear, null, null);
      break;

    case leftUpperArmId:
      m2 = translate(0.5 * torsoWidth, 0.0, -0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[leftUpperArmId], 0, 0, 1));
      m2 = mult(m2, rotate(dogUpperArmta, 0, 0, 1));
      figure[leftUpperArmId] = createNode(
        m2,
        leftUpperArm2,
        rightUpperArmId,
        leftLowerArmId
      );
      break;

    case rightUpperArmId:
      m2 = translate(0.5 * torsoWidth, 0.0, 0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[rightUpperArmId], 0, 0, 1));
      figure[rightUpperArmId] = createNode(
        m2,
        rightUpperArm2,
        leftUpperLegId,
        rightLowerArmId
      );
      break;

    case leftUpperLegId:
      m2 = translate(-0.5 * torsoWidth, 0.0, -0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[leftUpperLegId], 0, 0, 1));
      figure[leftUpperLegId] = createNode(
        m2,
        leftUpperLeg2,
        rightUpperLegId,
        leftLowerLegId
      );
      break;

    case rightUpperLegId:
      m2 = translate(-0.5 * torsoWidth, 0.0, 0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[rightUpperLegId], 0, 0, 1));
      figure[rightUpperLegId] = createNode(
        m2,
        rightUpperLeg2,
        tailId,
        rightLowerLegId
      );
      break;

    case leftLowerArmId:
      m2 = translate(0.0, -upperArmHeight, 0.0);
      m2 = mult(m2, rotate(theta[leftLowerArmId], 0, 0, 1));
      figure[leftLowerArmId] = createNode(m2, leftLowerArm2, null, null);
      break;

    case rightLowerArmId:
      m2 = translate(0.0, -upperArmHeight, 0.0);
      m2 = mult(m2, rotate(theta[rightLowerArmId], 0, 0, 1));
      figure[rightLowerArmId] = createNode(m2, rightLowerArm2, null, null);
      break;

    case leftLowerLegId:
      m2 = translate(0.2, -upperLegHeight, 0.0);
      m2 = mult(m2, rotate(theta[leftLowerLegId], 0, 0, 1));
      figure[leftLowerLegId] = createNode(m2, leftLowerLeg2, null, null);
      break;

    case rightLowerLegId:
      m2 = translate(0.0, -upperLegHeight, 0.0);
      m2 = mult(m2, rotate(theta[rightLowerLegId], 0, 0, 1));
      figure[rightLowerLegId] = createNode(m2, rightLowerLeg2, null, null);
      break;

    case tailId:
      m2 = translate(-(torsoWidth / 1.75), 0.5 * torsoHeight, 0);
      m2 = mult(m2, rotate(theta[tailId], 1, 0, 0));
      m2 = mult(m2, rotate(tailta, 0, 0, 1));
      figure[tailId] = createNode(m2, tail, null, null);
      break;
  }
}

function traverse2(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse2(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse2(figure[Id].sibling);
}

function torso2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );

  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth, torsoHeight, torsoWidth)
  );

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * headWidth, 0.5 * headHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(headWidth, headHeight, 1.5 * headWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperArm2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.5 * upperArmWidth, -0.5 * upperArmHeight, 0.5 * upperArmWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerArm2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.5 * lowerArmWidth, -0.5 * lowerArmHeight, 0.5 * lowerArmWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperArm2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.5 * upperArmWidth, -0.5 * upperArmHeight, -0.5 * upperArmWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerArm2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(-0.5 * lowerArmWidth, -0.5 * lowerArmHeight, -0.5 * lowerArmWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperLeg2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * upperLegWidth, -0.5 * upperLegHeight, 0.5 * upperLegWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight + 0.2, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerLeg2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * lowerLegWidth, -0.5 * lowerLegHeight, 0.5 * lowerLegWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperLeg2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * upperLegWidth, -0.5 * upperLegHeight, -0.5 * upperLegWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight + 0.2, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerLeg2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * lowerLegWidth, -0.5 * lowerLegHeight, -0.5 * lowerLegWidth)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function tail() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.5 * tailWidth, 0.8 * tailHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(tailWidth, tailHeight, tailWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
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

function cube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.8);

  gl.enable(gl.DEPTH_TEST);
  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  instanceMatrix = mat4();

  projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
  //    modelViewMatrix = mat4();

  //    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  cube();

  nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  var specularProduct = mult(lightSpecular, materialSpecular);

  document.getElementById("torso").oninput = function (event) {
    theta[torsoId] = event.target.value;
    initNodes(torsoId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("head1").oninput = function (event) {
    theta[head1Id] = event.target.value;
    initNodes(head1Id);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("left_upper_arm").oninput = function (event) {
    theta[leftUpperArmId] = event.target.value;
    initNodes(leftUpperArmId);
  };
  document.getElementById("left_lower_arm").oninput = function (event) {
    theta[leftLowerArmId] = event.target.value;
    initNodes(leftLowerArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("right_upper_arm").oninput = function (event) {
    theta[rightUpperArmId] = event.target.value;
    initNodes(rightUpperArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("right_lower_arm").oninput = function (event) {
    theta[rightLowerArmId] = event.target.value;
    initNodes(rightLowerArmId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("right_upper_leg").oninput = function (event) {
    theta[leftUpperLegId] = event.target.value;
    initNodes(leftUpperLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("left_lower_leg").oninput = function (event) {
    theta[leftLowerLegId] = event.target.value;
    initNodes(leftLowerLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("right_upper_leg").oninput = function (event) {
    theta[rightUpperLegId] = event.target.value;
    initNodes(rightUpperLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("right_lower_leg").oninput = function (event) {
    theta[rightLowerLegId] = event.target.value;
    initNodes(rightLowerLegId);
    if (isCapturing) capturedMotion.push([...theta]);
  };
  document.getElementById("head2").oninput = function (event) {
    theta[head2Id] = event.target.value;
    initNodes(head2Id);
    console.log(theta[head2Id]);
    if (isCapturing) capturedMotion.push([...theta]);
  };

  document.getElementById("walk").oninput = function (event) {
    theta[rightUpperArmId] = event.target.value;
    theta[leftUpperArmId] = -event.target.value;
    theta[leftUpperLegId] = event.target.value;
    theta[rightUpperLegId] = -event.target.value;
    torsoX += 0.1;
    m2 = mult(m2, translate(torsoX, torsoY, torsoZ));
    initNodes(head2Id);
    if (isCapturing) {
      capturedMotion.push([...theta]);
      capturedMove.push([torsoX, torsoY, torsoZ]);
    }
  };

  document.getElementById("run").oninput = function (event) {
    theta[rightUpperArmId] = event.target.value;
    theta[leftUpperArmId] = event.target.value;
    theta[leftUpperLegId] = -event.target.value;
    theta[rightUpperLegId] = -event.target.value;
    torsoX += 0.3;
    m2 = mult(m2, translate(torsoX, torsoY, torsoZ));
    initNodes(head2Id);
    if (isCapturing) {
      capturedMotion.push([...theta]);
      capturedMove.push([torsoX, torsoY, torsoZ]);
    }
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

//   document.getElementById("motioncapture_reset").oninput = function (event) {
//     capturedMotion = [];
// 	capturedMove = [];
//     console.log("Resetting captured motion");
//   };
  

  document.getElementById("motioncapture_play").onclick = function() {
    console.log("Playing captured motion");
	isCapturing = false;
	
    let index = 0;
    const interval = setInterval(() => {
        if (index < capturedMove.length) {
            // 현재 인덱스에 해당하는 위치 데이터를 가져와 모델 뷰 행렬을 업데이트
            torsoX = capturedMove[index][0];
            torsoY = capturedMove[index][1];
            torsoZ = capturedMove[index][2];

			theta = capturedMotion[index];

            // 모델 뷰 행렬 업데이트 함수 실행
            m2 = mat4();
            m2 = translate(torsoX, torsoY, torsoZ);
            m2 = mult(m2, rotate(theta[torsoId], 0, 1, 0)); // 회전을 적용하고 싶다면 여기에 추가
            modelViewMatrix = m2;

            // 모든 노드를 초기화하여 새로운 위치를 반영
            for (let i = 0; i < numNodes; i++) {
                initNodes(i);
            }

            index++;
        } else {
            // 배열의 끝에 도달하면 인터벌 중지
            clearInterval(interval);
        }
    }, 30); // 간격은 밀리초 단위로 설정, 조정 가능
};


  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  //for(i=0; i<numNodes; i++) initNodes(i);
  for (i = 0; i < numNodes; i++) initNodes(i);
  render();
};

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  modelViewMatrix = translate(-5.0, -3.0, 3.0);

  //for(i=0; i<numNodes; i++) initNodes(i);
  for (i = 0; i < numNodes; i++) initNodes(i);
  //traverse(torsoId);
  modelViewMatrix = translate(3.0, 0, 0.0);
  traverse2(torsoId);
  requestAnimFrame(render);
};
