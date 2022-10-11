import React, { useEffect, useState } from "react";
import "./App.css";
import LazyLoad from "react-lazy-load";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";

const App = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [xloading, xsetLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [search, setSearch] = useState("");

  const getSeriesList = async () => {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows`);
      const popresponse = await fetch(`https://api.tvmaze.com/shows?page=10`);

      if (!response.ok) {
        throw new Error(`This a HTTP error: The status is ${response.status}`);
      }
      const result = await response.json();
      const res = await popresponse.json();
      setLoading(true);
      setItems(result);
      setMonthlyItems(res);
      setError(null);
    } catch (error) {
      setError(error.message);
      setItems(null);
    }
  };

  useEffect(() => {
    if (!search) {
      getSeriesList();
    }
    async function getSearchResults() {
      // A CHECK
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${search}`
      );
      xsetLoading(true);
      const result = await response.json();
      const res = result.map((i) => i.show);
      setItems(res);
      xsetLoading(false);
    }
    if (search) getSearchResults();
  }, [search]);

  const debounced = (e) => setSearch(e?.target?.value);

  const debouncedSearch = debounce(debounced, 500);

  const getRandomKey = () => {
    return Math.random(999999);
  };

  if (!loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="wrapper-container">
        <header className="">
          <h1>
            <a href="#">SERIES SEEKERS</a>
          </h1>

          <input
            autoFocus
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search for..."
            onChange={debouncedSearch}
          />
          {error && (
            <div>{`There is a problem fetching the requested serie  - ${error}`}</div>
          )}
        </header>
        <div className="main-series-container">
          <div className="main-series">
            {xloading && (
              <div className="spinner-container-search">
                <div className="loading-spinner"></div>
              </div>
            )}
            <h3>Series streaming</h3>
            <ul>
              {items.map(
                ({ name, image, summary, premiered, rating, officialSite }) => (
                  <li key={getRandomKey()}>
                    <div className="overlay-image">
                      <a href={officialSite} target="_blank" rel="noreferrer">
                        <div className="image-container">
                          <LazyLoad>
                            <img
                              className="image"
                              src={
                                image?.medium ||
                                image?.original ||
                                "https://images.pexels.com/photos/2335046/pexels-photo-2335046.jpeg"
                              }
                              alt="Alt text"
                            />
                          </LazyLoad>
                        </div>
                        <div className="hover">
                          <h3>Click To Watch</h3>
                          <div className="text">
                            <p style={{ color: "#00b7ff" }}>
                              {name?.substring(0, 20).toUpperCase()}
                            </p>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: summary?.substring(0, 150),
                              }}
                            />
                          </div>
                          <div className="series-infos">
                            <div className="sub-infos">
                              <p>{premiered?.substring(0, 4)}</p>
                              <p>
                                <span>rating </span>
                                <b>{rating?.average || "N/A"}</b>
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                )
              )}
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
      {/* <div id="scrollTop" className={isActive}></div> */}
    </div>
  );
};

export default App;
