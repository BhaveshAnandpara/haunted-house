import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' //(use it after camera)
import { BufferAttribute, BufferGeometry, DirectionalLight, Mesh, MeshBasicMaterial, PCFSoftShadowMap, PointLight } from 'three'
import dat from 'dat.gui'


//Gui
const gui = new dat.GUI()




//Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog(0x262837 , 1, 15)
scene.fog = fog

//Textures

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcculsionTexture = textureLoader.load('textures/door/ambientOcculsion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')

const brickColorTexture = textureLoader.load('textures/bricks/color.jpg')
const brickAmbientOcculsionTexture = textureLoader.load('textures/bricks/ambientOcculsion.jpg')
const brickNormalTexture = textureLoader.load('textures/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcculsionTexture = textureLoader.load('textures/grass/ambientOcculsion.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')

//To repeat grass Texture ,  1 Grasss Texture is looking very big
grassColorTexture.repeat.set(8 , 8)
grassAmbientOcculsionTexture.repeat.set(8 , 8)
grassNormalTexture.repeat.set(8 , 8)
grassRoughnessTexture.repeat.set(8 , 8)

grassColorTexture.wrapS =  THREE.RepeatWrapping
grassAmbientOcculsionTexture.wrapS =  THREE.RepeatWrapping
grassNormalTexture.wrapS =  THREE.RepeatWrapping
grassRoughnessTexture.wrapS =  THREE.RepeatWrapping

grassColorTexture.wrapT =  THREE.RepeatWrapping
grassAmbientOcculsionTexture.wrapT =  THREE.RepeatWrapping
grassNormalTexture.wrapT= THREE.RepeatWrapping
grassRoughnessTexture.wrapT =  THREE.RepeatWrapping

//Mesh

const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4 , 2.5 ,4) ,
        new THREE.MeshStandardMaterial({
            map : brickColorTexture,
            aoMap : brickAmbientOcculsionTexture,
            normalMap : brickNormalTexture,
            roughnessMap : brickRoughnessTexture

        }) 
    )

walls.geometry.setAttribute(
        'uv2' ,
        new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)


walls.position.y = 2.5 / 2 //Height /2 



house.add(walls)


//Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5 , 1 , 4),
    new THREE.MeshStandardMaterial({color : 0xb35f45 })
)
roof.position.y = 2.5 + 0.5 //Height of Walls + Half of Roof
roof.rotation.y = Math.PI / 4 
house.add(roof)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2 , 2.2 , 100 , 100), //Segments as 100 for heigthTexture
    new THREE.MeshStandardMaterial({
        map : doorColorTexture,
        transparent : true,
        alphaMap : doorAlphaTexture, //Needs transparent prop
        aoMap : doorAmbientOcculsionTexture,//Needs uv2 
        displacementMap : doorHeightTexture, //Needs Segments
        displacementScale : 0.1 ,
        normalMap : doorNormalTexture,
        roughness : doorRoughnessTexture,
        // metalness : doorMetalnessTexture,
    })
)
door.geometry.setAttribute(
    'uv2' ,
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.z = 2 + 0.01//Half of width of walls (Z-fighting so add 0.01)
door.position.y =  1 //Half of door
house.add(door)


//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1 , 16 , 16 )
const bushMaterial = new THREE.MeshStandardMaterial({color : 0x89c854})

const bush1 = new THREE.Mesh(bushGeometry , bushMaterial )
bush1.position.set(0.8 , 0.2 , 2.2)
bush1.scale.set(0.5 ,  0.5 , 0.5)

const bush2 = new THREE.Mesh(bushGeometry , bushMaterial )
bush2.position.set(1.4 ,  0.1 , 2.1)
bush2.scale.set(0.25 , 0.25 , 0.25 )


const bush3 = new THREE.Mesh(bushGeometry , bushMaterial )
bush3.position.set(-0.8 , 0.1 , 2.2)
bush3.scale.set(0.4 ,  0.4 , 0.4)


const bush4 = new THREE.Mesh(bushGeometry , bushMaterial )
bush4.position.set(-1  , 0.05 , 2.6)
bush4.scale.set(0.15 ,  0.15 , 0.15)

house.add(bush1 , bush2 , bush3 , bush4)

//Graves

const Graves = new THREE.Group()
scene.add(Graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6 , 0.8 , 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color : 0xb2b6b1})

for(let i = 0 ; i < 50 ; i++){

    const angle = Math.random() * (Math.PI * 2) //To GIve random Value from 1 - 2.PI
    const graveRadius = 4 + Math.random() * 5 // GIves Radius for Graves MOre than 4 that is walls area
    const x = Math.sin(angle) * graveRadius
    const z = Math.cos(angle) * graveRadius

    const grave = new Mesh(graveGeometry , graveMaterial)
    grave.position.set(x , 0.3 , z)//Graves Height is 0.8
    grave.rotation.y = (Math.random() - 0.5) * 0.8
    grave.rotation.z = (Math.random() - 0.5) * 0.3

    grave.castShadow = true

    Graves.add(grave)

}

//Floor
const floor = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(20 , 20),
        new THREE.MeshStandardMaterial({
            map : grassColorTexture,
            aoMap : grassAmbientOcculsionTexture,
            normalMap : grassNormalTexture,
            roughnessMap : grassRoughnessTexture

        }) 
    )

floor.geometry.setAttribute(
        'uv2' ,
        new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = - Math.PI / 2

scene.add(floor)


const sizes = {

    width : window.innerWidth,
    height : window.innerHeight,
}


//Lights
const ambientLight = new THREE.AmbientLight(0xb9d5ff , 0.05)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xffffff  , 0.5)
directionalLight.position.set(4 , 5 ,-2)

gui.add(directionalLight.position , 'x').max(10).min(1).step(1)
gui.add(directionalLight.position , 'y').max(10).min(1).step(1)
gui.add(directionalLight.position , 'z').max(10).min(1).step(1)



scene.add(directionalLight)

//Door LIght 

const doorLight = new THREE.PointLight(0xff7d46 , 1 , 7)
doorLight.position.set(0 , 2.2 , 2.7)



house.add(doorLight) //Doorlight is a part of house

//Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2 ,5)

scene.add(ghost1)

const ghost2 = new THREE.PointLight(0x0000fff, 2 ,5)

scene.add(ghost2)

const ghost3 = new THREE.PointLight(0xfff000, 2 ,5)

scene.add(ghost3)


//Camera
const camera = new THREE.PerspectiveCamera(75 , (sizes.width / sizes.height) )
camera.position.z = 20 
camera.position.y = 0.5 

scene.add(camera)



//Canvas
const  canvas = document.querySelector('.webgl')

//Renderer
const  renderer = new THREE.WebGLRenderer({
    canvas : canvas,  
})
renderer.setSize(sizes.width ,sizes.height) 
renderer.setClearColor(0x262837)



//Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap


directionalLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

//Optimization

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far =  7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far =  7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far =  7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far =  7




//Controls 
const controls = new OrbitControls(camera , canvas)
controls.enableDamping = true 


//Clock 
const clock = new THREE.Clock()

//Animations
const tick = () => {


    const elapsedTime = clock.getElapsedTime()

    //Update Ghosts
    const ghost1Angle = elapsedTime / 2
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4 
    ghost1.position.y = Math.sin(elapsedTime * 3) //JUmping Animation

    const ghost2Angle = - elapsedTime / 2.2
    ghost2.position.x = Math.cos(ghost2Angle) * 6 
    ghost2.position.z = Math.sin(ghost2Angle) * 6 
    ghost2.position.y = Math.sin(elapsedTime * 3) //JUmping Animation

    const ghost3Angle = - elapsedTime / 2.8
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.18)
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime) * 0.5) 
    ghost3.position.y = Math.sin(elapsedTime * 3) //JUmping Animation
    

    //Update Controls
    controls.update()


    //render
    renderer.render(scene , camera);    

    window.requestAnimationFrame(tick)


}

tick()

