"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;

var eye = vec3(0, 7, 34); // 카메라를 z축을 따라 뒤로 이동
var at = vec3(-5, 0, 0); // 카메라가 원점을 바라보도록 설정
var up = vec3(0, 1, 0); // 상방향을 y축으로 설정

var isWalking = false;
var isRunning = false;
var isEating = false;
var isPeeing = false;
var isLyingDown = false;
var isShaking = false;
var isWaggingTail = false;

var torsoRotated = false; // 몸이 회전했는지 여부를 나타내는 플래그
var legLifted = false; // 다리가 들어올려졌는지 여부를 나타내는 플래그
var legLowered = false; // 다리가 내려갔는지 여부를 나타내는 플래그

var legDirection = 1; // 1이면 앞으로 걷고, -1이면 뒤로 걷기
var walkDirection = 1;
var runDirection = 7; // 각도 변화 속도를 빠르게 하기 위해 값 증가
var headDirection = 2;
var shakeDirection = 1;
var tailDirection = 1;

var accumulatedAngle = 0; // 누적 각도
var legPhase = 0; // 현재 다리의 단계
var legLiftDirection = 1; // 다리 각도 변화 방향

var runCycle = 0; // 주기적으로 앞뒤로 움직이는 것을 제어하는 변수

var torsoAngle = 0; // torso angle을 위한 변수 추가
var legLiftAngle = 0; // 다리 각도
var accumulatedOffset = 0; // 각도 누적 오프셋
var shakeAngle = 0;
var tailAngle = 0;

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
  vec4(-10.0, -6.0, -10.0, 1.0),
  vec4(-10.0, -6.0, 10.0, 1.0),
  vec4(10.0, -6.0, 10.0, 1.0),
  vec4(10.0, -6.0, -10.0, 1.0),
  vec4(-10.0, 10.0, -10.0, 1.0),
  vec4(-10.0, 10.0, 10.0, 1.0),
  vec4(10.0, 10.0, 10.0, 1.0),
  vec4(10.0, 10.0, -10.0, 1.0),
  vec4(0.0, 7.0, -8.0, 1.0), // Top vertex
  vec4(-10.0, 6.0, -8.0, 1.0), // Bottom left vertex
  vec4(10.0, 6.0, -8.0, 1.0), // Bottom right vertex
];

var groundVertices = [
  vec4(-10.0, -6.0, -10.0, 1.0),
  vec4(-10.0, -6.0, 10.0, 1.0),
  vec4(10.0, -6.0, 10.0, 1.0),
  vec4(10.0, -6.0, -10.0, 1.0),
  vec4(0.0, 7.0, -8.0, 1.0), // Top vertex
  vec4(-10.0, 6.0, -8.0, 1.0), // Bottom left vertex
  vec4(10.0, 6.0, -8.0, 1.0), // Bottom right vertex
];

var skyVertices = [
  vec4(-10.0, 10.0, -10.0, 1.0),
  vec4(-10.0, 10.0, 10.0, 1.0),
  vec4(10.0, 10.0, 10.0, 1.0),
  vec4(10.0, 10.0, -10.0, 1.0),
];

var triangleVertices = [
  vec4(0.0, 7.0, -8.0, 1.0), // Top vertex
  vec4(-10.0, 6.0, -8.0, 1.0), // Bottom left vertex
  vec4(10.0, 6.0, -8.0, 1.0), // Bottom right vertex
];

var lightPosition = vec4(25.0, 15.0, 22.0, 0.0);
var lightAmbient = vec4(2.0, 2.0, 2.0, 1.0);
var lightDiffuse = vec4(1.3, 1.3, 1.3, 1.0);
var lightSpecular = vec4(1.3, 1.3, 0.3, 1.0);

var constantAttenuation = 1.0;
var linearAttenuation = 0.01;
var quadraticAttenuation = 0.001;

// 골든 리트리버 색 https://encycolorpedia.kr/f1af09
var materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 10.0;

var color1 = vec4(0.9608, 0.9608, 0.8627, 1.0); // 사료 그릇 색상
var color2 = vec4(0.9451, 0.6863, 0.0353, 1.0); // 강아지 색상
var color3 = vec4(0.2165, 0.189, 0.1969, 1.0);

var torsoId = 0;
var torsoId2 = 14;
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
var leftUpperLegId2 = 15;
//var torsoId = 14;

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

var bowlHeight = 1.4;
var bowlWidth = 3;
var feedHeight = 0.4;
var feedWidth = 0.4;

var numNodes = 6;
var numAngles = 11;
var numNodes2 = 16;

//var theta = [30, 170, 180, 0, 180, 0, 180, 0, 180, 0, 0];
var theta = [225, 0, 0, 0, 0, 0, 0, 0, 0, 0, -90, 0, 0, 0, 0, 0, 0];

var initialHeadAngle = theta[head2Id];
var initialTorsoAngle = theta[torsoId];
var initialTorsoAngle2 = theta[torsoId2];

var stack = [];
var stack2 = [];
var figure = [];
var figure2 = [];

var torsoX = 0,
  torsoY = 0,
  torsoZ = 0,
  torsoX2 = 0,
  torsoY2 = 0,
  torsoZ2 = 0,
  torsota = 0,
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

for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);
for (var i = 0; i < numNodes2; i++)
  figure2[i] = createNode(null, null, null, null);

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

function calculateDistance(x1, y1, z1, x2, y2, z2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
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
  var m = mat4();
  switch (Id) {
    case torsoId:
      figure[torsoId] = createNode(m, bowl, headId, null);
      break;

    case headId:
      m = translate(-0.5 * bowlWidth, 0.5 * bowlHeight, 0.9 * bowlWidth);
      figure [headId] = createNode(m, feed, null, leftUpperArmId);
      break;

    case leftUpperArmId:
      m = translate(-1, 0, 1.0);
      figure[leftUpperArmId] = createNode(m, feed, leftLowerArmId, null);
      break;

    case leftLowerArmId:
      m = translate(-0.4, 0, 1.5);
      figure[leftLowerArmId] = createNode(m, feed, rightUpperArmId, null);
      break;

    case rightUpperArmId:
      m = translate(-1.2, 0, 1.0);
      figure[rightUpperArmId] = createNode(m, feed, rightLowerArmId, null);
      break;

    case rightLowerArmId:
      m = translate(-0.8, 0, 1.7);
      figure[rightLowerArmId] = createNode(m, feed, null, null);
      break;
  }
}

function initNodes2(Id) {
  var m2 = mat4();

  switch (Id) {
    case torsoId:
    case torsoId2:
      m2 = rotate(theta[torsoId], 0, 1, 0);
      m2 = mult(m2, rotate(torsoR, 1, 0, 0));
      m2 = mult(m2, rotate(torsoR2, 0, 0, 1));
      m2 = mult(m2, rotate(theta[torsoId2], 1, 0, 0));
      m2 = mult(m2, translate(torsoX2, torsoY2, torsoZ2));
      figure2[torsoId] = createNode(m2, torso2, null, headId);

      break;

    case headId:
    case head1Id:
    case head2Id:
      m2 = translate(0.5 * torsoWidth, 0.9 * torsoHeight, -1);
      m2 = mult(m2, rotate(theta[head1Id], 0, 0, 1));
      m2 = mult(m2, rotate(theta[head2Id], 0, 1, 0));

      figure2[headId] = createNode(m2, head2, leftUpperArmId, leftEarId);
      break;

    case leftEarId:
      m2 = translate(0, headHeight, 0.5 * headWidth);
      figure2[leftEarId] = createNode(m2, leftear, rightEarId, null);
      break;

    case rightEarId:
      m2 = translate(1.2 * headWidth, headHeight, 0.5 * headWidth);
      figure2[rightEarId] = createNode(m2, rightear, null, null);
      break;

    case leftUpperArmId:
      m2 = translate(0.5 * torsoWidth, 0.0, -0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[leftUpperArmId], 0, 0, 1)); // Rotate around Z-axis
      figure2[leftUpperArmId] = createNode(
        m2,
        leftUpperArm2,
        rightUpperArmId,
        leftLowerArmId
      );
      break;

    case rightUpperArmId:
      m2 = translate(0.5 * torsoWidth, 0.0, 0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[rightUpperArmId], 0, 0, 1)); // Rotate around Z-axis
      figure2[rightUpperArmId] = createNode(
        m2,
        rightUpperArm2,
        leftUpperLegId,
        rightLowerArmId
      );
      break;

    case leftUpperLegId:
      case leftUpperLegId2:
      m2 = translate(-0.5 * torsoWidth, 0.0, -0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[leftUpperLegId], 0, 0, 1)); // Z축 회전
      m2 = mult(m2, rotate(theta[leftUpperLegId2], 1, 0, 0)); // Y축 회전
      figure2[leftUpperLegId] = createNode(
        m2,
        leftUpperLeg2,
        rightUpperLegId,
        leftLowerLegId
      );
      break;

    case rightUpperLegId:
      m2 = translate(-0.5 * torsoWidth, 0.0, 0.5 * torsoWidth);
      m2 = mult(m2, rotate(theta[rightUpperLegId], 0, 0, 1)); // Rotate around Z-axis
      figure2[rightUpperLegId] = createNode(
        m2,
        rightUpperLeg2,
        tailId,
        rightLowerLegId
      );
      break;

    case leftLowerArmId:
      m2 = translate(0.0, -upperArmHeight, 0.0);
      m2 = mult(m2, rotate(theta[leftLowerArmId], 0, 0, 1));
      figure2[leftLowerArmId] = createNode(m2, leftLowerArm2, null, null);
      break;

    case rightLowerArmId:
      m2 = translate(0.0, -upperArmHeight, 0.0);
      m2 = mult(m2, rotate(theta[rightLowerArmId], 0, 0, 1));
      figure2[rightLowerArmId] = createNode(m2, rightLowerArm2, null, null);
      break;

    case leftLowerLegId:
      m2 = translate(0.0, -upperLegHeight, 0.0);
      m2 = mult(m2, rotate(theta[leftLowerLegId], 0, 0, 1));
      figure2[leftLowerLegId] = createNode(m2, leftLowerLeg2, null, null);
      break;

    case rightLowerLegId:
      m2 = translate(0.0, -upperLegHeight, 0.0);
      m2 = mult(m2, rotate(theta[rightLowerLegId], 0, 0, 1));
      figure2[rightLowerLegId] = createNode(m2, rightLowerLeg2, null, null);
      break;

    case tailId:
      m2 = translate(-(torsoWidth / 1.75), 0.5 * torsoHeight, 0);
      m2 = mult(m2, rotate(theta[tailId], 1, 0, 0));
      m2 = mult(m2, rotate(tailta, 0, 0, 1));
      figure2[tailId] = createNode(m2, tail, null, null);
      break;
  }
}

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function traverse2(Id) {
  if (Id == null) return;
  stack2.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure2[Id].transform);
  figure2[Id].render();
  if (figure2[Id].child != null) traverse2(figure2[Id].child);
  modelViewMatrix = stack2.pop();
  if (figure2[Id].sibling != null) traverse2(figure2[Id].sibling);
}

function bowl() {
  instanceMatrix = mult(modelViewMatrix, translate(-10.0, 0.0, 10.0));
  instanceMatrix = mult(instanceMatrix, rotate(45, 0, 1, 0));
  instanceMatrix = mult(instanceMatrix, rotate(5, 5, 0, 1));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(bowlWidth, bowlHeight, bowlWidth)
  );

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color1));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function feed() {
  instanceMatrix = mult(
    modelViewMatrix,
    // instanceMatrix = mult(modelViewMatrix, translate(-10.0, 0.0, 10.0));
    translate(-20.0 * feedWidth, 0.5 * feedHeight, 16.0 * feedWidth)
  );
  instanceMatrix = mult(instanceMatrix, rotate(45, 0, 1, 0));
  instanceMatrix = mult(instanceMatrix, rotate(5, 5, 0, 1));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(feedWidth, feedHeight, feedWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color3));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
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

  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth, torsoHeight, torsoWidth)
  );

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
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
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightear() {
  instanceMatrix = mult(modelViewMatrix, translate(-0.5 * earWidth, 0, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), flatten(color2));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function drawGround() {
  instanceMatrix = mat4();
  instanceMatrix = mult(instanceMatrix, translate(0.0, -3000.5, -100.0)); // Y 위치 조정
  instanceMatrix = mult(instanceMatrix, scale4(20000.0, 6000, 1.0)); // 크기 조정

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(
    gl.getUniformLocation(program, "uColor"),
    flatten(vec4(0.4157, 0.5216, 0.0941, 1.0))
  ); // 땅의 색상 (초록색)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // 단일 평면 그리기
}

function drawSky() {
  instanceMatrix = mat4();
  instanceMatrix = mult(instanceMatrix, translate(0.0, 600.0, -150.0)); // 위치 조정
  instanceMatrix = mult(instanceMatrix, scale4(20000.0, 6000.0, 1.0)); // 크기 조정
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  gl.uniform4fv(
    gl.getUniformLocation(program, "uColor"),
    flatten(vec4(0.698, 0.7686, 0.9314, 0.8))
  ); // 하늘의 색상 (파란색)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // 단일 평면 그리기
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

  // Setup the perspective projection
  var fov = 45; // degrees
  var aspect = canvas.width / canvas.height; // aspect ratio
  var near = 0.1; // near clipping plane
  var far = 200.0; // far clipping plane  단위

  projectionMatrix = perspective(fov, aspect, near, far);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  modelViewMatrix = lookAt(eye, at, up);

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

  function motionCapturePlay(motionCaptureData) {
    console.log("Playing captured motion");
    capturedMotion = motionCaptureData[0];
    capturedMove = motionCaptureData[1];

    let index = 0;
    const interval = setInterval(() => {
      if (index < capturedMove.length) {
        // motionCaptureData에 저장된 위치 데이터를 가져와 modelViewMatrix 업데이트
        torsoX2 = capturedMove[index][0];
        torsoY2 = capturedMove[index][1];
        torsoZ2 = capturedMove[index][2];
        theta = capturedMotion[index];
        // modelViewMatrix 업데이트
        m2 = mat4();
        m2 = translate(torsoX2, torsoY2, torsoZ2);
        m2 = mult(m2, rotate(theta[torsoId], 0, 1, 0)); // 회전
        modelViewMatrix = m2;
        // 모든 노드를 초기화하여 새로운 위치 반영
        for (let i = 0; i < numNodes; i++) {
          initNodes(i);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10); // 10ms
  }

  document.getElementById("playWithMeMotionData").onclick = function () {
    motionCapturePlay(playWithMeMotionData);
  };

  document.getElementById("playWithMeHardMotionData").onclick = function () {
    motionCapturePlay(playWithMeHardMotionData);
  };

  document.getElementById("dontEatMotionData").onclick = function () {
    motionCapturePlay(dontEatMotionData);
  };

  document.getElementById("eatMotionData").onclick = function () {
    motionCapturePlay(eatMotionData);
  };

  document.getElementById("peeMotionData").onclick = function () {
    motionCapturePlay(peeMotionData);
  };

  document.getElementById("walkAwayMotionData").onclick = function () {
    motionCapturePlay(walkAwayMotionData);
  };

  document.getElementById("runAwayMotionData").onclick = function () {
    motionCapturePlay(runAwayMotionData);
  };

  document.getElementById("giveHandMotionData").onclick = function () {
    motionCapturePlay(giveHandMotionData);
  }

  document.getElementById("didYouCallMeMotionData").onclick = function () {
    motionCapturePlay(didYouCallMeMotionData);
  }

  function resetLieDownVariables() {
    // 관련 변수 초기화
    accumulatedAngle = 0;
    torsoHeight = 0;
    legLiftDirection = 1;
  }

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
  
  var constantAttenuation = 1.0;
  var linearAttenuation = 0.01;
  var quadraticAttenuation = 0.001;

  var d = calculateDistance(
    lightPosition[0],
    lightPosition[1],
    lightPosition[2],
    torsoX2,
    torsoY2,
    torsoZ2
  ); // Assume fragPosition is the fragment's world position
  var attenuation =
    1.0 /
    (constantAttenuation +
      linearAttenuation * d +
      quadraticAttenuation * d * d);

  gl.uniform1f(gl.getUniformLocation(program, "attenuation"), attenuation);

  render();
};
var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  modelViewMatrix = translate(-3.0, -1.2, 5.6);

  drawGround();
  drawSky();
  
  for (i = 0; i < numNodes; i++) initNodes(i);
  for (i = 0; i < numNodes2; i++) initNodes2(i);
  modelViewMatrix = lookAt(eye, at, up);
  traverse(torsoId);
  traverse2(torsoId);
  requestAnimFrame(render);
};

