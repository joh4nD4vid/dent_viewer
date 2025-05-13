import { gsap } from "gsap";
import { GlobalInstances } from './globalManager';



// Positions caméra 3D
// - - - - - - - - - - - - - - - - - - - - -

    export const dents_position = {

        'position' : [18, 20, 25], 
        'target' : [0, 8, 10]
        
    };

    export const tete_position = {

        'position' : [101, 21, 45], 
        'target' : [0, 13, 3.5]
        
    };

// - - - - - - - - - - - - - - - - - - - - -




export const camera_func = {


    move : ( newPosition, newTarget, callback ) => {


        callback = callback || null;
      
    
        gsap.to(GlobalInstances.camera.position, {
    
            x: newPosition[0],
            y: newPosition[1],
            z: newPosition[2],
            duration: 1,
            ease: "ease.inOut",
            onUpdate: function () {
                GlobalInstances.camera.updateProjectionMatrix();
            },
            onComplete() {
                if ( callback ) { callback(); }
            }
    
        });
    

        gsap.to(GlobalInstances.controls.target, {
    
            x: newTarget[0],
            y: newTarget[1],
            z: newTarget[2],
            duration: 1,
            ease: "ease.inOut",
            onUpdate: function () {
                GlobalInstances.controls.update();
            }
    
        });

        
    },


    fov : ( newFov ) => {

        gsap.to(GlobalInstances.camera, {
    
          fov : newFov,
          duration: 1,
          ease: "ease.inOut",
          onUpdate: function () {
              GlobalInstances.camera.updateProjectionMatrix();
          }
    
      });


    }


}
