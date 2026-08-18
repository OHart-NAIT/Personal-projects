// Use client is only here to fix an error message when trying to use react, idk why its happening but it's been awhile since I've done next.js and react so could just be me forgetting things
"use client"

import styles from "@/app/page.module.css";

// MUI components
import { Box } from "@mui/material";

// React
import { useState } from "react";

export default function RecentlyCalled() {
    
    // State to track all balls that have been called
    // State to track the most recent called ball
    // State to track what balls are still avaliable
    // state to track if all balls have been called

    // function to reset balls
        // clears ball history and current ball display

    // function to get the letter for the number
        // figures out what number goes to the corresponding letter

    // OPTIONAL (not sure if I want to do this)
    // Function to return a colour for the ball dependant on the letter

    // The main function that draws a random ball from whats available
        // checks if the game is over or if no balls remain
        // selects random ball from the available balls array
        // removes it from the available ball array
        // adds it to called balls 
        // Sets it as currentBall for display

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