import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 1 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const seenJokes = useRef(new Set());

  const getJokes = async () => {
    try {
      let newJokes = [];
      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });

        let joke = res.data;
        if (!seenJokes.current.has(joke.id)) {
          seenJokes.current.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found");
        }
        setJokes((currJokes) => [...currJokes, { ...joke, votes: 0 }]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("getJokes fn: ");
      console.error(err);
    }
  };

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    setJokes((currJokes) =>
      currJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  useEffect(() => {
    getJokes();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )}
      {!isLoading && (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={vote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JokeList;
