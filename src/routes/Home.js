import Nweet from "Components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    setNweets([]);
    dbService.collection("nweets").onSnapshot((snapshot) => {
      //onSnapshot은 DB가 변경될때마다 호출
      const nweetArray = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }; //data()는 기존의 모든 데이터를 포함한다.
      });
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      created: Date.now(),
      creatorId: userObj.uid,
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
          //   console.log(nweet);
          return (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
            //nweets는 DB에서 불러와지는 정보인데, 이게 userObj(현재 누가 로그인 했는지 정보) 와 같다면, 수정가능
          );
        })}
      </div>
    </div>
  );
};

export default Home;
