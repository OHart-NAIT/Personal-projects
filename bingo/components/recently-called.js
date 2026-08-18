import styles from "@/app/page.module.css";

// MUI components
import { Box } from "@mui/material";

export default function RecentlyCalled() {
    
    const CallCount = () => {
         
    };

    return (

        <div className={styles.recentlyCalled}>
            <h2>Recently Called</h2>

            <Box>
                <div className={styles.ball}>
                    <p>Ball 1</p>
                </div>
            </Box>
        </div>    
    )
    
}