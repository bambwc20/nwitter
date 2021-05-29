import React, { useState, useEffect } from "react";
import AppRouter from "Components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); authService.currentUser는 파베가 로딩되기도 전에 불러와서 오류가남.
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    //인증정보가 바뀔떄마다 호출된다.
    authService.onAuthStateChanged((user) => {
      if (user) {
        //firebase 언어를 react 언어로 연결시켜주고 있는 것이다.
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
      }
      setInit(true);
    });
  }, []);

  //userObj가 너무커서 재대로 리프레시가 안되는 문제 떄문에, 객체크기를 줄여주는 것이다.
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  //우리가 유저정보를 바꾸면 파베의 정보가 바뀌는데 우리의 헤더나 네비게이션은 파베쪽과 연결되어 있지 않다. 그래서 안바뀌는 것이다.
  //그래서 firebase의 정버를 가지고 react.js를 업데이트 해줘야 하는 것이다. 그래서 refreshUser하는 것이다.

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        /> //userObj가 있을때만 로그인 되는 시스템
      ) : (
        //Userobj는 다른 곳에서도 사용 될 수 있으므로 애플리케이션의 최상에 위치해야 한다.
        "Initializing..."
      )}
    </>
  );
}

export default App;
