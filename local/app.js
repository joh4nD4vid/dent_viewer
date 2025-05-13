'use strict';

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GlobalInstances } from './globalManager.js';
import { camera_func, dents_position, tete_position } from './camera.js';







// URL ---------------------------------------------------------
// Récupère les paramètres de l'URL
const url = "https://joh4nd4vid.github.io/dent_viewer/public/";
const urlParams = new URLSearchParams(window.location.search);


// Paramètre appelé "model"
const model = urlParams.get('model');


// Empêche les injections JS
function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}


const sanitizedModel = model ? sanitize(model) : null;





// Fichier STL ------------------------------------------------
if (sanitizedModel) {


  // Chagement du modèle STL
    const loader = new STLLoader();

    loader.load(url + "stl/" + sanitizedModel + '.stl', (geometry) => {

      const material = new THREE.MeshPhongMaterial({ 
        color: 0xEEEEEE, 
        specular: 0x111111, 
        shininess: 500 
      });

      const mesh = new THREE.Mesh(geometry, material);


  // Positionnement, taille et rotation du modèle
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.PI;
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.position.y = 6.6;
    mesh.position.z = 12.2;



  // Plan de coupe du modèle (cacher le socle inférieur)
    const plane_Y = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    plane_Y.constant = -8.35;
    material.clippingPlanes = [plane_Y];


  // Ajout à la scène 3D
    GlobalInstances.scene.add(mesh);


  }, undefined, (error) => {
    console.error('Il y a eu une erreur avec le chargement du fichier STL.', error);
  });


}




// Gère le chargement du fichier 3D visage
  function loadOBJModel(filePath, material ) {


    const loader = new OBJLoader();
    
    loader.load(

      filePath,

      (object) => {

        object.traverse((child) => {
          if (child.isMesh) {

            // Applique le matériau à tous les enfants du modèle 3D
              child.material = material;
          }
        });
        
        // Positionnement 
          object.scale.set(100, 100, 100);
          object.position.set(0,-150,0);
        
        // Ajout à la scène 3D
          GlobalInstances.scene.add(object);
        
      },

      undefined,

      // Gestion des erreurs
        (error) => {
          console.error('Erreur avec le chargement du fichier OBJ', error);
        }

    );
  }



  let head_material = new THREE.MeshPhongMaterial({

      color: 0xFBD4C5,
      specular: 0x111111,
      shininess: 0,
      opacity : 1,
      transparent : true

  });


  loadOBJModel(url + "obj" + "/head.obj", head_material);






function init() {


  // Initialisation de la scène 3D
    const canvas = document.querySelector('#canvas');

    GlobalInstances.renderer = new THREE.WebGLRenderer({ 
      canvas : canvas, 
      antialias : true
    });

    GlobalInstances.renderer.localClippingEnabled = true;
    GlobalInstances.scene = new THREE.Scene();

    GlobalInstances.renderer.setClearColor(0xf0f0f0);
    GlobalInstances.renderer.setPixelRatio( window.devicePixelRatio );
    GlobalInstances.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( GlobalInstances.renderer.domElement );
    window.addEventListener('resize', onWindowResize, false);


  // Camera.
    const fov = 20;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    GlobalInstances.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


  // Contrôles de la caméra
    GlobalInstances.controls = new OrbitControls(GlobalInstances.camera, GlobalInstances.renderer.domElement);
    GlobalInstances.controls.enablePan = true;
    GlobalInstances.controls.enableKeys = false;
    GlobalInstances.controls.enableDamping = true;
    GlobalInstances.controls.update();
    GlobalInstances.camera.controls = GlobalInstances.controls;
    GlobalInstances.camera.position.set(101,21, 45);
    GlobalInstances.controls.target.set(0.97, 12.8, 3.5);
  

  // Lumières
    const light = new THREE.DirectionalLight(0xffffff, 3.0);
    const light_2 = new THREE.DirectionalLight(0xffffff, 3.0);

    light.position.set(0, 5, 4);
    light_2.position.set(0, -2, -4);
    GlobalInstances.scene.add(light);
    GlobalInstances.scene.add(light_2);


  // Evènements liés aux boutons
    buttons_events();
    sliders_checkbox();


}





// Gestion des boutons
  function buttons_events() {

      const bouton_tete = document.querySelector('#centrer_tete');
      const bouton_dents = document.querySelector('#centrer_dents');
      
      bouton_tete.addEventListener('click', e=>{
          camera_func.move( tete_position.position, tete_position.target );
      });
      
      bouton_dents.addEventListener('click', e=>{
          camera_func.move( dents_position.position, dents_position.target );
      });

  }




  // Sliders et checkbox
    function sliders_checkbox () {


    let sliders = {
        "Opacité tête" : 1,
        "Afficher / Cacher la tête" : true,
        "Afficher / Cacher les dents" : true
      };
    
    
    
      const gui = new dat.GUI();
    
    
      gui.add( sliders, "Opacité tête", 0, 1, 0.1 ).onChange( (value) => {
    
          head_material.opacity = value; 
          GlobalInstances.renderer.render(GlobalInstances.scene, GlobalInstances.camera);
    
      });
    
    
    
      gui.add( sliders, "Afficher / Cacher la tête" ).onChange( () => {
    
        GlobalInstances.scene.traverse((child) => {
    
          if (child.isMesh && child.material === head_material) {
            child.visible = !child.visible;
          }
    
        });
    
        GlobalInstances.renderer.render(GlobalInstances.scene, GlobalInstances.camera);
    
      });
    
    
    
      gui.add( sliders, "Afficher / Cacher les dents" ).onChange( () => {
    
        GlobalInstances.scene.traverse((child) => {
    
          if (child.isMesh && child.material !== head_material) {
            child.visible = !child.visible;
          }
    
        });
    
        GlobalInstances.renderer.render(GlobalInstances.scene, GlobalInstances.camera);
    
      });

  }




// Boucle de rendu 
// - - - - - - - - - - - - - - - - - - - - - - - - - - 

  function animate() {

    requestAnimationFrame( animate );
    render();

    // Mise à jour de controls caméra
      GlobalInstances.controls.update();

  }


  function render() {
    GlobalInstances.renderer.render( GlobalInstances.scene, GlobalInstances.camera );
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - 





// Redimensionne la caméra quand la fenêtre change de taille
  function onWindowResize() {

    GlobalInstances.camera.aspect = window.innerWidth / window.innerHeight;
    GlobalInstances.camera.updateProjectionMatrix();
    GlobalInstances.renderer.setSize( window.innerWidth, window.innerHeight );

  }


  

// Lancement de l'application
  init();
  animate();