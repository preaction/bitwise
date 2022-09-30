
import * as three from 'three';
import * as bitecs from 'bitecs';
import Scene from '../../Scene.ts';

export default class Render {
  scene:Scene;
  camera:three.OrthographicCamera;

  sceneCameras:three.OrthographicCamera[] = [];
  component:any;
  position:any;

  constructor( scene:Scene ) {
    this.scene = scene;

    this.position = scene.components[ "Position" ];
    if ( !this.position ) {
      throw "Position component required";
    }
    this.component = scene.components[ "OrthographicCamera" ];
    if ( !this.component ) {
      throw "OrthographicCamera component required";
    }

    this.query = bitecs.defineQuery([ this.position.store, this.component.store ]);
    this.enterQuery = bitecs.enterQuery( this.query );
    this.exitQuery = bitecs.exitQuery( this.query );

    scene.addEventListener( "resize", (e:Object) => {
      this.onResize(e);
    });
  }

  update( timeMilli:Number ) {
    // enteredQuery for cameraQuery: Create Camera and add to Scene
    const add = this.enterQuery(this.scene.world);
    for ( const eid of add ) {
      this.add( eid ); 
    }

    // exitedQuery for cameraQuery: Remove Camera from Scene
    const remove = this.exitQuery(this.scene.world);
    for ( const eid of remove ) {
      // XXX
    }

    // cameraQuery: Update camera properties and render if needed
    const update = this.query(this.scene.world);
    for ( const eid of update ) {
      // XXX: Object3d should be its own component somehow
      const camera = this.sceneCameras[eid];
      camera.position.x = this.position.store.x[eid];
      camera.position.y = this.position.store.y[eid];
      camera.position.z = this.position.store.z[eid];

      // Update wireframe width/height/depth
      // It's not the current game we want, we want the player game
      // size
      const { gameWidth, gameHeight } = this.scene.game.data;
      const ratio = gameWidth / gameHeight;

      const frustumSize = this.component.store.frustum[eid] || 20;
      const width = frustumSize * ratio;
      const height = frustumSize;
      const far = this.component.store.far[eid];
      const near = this.component.store.near[eid];
      const depth = far - near;
      console.log( `Wireframe scale ${width}, ${height}, ${depth} (ratio ${ratio})` );
      this.sceneCameras[eid].scale.set( width, height, depth );
    }
  }

  render() {
    if ( !this.camera ) {
      this.createCamera();
    }
    this.scene.game.renderer.render( this.scene._scene, this.camera );
  }

  frustumSize = 200;
  zoom = 1;

  createCamera() {
    console.log( `Creating editor camera` );
    const { width, height } = this.scene.game;
    const ratio = width / height;
    // Point a camera at 0, 0
    // Frustum size appears to work the same as zoom for an
    // orthographic camera, which makes sense
    const frustumSize = this.frustumSize;
    const far = 10;
    const near = 0;
    const camera = new three.OrthographicCamera(
      frustumSize * (ratio/-2),
      frustumSize * (ratio/2),
      frustumSize /2,
      frustumSize /-2,
      near, far,
    );
    camera.zoom = this.zoom;
    camera.updateProjectionMatrix();
    this.camera = camera;
    console.log( this.camera );
  }

  add( eid:Number ) {
    console.log( `Adding wireframe for camera ${eid}` );
    const { gameWidth, gameHeight } = this.scene.game.data;
    const ratio = gameWidth / gameHeight;

    const frustumSize = this.component.store.frustum[eid] || 20;
    const width = frustumSize * ratio;
    const height = frustumSize;
    const far = this.component.store.far[eid];
    const near = this.component.store.near[eid];
    const depth = far - near;

    const geometry = new three.BoxGeometry(1, 1, 1);
    const wireframe = new three.WireframeGeometry( geometry );
    const camera = new three.LineSegments( wireframe );
    camera.material.depthTest = false;
    camera.material.opacity = 0.25;
    camera.material.transparent = true;

    console.log( `Wireframe scale ${width}, ${height}, ${depth} (ratio ${ratio})` );
    camera.scale.set( width, height, depth );

    camera.position.x = this.position.store.x[eid];
    camera.position.y = this.position.store.y[eid];
    camera.position.z = this.position.store.z[eid];

    this.sceneCameras[eid] = camera;
    this.scene._scene.add( camera );
  }

  remove( eid:Number ) {
    this.scene._scene.remove( this.sceneCameras[eid] );
    this.sceneCameras[eid] = null;
  }

  onResize(e:{width:Number, height:Number}) {
    // Fix camera settings to maintain exact size/aspect
    const { width, height } = e;
    const ratio = width / height;
    const camera = this.camera;
    camera.left = this.frustumSize * (ratio/-2);
    camera.right = this.frustumSize * (ratio/2);
    camera.top = this.frustumSize / 2;
    camera.bottom = this.frustumSize / -2
    camera.updateProjectionMatrix();
    this.render();
    console.log( this.camera );
  }
}
