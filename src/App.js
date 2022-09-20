import React, { useEffect, useState } from "react";
import './App.css';
import LazyLoad from 'react-lazy-load';


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  function getSanitizedSearchResults(list) {
    return list.map(i => i.show)
  }
  const getSeriesList = async (page = 1) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows?page=${page}`)
      if (!response.ok) {
        throw new Error(
          `This a HTTP error: The status is ${response.status}`
        );
      }
      const result = await response.json()
      setIsLoaded(true)
      setItems(result)
      setError(null)
    } catch (error) {
      setError(error.message)
      setItems(null)
    }
  }


  const getSearchResults = async () => {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
    const result = await response.json()
    setItems(getSanitizedSearchResults(result))
  }


  useEffect(() => {
    getSeriesList()
  }, []);



  useEffect(() => {
    search.length && getSearchResults()
  }, [search]);

  const getRandomKey = () => {
    return Math.random(999999)
  }
  if (!isLoaded) {
    return (
      <div className="spinner-container">
        <h2>Loading ...</h2>
        <div className="loading-spinner">

        </div>
      </div>
    )
  } else
    return (
      <div className="App">
        <nav className="App-header">
          <h1>SERIES SEEKERS</h1>
        </nav>
        <input
          type="search"
          name="search-form"
          id="search-form"
          className="search-input"
          placeholder="Search for..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="slicer"></div>
        {error && (
          <div>{`There is a problem fetching the requested serie  - ${error}`}</div>
        )}
        <div className="App">
          <ul>
            {items.map(({ name, image, summary, premiered, rating }) => (
              <li key={getRandomKey()} >
                <div className="overlay-image">
                  <a href="#">
                    <div className="image-container">
                      <LazyLoad >
                        <img className="image" src={image?.medium || image?.original || "https://images.pexels.com/photos/2335046/pexels-photo-2335046.jpeg"} alt="Alt text" />
                      </LazyLoad>
                      <div className="premiered">
                        <p>{premiered?.substring(0, 4)}</p>
                      </div>
                    </div>
                    <div className="hover">
                      <div className="text"><b>Synopsis: </b>{summary?.substring(0, 100)} ...(Read more)</div>
                    </div>
                  </a>
                </div>
                <p>{name?.substring(0, 20)}</p>
                <p>rate : <b>{rating?.average || 'N/A'}</b></p>
              </li>
            ))
            }

          </ul >
        </div >
        <footer>
          <div className="links-container">
            <ul>
              <li><a href="#">Popular Search</a></li>
              <li><a href="#">Popular Series</a></li>
              <li><a href="#">Most Rated</a></li>
            </ul>
            <ul>
              <li><a href="#">Web/streaming schedule</a></li>
              <li><a href="#">Full schedule</a></li>
              <li><a href="#">Show updates</a></li>
            </ul>
            <ul>
              <li><a href="#">Show seasons</a></li>
              <li><a href="#">Show cast</a></li>
              <li><a href="#">Show crew</a></li>
            </ul>
          </div>
          <div><b>Series-SeekerS - 2022</b></div>
        </footer>
      </div >
    );
}

export default App;
