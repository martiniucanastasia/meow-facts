import { useEffect, useState } from "react";
import "./App.css";

const API = "https://meowfacts.herokuapp.com/";

function App() {
  const [isAsyncAwaitBasedFetch, setIsAsyncAwaitBasedFetch] = useState(false);
  const [isPromiseBasedFetch, setIsPromiseBasedFetch] = useState(true);
  const [meowFact, setMeowFact] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [isError, setIsError] = useState(false);
  const [savedFacts, setSavedFacts] = useState(
    JSON.parse(localStorage.getItem("savedFacts")) || []
  );

  // isPromiseBasedFetch
  const promiseFetchMeow = () => {
    console.log("promiseFetchMeow");
    setIsError(false);
    fetch(API)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        setMeowFact(res.data[0]);
      })
      .catch((error) => {
        console.log("Fetch error occurred:", error);
        setIsError(true);
      });
  };

  // isAsyncAwaitBasedFetch
  const asyncFetchMeow = async () => {
    console.log("asyncFetchMeow");
    setIsError(false);
    try {
      const response = await fetch(API);
      const json = await response.json();

      setMeowFact(json.data[0]);
    } catch (error) {
      console.error("Fetch error occurred:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    handleGetNewFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAsyncAwaitBasedFetch, isPromiseBasedFetch]);

  useEffect(() => {
    localStorage.setItem("savedFacts", JSON.stringify(savedFacts));
  }, [savedFacts]);

  const saveFact = (fact) => {
    setSavedFacts((prev) => [...prev, fact]);
  };

  const deleteAllSavedFacts = () => {
    setSavedFacts([]);
  };

  const handleActive = (event) => {
    const id = event.target.id;
    setActiveButton(id);
    if (id === "1") {
      setIsAsyncAwaitBasedFetch(true);
      setIsPromiseBasedFetch(false);
    } else if (id === "2") {
      setIsAsyncAwaitBasedFetch(false);
      setIsPromiseBasedFetch(true);
    }
  };

  const handleGetNewFact = () => {
    if (isAsyncAwaitBasedFetch) {
      asyncFetchMeow();
    }
    if (isPromiseBasedFetch) {
      promiseFetchMeow();
    }
  };

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      {meowFact ? (
        <div>
          <div
            style={{
              display: "flex",
              gap: "80px",
              justifyContent: "center",
            }}
          >
            <button
              key={1}
              id={"1"}
              className={activeButton === "1" ? "active" : undefined}
              onClick={(e) => handleActive(e)}
              style={{ color: "blueviolet" }}
            >
              Async
            </button>
            <button
              key={2}
              id={"2"}
              className={activeButton === "2" ? "active" : undefined}
              onClick={(e) => handleActive(e)}
              style={{ color: "blueviolet" }}
            >
              Promise
            </button>
          </div>
          <h3>{meowFact}</h3>
          <div
            style={{
              display: "flex",
              gap: "40px",
              justifyContent: "center",
            }}
          >
            <button onClick={() => deleteAllSavedFacts()}>Clean Saved</button>
            <button onClick={() => saveFact(meowFact)}>♥️</button>
            <button onClick={handleGetNewFact}>Get New Fact</button>
          </div>
          <br />
          <div>
            {savedFacts.length > 0 ? (
              <div>
                <h4>Saved Facts</h4>
                {savedFacts.map((fact, index) => {
                  return (
                    <div key={index}>
                      <p>{fact}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <h4>No favorites</h4>
            )}
          </div>
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
}

export default App;
