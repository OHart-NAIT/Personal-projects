// Use client is only here to fix an error message when trying to use react, idk why its happening but it's been awhile since I've done next.js and react so could just be me forgetting things
"use client"

import styles from "@/app/page.module.css";

// React
import { useState } from "react";

export default function BingoCard() {

    // state to store the bingo card numbers
    // state to track what numbers/cells are marked

    // function to generate the bingo card
        // generate ranges
        // build each column independantly
        // generate 5 unique random numbers for the columns
        // place numbers in the card array
        // make to center a free space

    // function to check if it's a bingo
        // check all rows
        // check all columns
        // check the diagonals

    // function to mark the numbers when ball caller is called??
        // search the entire crad for ball number, if found mark it

    // function to mark the number when manually clicked
        // don't let them toggle the free cell??

    return (
        <div className={styles.bingoCard}>
            <h2>Bingo Card</h2>
        </div>
        
    )   
}