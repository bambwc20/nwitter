import React, { useState, useEffect } from "react";
import AppRouter from "Components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //authService.currentUser는 파베가 로딩되기도 전에 불러와서 오류가남.

  useEffect(() => {
    //인증정보가 바뀔떄마다 호출된다.
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear} Nwitter</footer>
    </>
  );
}

export default App;
