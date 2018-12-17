import React, { Component } from 'react';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

class Terrain extends Component {
  state = {
    mouseX: null,
    mouseY: null,
  }

  async componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      15000
    )

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    this.scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    this.camera.add( pointLight );
    this.scene.add( this.camera );
    this.camera.position.y = 30;
    this.camera.position.z = 150;

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)


    this.THREE = THREE;
    const loader = new this.THREE.OBJLoader();

    // // load a resource
    const loaderASync = (url) => {
      return new Promise((res, rej) => {
        loader.load(
          url,
          ( object ) => {
            object.traverse((child) => {

              // if ( child.isMesh ) child.material.map = texture;
  
            } );
            this.terrain = object;
            this.scene.add( object )
            res()
          },
          function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
          },
          function ( error ) {
            console.log( 'An error happened' )
            rej(error)
          }
        )
      })

    }

    await loaderASync('terrain.obj')
    this.start()
 
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    const { mouseX, mouseY } = this.state;
    this.camera.position.x += ( mouseX - this.camera.position.x ) * .05;
    this.camera.position.y += ( - mouseY - this.camera.position.y ) * .05;

    this.camera.lookAt( this.scene.position );
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  onDocumentMouseMove = (event) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const mouseX = ( event.clientX - windowHalfX ) / 2;
    const mouseY = ( event.clientY - windowHalfY ) / 2;
    this.setState({ mouseX, mouseY });
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        onMouseMove={this.onDocumentMouseMove}
        style={{ width: '600px', height: '600px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
export default Terrain