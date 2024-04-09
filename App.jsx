import React, { useState, useEffect } from "react";
import { Button, Form, Input, Carousel } from "antd";

export default function App() {
    const carouselStyles = {
        "width": "640px", 
        "border": "solid 1px #000", 
        "margin": "auto"
    };

    const [tracks, setTracks] = useState([]); //useState to store track information instead of the albums array
    const [userData, setUserData] = useState({ 
        Artist: "",
        numberOfSongs: ""
    }); //useState to store user inputted data

    const handleInputChange = (e) => { //I used Chat GPT to figure out a way to store the values from the forms
        const { name, value } = e.target;
        console.log("Changing this input", name);
        setUserData({ ...userData, [name]: value });
        // my interpretation of this code is that it is taking the userData (Artist or numberOfSongs) and assigning them into "value" associated with the key [name]
    }; 

    const handleSubmit = (values) => { //Chat GPT used this function to access the values stored before to be used in the API endpoint
        // Handle form submission when the search button is pressed
        console.log("Form submitted with values:", values);
        fetchData(); // Call fetchData 
    };

    useEffect(() => { //useEffect was another method Chat GPT suggested; It is used to manage data fetched and makes sure that the userinputs are updated when the form fields change
        if (userData.Artist !== "" && userData.numberOfSongs !== "") { // Since the page starts out without userData, it doesn't run fetchData when the page reloads
            fetchData();
        }
    }, [userData.Artist, userData.numberOfSongs]); // Effects rerun if any of these dependencies (userInput) changes
      

    async function fetchData() {
        const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';
        const url = `${baseURL}?q=${userData.Artist}&type=album&limit=${userData.numberOfSongs}`;
        const request = await fetch(url);
        const data = await request.json();
        console.log(data);
        setTracks(data);// set state variable to redraw...
    }


    function objToIframe(albumJSON) {
        return (
            <iframe
                key={albumJSON.id}
                src={`https://open.spotify.com/embed/track/${albumJSON.id}?utm_source=generator`} //For some reason, the albumJSON.id part i don't think is working properly
                width="100%" 
                border="0"
                height="352" 
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        )
    }
          
    // JSX Data Below
    return (
        <>
            <header>
                <h1>Spotify Demo</h1>
            </header>
            <main>
                <Form
                    name="basic"
                    labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmit}
                //onFinishFailed={onFinishFailed}
                autoComplete="off"
                >

                <Form.Item
                    label="Search Term"
                    name="Artist"
                    rules={[
                        {
                        required: true,
                        message: 'Please input an Artist',
                        },
                    ]}
                >
                <Input name="Artist" onChange={handleInputChange} />
                </Form.Item>

                <Form.Item
                    label="Amount of Songs"
                    name="numberOfSongs"
                    rules={[
                        {
                        required: true,
                        message: 'Please input the amount of songs you want to see',
                        },
                    ]}
                >
                <Input name="numberOfSongs" onChange={handleInputChange} />
                </Form.Item>

                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
                </Form.Item>

            {/* Display form data */}
            <div>
            <h2>Displaying Form Data (making sure values work)</h2>
            <p>Artist: {userData.Artist}</p>
            <p>Number of Songs: {userData.numberOfSongs}</p>
            </div>

            </Form>

                <div style={carouselStyles}>
                    <Carousel dotPosition="top">
                    { 
                        tracks.map(objToIframe)
                    }
                </Carousel>
                </div>
            
            </main>
        </>
    );
}
