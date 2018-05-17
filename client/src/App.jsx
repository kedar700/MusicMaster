import React, {Component} from 'react';
import './App.css';
import {FormControl, FormGroup, InputGroup, Glyphicon} from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class App extends Component {

    constructor(props) {
        super(props);
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            query: ''
        }
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    search() {
        console.log('state', this.state);
        spotifyApi.searchArtists(this.state.query).then((res) =>{
            console.log(res);
        });
        // const baseURL = 'https://api.spotify.com/v1/search?';
        // const fetchURL = `${baseURL}q=${this.state.query}&type=artist&limit=1`;
        // let accessToken = params.access_token;
        // console.log(accessToken);
        // let spOptions = {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': 'Bearer ' + accessToken
        //     },
        //     mode: 'cors',
        //     cache: 'default'
        // };
        // console.log(fetchURL);
        // fetch(fetchURL, spOptions )
        //     .then(response => response.json())
        //     .then(json => console.log(json))
    }

    render() {
        return (
            <div className="App">
                {!this.state.loggedIn &&
                <a href="http://localhost:8888">Login to Spotify</a>
                }
                {this.state.loggedIn &&
                <div>
                    <div className="App-title">Music Master</div>
                    <FormGroup>
                        <InputGroup>
                            <FormControl type="text"
                                         placeholder="Search for an Artist"
                                         value={this.state.query}
                                         onChange={event => {
                                             this.setState({query: event.target.value})
                                         }}
                                         onKeyPress={event => {
                                             if (event.key === 'Enter')
                                                 this.search();
                                         }}/>
                            <InputGroup.Addon onClick={() => this.search()}>
                                <Glyphicon glyph="search"></Glyphicon>
                            </InputGroup.Addon>
                        </InputGroup>
                    </FormGroup>
                    <div className="Profile">
                        <div>Artist Photo</div>
                        <div>Artist Name</div>
                    </div>
                    <div className="Gallery">
                        Gallery
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default App;