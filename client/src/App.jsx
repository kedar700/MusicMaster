import React, {Component} from 'react';
import './App.css';
import {FormControl, FormGroup, InputGroup, Glyphicon} from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';
import Profile from './Profile';
import Gallery from './Gallery';

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
            query: '',
            artist: null,
            tracks: []
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
        spotifyApi.searchArtists(this.state.query).then((res) => {
            console.log(res);
            const artist = res.artists.items[0];
            this.setState({artist});
            spotifyApi.getArtistTopTracks(this.state.artist.id, 'US').then((response) => {
                console.log('top tracks', response);
                const {tracks} = response;
                this.setState({tracks});
            })
        });
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
                    {
                        this.state.artist !== null ?
                            <div>
                                <Profile artist={this.state.artist}/>
                                <Gallery tracks={this.state.tracks} />
                            </div> : <div></div>

                    }

                </div>
                }
            </div>
        )
    }
}

export default App;