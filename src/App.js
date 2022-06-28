import React, { useEffect, useState } from "react";

import { projectFirestore } from "./firebase/config";

import { AiFillTwitterSquare } from "react-icons/ai";
import { FaHamburger } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

import "./App.scss";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsPending(true);

    projectFirestore
      .collection("random")
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          setError("No quote to load 😞");
          setIsPending(false);
        } else {
          let results = [];
          snapshot.docs.forEach((doc) => {
            // console.log(doc);
            results.push({ ...doc.data(), id: doc.id });
          });
          setPosts(results);
          setIsPending(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  }, []);

  const handleClick = () => {
    const random = posts[Math.floor(Math.random() * posts.length)];
    setQuote(random); //value assigned here
  };

  return (
    <React.Fragment>
      <button onClick={handleClick} className="button">
        حچأيات بغِدادية
      </button>
      <br />
      {quote && <q>{quote.content}</q>}
      {quote && (
        <div className="share">
          Share to
          {/* Twitter */}
          <a
            id="icon"
            href={`http://twitter.com/intent/tweet?text="${quote.content}"`}
            target="_blank"
            rel="noopener noreferrer"
            title="share on twitter"
          >
            <AiFillTwitterSquare />
          </a>
          {/* Facebook */}
          {/* <a
            id="icon"
            href={`https://www.facebook.com/sharer/sharer.php?u="${quote.content}"`}
            target="_blank"
            rel="noopener noreferrer"
            title="share on facebook"
          >
            <FaFacebook />
          </a> */}
        </div>
      )}
      {/* error */}
      {error && <p className="error">{error}</p>}
      {isPending && <span class="loader">Load&nbsp;ng</span>}
      <div className="footer">
        buy me a burger
        <a
          id="icon"
          href="https://www.buymeacoffee.com/Hovsep93"
          target="_blank"
          rel="noopener noreferrer"
          title="share on twitter"
        >
          <FaHamburger />
        </a>
      </div>
    </React.Fragment>
  );
};

export default App;
