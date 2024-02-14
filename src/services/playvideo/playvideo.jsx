import axios from "axios";
import UPLOAD_PHOTO from "../../constants";
import { apiBase } from "../../contant/api";

class playvideo {

  async play(data) {
    console.log('hello')
    try {
      const response = await  fetch(`${apiBase}/?video_name=${data}`)
      console.log(response);
 
    } catch (e) {
      console.log(e);
    }
  }
  async live()
  {
    console.log('hello')
    try {
      const response = await  fetch(`${apiBase}/webcam`)
      console.log(response);
 
    } catch (e) {
      console.log(e);
    }
  }
  async pause(){
    try {
      const response = await axios.delete(`${apiBase}/pause`);
      console.log("PAUSE : ",response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
  async getVideo() {
    console.log('hello')
    try {
      const response = await  fetch(`${apiBase}/videos`)
      console.log(response);
      return response.json();
 
    } catch (e) {
      console.log(e);
    }
  }
  apipath = UPLOAD_PHOTO;
  async Add(data) {
    console.log('hello')
    try {
      const response = await axios.post(`${apiBase}/uploadVideo`, data);
      console.log(response);
      console.log('bye');
    } catch (e) {
      console.log(e);
    }
  }

}

const VideoPlay = new playvideo();

export default VideoPlay;