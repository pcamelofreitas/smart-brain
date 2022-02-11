import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FindFaceInput from './components/FindFaceInput/FindFaceInput';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Singnin/Signin'
import Register from './components/Register/Register'
import './App.css';

const particlesOptions = {
    
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 500
        }
      }
    }
  }

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component {

    constructor(){
        super()
        this.state=initialState;  
    }
   
    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined : data.joined
        }})
        console.log(this.state.user)
    }

    calculateFaceLocation=(data)=>{
        const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }  

    displayFaceBox=(box) =>{
        this.setState({box: box});
    }

    onInputChange=(event)=>{
        this.setState({input: event.target.value})
    }

    onButtonSubmit=()=>{
        this.setState({imageUrl: this.state.input});
            fetch('http://localhost:3000/imageurl',{
                        method: 'post',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({
                            input:this.state.input
                        })    
                    })
            .then(response => response.json())
            .then(response => {
                if(response){
                    fetch('http://localhost:3000/image',{
                        method: 'put',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({
                            id:this.state.user.id
                        })    
                    })
                    .then(response=>response.json())
                    .then(count=>{
                        this.setState(Object.assign(this.state.user,{entries:count}))
                    })
                    .catch(err=> console.log(err))
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err)); 
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
          this.setState(initialState)
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

    
    render(){
        const {isSignedIn, imageUrl, route, box} = this.state
        return (
            <div className="App">

                <Particles className='particles'
                        params={particlesOptions}
                        />
                {/* <Particles
                    id="tsparticles"
                    
                    options={{
                    
                        fpsLimit: 120,
                        interactivity: {
                        events: {
                            onClick: {
                            enable: true,
                            mode: "push",
                            },
                            onHover: {
                            enable: false,
                            mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            bubble: {
                            distance: 400,
                            duration: 2,
                            opacity: 0.8,
                            size: 40,
                            },
                            push: {
                            quantity: 4,
                            },
                            repulse: {
                            distance: 200,
                            duration: 0.4,
                            },
                        },
                        },
                        particles: {
                        color: {
                            value: "#ffffff",
                        },
                        links: {
                            color: "#ffffff",
                            distance: 100,
                            enable: true,
                            opacity: 0.5,
                            width: 0.5,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "bounce",
                            random: true,
                            speed: 6,
                            straight: false,
                        },
                        number: {
                            density: {
                            enable: true,
                            area: 800,
                            },
                            value: 100,
                        },
                        opacity: {
                            value: 0.4,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            random: true,
                            value: 2,
                        },
                        },
                        
                    }}
                /> */}

                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                
            
                {route === 'home' ?   
                    <div>
                        <Logo />
                        <Rank 
                            userName={this.state.user.name}
                            userEntries={this.state.user.entries}/>
                        <FindFaceInput 
                            onInputChange={this.onInputChange} 
                            onButtonSubmit={this.onButtonSubmit}/> 
                        <FaceRecognition box={box} imageUrl={imageUrl}/>
                    </div> 
                
                :   ( 
                        route === 'signin'
                        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
  
}

export default App;