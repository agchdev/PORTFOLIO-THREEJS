import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../components/Loader'

import Island from '../models/Island';
import Sky from '../models/Sky';
import Bird from '../models/Bird';
import Plane from '../models/Plane';
import HomeInfo from '../components/Homeinfo';

import sakura from '../assets/sakura.mp3'
import { soundoff, soundon } from '../assets/icons';


const Home = () => {
    const audioRef = useRef(new Audio(sakura));
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1)
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);

    useEffect(() => {
        if(isPlayingMusic){
            audioRef.current.play();
        }

        return() => {
            audioRef.current.pause();
        }
    }, [isPlayingMusic])

    const adjustIslandForScreenSize = () => { /** Primero creamos la funcion */
        let screeScale = null; /** Luego la variable para la escala */
        let screenPosition = [0, -6.5, -43]; /** Luego la variable para la posicion */
        let rotation = [0.1, 4.7, 0]; /**Variable para la rotacion */
        if(window.innerWidth < 768){ /** Hacemos un poco de responsive, que para las distintas resoluciones tenga un tamaño */
            screeScale = [0.9, 0.9, 0.9];
        }else{
            screeScale = [1, 1, 1];
        }

        return [screeScale, screenPosition, rotation]; /**Devolvemos en un vector todos los cambios */
    }
    const adjustPlaneForScreenSize = () => { /** Primero creamos la funcion */
        let screeScale, screenPosition; /** Luego la variable para la posicion */

        if(window.innerWidth < 768){ /** Hacemos un poco de responsive, que para las distintas resoluciones tenga un tamaño */
            screeScale = [1.5, 1.5, 1.5];
            screenPosition = [0, -1.5, 0];
        }else{
            screeScale = [3, 3, 3];
            screenPosition = [0, -4, -4];
        }

        return [screeScale, screenPosition]; /**Devolvemos en un vector todos los cambios */
    }

    const [islandScale, islansPosition, islandRotation] = adjustIslandForScreenSize(); /** Esto es muy importante:
    1. Creamos dos variables
    2. Como son dos y la funcion adjustIslandForScreenSize() devuelve un array de dos valores le asigna uno a cada uno */
    const [planeScale, planePosition] = adjustPlaneForScreenSize();

    return (
    <section className='w-full h-screen relative'>
        <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
            {currentStage && <HomeInfo currentStage={currentStage}/>}
        </div>
        <Canvas
            className = {`"w-full h-screen relative" ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
            camera = {{ near: 0.1, far: 1000 }}
        >
            <Suspense fallback={<Loader />}>
                <directionalLight position={[1,1,1]} intensity={2} />
                <ambientLight intensity={0.5}/>
                <pointLight/>
                <spotLight/>
                <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>


                <Bird />
                <Sky isRotating={isRotating} />
                <Island 
                    position={islansPosition}
                    scale={islandScale}
                    rotation={islandRotation}
                    isRotating={isRotating}
                    setIsRotating={setIsRotating}
                    setCurrentStage={setCurrentStage}
                />
                <Plane 
                    isRotating={isRotating}
                    scale={planeScale}
                    position={planePosition}
                    rotation={[0,20,0]}
                />
            </Suspense>
        </Canvas>
        <div className='absolute bottom-2 left-2'>
            <img
                src={!isPlayingMusic ? soundoff : soundon}
                alt="sound"
                className='w-10 h-10 cursor-pointer object-contain'
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            />
        </div>
    </section>
  )
}

export default Home 