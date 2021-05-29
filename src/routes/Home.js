import Nweet from "Components/Nweet";
import NweetFactory from "Components/NweetFacroty";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    setNweets([]);
    dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        //onSnapshot은 DB가 변경될때마다 호출
        const nweetArray = snapshot.docs.reverse().map((doc) => {
          //먼저쓴가 가장 위로 코드
          return { id: doc.id, ...doc.data() }; //data()는 기존의 모든 데이터를 포함한다.
        });

        setNweets(nweetArray);
      });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
