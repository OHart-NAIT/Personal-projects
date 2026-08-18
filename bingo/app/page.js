import styles from "./page.module.css";

// My components
import Header from "@/components/header";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <Header/>
      </main>
    </div>
  );
}
