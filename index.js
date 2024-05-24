"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc; // test

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

// Root (루트 노드)
var RootId = 0;
var RootHeight = 1.0;
var RootWidth = 1.0;

// Left Clavicle (왼쪽 쇄골)
var LClavId = 1;
var LClavHeight = 0.3;
var LClavWidth = 0.3;

// Left Scapula Joint (왼쪽 견갑골 조인트)
var LScapulaJointId = 2;
var LScapulaJointHeight = 0.3;
var LScapulaJointWidth = 0.3;

// Left Shoulder Joint (왼쪽 어깨 조인트)
var LShoulderJointId = 3;
var LShoulderJointHeight = 0.4;
var LShoulderJointWidth = 0.4;

// Left Elbow Joint (왼쪽 팔꿈치 조인트)
var LElbowJointId = 4;
var LElbowJointHeight = 0.35;
var LElbowJointWidth = 0.35;

// Left Wrist Joint (왼쪽 손목 조인트)
var LWristJointId = 5;
var LWristJointHeight = 0.25;
var LWristJointWidth = 0.25;

// Left Paw Joint (왼쪽 손바닥 조인트)
var LPawJointId = 6;
var LPawJointHeight = 0.2;
var LPawJointWidth = 0.2;

// Right Clavicle (오른쪽 쇄골)
var RClavId = 7;
var RClavHeight = 0.3;
var RClavWidth = 0.3;

// Right Scapula Joint (오른쪽 견갑골 조인트)
var RScapulaJointId = 8;
var RScapulaJointHeight = 0.3;
var RScapulaJointWidth = 0.3;

// Right Shoulder Joint (NewBone_3)
var RShoulderJointId = 9;
var RShoulderJointHeight = 0.4;
var RShoulderJointWidth = 0.4;

// Right Elbow Joint (오른쪽 팔꿈치 조인트)
var RElbowJointId = 10;
var RElbowJointHeight = 0.35;
var RElbowJointWidth = 0.35;

// Right Wrist Joint (오른쪽 손목 조인트)
var RWristJointId = 11;
var RWristJointHeight = 0.25;
var RWristJointWidth = 0.25;

// Right Paw Joint (오른쪽 손바닥 조인트)
var RPawJointId = 12;
var RPawJointHeight = 0.2;
var RPawJointWidth = 0.2;

// Root to Spine Dummy (루트에서 척추 더미로)
var RootSpineDummyId = 13;
var RootSpineDummyHeight = 0.5;
var RootSpineDummyWidth = 0.5;

// Spine 1
var Spine1Id = 14;
var Spine1Height = 0.6;
var Spine1Width = 0.5;

// Spine 2
var Spine2Id = 15;
var Spine2Height = 0.7;
var Spine2Width = 0.5;

// Spine 3
var Spine3Id = 16;
var Spine3Height = 0.8;
var Spine3Width = 0.5;

// Pelvis Root
var PelvisRootId = 17;
var PelvisRootHeight = 0.4;
var PelvisRootWidth = 0.5;

// Left Pelvis
var LPelvisId = 18;
var LPelvisHeight = 0.4;
var LPelvisWidth = 0.4;

// Left Femur Joint
var LFemurJointId = 19;
var LFemurJointHeight = 0.45;
var LFemurJointWidth = 0.45;

// Left Tibia Joint
var LTibiaJointId = 20;
var LTibiaJointHeight = 0.5;
var LTibiaJointWidth = 0.5;

// Left Ankle Joint
var LAnkleJointId = 21;
var LAnkleJointHeight = 0.3;
var LAnkleJointWidth = 0.3;

// Left Foot Joint
var LFootJointId = 22;
var LFootJointHeight = 0.25;
var LFootJointWidth = 0.25;

// Right Pelvis
var RPelvisId = 23;
var RPelvisHeight = 0.4;
var RPelvisWidth = 0.4;

// Right Femur Joint
var RFemurJointId = 24;
var RFemurJointHeight = 0.45;
var RFemurJointWidth = 0.45;

// Right Tibia Joint
var RTibiaJointId = 25;
var RTibiaJointHeight = 0.5;
var RTibiaJointWidth = 0.5;

// Right Ankle Joint
var RAnkleJointId = 26;
var RAnkleJointHeight = 0.3;
var RAnkleJointWidth = 0.3;

// Right Foot Joint
var RFootJointId = 27;
var RFootJointHeight = 0.25;
var RFootJointWidth = 0.25;

// Root to Neck
var RootNeckId = 28;
var RootNeckHeight = 0.4;
var RootNeckWidth = 0.4;

// Neck 1
var Neck1Id = 29;
var Neck1Height = 0.3;
var Neck1Width = 0.3;

// Neck 2
var Neck2Id = 30;
var Neck2Height = 0.35;
var Neck2Width = 0.35;

// Head
var HeadId = 31;
var HeadHeight = 0.4;
var HeadWidth = 0.4;

// Right Clavicle 1
var RClav1Id = 32;
var RClav1Height = 0.3;
var RClav1Width = 0.3;

var numNodes = 32; // 10;
var numAngles = 33; // 11;
var angle = 0;

var theta = [
    0,   // Root: 루트 회전 없음
    0,   // L_Clavicle: 왼쪽 쇄골
    0,   // L_Scapula: 왼쪽 견갑
    30,  // L_Shoulder: 왼쪽 어깨 약간 들기
    30,  // L_Elbow: 왼쪽 팔꿈치 살짝 구부리기
    10,  // L_Wrist: 왼쪽 손목
    0,   // L_Paw: 왼쪽 손
    0,   // R_Clavicle: 오른쪽 쇄골
    0,   // R_Scapula: 오른쪽 견갑
    30,  // R_Shoulder: 오른쪽 어깨 약간 들기
    30,  // R_Elbow: 오른쪽 팔꿈치 살짝 구부리기
    10,  // R_Wrist: 오른쪽 손목
    0,   // R_Paw: 오른쪽 손
    0,   // Root_To_Spine: 척추 더미
    -10, // Spine1: 첫 번째 척추 약간 구부리기
    -20, // Spine2: 두 번째 척추 더 구부리기
    -10, // Spine3: 세 번째 척추 조금 구부리기
    0,   // Pelvis_Root: 골반 루트
    0,   // L_Pelvis: 왼쪽 골반
    20,  // L_Femur: 왼쪽 대퇴골 약간 들기
    -30, // L_Tibia: 왼쪽 경골 구부리기
    20,  // L_Ankle: 왼쪽 발목
    0,   // L_Foot: 왼쪽 발
    0,   // R_Pelvis: 오른쪽 골반
    20,  // R_Femur: 오른쪽 대퇴골 약간 들기
    -30, // R_Tibia: 오른쪽 경골 구부리기
    20,  // R_Ankle: 오른쪽 발목
    0,   // R_Foot: 오른쪽 발
    10,  // Neck1: 목 약간 들기
    20,  // Neck2: 목 더 들기
    0,   // Head: 머리는 직선 유지
    0,   // R_Clavicle_1 (End Site)
  ];
  
var numVertices = 24;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

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
    var m = mat4();
  
    switch (Id) {
      case RootId:
        m = rotate(theta[RootId], 0, 1, 0);
        figure[RootId] = createNode(m, drawRoot, null, LClavId);
        break;
  
      case LClavId:
        m = translate(0.0, RootHeight, 0.0);
        m = mult(m, rotate(theta[LClavId], 0, 0, 1));
        figure[LClavId] = createNode(m, drawLClav, RClavId, LScapulaJointId);
        break;
  
      case LScapulaJointId:
        m = translate(4.0, 0.0, 0.0);
        m = mult(m, rotate(theta[LScapulaJointId], 0, 0, 1));
        figure[LScapulaJointId] = createNode(m, drawLScapulaJoint, null, LShoulderJointId);
        break;
  
      case LShoulderJointId:
        m = translate(4.00268, -11.084213, 10.770061);
        m = mult(m, rotate(theta[LShoulderJointId], 0, 0, 1));
        figure[LShoulderJointId] = createNode(m, drawLShoulderJoint, null, LElbowJointId);
        break;
  
      case LElbowJointId:
        m = translate(2.147804, -15.16102, -8.035202);
        m = mult(m, rotate(theta[LElbowJointId], 0, 0, 1));
        figure[LElbowJointId] = createNode(m, drawLElbowJoint, null, LWristJointId);
        break;
  
      case LWristJointId:
        m = translate(-2.240269, -20.029085, -9.040068);
        m = mult(m, rotate(theta[LWristJointId], 0, 0, 1));
        figure[LWristJointId] = createNode(m, drawLWristJoint, null, LPawJointId);
        break;
  
      case LPawJointId:
        m = translate(0.706234, -5.721245, 1.83493);
        m = mult(m, rotate(theta[LPawJointId], 0, 0, 1));
        figure[LPawJointId] = createNode(m, drawLPawJoint, null, null);
        break;
  
      case RClavId:
        m = translate(0.0, RootHeight, 0.0);
        m = mult(m, rotate(theta[RClavId], 0, 0, -1));
        figure[RClavId] = createNode(m, drawRClav, RootSpineDummyId, RScapulaJointId);
        break;
  
      case RScapulaJointId:
        m = translate(-4.0, 0.0, 0.0);
        m = mult(m, rotate(theta[RScapulaJointId], 0, 0, -1));
        figure[RScapulaJointId] = createNode(m, drawRScapulaJoint, null, RShoulderJointId);
        break;
  
      case RShoulderJointId:
        m = translate(-4.614829, -11.686035, 9.889533);
        m = mult(m, rotate(theta[RShoulderJointId], 0, 0, -1));
        figure[RShoulderJointId] = createNode(m, drawRShoulderJoint, null, RElbowJointId);
        break;
  
      case RElbowJointId:
        m = translate(-0.160743, -16.404388, -5.491836);
        m = mult(m, rotate(theta[RElbowJointId], 0, 0, -1));
        figure[RElbowJointId] = createNode(m, drawRElbowJoint, null, RWristJointId);
        break;
  
      case RWristJointId:
        m = translate(2.412016, -21.93568, 1.190901);
        m = mult(m, rotate(theta[RWristJointId], 0, 0, -1));
        figure[RWristJointId] = createNode(m, drawRWristJoint, null, RPawJointId);
        break;
  
      case RPawJointId:
        m = translate(-0.535018, -3.351765, 3.806499);
        m = mult(m, rotate(theta[RPawJointId], 0, 0, -1));
        figure[RPawJointId] = createNode(m, drawRPawJoint, null, null);
        break;
  
      case RootSpineDummyId:
        m = translate(0.0, 0.0, 0.0);
        m = mult(m, rotate(theta[RootSpineDummyId], 0, 1, 0));
        figure[RootSpineDummyId] = createNode(m, drawRootSpineDummy, Spine1Id, null);
        break;
  
      case Spine1Id:
        m = translate(0.0, -0.0, -3.827275);
        m = mult(m, rotate(theta[Spine1Id], 0, 1, 0));
        figure[Spine1Id] = createNode(m, drawSpine1, Spine2Id, null);
        break;
  
      case Spine2Id:
        m = translate(0.000001, -0.000004, -16.93926);
        m = mult(m, rotate(theta[Spine2Id], 0, 1, 0));
        figure[Spine2Id] = createNode(m, drawSpine2, Spine3Id, null);
        break;
  
      case Spine3Id:
        m = translate(0.000002, -0.000004, -14.393892);
        m = mult(m, rotate(theta[Spine3Id], 0, 1, 0));
        figure[Spine3Id] = createNode(m, drawSpine3, PelvisRootId, null);
        break;
  
      case PelvisRootId:
        m = translate(0.000002, -0.000004, -14.39389);
        m = mult(m, rotate(theta[PelvisRootId], 0, 1, 0));
        figure[PelvisRootId] = createNode(m, drawPelvisRoot, LPelvisId, RPelvisId);
        break;
  
      case LPelvisId:
        m = translate(0.0, 0.0, 0.0);
        m = mult(m, rotate(theta[LPelvisId], 0, 1, 0));
        figure[LPelvisId] = createNode(m, drawLPelvis, LFemurJointId, null);
        break;
  
      case RPelvisId:
        m = translate(0.0, 0.0, 0.0);
        m = mult(m, rotate(theta[RPelvisId], 0, 1, 0));
        figure[RPelvisId] = createNode(m, drawRPelvis, RFemurJointId, null);
        break;
  
      case LFemurJointId:
        m = translate(8.31808, -6.780921, -6.728058);
        m = mult(m, rotate(theta[LFemurJointId], 0, 1, 0));
        figure[LFemurJointId] = createNode(m, drawLFemurJoint, LTibiaJointId, null);
        break;
  
      case RFemurJointId:
        m = translate(-8.082922, -7.104604, -6.553699);
        m = mult(m, rotate(theta[RFemurJointId], 0, 1, 0));
        figure[RFemurJointId] = createNode(m, drawRFemurJoint, RTibiaJointId, null);
        break;
  
      case LTibiaJointId:
        m = translate(4.762119, -18.232956, 12.109562);
        m = mult(m, rotate(theta[LTibiaJointId], 0, 1, 0));
        figure[LTibiaJointId] = createNode(m, drawLTibiaJoint, LAnkleJointId, null);
        break;
  
      case RTibiaJointId:
        m = translate(-3.034004, -18.950596, 11.551201);
        m = mult(m, rotate(theta[RTibiaJointId], 0, 1, 0));
        figure[RTibiaJointId] = createNode(m, drawRTibiaJoint, RAnkleJointId, null);
        break;
  
      case LAnkleJointId:
        m = translate(1.748854, -18.426315, -12.690487);
        m = mult(m, rotate(theta[LAnkleJointId], 0, 1, 0));
        figure[LAnkleJointId] = createNode(m, drawLAnkleJoint, LFootJointId, null);
        break;
  
      case RAnkleJointId:
        m = translate(0.163292, -19.936808, -10.210636);
        m = mult(m, rotate(theta[RAnkleJointId], 0, 1, 0));
        figure[RAnkleJointId] = createNode(m, drawRAnkleJoint, RFootJointId, null);
        break;
  
      case LFootJointId:
        m = translate(2.893215, -10.324425, 3.420891);
        m = mult(m, rotate(theta[LFootJointId], 0, 1, 0));
        figure[LFootJointId] = createNode(m, drawLFoot, null, null);
        break;
  
      case RFootJointId:
        m = translate(-0.79368, -9.967937, 0.101715);
        m = mult(m, rotate(theta[RFootJointId], 0, 1, 0));
        figure[RFootJointId] = createNode(m, drawRFoot, null, null);
        break;
  
      case Neck1Id:
        m = translate(0.0, 4.185544, 5.729186);
        m = mult(m, rotate(theta[Neck1Id], 0, 1, 0));
        figure[Neck1Id] = createNode(m, drawNeck1, Neck2Id, null);
        break;
  
      case Neck2Id:
        m = translate(2.125778, 5.862308, 7.100437);
        m = mult(m, rotate(theta[Neck2Id], 0, 1, 0));
        figure[Neck2Id] = createNode(m, drawNeck2, HeadId, null);
        break;
  
      case HeadId:
        m = translate(-4.381103, 5.689912, 1.80198);
        m = mult(m, rotate(theta[HeadId], 0, 1, 0));
        figure[HeadId] = createNode(m, drawHead, null, null);
        break;
    }
  }
  

function traverse(Id) {
  if (Id == null) return;
  stack.push(modelViewMatrix);
//   console.log(Id);
//   console.log(modelViewMatrix);
//   console.log(figure[Id].transform);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function drawRoot() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * RootHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RootWidth, RootHeight, RootWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function drawLClav() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LClavHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LClavWidth, LClavHeight, LClavWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLScapulaJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LScapulaJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LScapulaJointWidth, LScapulaJointHeight, LScapulaJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLShoulderJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LShoulderJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LShoulderJointWidth, LShoulderJointHeight, LShoulderJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLElbowJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LElbowJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LElbowJointWidth, LElbowJointHeight, LElbowJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLWristJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LWristJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LWristJointWidth, LWristJointHeight, LWristJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLPawJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LPawJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LPawJointWidth, LPawJointHeight, LPawJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRClav() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RClavHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RClavWidth, RClavHeight, RClavWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRScapulaJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RScapulaJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RScapulaJointWidth, RScapulaJointHeight, RScapulaJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRShoulderJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RShoulderJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RShoulderJointWidth, RShoulderJointHeight, RShoulderJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRElbowJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RElbowJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RElbowJointWidth, RElbowJointHeight, RElbowJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRWristJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RWristJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RWristJointWidth, RWristJointHeight, RWristJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRPawJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RPawJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RPawJointWidth, RPawJointHeight, RPawJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawSpine1() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * Spine1Height, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(Spine1Width, Spine1Height, Spine1Width)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawSpine2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * Spine2Height, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(Spine2Width, Spine2Height, Spine2Width)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawSpine3() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * Spine3Height, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(Spine3Width, Spine3Height, Spine3Width)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawPelvisRoot() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * PelvisRootHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(PelvisRootWidth, PelvisRootHeight, PelvisRootWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLPelvis() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LPelvisHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LPelvisWidth, LPelvisHeight, LPelvisWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRPelvis() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RPelvisHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RPelvisWidth, RPelvisHeight, RPelvisWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLFemurJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LFemurJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LFemurJointWidth, LFemurJointHeight, LFemurJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRFemurJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RFemurJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RFemurJointWidth, RFemurJointHeight, RFemurJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLTibiaJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LTibiaJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LTibiaJointWidth, LTibiaJointHeight, LTibiaJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRTibiaJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RTibiaJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RTibiaJointWidth, RTibiaJointHeight, RTibiaJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLAnkleJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LAnkleJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LAnkleJointWidth, LAnkleJointHeight, LAnkleJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRAnkleJoint() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RAnkleJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RAnkleJointWidth, RAnkleJointHeight, RAnkleJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawLFoot() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * LFootJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(LFootJointWidth, LFootJointHeight, LFootJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawRFoot() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * RFootJointHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(RFootJointWidth, RFootJointHeight, RFootJointWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawNeck1() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * Neck1Height, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(Neck1Width, Neck1Height, Neck1Width)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawNeck2() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * Neck2Height, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(Neck2Width, Neck2Height, Neck2Width)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function drawHead() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * HeadHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(HeadWidth, HeadHeight, HeadWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function drawRootSpineDummy() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * RootSpineDummyHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(RootSpineDummyWidth, RootSpineDummyHeight, RootSpineDummyWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function drawRootNeck() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * RootNeckHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(RootNeckWidth, RootNeckHeight, RootNeckWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  pointsArray.push(vertices[b]);
  pointsArray.push(vertices[c]);
  pointsArray.push(vertices[d]);
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
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  instanceMatrix = mat4();

  projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelViewMatrix)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  cube();

  vBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  document.getElementById("slider0").onchange = function (event) {
    theta[RootId] = event.target.value;
    initNodes(RootId);
  };

  for (i = 0; i < numNodes; i++) {
    initNodes(i);
  }
  render();
};

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT);
  traverse(RootId);
  requestAnimFrame(render);
};
