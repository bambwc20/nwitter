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
        // setIsLoggedIn(true);
        setUserObj(user);
      } else {
        // setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> //userObj가 있을때만 로그인 되는 시스템
      ) : (
        //Userobj는 다른 곳에서도 사용 될 수 있으므로 애플리케이션의 최상에 위치해야 한다.
        "Initializing..."
      )}
    </>
  );
}

export default App;
