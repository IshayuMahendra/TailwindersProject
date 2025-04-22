'use client'

import NavBar from "./components/navbar"
import '@/app/styles/global_styles.css';

//This is the 404 page
export default function NotFound() {
    return (

        <div className="home h-full flex flex-col ">
            <NavBar />
        
    
                <main className="ml-auto mr-auto flex-1 p-6 mt-80">
                    <h1>404 NOT FOUND</h1>
                </main>
              

        </div>

    );
}

