'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'dat.gui';


let vertexShader = null;
let fragmentShader = null;
let material = null;
let time = 0.0;

let speed = {
  value : 1.0
};

// Variables GUI
const gui = new dat.GUI();
gui.add(speed, 'value', 0, 2, 0.1);


// Shader uniforms 
let uniforms = {

  u_time : {
      type : 'f',
      value : time
  },

  u_resolution : {
    type : "v2",
    value : new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(window.devicePixelRatio)
  },

  u_speed : {
    type : "f",
    value : speed
  }

};



// Chargement dynamique des shaders
let request_vertex = new XMLHttpRequest();
let request_fragment = new XMLHttpRequest();

// On les récupère sous forme de texte, à la bonne adresse
request_vertex.open('GET', 'shaders/vertex_shader.glsl', true);
request_vertex.responseType = 'text';

request_fragment.open('GET', 'shaders/fragment_shader.glsl', true);
request_fragment.responseType = 'text';


// Chaque chargement effectué appelle la fonction correspondante
request_vertex.onload = () => {

    if ( request_vertex.readyState === request_vertex.DONE && request_vertex.status === 200 ){
        vertexDone( request_vertex.responseText );
    }
}

request_fragment.onload = () => {
    if ( request_fragment.readyState === request_fragment.DONE && request_fragment.status === 200 ){
        fragmentDone( request_fragment.responseText );
    }
}

request_vertex.send(null);
request_fragment.send(null);


// Ces fonctions vérifient si l'autre shader est chargé.
// Si c'est le cas, on appelle shadersDone()
function vertexDone( text ) {
    vertexShader = text;
    if (fragmentShader !== null) {
        shadersDone();
    }
}

function fragmentDone( text ) {
    fragmentShader = text;
    if (vertexShader !== null) {
        shadersDone();
    }
}

// On peut créer notre matériau et ursuivre.
function shadersDone() {

    // Create the shader material
    material = new THREE.MeshLambertMaterial({ color : 0xFFFF00 });


    material = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : vertexShader,
        fragmentShader : fragmentShader
    });

    // start scene
    init();
    animate();


}






var camera, scene, renderer, light, monCube, stats;
var controls;


function init() {

  // Scene
  const canvas = document.querySelector('#canvas');

  renderer = new THREE.WebGLRenderer({ 
    canvas : canvas, 
    antialias : true
  });

  scene = new THREE.Scene();

  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener('resize', onWindowResize, false);



  // Camera.
  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 2000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 30;


  // Orbit controls.
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableKeys = false;
  controls.update();
  camera.controls = controls;

  
  //Stats
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // Cube
  var geometry = new THREE.BoxGeometry( 5, 5, 5 );
  monCube = new THREE.Mesh(geometry, material );
  scene.add(monCube);

  // Lights.
  light = new THREE.DirectionalLight(0xffffff, 3.0);
  light.position.set(0, 11, 0);
  scene.add(light);

}


// Un autre exemple : avec une boucle de rendu
function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  time++;

  monCube.rotation.x += (0.03 * speed.value );
  monCube.rotation.y += (0.05 * speed.value );
  monCube.rotation.z += (0.07 * speed.value );

  stats.update();
  renderer.render( scene, camera );
}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

