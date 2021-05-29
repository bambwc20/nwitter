import Nweet from "Components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    };

    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;

    const theFile = files[0]; //인풋은 단 한개의 파일만 받기 때문.
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //api를 이용해서 파일을 읽음
    //이게 파일을 읽고 나면 이게 끝나면 onloadend이거가 실행됨.
  };

  const onClearAttatchmentClear = () => setAttachment(null);

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input value="Nweet" type="submit" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttatchmentClear}>Clear</button>
          </div>
        )}
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
