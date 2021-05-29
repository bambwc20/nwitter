import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory(); //Hooks으로도 가능.
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    //내가 쓴 글 보는 코드
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    //where를 또 할 수 있지만 지금은 그냥 get으로 가져오면 됨.
    // console.log(
    //   nweets.docs.map((doc) => {
    //     return doc.data();
    //   })
    // );
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser(); //이벤트를 넘겨 받음
      //firebase에 있는 profile을 업데이트 시켜준 후에 react.js에 있는 profile를 새로고침 해줄거야!
    }
  };

  //나중에 내가 쓴글을 보이게 하려면 써라
  // useEffect(() => {
  //   getMyNweets();
  // }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
