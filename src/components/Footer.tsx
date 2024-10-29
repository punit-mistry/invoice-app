import React from "react";
import Container from "./Container";
const Header = () => {
  return (
      <footer className=" py-4 absolute bottom-0 w-full ">
    <Container className="flex justify-between gap-4">
       <p>
         © {new Date().getFullYear()} Inovicing App. 
       </p>
       <p>
        Created by Punit Mistry With Nextjs, Xata, Clerk
       </p>
    </Container>
      </footer>
  );
};

export default Header;
