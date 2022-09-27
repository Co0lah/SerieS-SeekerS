import React, { useEffect, useState } from "react";
import "./App.css";
import LazyLoad from "react-lazy-load";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [search, setSearch] = useState("");
  // const [isActive, setIsActive] = useState("hidden");

  function getSanitizedSearchResults(list) {
    return list.map((i) => i.show);
  }
  const getSeriesList = async () => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows`);
      const popresponse = await fetch(`https://api.tvmaze.com/shows?page=10`);

      if (!response.ok) {
        throw new Error(`This a HTTP error: The status is ${response.status}`);
      }
      const result = await response.json();
      const res = await popresponse.json();
      // console.log(res);
      setIsLoaded(true);
      setItems(result);
      setMonthlyItems(res);
      setError(null);
    } catch (error) {
      setError(error.message);
      setItems(null);
    }
  };

  const getSearchResults = async () => {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${search}`
    );
    const result = await response.json();
    setItems(getSanitizedSearchResults(result));
  };

  // const getPopularSearch = async () => {
  //   const response = await fetch(`https://api.tvmaze.com/shows?page=10`);
  //   const res = await response.json();
  //   setMonthlyItems(res);
  // };

  useEffect(() => {
    if (!search) {
      getSeriesList();
    }
    search.length && getSearchResults();
    // if (window.scrollY > 200) {
    //   setIsActive("visible");
    //   console.log(window.scroll);
    // }
  }, [search]);

  // useEffect(() => {
  //   getPopularSearch();
  // }, []);

  const getRandomKey = () => {
    return Math.random(999999);
  };

  if (!isLoaded) {
    return (
      <div className="spinner-container">
        <h2>Loading</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <LazyLoad>
        <div className="wrapper-container">
          <header className="">
            <h1>
              <a href="#">SERIES SEEKERS</a>
            </h1>
            <input
              type="search"
              name="search-form"
              id="search-form"
              className="search-input"
              placeholder="Search for..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {error && (
              <div>{`There is a problem fetching the requested serie  - ${error}`}</div>
            )}
          </header>
          <div className="main-series-container">
            <div className="main-series">
              <h3>Series streaming</h3>
              <ul>
                {items.map(({ name, image, summary, premiered, rating }) => (
                  <li key={getRandomKey()}>
                    <div className="overlay-image">
                      <a href="#">
                        <div className="image-container">
                          <img
                            className="image"
                            src={
                              image?.medium ||
                              image?.original ||
                              "https://images.pexels.com/photos/2335046/pexels-photo-2335046.jpeg"
                            }
                            alt="Alt text"
                          />
                          <div className="premiered">
                            <p>{premiered?.substring(0, 4)}</p>
                          </div>
                        </div>
                        <div className="hover">
                          <div className="text">
                            <b>Synopsis: </b>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: summary?.substring(0, 150),
                              }}
                            />
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="infos">
                      <p>{name?.substring(0, 20)}</p>
                      <p>
                        <span>rating </span>
                        <b>{rating?.average || "N/A"}</b>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aside-series">
              <h3>Popular Search</h3>
              <ul className="various-container">
                {monthlyItems.map(({ name, image, premiered }) => (
                  <li key={getRandomKey()}>
                    <div className="overlay-image">
                      <a href="#">
                        <div className="image-container">
                          <img
                            className="image"
                            src={
                              image?.medium ||
                              image?.original ||
                              "https://images.pexels.com/photos/2335046/pexels-photo-2335046.jpeg"
                            }
                            alt="Alt text"
                          />
                          <div className="premiered">
                            <p>{premiered?.substring(0, 4)}</p>
                          </div>
                        </div>
                        <div className="hover">
                          {/* <div className="text">
                            <b>Synopsis: </b>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: summary?.substring(0, 150),
                              }}
                            />
                          </div> */}

                          <div className="svg">
                            <FontAwesomeIcon icon={faCirclePlay} />
                          </div>
                        </div>
                      </a>
                    </div>
                    <div>
                      <p>{name?.substring(0, 20)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </LazyLoad>
      {/* <div id="scrollTop" className={isActive}></div> */}
    </div>
  );
};

export default App;
