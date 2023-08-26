const video = document.getElementById('video')
var exec = true;

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)


function startVideo(exec) {
  
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  if(exec == false){return;}
}
video.addEventListener('play',async (e) => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  const labeledFaceDescriptors =  await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
  
  var t = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    if(resizedDetections[0] && resizedDetections[0].detection._score > 0.50){
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
   	  let image_data_uarl = canvas.toDataURL('image/jpeg');
      const fimg = new Image()
      fimg.src = image_data_uarl
       const detections = await faceapi.detectAllFaces(fimg).withFaceLandmarks().withFaceDescriptors()
       const resizedDetections = faceapi.resizeResults(detections, displaySize)
       const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
       if(results.length != 0){
          var label=results.toString().substr(0,results.toString().indexOf(' '));
          var dis = results.toString().substr(results.toString().indexOf("(")+1,results.toString().indexOf(")"));
          var dist= parseFloat(dis);
          if(dist<0.4){
                 window.location.href = "/recorded/"+label;
                 clearInterval(t);
           }
        }
       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    }
  }, 100)
})


function loadLabeledImages() {
  const labelss = document.getElementById("y").innerText;
  const labels = labelss.split(",");
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      const img = await faceapi.fetchImage(`./labeled_images/${label}.jpg`)
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections.descriptor)
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
