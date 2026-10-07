# Learn an Instrument with Checkpointissimo!
### A checkpoint-based video playback web application that lets you focus on playing instead of pressing arrow keys manually!

![functionality demonstration gif](./img/demo.gif)

## Main Functionality as of Latest Commit
* Multiple videos can be added and played at the same time.
* Checkpoints let you get back to any timestamp you placed yourself as well as get back to the last one.
* Cookies save all of your checkpoints and added videos. Nothing is saved on the server.
* Checkpoints always rewind videos 1 second earlier than intended for ease of use.


> [!NOTE]
> * Each checkpoint is a mark in time of the first video. Others synchronise by measuring time difference between the first video and themselves. 
> * On the very beginning videos must be synchronised manually inside each Youtube player element, but will be controlled together with the help of UI buttons afterwards.
> * Even though I paid close attention to details coding the program, small bugs may still be present. Please let me know if found any!

## Launching on Your Own Machine

> [!CAUTION]
> The resulting Docker image from the Dockerfile contains a development server which is unsuitable for running in production. Its main purpose here was for me to learn working with Docker.

Running development server without Docker:
1. **Pull** the source code from GitHub to your local machine;
1. **Run** `pip install -r requirements.txt`;
2. (optional) **Enter** into Python's virtual environment with `python -3.14.7 -m venv .venv` ;
3. **Run** `flask --app ./src/app.py run` to start the development server;
4. Head over to 127.0.0.1:5000 on any browser and **have fun**!



<p align="center">
  Developed by <b>Rimantas Rimkevičius</b> <br>
</p>


    Copyright (C) 2026 Rimantas Rimkevičius
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/
