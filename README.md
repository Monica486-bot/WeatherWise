OpenWeather Application

Overview
This application utilizes the OpenWeather API to fetch and display weather data for a user-specified location. Users can enter a city name to retrieve current weather conditions, including temperature, humidity, and weather descriptions. The application is designed as a web app using HTML, CSS, and JavaScript.

Features
- Fetches real-time weather data using the OpenWeather API.
- User-friendly interface for entering city names.
- Displays temperature, weather description, humidity, and weather icons.
- Error handling for invalid cities or API failures.
- Responsive design for mobile and desktop users.

 Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **API**: OpenWeather API
- **Server Deployment**: Ubuntu web servers
- **Load Balancer**: HAProxy

Getting Started

Prerequisites
- Node.js installed on your machine (if running locally with a server)
- A valid OpenWeather API key
- Access to provided web servers

 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/openweather-app.git
   cd openweather-app
   ```
2. Install dependencies (if applicable):
   ```sh
   npm install
   ```
3. Create a `.env` file and add your API key:
   ```sh
   echo "WEATHER_API_KEY=your_api_key_here" > .env
   ```
4. Start the application:
   ```sh
   node server.js  # If using a backend server
   ```
   Or simply open `index.html` in a browser if running as a static web app.

## Deployment Instructions

### Web Server Setup (Web01 & Web02)
1. Copy the application files to each server:
   ```sh
   scp -r openweather-app/ user@web01:/var/www/html/
   scp -r openweather-app/ user@web02:/var/www/html/
   ```
2. Install and configure Nginx or Apache on each server:
   ```sh
   sudo apt update && sudo apt install nginx -y
   sudo cp /var/www/html/openweather-app/nginx.conf /etc/nginx/sites-available/default
   sudo systemctl restart nginx
   ```

### Load Balancer Configuration (Lb01)
1. Install HAProxy:
   ```sh
   sudo apt update && sudo apt install haproxy -y
   ```
2. Configure HAProxy to distribute traffic:
   ```sh
   sudo nano /etc/haproxy/haproxy.cfg
   ```
   Add the following configuration:
   ```
   frontend http_front
       bind *:80
       default_backend web_servers

   backend web_servers
       balance roundrobin
       server web01 192.168.1.2:80 check
       server web02 192.168.1.3:80 check
   ```
3. Restart HAProxy:
   ```sh
   sudo systemctl restart haproxy
   ```

## API Documentation
- **OpenWeather API**: [https://openweathermap.org/api](https://openweathermap.org/api)
- **Endpoints Used**:
  - `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric`

## Error Handling
- Displays user-friendly error messages for:
  - Invalid city names
  - API request failures
  - Network connectivity issues

## Challenges & Solutions
- **Handling API Key Security**: Implemented environment variables and `.gitignore` to prevent key exposure.
- **Ensuring Deployment Across Servers**: Used HAProxy load balancing for redundancy and availability.
- **Optimizing Performance**: Implemented caching for API responses to reduce load times.

## Attribution
- OpenWeather API
- HAProxy Documentation
- Nginx Documentation

## Demo Video
A short demo video showcasing the application’s functionality can be found here: [Demo Video Link]

## License
This project is licensed under the MIT License - see the LICENSE file for details.

