
			var container;

			var camera, scene, renderer;

			var spheres = [];

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			document.addEventListener( 'mousemove', onDocumentMouseMove, false );

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
				camera.position.z = 3200;

				scene = new THREE.Scene();
				scene.background = new THREE.CubeTextureLoader()
					.setPath( 'cube/' )
					.load( [ 'nx.jpg', 'nx.jpg', 'nx.jpg', 'nx.jpg', 'nx.jpg', 'nx.jpg' ] );

                var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
                
                loadModels()

    function loadModels() {

        const loader = new THREE.GLTFLoader();
      
        // A reusable function to set up the models. We're passing in a position parameter
        // so that they can be individually placed around the scene
        const onLoad = ( gltf, position ) => {
      
          const model = gltf.scene.children[ 0 ];
          console.log(model)
          model.position.copy( position );
      
          //scene.add( model );
          //createScene(model,cubeMaterial3 )

          return model
      
        }
        
    
        const onProgress = () => {};

        const onError = ( errorMessage ) => { console.log( errorMessage ); };
      
        const bull = new THREE.Vector3( 0, 0, 0 );
        loader.load( 'bull.glb', gltf => onLoad( gltf, bull ), onProgress, onError );
    }           



				var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: scene.background, refractionRatio: 0.95 } );
				material.envMap.mapping = THREE.CubeRefractionMapping;

				for ( var i = 0; i < 15; i ++ ) {

					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.x = Math.random() * 10 - 5;
					mesh.position.y = Math.random() * 10 - 5;
					mesh.position.z = Math.random() * 10 - 5;

					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 10 + 10;

					scene.add( mesh );

					spheres.push( mesh );

				}

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

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

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) * 10;
				mouseY = ( event.clientY - windowHalfY ) * 10;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var timer = 0.0005 * Date.now();

				for ( var i = 0, il = spheres.length; i < il; i ++ ) {

					var sphere = spheres[ i ];

					sphere.position.x = 5000 * Math.cos( timer + i );
					sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

				}

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}

