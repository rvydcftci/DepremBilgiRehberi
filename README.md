# 🌍 Earthquake Information Guide

A web-based disaster awareness platform that provides real-time earthquake data, interactive maps, safe zone locations, and essential preparedness resources.

---

## 🚀 Features

- 🌐 Real-time earthquake monitoring  
- 🗺 Interactive earthquake map with magnitude-based visualization  
- 🎯 Filter earthquakes by city, magnitude, and date  
- 📍 Locate nearby safe gathering areas  
- 📊 Earthquake statistics dashboard  
- 📚 Information center with guides, videos, and downloadable documents  
- 📞 Quick access to emergency contact numbers  

---

## 🛠 Technologies Used

- Node.js  
- Express.js  
- MongoDB Atlas  
- Handlebars (View Engine)  
- HTML / CSS / JavaScript  

---

## 🔐 Database & Security

- MongoDB Atlas is used as the backend database.  
- Data is recommended to be backed up hourly.  
- Users can only view data; no edit permissions are granted.  

---

## ⚙ Installation & Setup

### 📦 Install Dependencies
```bash
npm install
```
 
## 🔧 Configure Environment Variables

- Create a .env file in the root directory and add:

PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/earthquakeDB

## ⚠️ Replace:

- username → your MongoDB Atlas database user
- password → your MongoDB Atlas password
- earthquakeDB → your database name

---

## ☁ MongoDB Atlas Setup

- Create a cluster in MongoDB Atlas

- Create a database user (Database Access)

- Add your IP address in Network Access

- Copy the connection string

- Paste it inside your .env file

---

## Run the Application 
```bash
- node app.js 
- npm start
```
---

### 🏠 Home Screen

<table>
  <tr>
    <td><img src="images/giris.jpeg" width="350"/></td>
    <td><img src="images/anasayfa.jpeg" width="350"/></td>
  </tr>
  <tr>
    <td><img src="images/anasayfa1.jpeg" width="350"/></td>
    <td><img src="images/anasayfa2.jpeg" width="350"/></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="images/anasayfa3.jpeg" width="350"/>
    </td>
  </tr>
</table>

---

### 🌍 Recent Earthquakes Screen

<table>
  <tr>
    <td><img src="images/sondepremler.jpeg" width="350"/></td>
    <td><img src="images/depremsiddeti.jpeg" width="350"/></td>
  </tr>
  <tr>
    <td><img src="images/depremsiddeti2.jpeg" width="350"/></td>
    <td><img src="images/depremsiddeti3.jpeg" width="350"/></td>
  </tr>
</table>

---


### 📍 Safe Zones Screen

<table>
  <tr>
    <td align="center">
      <img src="images/guvenlibolge.jpeg" width="700"/>
    </td>
  </tr>
</table>

---

### 📚 Information Center Screen

<table>
  <tr>
    <td><img src="images/bilgikosesi.jpeg" width="350"/></td>
    <td><img src="images/bilgikosesi2.jpeg" width="350"/></td>
  </tr>
  <tr>
    <td><img src="images/bilgikosesi3.jpeg" width="350"/></td>
    <td><img src="images/bilgikosesi4.jpeg" width="350"/></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="images/bilgikosesi5.jpeg" width="350"/>
    </td>
  </tr>
</table>

---

## Developers
- -Ümit DEMİR 

- Elif ERGEN 

- Rüveyda ÇİFTCİ 

- Aziz BOLAT

2024

---