import React, { useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  return (
    <div>
      <form>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={123}
        />
        <input onSubmit={onSubmit} type="submit" value="Nweet" />
      </form>
    </div>
  );
};

export default Home;
