import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
const Logo =()=>{
    return(
    <div className="ma4 mt0">
        <Tilt scale={1.2}  className='br2 shadow-2' style={{height: '150px', width: '150px', background: 'linear-gradient(89deg, #ff5edf 0%, #04c8de 100% )'}}>
            <div className='pa3'>
               <img alt='brain-logo' src={brain} />
            </div>
        </Tilt>
    </div>
    )
}
export default Logo;