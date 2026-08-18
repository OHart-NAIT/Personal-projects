import styles from "./page.module.css";

// My components
import Header from "@/components/header";
import RecentlyCalled from "@/components/recently-called"
import BingoCard from "@/components/bingo-card"

export default function Home() {
  return (
    <div className={styles.page}>

      <Header />
      
      <main className={styles.main}>
          <RecentlyCalled/>

          <BingoCard/>
      </main>
    </div>
  );
}


