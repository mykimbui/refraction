import * as THREE from '../build/three.module.js';

			import Stats from './jsm/libs/stats.module.js';

			import { PLYLoader } from './jsm/loaders/PLYLoader.js';

			var container, stats;

			var camera, scene, renderer;

			var pointLight;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = - 4000;

				//

				var r = "cube/";

				var urls = [
					r + "px.jpg", r + "nx.jpg",
					r + "py.jpg", r + "ny.jpg",
					r + "pz.jpg", r + "nz.jpg"
				];

				var textureCube = new THREE.CubeTextureLoader().load( urls );
				textureCube.mapping = THREE.CubeRefractionMapping;

				scene = new THREE.Scene();
				scene.background = textureCube;

				// LIGHTS

				var ambient = new THREE.AmbientLight( 0xffffff );
				scene.add( ambient );

				pointLight = new THREE.PointLight( 0xffffff, 2 );
				scene.add( pointLight );

				// light representation

				var sphere = new THREE.SphereBufferGeometry( 100, 16, 8 );

				var mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
				mesh.scale.set( 0.05, 0.05, 0.05 );
				pointLight.add( mesh );

				// material samples

				var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0xccddff, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 } );
				//var cubeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } );
				//var cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
                loadModels();

				//var loader = new PLYLoader();
				//loader.load( 'models/ply/binary/Lucy100k.ply', function ( geometry ) {

				//	createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 );

                //} );
                

                function loadModels() {

                    const loader = new THREE.GLTFLoader();
                    const onLoad = ( gltf, position ) => {
                  
                      const model = gltf.scene.children[ 0 ];
                      model.position.copy( position );
                  
                      createScene(model,cubeMaterial3 )
                  
                    }
                    
                }
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function createScene( geometry, m1, m2, m3 ) {

				geometry.computeVertexNormals();

				var s = 1.5;

				var mesh = new THREE.Mesh( geometry, m1 );
				mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
				scene.add( mesh );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) * 4;
				mouseY = ( event.clientY - windowHalfY ) * 4;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				var timer = - 0.0002 * Date.now();

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				pointLight.position.x = 1500 * Math.cos( timer );
				pointLight.position.z = 1500 * Math.sin( timer );

				renderer.render( scene, camera );

			}
