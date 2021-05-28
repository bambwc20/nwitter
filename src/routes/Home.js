import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const dbnweets = await dbService.collection("nweets").get();
    dbnweets.forEach((document) => {
      //각각의 도큐먼트 데이터를 나타내고 있다.
      const nweetObject = {
        id: document.id,
        ...document.data(),
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    setNweets([]);
    getNweets();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("nweets").add({
      nweet: nweet,
      created: Date.now(),
    });
    setNweet("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={123}
        />
        <input value="Nweet" type="submit" />
      </form>
      <div>
        {nweets.map((nweet) => {
          return (
            <div key={nweet.id}>
              <h4>{nweet.nweet}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
