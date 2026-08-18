import styles from "./page.module.css";

// My components
import Header from "@/components/header";
import BallCaller from "@/components/ball-caller"
import BingoCard from "@/components/bingo-card"

export default function Home() {

  // state to control the bingo win notification
  // state to store the marknumber function from bingo-card

  // function to handle the bingo notification
    // called by Bingo-card when a bingo is detected to display the win notification
  
  // Function called by BallCaller when a new ball is drawn
    // Passes the ball number to BingoCard's markNumber function
  
  // function called when resting the game
    // closes the gingo notification

  // Callback function passed to BingoCard
    //  Receives the markNumber function from BingoCard
    // Stores it so BallCaller can call it
    
  return (
    <div className={styles.page}>

      <Header />
      
      <main className={styles.main}>
          <BallCaller/>

          <BingoCard/>
      </main>
    </div>
  );
}


