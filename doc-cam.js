const getCameraStream = async()=>{
  const constraints = {video:true, audio: false};
  try{
    console.log('getting webcam stream ...');
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  }catch(err){
    console.log('webcam was not approved by user' + err);
    alert('webcam was not approved by user' + err);
  }
}

const setVideoTrackSize = async (stream) => {
  const videoConstraints = {
    width: 1200,
    height: 720
  };
  //Get Video Track from stream
  const vTrack = stream.getVideoTracks()[0];
  try{
    const setVideo = await vTrack.applyConstraints(videoConstraints);
  }catch(err){
    console.log('track size was rejected: ' + err);
  }

}

const setVideoSourceToStream = async(videoEl)=>{
  const stream = await getCameraStream();
  const videoSet = await setVideoTrackSize(stream);
  videoEl.srcObject = stream;
  videoEl.addEventListener('loadedmetadata', ()=> videoEl.play());
}

const takeScreenshot = (canvas, video)=>{
  const context = canvas.getContext('2d');
  const videoBox = video.getBoundingClientRect();
  context.drawImage(video, 0, 0, videoBox.width, videoBox.height);
  const data = canvas.toDataURL('image/png');
  return data;
}

const addPhoto = (elements)=>{
  const img = document.createElement('img');
  const data = takeScreenshot(elements.canvas, elements.video);
  img.setAttribute('src', data);
  const downloadLink = document.createElement('a');
  downloadLink.href = data;
  downloadLink.download = `screenshot-${Date.now()}.png`;
  downloadLink.appendChild(img);
  elements.photoContainer.appendChild(downloadLink);
}

window.onload = ()=>{

  const elements = {
    video: document.getElementById("video"),
    videoButton: document.getElementById('video-button'),
    closeVideoButton: document.getElementById('close-video-button'),
    photoButton: document.getElementById('take-photo-button'),
    photoContainer: document.getElementById('photo-container'),
    clearPhotosButton: document.getElementById('clear-photos-button'),
    canvas: document.getElementById('canvas'),
    sidebar: document.getElementById('sidebar'),
    viewSidebarButton: document.getElementById('toggle-sidebar-button'),
    closeSidebarButton: document.getElementById('close-sidebar-button')
  };

  

  elements.videoButton.addEventListener('click',()=>{
    setVideoSourceToStream(elements.video);
    elements.videoButton.style.display='none';
  });

  elements.viewSidebarButton.addEventListener('click', ()=>{
    elements.sidebar.classList.toggle('active');
  });
  
  elements.closeSidebarButton.addEventListener('click', ()=>{
    elements.sidebar.classList.toggle('active');
  });

  
  elements.photoButton.addEventListener('click', ()=>{
    elements.canvas.setAttribute('width', elements.video.getBoundingClientRect().width);
    elements.canvas.setAttribute('height', elements.video.getBoundingClientRect().height);
    addPhoto(elements);
  });

  elements.clearPhotosButton.addEventListener('click', ()=>{
    elements.photoContainer.innerHTML = '';
  });
  
}





 
